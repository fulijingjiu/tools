<script setup lang="ts">
import type { Tool } from '@/tools/tools.types'
import { useRouter } from 'vue-router'

defineProps<{ tool: Tool }>()
const router = useRouter()
</script>

<template>
  <button
    @click="router.push(tool.path)"
    class="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800
           rounded-xl border border-gray-200 dark:border-gray-700
           hover:border-purple-400 dark:hover:border-purple-500
           hover:shadow-lg transition-all duration-200 text-left w-full cursor-pointer"
  >
    <component :is="tool.icon" :size="32" class="text-purple-600 dark:text-purple-400 shrink-0" />
    <div class="min-w-0">
      <h3 class="font-semibold text-gray-900 dark:text-white text-center text-sm truncate">
        {{ tool.name }}
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center line-clamp-2">
        {{ tool.description }}
      </p>
    </div>
  </button>
</template>
