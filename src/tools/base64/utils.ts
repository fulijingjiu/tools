export function encodeBase64(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    const bytes = new TextEncoder().encode(input)
    const binary = String.fromCharCode(...bytes)
    return { result: btoa(binary), error: null }
  } catch (e) {
    return { result: '', error: `编码失败：${(e as Error).message}` }
  }
}

export function decodeBase64(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    const binary = atob(input.trim())
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return { result: new TextDecoder().decode(bytes), error: null }
  } catch {
    return { result: '', error: 'Base64 格式不正确' }
  }
}
