<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import {
  toUpperCase,
  toLowerCase,
  capitalize,
  removeEmptyLines,
  trimLines,
  sortLines,
  reverseLines,
  deduplicateLines,
  reverseText,
  countStats,
} from './utils'

const input = ref('')
const output = ref('')

const stats = computed(() => countStats(input.value))

interface Action {
  label: string
  fn: (s: string) => string
}

const actions: Action[] = [
  { label: '转大写', fn: toUpperCase },
  { label: '转小写', fn: toLowerCase },
  { label: '首字母大写', fn: capitalize },
  { label: '去除空行', fn: removeEmptyLines },
  { label: '去除首尾空格', fn: trimLines },
  { label: '升序排列', fn: (s) => sortLines(s, true) },
  { label: '降序排列', fn: (s) => sortLines(s, false) },
  { label: '文本去重', fn: deduplicateLines },
  { label: '反转行序', fn: reverseLines },
  { label: '反转文本', fn: reverseText },
]

const apply = (fn: (s: string) => string) => {
  output.value = fn(input.value)
}

const { addRecent } = useRecentTools()
addRecent('text-processor')
</script>

<template>
  <ToolLayout title="文本处理" description="大小写转换、去重、排序、去空行等常用文本处理。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="输入文本..." />

      <!-- 统计 -->
      <div
        v-if="input"
        class="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400"
      >
        <span>字符：{{ stats.chars }}</span>
        <span>不含空格：{{ stats.charsNoSpace }}</span>
        <span>单词：{{ stats.words }}</span>
        <span>行数：{{ stats.lines }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="action in actions"
          :key="action.label"
          @click="apply(action.fn)"
          class="px-3 py-1.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {{ action.label }}
        </button>
        <button
          @click="input = ''; output = ''"
          class="px-3 py-1.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>

      <TextOutput v-model="output" />
    </div>
  </ToolLayout>
</template>
