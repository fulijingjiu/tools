<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './utils'

const hexInput = ref('#6366F1')
const r = ref(99)
const g = ref(102)
const b = ref(241)
const h = ref(239)
const s = ref(85)
const l = ref(67)

const hexError = ref<string | null>(null)

const currentColor = computed(() => {
  const rgb = hexToRgb(hexInput.value)
  if (rgb) {
    hexError.value = null
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }
  hexError.value = hexInput.value ? '无效的 HEX 颜色值' : null
  return '#6366F1'
})

const updateFromHex = () => {
  const rgb = hexToRgb(hexInput.value)
  if (rgb) {
    r.value = rgb.r
    g.value = rgb.g
    b.value = rgb.b
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    h.value = hsl.h
    s.value = hsl.s
    l.value = hsl.l
  }
}

const updateFromRgb = () => {
  hexInput.value = rgbToHex(r.value, g.value, b.value)
  const hsl = rgbToHsl(r.value, g.value, b.value)
  h.value = hsl.h
  s.value = hsl.s
  l.value = hsl.l
}

const updateFromHsl = () => {
  const rgb = hslToRgb(h.value, s.value, l.value)
  r.value = rgb.r
  g.value = rgb.g
  b.value = rgb.b
  hexInput.value = rgbToHex(rgb.r, rgb.g, rgb.b)
}

const { addRecent } = useRecentTools()
addRecent('color-converter')
</script>

<template>
  <ToolLayout title="颜色转换" description="HEX、RGB、HSL 颜色格式互转，实时预览。">
    <div class="space-y-6">
      <!-- 颜色预览 -->
      <div
        class="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner transition-colors"
        :style="{ backgroundColor: currentColor }"
      />

      <!-- HEX -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">HEX</label>
        <div class="flex gap-2">
          <input
            v-model="hexInput"
            @input="updateFromHex"
            placeholder="#000000"
            class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   font-mono text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div
            class="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0"
            :style="{ backgroundColor: currentColor }"
          />
        </div>
        <p v-if="hexError" class="text-sm text-red-500">{{ hexError }}</p>
      </div>

      <!-- RGB -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">RGB</label>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <span class="text-xs text-gray-400">R</span>
            <input
              v-model.number="r"
              @input="updateFromRgb"
              type="number"
              min="0"
              max="255"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <span class="text-xs text-gray-400">G</span>
            <input
              v-model.number="g"
              @input="updateFromRgb"
              type="number"
              min="0"
              max="255"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <span class="text-xs text-gray-400">B</span>
            <input
              v-model.number="b"
              @input="updateFromRgb"
              type="number"
              min="0"
              max="255"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- HSL -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-500 dark:text-gray-400">HSL</label>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <span class="text-xs text-gray-400">H°</span>
            <input
              v-model.number="h"
              @input="updateFromHsl"
              type="number"
              min="0"
              max="360"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <span class="text-xs text-gray-400">S%</span>
            <input
              v-model.number="s"
              @input="updateFromHsl"
              type="number"
              min="0"
              max="100"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <span class="text-xs text-gray-400">L%</span>
            <input
              v-model.number="l"
              @input="updateFromHsl"
              type="number"
              min="0"
              max="100"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
