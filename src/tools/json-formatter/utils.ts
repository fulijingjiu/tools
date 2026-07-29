export function formatJson(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    const parsed = JSON.parse(input)
    return { result: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    return { result: '', error: `JSON 格式错误：${(e as Error).message}` }
  }
}

export function minifyJson(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null }
  try {
    const parsed = JSON.parse(input)
    return { result: JSON.stringify(parsed), error: null }
  } catch (e) {
    return { result: '', error: `JSON 格式错误：${(e as Error).message}` }
  }
}

export function getJsonExample(): string {
  return JSON.stringify(
    { name: '张三', age: 25, hobbies: ['编程', '阅读'] },
    null,
    2,
  )
}
