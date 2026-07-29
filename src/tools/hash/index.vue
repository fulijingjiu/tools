<script setup lang="ts">
import { ref } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import { computeHash, type HashAlgorithm } from './utils'

const input = ref('')
const algorithm = ref<HashAlgorithm>('SHA-256')
const result = ref('')
const loading = ref(false)

const algorithms: { value: HashAlgorithm; label: string }[] = [
  { value: 'SHA-1', label: 'SHA-1' },
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-512', label: 'SHA-512' },
]

const compute = async () => {
  if (!input.value) {
    result.value = ''
    return
  }
  loading.value = true
  result.value = await computeHash(input.value, algorithm.value)
  loading.value = false
}

const { addRecent } = useRecentTools()
addRecent('hash')
</script>

<template>
  <ToolLayout title="Hash 计算" description="计算字符串的 SHA-1、SHA-256、SHA-512 哈希值。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="输入文本..." @input="compute" />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="algo in algorithms"
          :key="algo.value"
          @click="algorithm = algo.value; compute()"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            algorithm === algo.value
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          {{ algo.label }}
        </button>
        <button
          @click="input = ''; result = ''"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>

      <div v-if="loading" class="text-sm text-gray-400">计算中...</div>

      <TextOutput v-model="result" :rows="3" />
    </div>
  </ToolLayout>
</template>
