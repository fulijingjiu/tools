import { useRoute } from 'vue-router'
import type { Tool } from '@/tools/tools.types'

export function useToolMeta() {
  const route = useRoute()
  return (route.meta.tool as Tool) || null
}
