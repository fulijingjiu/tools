export function encodeBase64(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    const bytes = new TextEncoder().encode(input)
    let binary = ''
    const chunkSize = 0x8000

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      binary += String.fromCharCode(...chunk)
    }

    return { result: btoa(binary), error: null }
  } catch {
    return { result: '', error: '编码失败，请检查输入内容' }
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
