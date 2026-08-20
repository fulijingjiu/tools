export function parseJwt(token: string): {
  header: object | null
  payload: object | null
  signature: string
  error: string | null
} {
  if (!token.trim()) return { header: null, payload: null, signature: '', error: null }

  const trimmed = token.trim()
  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return {
      header: null,
      payload: null,
      signature: '',
      error: 'JWT 格式不正确，请输入 header.payload.signature',
    }
  }

  const [headerToken, payloadToken, signature] = parts
  if (!headerToken || !payloadToken) {
    return {
      header: null,
      payload: null,
      signature,
      error: 'JWT 缺少 header 或 payload 段',
    }
  }

  if (!signature) {
    return {
      header: null,
      payload: null,
      signature: '',
      error: 'JWT signature 为空，请确认 token 是否完整',
    }
  }

  try {
    const header = safeJsonParse(decodeJwtBase64Url(headerToken), 'header')
    const payload = safeJsonParse(decodeJwtBase64Url(payloadToken), 'payload')
    return { header, payload, signature, error: null }
  } catch (err) {
    return {
      header: null,
      payload: null,
      signature: '',
      error: err instanceof Error ? err.message : 'JWT 解析失败',
    }
  }
}

function decodeJwtBase64Url(segment: string): string {
  const normalizedBase = normalizeBase64Url(segment)
  const padding = normalizedBase.length % 4
  if (padding === 1) {
    throw new Error('分段长度非法，Base64URL 长度不合法')
  }

  let binary: string
  try {
    const normalized = normalizedBase + '='.repeat((4 - padding) % 4)
    binary = atob(normalized)
  } catch {
    throw new Error('Base64URL 解码失败，请检查 JWT 段格式')
  }

  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  const decoder = new TextDecoder()
  const decoded = decoder.decode(bytes)
  if (!decoded.trim()) throw new Error('解码结果为空')
  return decoded
}

function normalizeBase64Url(value: string): string {
  return value.replace(/-/g, '+').replace(/_/g, '/')
}

function safeJsonParse(raw: string, source: 'header' | 'payload'): object {
  try {
    const value = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) {
      throw new Error()
    }
    return value
  } catch {
    throw new Error(`JWT ${source} 不是有效 JSON`)
  }
}
