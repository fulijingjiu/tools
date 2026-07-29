<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useTitle } from '@vueuse/core'

const props = defineProps<{
  title: string
  description?: string
}>()

useTitle(`${props.title} - 开发者工具箱`)

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <!-- 顶部栏 -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          @click="router.push('/')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="返回首页"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h1>
          <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
      </div>
    </header>

    <!-- 工具内容 -->
    <main class="max-w-4xl mx-auto p-6">
      <slot />
    </main>
  </div>
</template>
