import { Clock } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'timestamp',
  name: '时间戳转换',
  path: '/tools/timestamp',
  description: 'Unix 时间戳与北京时间互转，支持秒和毫秒。',
  category: 'developer',
  keywords: ['timestamp', '时间戳', 'unix', '日期', '时间'],
  tags: ['datetime', 'unix', 'converter', 'time'],
  component: () => import('./index.vue'),
  icon: Clock,
}
