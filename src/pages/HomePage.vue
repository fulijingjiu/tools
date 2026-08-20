<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, Sun, Moon, X } from 'lucide-vue-next'
import { tools, toolsByCategory } from '@/tools'
import { useRecentTools } from '@/composables/useRecentTools'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import ToolCard from '@/components/ToolCard.vue'

type SearchMatch = {
  tool: (typeof tools)[number]
  score: number
  reasons: string[]
}

const search = ref('')
const { isDark, toggleDark } = useTheme()
const { getRecentTools, clearRecent } = useRecentTools()
const { success } = useToast()
const githubRepo = 'https://github.com/fulijingjiu/tools'

const categoryLabels: Record<string, string> = {
  developer: 'Developer',
  text: 'Text',
  image: 'Image',
  design: 'Design',
  other: 'Other',
}

const matchReasonLabels: Record<string, string> = {
  name: 'Name',
  description: 'Description',
  keyword: 'Keyword',
  tag: 'Tag',
  'all-fields': 'All fields',
  'category match': 'Category',
  'tag match': 'Tag',
}

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[\\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

const scoreByMatchType = (field: string, token: string, weight = 1) => {
  const lower = field.toLowerCase()
  if (lower === token) return 20 * weight
  if (lower.startsWith(token)) return 12 * weight
  if (lower.includes(token)) return 6 * weight
  return 0
}

const matchForToken = (tool: typeof tools[number], token: string): SearchMatch => {
  let score = 0
  const reasons: string[] = []

  score += scoreByMatchType(tool.name, token)
  if (score) reasons.push(matchReasonLabels.name)

  score += scoreByMatchType(tool.description, token)
  if (tool.description.toLowerCase().includes(token)) reasons.push(matchReasonLabels.description)

  const keywordMatched = tool.keywords
    .map((keyword) => keyword.toLowerCase())
    .some((keyword) => keyword.includes(token))
  if (keywordMatched) {
    score += 9
    reasons.push(matchReasonLabels.keyword)
  }

  const tagMatched = (tool.tags ?? []).some((tag) => tag.toLowerCase().includes(token))
  if (tagMatched) {
    score += 11
    reasons.push(matchReasonLabels.tag)
  }

  if (!reasons.length) {
    if (tool.category.toLowerCase().includes(token)) {
      score += 3
      reasons.push(matchReasonLabels['category match'])
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
    if (tool.keywords.some((keyword) => keyword.toLowerCase().includes(token))) {
      score += 3
      reasons.push(matchReasonLabels.keyword)
    }
  }

  return { tool, score, reasons: [...new Set(reasons)] }
}

const getQuickTags = () => {
  const tags = tools.flatMap((tool) => tool.tags ?? []).filter(Boolean)
  return [...new Set(tags)].slice(0, 6)
}

const quickSearchHints = computed(() => {
  const categories = Object.keys(categoryLabels).map((category) => `cat:${category}`)
  const tags = getQuickTags().map((tag) => `tag:${tag}`)
  return ['cat:*', 'tag:*', ...categories, ...new Set(tags)]
})

const filteredTools = computed(() => {
  const query = search.value.trim()
  if (!query) return [] as SearchMatch[]

  const normalized = query.toLowerCase()
  const wildcardOnly = normalized.endsWith('*')

  if (normalized.startsWith('cat:')) {
    const targetCategory = normalized.slice(4).trim().replace('*', '').trim()
    return tools
      .filter((tool) => (wildcardOnly || !targetCategory) || tool.category.toLowerCase().includes(targetCategory))
      .map((tool) => ({ tool, score: 0, reasons: [matchReasonLabels['category match']] }))
  }

  if (normalized.startsWith('tag:')) {
    const targetTag = normalized.slice(4).trim().replace('*', '').trim()
    return tools
      .filter((tool) => {
        if (wildcardOnly) return true
        if (!targetTag) return (tool.tags ?? []).length > 0
        return (tool.tags ?? []).some((tag) => tag.toLowerCase().includes(targetTag))
      })
      .map((tool) => ({ tool, score: 0, reasons: [matchReasonLabels['tag match']] }))
  }

  const tokens = tokenize(normalized)
  if (!tokens.length) return [] as SearchMatch[]

  return tools
    .map((tool) => {
      const matches = tokens.map((token) => matchForToken(tool, token))
      const score = matches.reduce((sum, match) => sum + match.score, 0)
      const reasons = [...new Set(matches.flatMap((match) => match.reasons))]
      return { tool, score, reasons }
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return a.tool.name.localeCompare(b.tool.name)
    })
})

const recentTools = computed(() => getRecentTools(tools))
const hasSearching = computed(() => search.value.trim().length > 0)

const handleClearRecent = () => {
  clearRecent()
  success('Recently used tools cleared')
}

const handleClearSearch = () => {
  search.value = ''
}

const handleQuickSearch = (value: string) => {
  search.value = value
}

const isInvalidCategoryTagQuery =
  computed(() => {
    if (!hasSearching.value) return false
    const normalized = search.value.toLowerCase().trim()
    return (
      normalized === 'cat:' ||
      normalized === 'tag:' ||
      (normalized.startsWith('cat:') && normalized.includes(' ')) ||
      (normalized.startsWith('tag:') && normalized.includes(' '))
    )
  })

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Developer Toolkit</h1>
        <button
          @click="toggleDark()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="Toggle theme"
        >
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <div class="relative mb-4">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search tools by name/description/keyword/tag/category"
          class="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
        />
        <button
          v-if="hasSearching"
          @click="handleClearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500"
          title="Clear"
        >
          <X :size="16" />
        </button>
      </div>

      <div class="mb-8 text-xs text-gray-500 dark:text-gray-400">
        <p class="mb-2">Quick search: supports <span class="font-semibold">cat:</span> + category and <span class="font-semibold">tag:</span> + tag.</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="hint in quickSearchHints"
            :key="hint"
            type="button"
            @click="handleQuickSearch(hint)"
            class="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
          >
            {{ hint }}
          </button>
        </div>
      </div>

      <div v-if="hasSearching" class="mb-10">
        <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Search result ({{ filteredTools.length }})
        </h2>

        <template v-if="filteredTools.length">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ToolCard
              v-for="item in filteredTools"
              :key="item.tool.id"
              :tool="item.tool"
              :match-reasons="item.reasons"
            />
          </div>
          <p v-if="isInvalidCategoryTagQuery" class="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Current query uses a special prefix. Use plain keywords directly for regular search.
          </p>
        </template>

        <p v-else class="text-gray-400 dark:text-gray-500 text-center py-12">
          No match found.
          <button
            class="text-purple-600 dark:text-purple-400 underline ml-2"
            @click="handleClearSearch"
          >
            Clear and retry
          </button>
        </p>
      </div>

      <template v-else>
        <section v-if="recentTools.length" class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">Recent used</h2>
            <button
              @click="handleClearRecent"
              class="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ToolCard v-for="tool in recentTools" :key="tool.id" :tool="tool" />
          </div>
        </section>

        <section v-for="(items, category) in toolsByCategory" :key="category" class="mb-10">
          <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            {{ categoryLabels[category] || category }}
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ToolCard v-for="tool in items" :key="tool.id" :tool="tool" />
          </div>
        </section>
      </template>
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500">
        Privacy-first toolkit. Processing is local.
        <RouterLink to="/privacy" class="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy notes</RouterLink>
        |
        <a
          :href="githubRepo"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:text-gray-300"
        >
          GitHub
        </a>
      </p>
    </footer>
  </div>
</template>
