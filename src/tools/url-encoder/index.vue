<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import { encodeUrl, decodeUrl } from './utils'

const input = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const error = ref<string | null>(null)
const { error: showError } = useToast()

const output = computed(() => {
  if (!input.value) {
    error.value = null
    return ''
  }
  if (mode.value === 'encode') {
    error.value = null
    return encodeUrl(input.value)
  }
  const result = decodeUrl(input.value)
  error.value = result.error
  return result.result
})

watch(error, (msg) => {
  if (msg) showError(msg)
})

const { addRecent } = useRecentTools()
addRecent('url-encoder')
</script>

<template>
  <ToolLayout title="URL 编解码" description="对 URL 参数进行编码和解码，支持中文和特殊字符。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="输入文本或 URL 字符串..." />

      <div class="flex flex-wrap gap-2">
        <button
          @click="mode = 'encode'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'encode'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          编码
        </button>
        <button
          @click="mode = 'decode'"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            mode === 'decode'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          解码
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
