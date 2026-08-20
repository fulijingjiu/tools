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

  assert(/v-model=\"search\"/.test(source), 'search input binding missing')
  assert(/const handleClearSearch/.test(source), 'clear search handler missing')
  assert(/@click=\"handleClearSearch\"/.test(source), 'search clear button binding missing')
  assert(/v-if=\"hasSearching\"/.test(source), 'search-result mode branch missing')
  assert(/<template v-else>/.test(source), 'homepage default branch missing')
  assert(/最近使用/.test(source), 'recent tools section missing')
  assert(/toolsByCategory/.test(source), 'category sections missing')
  assert(/清空后重试/.test(source), 'empty search fallback action missing')
  assert(/在线工具箱/.test(source), 'Chinese page title missing')
  assert(/按名称、说明、关键词、标签或分类搜索工具/.test(source), 'Chinese search placeholder missing')
  assert(!/Developer Toolkit|Quick search|Recent used/.test(source), 'English homepage copy remains')

  console.log('Loop5 UI guard: PASS')
}

main()
