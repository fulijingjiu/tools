<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Shield, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          @click="router.push('/')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="返回首页"
        >
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">隐私声明</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-10">
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <div class="flex items-center gap-3 mb-6">
          <Shield :size="28" class="text-purple-600" />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">数据完全本地处理</h2>
        </div>

        <div class="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            开发者工具箱是一个纯前端项目。你在页面上输入或上传的所有内容（文本、图片、JSON、JWT 等）均在浏览器本地完成计算，<strong class="text-gray-900 dark:text-white">不会上传到任何服务器</strong>。
          </p>

          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">我们存储什么</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>最近使用过的工具 ID（用于首页"最近使用"功能）</li>
              <li>深色 / 浅色主题偏好</li>
            </ul>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              以上数据仅保存在你当前浏览器的 localStorage 中，可随时通过浏览器设置清除。
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">我们不做什么</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>不收集用户账号、手机号、邮箱等个人信息</li>
              <li>不使用 Cookie 追踪用户</li>
              <li>不向第三方分享任何数据</li>
              <li>不记录你输入的具体内容</li>
            </ul>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            如果你对本声明有疑问，可以通过项目的 GitHub 仓库提交 issue 反馈。
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
