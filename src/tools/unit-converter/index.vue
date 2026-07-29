<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ArrowRightLeft } from 'lucide-vue-next'
import { useRecentTools } from '@/composables/useRecentTools'
import ToolLayout from '@/components/ToolLayout.vue'
import { categories, convertValue, formatNumber, type UnitCategory } from './utils'

const categoryId = ref<UnitCategory>('length')
const fromUnit = ref('')
const toUnit = ref('')
const input = ref('1')

const category = computed(() => categories.find((c) => c.id === categoryId.value)!)

// 切换分类时重置单位
watch(
  category,
  (c) => {
    fromUnit.value = c.units[0].id
    toUnit.value = c.units[1]?.id ?? c.units[0].id
  },
  { immediate: true },
)

const result = computed(() => {
  const value = parseFloat(input.value)
  if (Number.isNaN(value)) return ''
  const converted = convertValue(value, fromUnit.value, toUnit.value, category.value)
  return formatNumber(converted)
})

const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
}

const { addRecent } = useRecentTools()
addRecent('unit-converter')
</script>

<template>
  <ToolLayout title="单位换算" description="长度、重量、温度、面积、体积、数据存储等常用单位实时互转。">
    <div class="space-y-5">
      <!-- 分类选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          换算类型
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in categories"
            :key="c.id"
            @click="categoryId = c.id"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              categoryId === c.id
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            {{ c.name }}
          </button>
        </div>
      </div>

      <!-- 输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          数值
        </label>
        <input
          v-model="input"
          type="number"
          class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="输入数值"
        />
      </div>

      <!-- 单位选择 -->
      <div class="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            从
          </label>
          <select
            v-model="fromUnit"
            class="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option v-for="u in category.units" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>

        <button
          @click="swapUnits"
          class="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="交换单位"
        >
          <ArrowRightLeft :size="18" />
        </button>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            到
          </label>
          <select
            v-model="toUnit"
            class="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option v-for="u in category.units" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
      </div>

      <!-- 结果 -->
      <div
        class="p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">换算结果</p>
        <p class="text-2xl sm:text-3xl font-mono font-semibold text-purple-600 dark:text-purple-400 break-all">
          {{ result || '—' }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ category.units.find((u) => u.id === toUnit)?.name }}
        </p>
      </div>
    </div>
  </ToolLayout>
</template>
