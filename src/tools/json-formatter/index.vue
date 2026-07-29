<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import { formatJson, minifyJson, getJsonExample } from './utils'

const input = ref('')
const mode = ref<'format' | 'minify'>('format')
const error = ref<string | null>(null)
const { error: showError } = useToast()

const output = computed(() => {
  const result = mode.value === 'format' ? formatJson(input.value) : minifyJson(input.value)
  error.value = result.error
  return result.result
})

watch(error, (msg) => {
  if (msg) showError(msg)
})

const { addRecent } = useRecentTools()
addRecent('json-formatter')
</script>

<template>
  <ToolLayout title="JSON 格式化" description="将 JSON 字符串格式化为易读形式，或压缩为一行。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="输入 JSON 字符串..." />

      <div class="flex flex-wrap gap-2">
        <button
          @click="mode = 'format'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'format'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          格式化
        </button>
        <button
          @click="mode = 'minify'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'minify'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          压缩
        </button>
        <button
          @click="input = getJsonExample()"
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

      <TextOutput v-model="output" />
    </div>
  </ToolLayout>
</template>
