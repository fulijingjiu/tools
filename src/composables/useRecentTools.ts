import { useStorage } from '@vueuse/core'
import type { Tool } from '@/tools/tools.types'

const MAX_RECENT = 8

export function useRecentTools() {
  const recentIds = useStorage<string[]>('recent-tools', [])

  const addRecent = (toolId: string) => {
    recentIds.value = [
      toolId,
      ...recentIds.value.filter((id) => id !== toolId),
    ].slice(0, MAX_RECENT)
  }

  const clearRecent = () => {
    recentIds.value = []
  }

  const getRecentTools = (tools: Tool[]): Tool[] => {
    return recentIds.value
      .map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) as Tool[]
  }

  return { recentIds, addRecent, clearRecent, getRecentTools }
}
