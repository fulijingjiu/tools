#!/usr/bin/env node
import { readFileSync } from 'node:fs'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function main() {
  const source = readFileSync('src/pages/HomePage.vue', 'utf8')

  const startMarker = 'const filteredTools = computed(() => {'
  const endMarker = 'const recentTools = computed(() => getRecentTools(tools))'
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker)
  assert(start >= 0, 'HomePage should define filteredTools computed block')
  assert(end > start, 'HomePage should define recentTools after filteredTools block')
  const filteredBlock = source.slice(start, end)

  assert(!/isDark/.test(filteredBlock), 'search ordering logic should not depend on theme state isDark')
  assert(filteredBlock.includes('tools'), 'filteredTools logic should still reference tools dataset')
  assert(
    filteredBlock.includes('sort((a, b) => {'),
    'filteredTools should use explicit deterministic sort for search results'
  )
  assert(
    filteredBlock.includes('if (a.score !== b.score) return b.score - a.score'),
    'filteredTools sort should prioritize score descending'
  )
  assert(
    filteredBlock.includes('return a.tool.name.localeCompare(b.tool.name)'),
    'filteredTools tie-breaker should deterministically use tool name'
  )

  console.log('Loop5 theme-order guard: PASS')
}

main()
