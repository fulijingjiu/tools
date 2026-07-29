export function timestampToDate(ts: string): { result: string; error: string | null } {
  if (!ts.trim()) return { result: '', error: null }
  const num = Number(ts)
  if (isNaN(num)) return { result: '', error: '无效的时间戳' }
  // 自动判断秒/毫秒：大于 1e12 视为毫秒
  const ms = num > 1e12 ? num : num * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime())) return { result: '', error: '无效的时间戳' }
  return { result: formatDate(d), error: null }
}

export function dateToTimestamp(dateStr: string): { result: string; error: string | null } {
  if (!dateStr.trim()) return { result: '', error: null }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return { result: '', error: '无效的时间格式' }
  return { result: String(Math.floor(d.getTime() / 1000)), error: null }
}

export function getCurrentTimestamp(): { sec: number; ms: number } {
  const ms = Date.now()
  return { sec: Math.floor(ms / 1000), ms }
}

export function getCurrentDateStr(): string {
  return formatDate(new Date())
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
