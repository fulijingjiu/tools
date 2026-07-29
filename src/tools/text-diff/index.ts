import { FileDiff } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'text-diff',
  name: '文本差异对比',
  path: '/tools/text-diff',
  description: '对比两段文本，高亮显示新增、删除和 unchanged 内容。',
  category: 'text',
  keywords: ['diff', 'difference', '文本对比', '差异', '比较', 'compare'],
  component: () => import('./index.vue'),
  icon: FileDiff,
}
