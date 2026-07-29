<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import { computeDiff, getDiffExample, type DiffMode } from './utils'

const left = ref('')
const right = ref('')
const mode = ref<DiffMode>('lines')

const diff = computed(() => computeDiff(left.value, right.value, mode.value))

const addedCount = computed(() => diff.value.filter((p) => p.added).length)
const removedCount = computed(() => diff.value.filter((p) => p.removed).length)

const loadExample = () => {
  const ex = getDiffExample()
  left.value = ex.left
  right.value = ex.right
}

const { addRecent } = useRecentTools()
addRecent('text-diff')
</script>

<template>
  <ToolLayout title="文本差异对比" description="对比两段文本，高亮显示新增、删除和 unchanged 内容。">
    <div class="space-y-4">
      <!-- 模式切换 -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="mode = 'lines'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'lines'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          按行对比
        </button>
        <button
          @click="mode = 'words'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'words'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          按词对比
        </button>
        <button
          @click="loadExample"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          示例
        </button>
        <button
          @click="left = ''; right = ''"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>

      <!-- 输入区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            原文本
          </label>
          <TextInput v-model="left" placeholder="输入原始文本..." :rows="8" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            对比文本
          </label>
          <TextInput v-model="right" placeholder="输入对比文本..." :rows="8" />
        </div>
      </div>

      <!-- 统计 -->
      <div class="flex gap-4 text-sm">
        <span class="text-green-600 dark:text-green-400 font-medium">
          +{{ addedCount }} 新增
        </span>
        <span class="text-red-500 dark:text-red-400 font-medium">
          -{{ removedCount }} 删除
        </span>
      </div>

      <!-- 差异结果 -->
      <div
        class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm whitespace-pre-wrap break-all min-h-[160px] leading-relaxed"
      >
        <template v-if="left || right">
          <template v-for="part in diff" :key="part.key">
            <span
              v-if="part.added"
              class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              >{{ part.value }}</span
            >
            <span
              v-else-if="part.removed"
              class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through decoration-red-500"
              >{{ part.value }}</span
            >
            <span v-else class="text-gray-700 dark:text-gray-300">{{ part.value }}</span>
          </template>
        </template>
        <p v-else class="text-gray-400 dark:text-gray-500">请输入两段文本进行对比</p>
      </div>
    </div>
  </ToolLayout>
</template>
