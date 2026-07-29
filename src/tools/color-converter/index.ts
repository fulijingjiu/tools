import { Palette } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'color-converter',
  name: '颜色转换',
  path: '/tools/color-converter',
  description: 'HEX、RGB、HSL 颜色格式互转，实时预览颜色。',
  category: 'design',
  keywords: ['color', '颜色', 'hex', 'rgb', 'hsl', '调色'],
  component: () => import('./index.vue'),
  icon: Palette,
}
