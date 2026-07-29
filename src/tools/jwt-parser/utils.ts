export function parseJwt(token: string): {
  header: object | null
  payload: object | null
  signature: string
  error: string | null
} {
  if (!token.trim()) return { header: null, payload: null, signature: '', error: null }

  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: '', error: 'JWT 格式不正确，应包含三段以 "." 分隔' }
  }

  try {
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    return { header, payload, signature: parts[2], error: null }
  } catch {
    return { header: null, payload: null, signature: '', error: 'JWT 解析失败，请检查 token 是否完整' }
  }
}
