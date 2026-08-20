import { Image } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'image-compressor',
  name: '图片压缩',
  path: '/tools/image-compressor',
  description: '调整图片尺寸、质量和输出格式，压缩后可预览并下载。',
  category: 'image',
  keywords: ['image', 'compress', 'jpeg', 'png', 'webp', 'resize', 'optimizer'],
  tags: ['image-optimize', 'resize', 'upload', 'thumbnail', 'quality'],
  redirectFrom: ['/tools/compress-image'],
  component: () => import('./index.vue'),
  icon: Image,
}
