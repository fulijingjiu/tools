<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import { Copy, Check, Eye, Code, Download } from 'lucide-vue-next'
import { useCopy } from '@/composables/useCopy'
import { useToast } from '@/composables/useToast'
import { renderMarkdown } from './utils'

const input = ref('')
const mode = ref<'preview' | 'source'>('preview')
const { copy } = useCopy()
const { error: showError } = useToast()
const hasCopied = ref(false)

const markdownOutput = computed(() => renderMarkdown(input.value))
const html = computed(() => markdownOutput.value.html)
const sourceCode = computed(() => (input.value ? html.value : ''))

watch(
  () => markdownOutput.value.error,
  (msg) => {
    if (msg) showError(msg)
  },
)

const copyHtml = async () => {
  const ok = await copy(html.value)
  if (ok) {
    hasCopied.value = true
    setTimeout(() => (hasCopied.value = false), 2000)
  }
}

const downloadHtml = () => {
  const blob = new Blob([`<!doctype html><meta charset="UTF-8"><body>${html.value}</body>`], {
    type: 'text/html;charset=utf-8',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'markdown-preview.html'
  link.click()
  URL.revokeObjectURL(link.href)
}

const { addRecent } = useRecentTools()
addRecent('markdown-preview')

const exampleMarkdown = `# Markdown 预览
## 二级标题
**粗体** *斜体*

- 列表项 1
- 列表项 2

> 引用

\`\`\`
// 代码块
console.log("hello")
\`\`\`
`
</script>

<template>
  <ToolLayout title="Markdown 预览" description="实时预览 Markdown 文本的渲染效果。">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button
          @click="input = exampleMarkdown"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          示例
        </button>
        <button
          @click="input = ''"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            编辑
          </h3>
          <TextInput v-model="input" placeholder="输入 Markdown 文本..." :rows="15" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex gap-1">
              <button
                @click="mode = 'preview'"
                :class="[
                  'px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1',
                  mode === 'preview'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <Eye :size="14" /> 预览
              </button>
              <button
                @click="mode = 'source'"
                :class="[
                  'px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1',
                  mode === 'source'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <Code :size="14" /> 源码
              </button>
            </div>
            <div class="flex gap-1">
              <button
                @click="downloadHtml"
                class="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="下载 HTML"
              >
                <Download :size="14" />
              </button>
              <button
                @click="copyHtml"
                class="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="复制 HTML"
              >
                <Check v-if="hasCopied" :size="14" class="text-green-500" />
                <Copy v-else :size="14" />
              </button>
            </div>
          </div>

          <div
            v-if="mode === 'preview'"
            class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[300px] prose prose-sm dark:prose-invert max-w-none"
            v-html="html"
          />

          <pre
            v-else
            class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-gray-100 overflow-auto min-h-[300px] max-h-[400px] font-mono"
          >{{ sourceCode }}</pre>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
