const BASES = [2, 8, 10, 16] as const
const BASE_LABELS: Record<number, string> = { 2: '二进制', 8: '八进制', 10: '十进制', 16: '十六进制' }

export { BASES, BASE_LABELS }

export function convertBase(
  input: string,
  fromBase: number,
): { results: Record<number, string>; error: string | null } {
  const results: Record<number, string> = {}
  if (!input.trim()) {
    BASES.forEach((b) => (results[b] = ''))
    return { results, error: null }
  }
  const num = parseInt(input, fromBase)
  if (isNaN(num)) {
    return { results: {}, error: '包含非法字符，请检查输入' }
  }
  BASES.forEach((b) => {
    results[b] = num.toString(b).toUpperCase()
  })
  return { results, error: null }
}

export function isValidForBase(input: string, base: number): boolean {
  if (!input.trim()) return true
  const regexMap: Record<number, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }
  return regexMap[base]?.test(input) ?? false
}
