import { Hash } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'hash',
  name: 'Hash 计算',
  path: '/tools/hash',
  description: '计算字符串的 SHA-1、SHA-256、SHA-512 哈希值。',
  category: 'developer',
  keywords: ['hash', 'sha1', 'sha256', 'sha512', '哈希', '散列'],
  tags: ['crypto', 'checksum', 'fingerprint', 'security'],
  component: () => import('./index.vue'),
  icon: Hash,
}
