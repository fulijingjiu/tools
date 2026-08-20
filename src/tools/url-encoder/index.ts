import { Link } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'url-encoder',
  name: 'URL 编解码',
  path: '/tools/url-encoder',
  description: '对 URL 参数进行编码和解码，支持中文和特殊字符。',
  category: 'developer',
  keywords: ['url', 'encode', 'decode', '编码', '解码', 'encodeURIComponent'],
  tags: ['uri', 'query', 'web', 'encoding'],
  component: () => import('./index.vue'),
  icon: Link,
}
