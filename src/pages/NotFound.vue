<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Frown } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Frown :size="64" class="text-gray-300 dark:text-gray-600 mb-6" />
    <h1 class="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
    <p class="text-gray-400 dark:text-gray-500 mb-8">页面不存在</p>
    <button
      @click="router.push('/')"
      class="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
    >
      返回首页
    </button>
  </div>
</template>
