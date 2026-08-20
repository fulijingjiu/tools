#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const TOOLS_DIR = join(process.cwd(), 'src', 'tools')

function readToolSources() {
  const entries = readdirSync(TOOLS_DIR, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(TOOLS_DIR, entry.name, 'index.ts'))
    .filter((file) => {
      try {
        readFileSync(file, 'utf8')
        return true
      } catch {
        return false
      }
    })
}

function parseQuotedList(content) {
  const list = []
  const reg = /['"`]([^'"`]+)['"`]/g
  let m
  while ((m = reg.exec(content)) !== null) {
    list.push(m[1])
  }
  return list
}

function extractFieldString(content, key) {
  const reg = new RegExp(`${key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`)
  const m = content.match(reg)
  return m ? m[1] : ''
}

function extractFieldList(content, key) {
  const reg = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'm')
  const m = content.match(reg)
  if (!m) return []
  return parseQuotedList(m[1])
}

function loadTools() {
  return readToolSources().map((file) => {
    const raw = readFileSync(file, 'utf8')
    return {
      id: extractFieldString(raw, 'id'),
      name: extractFieldString(raw, 'name'),
      path: extractFieldString(raw, 'path'),
      description: extractFieldString(raw, 'description'),
      category: extractFieldString(raw, 'category'),
      keywords: extractFieldList(raw, 'keywords'),
      tags: extractFieldList(raw, 'tags'),
    }
  })
}

function scoreByMatchType(field, token, weight = 1) {
  const lower = field.toLowerCase()
  if (lower === token) return 20 * weight
  if (lower.startsWith(token)) return 12 * weight
  if (lower.includes(token)) return 6 * weight
  return 0
}

function matchForToken(tool, token) {
  let score = 0
  const reasons = []

  score += scoreByMatchType(tool.name, token)
  if (score) reasons.push('Name')

  score += scoreByMatchType(tool.description, token)
  if (tool.description.toLowerCase().includes(token)) reasons.push('Description')

  const keywordMatched = tool.keywords.map((keyword) => keyword.toLowerCase()).some((keyword) => keyword.includes(token))
  if (keywordMatched) {
    score += 9
    reasons.push('Keyword')
  }

  const tagMatched = (tool.tags ?? []).some((tag) => tag.toLowerCase().includes(token))
  if (tagMatched) {
    score += 11
    reasons.push('Tag')
  }

  if (!reasons.length) {
    if (tool.category.toLowerCase().includes(token)) {
      score += 3
      reasons.push('Category')
      return { tool, score, reasons: [...new Set(reasons)] }
    }
    if (tool.id.toLowerCase().includes(token)) {
      score += 2
      reasons.push('ID')
    }
    if (tool.path.toLowerCase().includes(token)) {
      score += 2
      reasons.push('Path')
    }
  }

  return { tool, score, reasons: [...new Set(reasons)] }
}

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[\\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function searchTools(allTools, query) {
  const text = query.trim().toLowerCase()
  if (!text) return []

  const wildcardOnly = text.endsWith('*')

  if (text.startsWith('cat:')) {
    const target = text.slice(4).trim().replace('*', '').trim()
    return allTools
      .filter((tool) => wildcardOnly || !target || tool.category.toLowerCase().includes(target))
      .map((tool) => ({ tool, score: 0, reasons: ['Category'] }))
  }

  if (text.startsWith('tag:')) {
    const target = text.slice(4).trim().replace('*', '').trim()
    return allTools
      .filter((tool) => {
        if (wildcardOnly) return (tool.tags ?? []).length > 0
        if (!target) return (tool.tags ?? []).length > 0
        return (tool.tags ?? []).some((tag) => tag.toLowerCase().includes(target))
      })
      .map((tool) => ({ tool, score: 0, reasons: ['Tag'] }))
  }

  const tokens = tokenize(text)
  return allTools
    .map((tool) => {
      const matches = tokens.map((token) => matchForToken(tool, token))
      const score = matches.reduce((sum, match) => sum + match.score, 0)
      const reasons = [...new Set(matches.flatMap((match) => match.reasons))]
      return { tool, score, reasons }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return a.tool.name.localeCompare(b.tool.name)
    })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function runFunctionalAssertions(tools) {
  assert(searchTools(tools, '').length === 0, 'empty query should not return search matches')

  const resultsByCategory = tools.filter((tool) => tool.category === 'developer')
  const searchDeveloper = searchTools(tools, 'cat:developer').map((entry) => entry.tool)
  assert(searchDeveloper.length === resultsByCategory.length, 'cat:developer should return all developer tools')

  const resultCatWildcard = searchTools(tools, 'cat:*')
  assert(resultCatWildcard.length > 0, 'cat:* should return some results')

  const resultCatUnknown = searchTools(tools, 'cat:nonexistent')
  assert(resultCatUnknown.length === 0, 'unknown category should return no results')

  const resultCatPartial = searchTools(tools, 'cat:dev')
  assert(resultCatPartial.length >= 1, 'partial category query should match related tools')

  const resultTagAll = searchTools(tools, 'tag:')
  assert(resultTagAll.length === tools.filter((tool) => (tool.tags ?? []).length > 0).length, 'tag: should return all tools with tags')

  const resultTagSecurity = searchTools(tools, 'tag:security')
  assert(resultTagSecurity.length >= 1, 'tag:security should return at least one result')

  const resultName = searchTools(tools, 'json')
  assert(resultName.length >= 1, 'text query "json" should return matches')

  const resultNameUpper = searchTools(tools, 'JSON')
  assert(resultNameUpper.length === resultName.length, 'search should be case-insensitive')

  const resultNameReasons = searchTools(tools, 'json')[0]
  assert(!!resultNameReasons?.reasons?.length, 'matching query should expose match reasons')

  const resultUnknown = searchTools(tools, 'tag:does-not-exist-xyz')
  assert(resultUnknown.length === 0, 'unknown tag should return none')

  const resultMulti = searchTools(tools, 'text processor')
  assert(resultMulti.length >= 1, 'multi-keyword query should return at least one result')

  const resultComma = searchTools(tools, 'json, formatter')
  assert(resultComma.length >= 1, 'comma-separated query should tokenize and match')

  const resultExact = searchTools(tools, 'base64 encode')
  assert(resultExact.length >= 1, 'exact tool keyword phrase should match at least one tool')

  const resultExactName = searchTools(tools, 'json formatter')
  assert(resultExactName.length >= 1, 'exact name-like query should match expected tool(s)')

  const symbolQuery = searchTools(tools, '+/?:*')
  assert(Array.isArray(symbolQuery), 'special-symbol query should not throw')

  const symbolSlashQuery = searchTools(tools, '/')
  assert(Array.isArray(symbolSlashQuery), 'slash symbol query should not throw')

  const queryWithWhitespaceAroundColon = searchTools(tools, 'cat: developer')
  assert(queryWithWhitespaceAroundColon.length >= 1, 'category query with extra whitespace around colon should still work')

  const queryTagWithWhitespaceAroundColon = searchTools(tools, 'tag: security')
  assert(queryTagWithWhitespaceAroundColon.length >= 1, 'tag query with extra whitespace around colon should still work')
}

function runPerformanceCheck(tools) {
  const repeated = []
  for (let i = 0; i < 2000; i += 1) {
    const seed = tools[i % tools.length]
    repeated.push({
      ...seed,
      id: `${seed.id}-${i}`,
      path: `${seed.path}-${i}`,
    })
  }

  const queries = ['json', 'text', 'security', 'tag:security', 'cat:developer', 'base64', 'image', 'timestamp', 'hash']
  const loops = 300
  const start = performance.now()

  for (let i = 0; i < loops; i += 1) {
    const q = queries[i % queries.length]
    searchTools(repeated, q)
  }

  const elapsed = performance.now() - start
  const avgMs = elapsed / loops
  assert(avgMs < 150, `search average latency (${avgMs.toFixed(2)}ms) should be < 150ms`)
}

function main() {
  const tools = loadTools()
  assert(tools.length > 0, 'no tool metadata loaded')

  runFunctionalAssertions(tools)
  runPerformanceCheck(tools)

  console.log(`Loop5 search smoke: PASS (tools=${tools.length})`)
}

main()
