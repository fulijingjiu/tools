import { FileText } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'markdown-preview',
  name: 'Markdown 预览',
  path: '/tools/markdown-preview',
  description: '实时预览 Markdown 文本的渲染效果，支持导出 HTML。',
  category: 'design',
  keywords: ['markdown', 'md', '预览', 'preview', '渲染'],
  component: () => import('./index.vue'),
  icon: FileText,
}
