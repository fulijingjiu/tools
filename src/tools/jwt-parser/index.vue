<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import TextOutput from '@/components/TextOutput.vue'
import { parseJwt } from './utils'

const input = ref('')
const error = ref<string | null>(null)
const { error: showError } = useToast()

const parsed = computed(() => {
  const r = parseJwt(input.value)
  error.value = r.error
  return r
})

watch(error, (msg) => {
  if (msg) showError(msg)
})

const headerJson = computed(() =>
  parsed.value.header ? JSON.stringify(parsed.value.header, null, 2) : '',
)
const payloadJson = computed(() =>
  parsed.value.payload ? JSON.stringify(parsed.value.payload, null, 2) : '',
)

const { addRecent } = useRecentTools()
addRecent('jwt-parser')
</script>

<template>
  <ToolLayout title="JWT 解析" description="解析 JWT 令牌的头部和载荷部分。">
    <div class="space-y-4">
      <TextInput v-model="input" placeholder="粘贴 JWT 令牌..." />

      <div v-if="parsed.header" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            头部
          </h3>
          <TextOutput v-model="headerJson" :rows="6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            载荷
          </h3>
          <TextOutput v-model="payloadJson" :rows="10" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            签名
          </h3>
          <p class="font-mono text-xs text-gray-400 dark:text-gray-500 break-all p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {{ parsed.signature }}
          </p>
        </div>
        <button
          @click="input = ''"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  </ToolLayout>
</template>
