<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, Sun, Moon } from 'lucide-vue-next'
import { tools, toolsByCategory } from '@/tools'
import { useRecentTools } from '@/composables/useRecentTools'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import ToolCard from '@/components/ToolCard.vue'

const search = ref('')
const { isDark, toggleDark } = useTheme()
const { getRecentTools, clearRecent } = useRecentTools()
const { success } = useToast()

const filteredTools = computed(() => {
  if (!search.value.trim()) return tools
  const q = search.value.toLowerCase()
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)),
  )
})

const recentTools = computed(() => getRecentTools(tools))

const handleClearRecent = () => {
  clearRecent()
  success('最近使用已清空')
}

const categoryLabels: Record<string, string> = {
  developer: '开发者工具',
  text: '文本工具',
  image: '图片工具',
  design: '设计工具',
  other: '其他工具',
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">开发者工具箱</h1>
        <div class="flex items-center gap-3">
          <button
            @click="toggleDark()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="切换主题"
          >
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- 搜索框 -->
      <div class="relative mb-10">
        <Search
          :size="20"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="search"
          type="text"
          placeholder="搜索工具..."
          class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
        />
      </div>

      <!-- 搜索结果 -->
      <div v-if="search.trim()" class="mb-10">
        <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          搜索结果（{{ filteredTools.length }}）
        </h2>
        <div
          v-if="filteredTools.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
        </div>
        <p v-else class="text-gray-400 dark:text-gray-500 text-center py-12">
          没有找到匹配的工具
        </p>
      </div>

      <!-- 分类展示 -->
      <template v-else>
        <!-- 最近使用 -->
        <section v-if="recentTools.length" class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">最近使用</h2>
            <button
              @click="handleClearRecent"
              class="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              清空
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ToolCard v-for="tool in recentTools" :key="tool.id" :tool="tool" />
          </div>
        </section>

        <!-- 分类 -->
        <section v-for="(items, category) in toolsByCategory" :key="category" class="mb-10">
          <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            {{ categoryLabels[category] || category }}
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ToolCard v-for="tool in items" :key="tool.id" :tool="tool" />
          </div>
        </section>

        <!-- 空状态 -->
        <div
          v-if="tools.length === 0"
          class="text-center py-20 text-gray-400 dark:text-gray-500"
        >
          <p class="text-lg">工具列表为空</p>
          <p class="text-sm mt-2">请在 src/tools/index.ts 中注册工具</p>
        </div>
      </template>
    </main>

    <!-- 底部 -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500">
        所有运算在浏览器本地完成，不上传用户数据 ·
        <RouterLink to="/privacy" class="underline hover:text-gray-600 dark:hover:text-gray-300">隐私声明</RouterLink>
        ·
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          GitHub
        </a>
      </p>
    </footer>
  </div>
</template>
