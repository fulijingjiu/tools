import { useClipboard } from '@vueuse/core'
import { useToast } from '@/composables/useToast'

export function useCopy() {
  const { copy, copied, isSupported } = useClipboard()
  const { success, error } = useToast()

  const copyText = async (text: string): Promise<boolean> => {
    if (!isSupported.value) {
      error('当前浏览器不支持剪贴板操作')
      return false
    }
    try {
      await copy(text)
      success('已复制到剪贴板')
      return true
    } catch {
      error('复制失败，请手动复制')
      return false
    }
  }

  return { copy: copyText, copied, isSupported }
}
