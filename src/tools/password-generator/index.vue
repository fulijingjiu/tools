<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextOutput from '@/components/TextOutput.vue'
import { RefreshCw } from 'lucide-vue-next'
import { generatePassword, getPasswordStrength } from './utils'

const length = ref(16)
const uppercase = ref(true)
const lowercase = ref(true)
const numbers = ref(true)
const symbols = ref(true)
const password = ref('')
const { error: showError } = useToast()

const strength = computed(() => getPasswordStrength(password.value))

const configError = computed(() => {
  if (!uppercase.value && !lowercase.value && !numbers.value && !symbols.value) {
    return '请至少选择一种字符类型'
  }
  return null
})

watch(configError, (msg) => {
  if (msg) showError(msg)
})

const generate = () => {
  if (configError.value) return
  password.value = generatePassword({
    length: length.value,
    uppercase: uppercase.value,
    lowercase: lowercase.value,
    numbers: numbers.value,
    symbols: symbols.value,
  })
}

const { addRecent } = useRecentTools()
addRecent('password-generator')

// 初始生成一次
generate()
</script>

<template>
  <ToolLayout title="密码生成器" description="生成安全的随机密码，可配置长度和字符类型。">
    <div class="space-y-6">
      <!-- 配置 -->
      <div class="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <!-- 长度 -->
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
            密码长度
            <span class="text-purple-600 dark:text-purple-400 font-mono font-bold">{{ length }}</span>
          </label>
          <input
            v-model.number="length"
            type="range"
            min="6"
            max="64"
            class="w-full mt-2 accent-purple-600"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>6</span>
            <span>64</span>
          </div>
        </div>

        <!-- 选项 -->
        <div class="space-y-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="uppercase" type="checkbox" class="w-4 h-4 rounded accent-purple-600" />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含大写字母 (A-Z)</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="lowercase" type="checkbox" class="w-4 h-4 rounded accent-purple-600" />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含小写字母 (a-z)</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="numbers" type="checkbox" class="w-4 h-4 rounded accent-purple-600" />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含数字 (0-9)</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="symbols" type="checkbox" class="w-4 h-4 rounded accent-purple-600" />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含特殊符号 (!@#$...)</span>
          </label>
        </div>
      </div>

      <!-- 生成按钮 -->
      <button
        @click="generate"
        :disabled="!!configError"
        class="w-full py-3 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw :size="18" />
        生成密码
      </button>

      <!-- 结果 -->
      <div v-if="password" class="space-y-2">
        <TextOutput v-model="password" :rows="2" />

        <!-- 强度 -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">密码强度：</span>
          <span
            :class="[
              'text-sm font-medium',
              strength.level === 'strong'
                ? 'text-green-600 dark:text-green-400'
                : strength.level === 'medium'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400',
            ]"
          >
            {{ strength.label }}
          </span>
          <div class="flex gap-1">
            <div
              :class="[
                'w-8 h-1.5 rounded-full transition-colors',
                strength.level === 'weak'
                  ? 'bg-red-500'
                  : strength.level === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500',
              ]"
            />
            <div
              :class="[
                'w-8 h-1.5 rounded-full transition-colors',
                strength.level === 'medium'
                  ? 'bg-yellow-500'
                  : strength.level === 'strong'
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700',
              ]"
            />
            <div
              :class="[
                'w-8 h-1.5 rounded-full transition-colors',
                strength.level === 'strong'
                  ? 'bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700',
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
