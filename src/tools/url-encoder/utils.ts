export function encodeUrl(input: string): string {
  return encodeURIComponent(input)
}

export function decodeUrl(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    return { result: decodeURIComponent(input.trim()), error: null }
  } catch {
    return { result: '', error: 'URL 解码失败，请检查输入格式' }
  }
}
