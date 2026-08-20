<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecentTools } from '@/composables/useRecentTools'
import { useToast } from '@/composables/useToast'
import ToolLayout from '@/components/ToolLayout.vue'
import TextInput from '@/components/TextInput.vue'
import { testRegex, highlightSegments, getRegexExample } from './utils'

const pattern = ref('')
const flags = ref('g')
const text = ref('')
const { error: showError } = useToast()

const result = computed(() => testRegex(pattern.value, flags.value, text.value))
const segments = computed(() => highlightSegments(text.value, result.value.matches))
const matchCount = computed(() => result.value.matches.length)

watch(
  () => result.value.error,
  (msg) => {
    if (msg) showError(msg)
  },
)

const loadExample = () => {
  const ex = getRegexExample()
  pattern.value = ex.pattern
  flags.value = ex.flags
  text.value = ex.text
}

const { addRecent } = useRecentTools()
addRecent('regex-tester')
</script>

<template>
  <ToolLayout title="正则表达式测试" description="输入正则表达式与测试文本，实时查看匹配结果与分组。">
    <div class="space-y-4">
      <!-- 正则输入 -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div class="sm:col-span-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            正则表达式
          </label>
          <input
            v-model="pattern"
            type="text"
            placeholder="例如：\\d+"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            标志位
          </label>
          <input
            v-model="flags"
            type="text"
            placeholder="gim"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <!-- 测试文本 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          测试文本
        </label>
        <TextInput v-model="text" placeholder="输入需要匹配的文本..." :rows="6" />
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="loadExample"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          示例
        </button>
        <button
          @click="pattern = ''; flags = 'g'; text = ''"
          class="px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-red-500 border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          清空
        </button>
      </div>

      <!-- 匹配统计 -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        匹配结果：
        <span v-if="!pattern.trim()" class="text-gray-400 dark:text-gray-500">请输入正则表达式</span>
        <span v-else-if="result.error" class="text-red-500">{{ result.error }}</span>
        <span v-else>
          共 <strong class="text-purple-600 dark:text-purple-400">{{ matchCount }}</strong> 处匹配
        </span>
      </div>

      <!-- 高亮结果 -->
      <div
        v-if="text && pattern && !result.error"
        class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]"
      >
        <template v-for="(seg, idx) in segments" :key="idx">
          <mark
            v-if="seg.type === 'match'"
            class="bg-yellow-200 dark:bg-yellow-600/40 text-gray-900 dark:text-gray-100 rounded px-0.5"
            :title="`匹配 #${seg.matchIndex + 1}`"
          >
            {{ seg.text }}
          </mark>
          <span v-else>{{ seg.text }}</span>
        </template>
      </div>

      <!-- 分组详情 -->
      <div
        v-if="result.matches.some((m) => m.groups.length || m.namedGroups)"
        class="space-y-2"
      >
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">分组详情</h3>
        <div
          v-for="(match, idx) in result.matches.filter((m) => m.groups.length || m.namedGroups)"
          :key="idx"
          class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
        >
          <p class="font-medium text-gray-900 dark:text-white mb-1.5">匹配 #{{ idx + 1 }}</p>
          <div class="space-y-1 text-gray-600 dark:text-gray-400 font-mono">
            <p v-for="(group, gIdx) in match.groups" :key="`g-${gIdx}`">
              ${{ gIdx + 1 }}: {{ group ?? '未匹配' }}
            </p>
            <p v-for="(value, name) in match.namedGroups" :key="`n-${name}`">
              &lt;{{ name }}&gt;: {{ value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
