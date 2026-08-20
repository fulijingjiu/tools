#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const TOOLS_DIR = join(process.cwd(), 'src', 'tools')

function hasProperty(text, key) {
  const pattern = new RegExp(`\\b${key}\\s*:\\s*`, 'm')
  return pattern.test(text)
}

function extractStringField(text, key) {
  const match = text.match(new RegExp(`${key}\\s*:\\s*['\"]([^'\"]+)['\"]`))
  return match?.[1] ?? null
}

function getListLength(rawValue) {
  if (!rawValue) return 0
  const trimmed = rawValue.trim()
  if (!trimmed || trimmed === '[]') return 0
  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item !== ',')
    .length
}

function parseQuotedStrings(rawValue) {
  if (!rawValue) return []
  const values = new Set(rawValue.split(',').map((item) => item.trim()))
  const list = []
  for (const item of values) {
    const match = item.match(/^['"`]([^'"`]+)['"`]$/)
    if (match?.[1]) {
      list.push(match[1])
    }
  }
  return list
}

function extractArrayBlock(text, key) {
  const startPattern = new RegExp(`${key}\\s*:\\s*\\[`, 'm')
  const startMatch = text.match(startPattern)
  if (!startMatch) return null

  const start = startMatch.index + startMatch[0].length
  const end = text.indexOf(']', start)
  if (end < 0) return null

  return text.slice(start, end)
}

function inspectToolFile(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const errors = []
  const warnings = []

  const required = ['name', 'path', 'description', 'category', 'keywords', 'component', 'icon', 'id']

  for (const key of required) {
    if (!hasProperty(raw, key)) {
      errors.push(`missing ${key}`)
    }
  }

  const keywordsBlock = extractArrayBlock(raw, 'keywords')
  if (!keywordsBlock || getListLength(keywordsBlock) === 0) {
    errors.push('keywords empty')
  }

  const tagsBlock = extractArrayBlock(raw, 'tags')
  if (!tagsBlock || getListLength(tagsBlock) === 0) {
    errors.push('tags empty')
  }

  if (tagsBlock) {
    const values = parseQuotedStrings(tagsBlock)
    const dedup = new Set(values)
    if (values.length !== dedup.size) {
      warnings.push('tags contains duplicates')
    }
  }

  if (keywordsBlock) {
    const keywordsValues = parseQuotedStrings(keywordsBlock)
    const dedup = new Set(keywordsValues)
    if (keywordsValues.length !== dedup.size) {
      warnings.push('keywords contains duplicates')
    }
  }

  return {
    file: basename(filePath),
    errors,
    warnings,
    id: extractStringField(raw, 'id'),
    path: extractStringField(raw, 'path'),
  }
}

function printReport(type, items) {
  for (const item of items) {
    console.log(`- ${item.file}`)
    for (const issue of item[type]) {
      console.log(`  - ${issue}`)
    }
  }
}

function main() {
  const entries = readdirSync(TOOLS_DIR, { withFileTypes: true })

  const toolFiles = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(TOOLS_DIR, entry.name, 'index.ts'))
    .filter((p) => {
      try {
        readFileSync(p, 'utf8')
        return true
      } catch {
        return false
      }
    })

  const checks = toolFiles.map(inspectToolFile)
  const bad = checks.filter((item) => item.errors.length > 0)
  const warn = checks.filter((item) => item.warnings.length > 0)
  const idMap = new Map()
  const pathMap = new Map()

  for (const item of checks) {
    if (item.id) {
      idMap.set(item.id, (idMap.get(item.id) ?? 0) + 1)
    }
    if (item.path) {
      pathMap.set(item.path, (pathMap.get(item.path) ?? 0) + 1)
    }
  }

  const duplicateIds = [...idMap.entries()].filter(([, count]) => count > 1)
  const duplicatePaths = [...pathMap.entries()].filter(([, count]) => count > 1)

  if (bad.length === 0) {
    console.log('Tool metadata check: PASS')
  } else {
    console.log('Tool metadata check: FAIL')
    printReport('errors', bad)
  }

  if (warn.length === 0 && duplicateIds.length === 0 && duplicatePaths.length === 0) {
    console.log('No warnings.')
  } else {
    console.log('Warnings:')
    printReport('warnings', warn)
    if (duplicateIds.length > 0) {
      console.log(' - duplicate tool IDs:')
      for (const [value, count] of duplicateIds) {
        console.log(`   - ${value} (${count})`)
      }
    }
    if (duplicatePaths.length > 0) {
      console.log(' - duplicate tool paths:')
      for (const [value, count] of duplicatePaths) {
        console.log(`   - ${value} (${count})`)
      }
    }
  }

  if (bad.length > 0 || warn.length > 0 || duplicateIds.length > 0 || duplicatePaths.length > 0) {
    process.exitCode = 1
    return
  }
}

main()
