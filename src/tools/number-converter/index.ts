import { Binary } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'number-converter',
  name: '进制转换',
  path: '/tools/number-converter',
  description: '二进制、八进制、十进制、十六进制实时互转。',
  category: 'developer',
  keywords: ['进制', '二进制', '八进制', '十进制', '十六进制', 'hex', 'binary', 'octal'],
  component: () => import('./index.vue'),
  icon: Binary,
}
