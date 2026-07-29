<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import { convertBase, isValidForBase, BASES, BASE_LABELS } from './utils'

const input = ref('')
const fromBase = ref<number>(10)
const error = ref<string | null>(null)
const { error: showError } = useToast()

const results = computed(() => {
  if (!input.value) {
    error.value = null
    return {}
  }
  if (!isValidForBase(input.value, fromBase.value)) {
    error.value = '输入包含非法字符'
    return {}
  }
  const r = convertBase(input.value, fromBase.value)
  error.value = r.error
  return r.results
})

watch(error, (msg) => {
  if (msg) showError(msg)
})

const { addRecent } = useRecentTools()
addRecent('number-converter')
</script>

<template>
  <ToolLayout title="进制转换" description="二进制、八进制、十进制、十六进制实时互转。">
    <div class="space-y-4">
      <!-- 输入进制选择 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="base in BASES"
          :key="base"
          @click="fromBase = base"
          :class="[
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            fromBase === base
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          输入为{{ BASE_LABELS[base] }}
        </button>
      </div>

      <!-- 输入 -->
      <div class="relative">
        <input
          v-model="input"
          type="text"
          :placeholder="`输入${BASE_LABELS[fromBase]}数字...`"
          class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 font-mono text-lg text-center tracking-widest
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <!-- 结果 -->
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="base in BASES"
          :key="base"
          :class="[
            'p-4 rounded-lg border',
            fromBase === base
              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {{ BASE_LABELS[base] }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">Base {{ base }}</span>
          </div>
          <p class="font-mono text-lg text-gray-900 dark:text-gray-100 break-all">
            {{ results[base] || '-' }}
          </p>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
