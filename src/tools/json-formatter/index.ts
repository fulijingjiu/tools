import { Braces } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'json-formatter',
  name: 'JSON 格式化',
  path: '/tools/json-formatter',
  description: '将 JSON 字符串格式化为易读形式，或压缩为一行。',
  category: 'developer',
  keywords: ['json', 'format', '格式化', '压缩', 'minify', '美化'],
  component: () => import('./index.vue'),
  icon: Braces,
}
