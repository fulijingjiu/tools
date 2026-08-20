<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { Download, Loader2, RotateCcw, Upload } from 'lucide-vue-next'
import ToolLayout from '@/components/ToolLayout.vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import {
  compressImage,
  formatSize,
  downloadBlob,
  type CompressOptions,
  type CompressResult,
} from './utils'

type ImageType = CompressOptions['type']

const { addRecent } = useRecentTools()
const { error } = useToast()

addRecent('image-compressor')

const fileInput = ref<HTMLInputElement | null>(null)
const sourceFile = ref<File | null>(null)
const sourceUrl = ref<string>('')
const result = ref<CompressResult | null>(null)
const isCompressing = ref(false)
const maxWidth = ref(1600)
const maxHeight = ref(1600)
const quality = ref(0.8)
const targetType = ref<ImageType>('image/jpeg')

const originalFileName = computed(() => sourceFile.value?.name || '')
const hasFile = computed(() => !!sourceFile.value)
const canCompress = computed(() => hasFile.value && !isCompressing.value)
const compressRatio = computed(() => {
  if (!result.value || !sourceFile.value) return 0
  return Math.max(
    0,
    Math.round(100 - (result.value.compressedSize / result.value.originalSize) * 100),
  )
})

const fileExt = (type: ImageType) => {
  if (type === 'image/jpeg') return 'jpg'
  if (type === 'image/png') return 'png'
  return 'webp'
}

const baseName = (name: string) => {
  const idx = name.lastIndexOf('.')
  return idx > -1 ? name.slice(0, idx) : name
}

const clear = () => {
  if (sourceUrl.value) {
    URL.revokeObjectURL(sourceUrl.value)
  }
  if (result.value?.dataUrl) {
    URL.revokeObjectURL(result.value.dataUrl)
  }
  sourceFile.value = null
  sourceUrl.value = ''
  result.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const onSelectFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error('仅支持图片文件。')
    if (input) input.value = ''
    return
  }

  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (result.value?.dataUrl) {
    URL.revokeObjectURL(result.value.dataUrl)
    result.value = null
  }

  sourceFile.value = file
  sourceUrl.value = URL.createObjectURL(file)
  maxWidth.value = Math.min(maxWidth.value || 1600, 4096)
  maxHeight.value = Math.min(maxHeight.value || 1600, 4096)
}

const runCompress = async () => {
  if (!sourceFile.value) return

  isCompressing.value = true
  if (result.value?.dataUrl) {
    URL.revokeObjectURL(result.value.dataUrl)
    result.value = null
  }

  const options: CompressOptions = {
    maxWidth: maxWidth.value,
    maxHeight: maxHeight.value,
    quality: quality.value,
    type: targetType.value,
  }

  try {
    result.value = await compressImage(sourceFile.value, options)
  } catch {
    error('图片压缩失败，请检查文件格式和参数。')
  } finally {
    isCompressing.value = false
  }
}

const onDownload = () => {
  if (!result.value) return
  const name = originalFileName.value
  const fileName = `${baseName(name)}_压缩后.${fileExt(targetType.value)}`
  downloadBlob(result.value.blob, fileName)
}

onUnmounted(() => {
  clear()
})
</script>

<template>
  <ToolLayout title="图片压缩" description="上传图片后调整尺寸、质量和格式，一步完成压缩。">
    <div class="space-y-5">
      <div
        class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4"
      >
        <label
          class="flex flex-col items-center gap-2 py-6 cursor-pointer text-center"
          for="image-file-input"
        >
          <Upload :size="28" class="text-gray-500 dark:text-gray-400" />
          <span class="text-sm text-gray-600 dark:text-gray-300">
            点击上传图片
          </span>
          <span class="text-xs text-gray-400">支持格式：JPG、PNG、WEBP</span>
        </label>
        <input
          id="image-file-input"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onSelectFile"
        />
      </div>

      <div v-if="hasFile" class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span class="text-gray-700 dark:text-gray-300 font-medium">原图：{{ originalFileName }}</span>
          <span class="text-gray-500 dark:text-gray-400">大小：{{ formatSize(sourceFile?.size || 0) }}</span>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <label class="space-y-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">最大宽度（像素）</span>
            <input
              v-model.number="maxWidth"
              type="number"
              min="100"
              max="4096"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <label class="space-y-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">最大高度（像素）</span>
            <input
              v-model.number="maxHeight"
              type="number"
              min="100"
              max="4096"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
        </div>

        <label class="space-y-1 block">
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>质量：{{ Math.round(quality * 100) }}%</span>
            <span>建议：{{ quality >= 0.75 ? '均衡' : '更高压缩率' }}</span>
          </div>
          <input v-model.number="quality" type="range" min="0.1" max="1" step="0.05" class="w-full" />
        </label>

        <label class="space-y-1 block">
          <span class="text-xs text-gray-500 dark:text-gray-400">输出格式</span>
          <select
            v-model="targetType"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </label>

        <div class="flex flex-wrap gap-2">
          <button
            @click="runCompress"
            :disabled="!canCompress"
            class="px-4 py-2 rounded-lg font-medium text-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Loader2 v-if="isCompressing" :size="16" class="animate-spin" />
            <span>{{ isCompressing ? '正在压缩...' : '开始压缩' }}</span>
          </button>
          <button
            @click="clear"
            class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <RotateCcw :size="16" />
            清空
          </button>
          <button
            v-if="result"
            @click="onDownload"
            class="px-4 py-2 rounded-lg font-medium text-sm text-white bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Download :size="16" />
            下载
          </button>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div
          v-if="sourceUrl"
          class="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">原图</p>
          <img
            :src="sourceUrl"
            alt="原图预览"
            class="w-full rounded-lg object-contain max-h-72 bg-gray-100 dark:bg-gray-900"
          />
        </div>

        <div
          v-if="result"
          class="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">压缩结果</p>
          <img
            :src="result.dataUrl"
            alt="压缩结果预览"
            class="w-full rounded-lg object-contain max-h-72 bg-gray-100 dark:bg-gray-900"
          />
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {{ formatSize(result.originalSize) }} → {{ formatSize(result.compressedSize) }}
            <span class="text-green-600 dark:text-green-400 ml-2">-{{ compressRatio }}%</span>
          </p>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
