<script setup lang="ts">
import { Copy, Check } from 'lucide-vue-next'
import { useCopy } from '@/composables/useCopy'

const model = defineModel<string>({ default: '' })
const { copy, copied } = useCopy()

withDefaults(
  defineProps<{
    readonly?: boolean
    rows?: number
  }>(),
  {
    readonly: true,
    rows: 10,
  },
)

const doCopy = () => copy(model.value)
</script>

<template>
  <div class="relative">
    <textarea
      v-model="model"
      :readonly="readonly"
      :rows="rows"
      class="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg
             bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100
             font-mono text-sm resize-y focus:outline-none focus:ring-2
             focus:ring-purple-500 focus:border-transparent"
    />
    <button
      @click="doCopy"
      class="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-gray-700
             border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400
             hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      :title="copied ? '已复制' : '复制'"
    >
      <Check v-if="copied" :size="16" class="text-green-500" />
      <Copy v-else :size="16" />
    </button>
    <div class="absolute bottom-3 left-4 text-xs text-gray-400 dark:text-gray-500 select-none">
      {{ model.length }} 字符
    </div>
  </div>
</template>
