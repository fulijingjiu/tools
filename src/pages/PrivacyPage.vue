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
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">隐私说明</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-10">
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <div class="flex items-center gap-3 mb-6">
          <Shield :size="28" class="text-purple-600" />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">数据处理说明</h2>
        </div>

        <div class="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            本工具箱为纯前端应用，仅在你的浏览器中执行处理，不会主动上传输入内容、文件、图片或链接到服务端。所有结果都在本地生成，仅在本机内存或本地存储中临时保留（如最近使用记录）。
          </p>

          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">我们会保留</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>最近访问工具 ID（存储在 localStorage）</li>
              <li>明文输入文本（仅在页面状态下短期使用）</li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">我们不会上传</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>个人身份信息</li>
              <li>Cookie、登录凭据</li>
              <li>完整的文本内容或图片文件</li>
              <li>你传入的敏感字段（除非浏览器默认行为保存）</li>
            </ul>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            如有问题或建议，可在项目 GitHub 仓库提交 issue。
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
