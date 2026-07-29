import { Search } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'regex-tester',
  name: '正则表达式测试',
  path: '/tools/regex-tester',
  description: '输入正则表达式与测试文本，实时查看匹配结果与分组。',
  category: 'developer',
  keywords: ['regex', 'regular expression', '正则', '表达式', '匹配', 'test'],
  component: () => import('./index.vue'),
  icon: Search,
}
