#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const HOME_PAGE_PATH = 'src/pages/HomePage.vue'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function main() {
  const source = readFileSync(HOME_PAGE_PATH, 'utf8')

  assert(/const quickSearchHints = computed\(\(\) => \{/.test(source), 'quickSearchHints computed definition missing')
  assert(/v-model=\"search\"/.test(source), 'search input binding missing')
  assert(/cat:\*/.test(source), 'quick search should include cat:* quick hint')
  assert(/tag:\*/.test(source), 'quick search should include tag:* quick hint')
  assert(/const handleClearSearch/.test(source), 'clear search handler missing')
  assert(/@click=\"handleClearSearch\"/.test(source), 'search clear button binding missing')
  assert(/const handleQuickSearch/.test(source), 'quick search handler missing')
  assert(/v-for=\"hint in quickSearchHints\"/.test(source), 'quick search hint rendering missing')
  assert(/v-if=\"hasSearching\"/.test(source), 'search-result mode branch missing')
  assert(/<template v-else>/.test(source), 'homepage default branch missing')
  assert(/Recent used/.test(source), 'recent tools section missing')
  assert(/toolsByCategory/.test(source), 'category sections missing')
  assert(/Clear and retry/.test(source), 'empty search fallback action missing')
  assert(/isInvalidCategoryTagQuery/.test(source), 'invalid category/tag query computed marker missing')
  assert(/Current query uses a special prefix/.test(source), 'special prefix guidance message missing')
  assert(/handleQuickSearch\(hint\)/.test(source), 'quick hint click binding missing')

  console.log('Loop5 UI guard: PASS')
}

main()
