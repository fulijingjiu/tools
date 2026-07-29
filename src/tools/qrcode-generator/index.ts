import { QrCode } from 'lucide-vue-next'
import type { Tool } from '../tools.types'

export const tool: Tool = {
  id: 'qrcode-generator',
  name: '二维码生成',
  path: '/tools/qrcode-generator',
  description: '将文本或链接生成为二维码图片，支持下载。',
  category: 'image',
  keywords: ['qrcode', '二维码', 'qr', '生成'],
  component: () => import('./index.vue'),
  icon: QrCode,
}
