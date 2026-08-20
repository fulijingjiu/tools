import { Type } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'text-processor',
  name: '文本处理',
  path: '/tools/text-processor',
  description: '大小写转换、去重、排序、去空行等常用文本处理。',
  category: 'text',
  keywords: ['text', '文本', '大小写', '排序', '去重', '统计'],
  tags: ['format', 'normalize', 'case', 'statistics'],
  component: () => import('./index.vue'),
  icon: Type,
}
