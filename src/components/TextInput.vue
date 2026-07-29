<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
  }>(),
  {
    placeholder: '请输入...',
    rows: 10,
  },
)
</script>

<template>
  <div class="relative">
    <textarea
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
             font-mono text-sm resize-y focus:outline-none focus:ring-2
             focus:ring-purple-500 focus:border-transparent
             placeholder-gray-400 dark:placeholder-gray-500"
    />
    <div class="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 select-none">
      {{ model.length }} 字符
    </div>
  </div>
</template>
