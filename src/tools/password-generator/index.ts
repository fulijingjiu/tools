import { Key } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'password-generator',
  name: '密码生成器',
  path: '/tools/password-generator',
  description: '生成安全的随机密码，可配置长度和字符类型。',
  category: 'other',
  keywords: ['password', '密码', '生成', '随机', '安全'],
  tags: ['security', 'random', 'credentials', 'utility'],
  component: () => import('./index.vue'),
  icon: Key,
}
