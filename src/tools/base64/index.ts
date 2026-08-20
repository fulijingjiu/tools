import { FileDigit } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'base64',
  name: 'Base64 编解码',
  path: '/tools/base64',
  description: '在普通文本和 Base64 字符串之间转换，支持中文。',
  category: 'developer',
  keywords: ['base64', 'encode', 'decode', '编码', '解码'],
  tags: ['encoding', 'decoding', 'binary', 'data'],
  component: () => import('./index.vue'),
  icon: FileDigit,
}
