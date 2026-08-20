import { ShieldCheck } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'jwt-parser',
  name: 'JWT 解析',
  path: '/tools/jwt-parser',
  description: '解析 JWT 令牌的头部和载荷部分。',
  category: 'developer',
  keywords: ['jwt', 'token', '解析', 'decode', 'header', 'payload'],
  tags: ['auth', 'security', 'token', 'debug'],
  component: () => import('./index.vue'),
  icon: ShieldCheck,
}
