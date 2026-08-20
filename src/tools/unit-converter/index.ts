import { Scale } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'unit-converter',
  name: '单位换算',
  path: '/tools/unit-converter',
  description: '长度、重量、温度、面积、体积、数据存储等常用单位实时互转。',
  category: 'other',
  keywords: ['unit', 'converter', '单位', '换算', '长度', '重量', '温度', '面积', '体积'],
  tags: ['measurement', 'conversion', 'metric', 'imperial', 'science'],
  component: () => import('./index.vue'),
  icon: Scale,
}
