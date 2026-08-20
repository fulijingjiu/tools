import { Image } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'image-compressor',
  name: 'Image Compressor',
  path: '/tools/image-compressor',
  description: 'Compress images with configurable size and quality to reduce file size for upload or storage.',
  category: 'image',
  keywords: ['image', 'compress', 'jpeg', 'png', 'webp', 'resize', 'optimizer'],
  tags: ['image-optimize', 'resize', 'upload', 'thumbnail', 'quality'],
  redirectFrom: ['/tools/compress-image'],
  component: () => import('./index.vue'),
  icon: Image,
}
