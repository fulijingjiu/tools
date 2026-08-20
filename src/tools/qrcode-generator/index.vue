<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import { Download } from 'lucide-vue-next'
import { generateQRCode } from './utils'

const input = ref('https://github.com')
const qrcodeDataUrl = ref('')
const size = ref(256)

const updateQR = async () => {
  if (input.value.trim()) {
    qrcodeDataUrl.value = await generateQRCode(input.value, { width: size.value })
  } else {
    qrcodeDataUrl.value = ''
  }
}

const downloadQR = () => {
  if (!qrcodeDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrcodeDataUrl.value
  a.download = 'qrcode.png'
  a.click()
}

const { addRecent } = useRecentTools()
addRecent('qrcode-generator')

// 初始生成 + 监听变化
updateQR()
watch([input, size], updateQR)
</script>

<template>
  <ToolLayout title="二维码生成" description="将文本或链接生成为二维码图片，支持下载。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="输入文本或链接..." :rows="3" />

      <div class="flex flex-wrap gap-2 items-center">
        <label class="text-sm text-gray-500 dark:text-gray-400">尺寸：</label>
        <button
          v-for="s in [128, 256, 512]"
          :key="s"
          @click="size = s"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            size === s
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
        >
          {{ s }}px
        </button>
      </div>

      <div class="flex justify-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <img
          v-if="qrcodeDataUrl"
          :src="qrcodeDataUrl"
          alt="二维码"
          class="max-w-full"
        />
        <p v-else class="text-gray-400 dark:text-gray-500">请输入内容生成二维码</p>
      </div>

      <button
        v-if="qrcodeDataUrl"
        @click="downloadQR"
        class="w-full py-2.5 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        <Download :size="18" />
        下载 PNG
      </button>
    </div>
  </ToolLayout>
</template>
