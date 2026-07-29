export function toUpperCase(input: string): string {
  return input.toUpperCase()
}

export function toLowerCase(input: string): string {
  return input.toLowerCase()
}

export function capitalize(input: string): string {
  return input
    .split('\n')
    .map((line) => line.charAt(0).toUpperCase() + line.slice(1).toLowerCase())
    .join('\n')
}

export function removeEmptyLines(input: string): string {
  return input
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n')
}

export function trimLines(input: string): string {
  return input
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

export function sortLines(input: string, asc: boolean = true): string {
  const lines = input.split('\n')
  lines.sort((a, b) => (asc ? a.localeCompare(b) : b.localeCompare(a)))
  return lines.join('\n')
}

export function reverseLines(input: string): string {
  return input.split('\n').reverse().join('\n')
}

export function deduplicateLines(input: string): string {
  return [...new Set(input.split('\n'))].join('\n')
}

export function reverseText(input: string): string {
  return input.split('').reverse().join('')
}

export function countStats(input: string): {
  chars: number
  charsNoSpace: number
  words: number
  lines: number
} {
  const lines = input.split('\n')
  return {
    chars: input.length,
    charsNoSpace: input.replace(/\s/g, '').length,
    words: input
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length,
    lines: lines.length,
  }
}
