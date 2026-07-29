<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  getCurrentDateStr,
} from './utils'

const tsInput = ref('')
const dateInput = ref('')
const tsError = ref<string | null>(null)
const dateError = ref<string | null>(null)
const { error: showError } = useToast()

const dateResult = computed(() => {
  const r = timestampToDate(tsInput.value)
  tsError.value = r.error
  return r.result
})

const tsResult = computed(() => {
  const r = dateToTimestamp(dateInput.value)
  dateError.value = r.error
  return r.result
})

watch(tsError, (msg) => {
  if (msg) showError(msg)
})
watch(dateError, (msg) => {
  if (msg) showError(msg)
})

const fillNow = () => {
  const { sec } = getCurrentTimestamp()
  tsInput.value = String(sec)
  dateInput.value = getCurrentDateStr()
}

const { addRecent } = useRecentTools()
addRecent('timestamp')
</script>

<template>
  <ToolLayout
    title="时间戳转换"
    description="Unix 时间戳与北京时间互转，支持秒和毫秒。"
  >
    <div class="space-y-6">
      <!-- 时间戳 → 日期 -->
      <div class="space-y-3">
        <h2 class="font-medium text-gray-700 dark:text-gray-300 text-sm">
          时间戳 → 日期时间
        </h2>
        <TextInput v-model="tsInput" placeholder="输入 Unix 时间戳..." :rows="3" />
        <div class="flex flex-wrap gap-2">
          <button
            @click="fillNow"
            class="px-4 py-2 rounded-lg font-medium text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            现在
          </button>
        </div>
        <TextOutput v-model="dateResult" :rows="2" />
      </div>

      <!-- 日期 → 时间戳 -->
      <div class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 class="font-medium text-gray-700 dark:text-gray-300 text-sm">
          日期时间 → 时间戳
        </h2>
        <TextInput
          v-model="dateInput"
          placeholder="输入日期时间，如 2024-01-01 12:00:00"
          :rows="3"
        />
        <TextOutput v-model="tsResult" :rows="2" />
      </div>
    </div>
  </ToolLayout>
</template>
