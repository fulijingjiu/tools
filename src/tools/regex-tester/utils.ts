export interface RegexMatch {
  index: number
  length: number
  groups: string[]
  namedGroups: Record<string, string> | undefined
}

export interface RegexTestResult {
  matches: RegexMatch[]
  error: string | null
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  if (!pattern.trim()) return { matches: [], error: null }
  try {
    const regex = new RegExp(pattern, flags)
    const matches: RegexMatch[] = []
    if (flags.includes('g')) {
      let match: RegExpExecArray | null
      while ((match = regex.exec(text)) !== null) {
        // 防止零宽匹配导致死循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
        matches.push(parseMatch(match))
      }
    } else {
      const match = regex.exec(text)
      if (match) matches.push(parseMatch(match))
    }
    return { matches, error: null }
  } catch {
    return { matches: [], error: '正则表达式错误，请检查表达式和标志位' }
  }
}

function parseMatch(match: RegExpExecArray): RegexMatch {
  return {
    index: match.index,
    length: match[0].length,
    groups: match.slice(1),
    namedGroups: match.groups,
  }
}

export type Segment =
  | { type: 'text'; text: string }
  | { type: 'match'; text: string; matchIndex: number }

export function highlightSegments(text: string, matches: RegexMatch[]): Segment[] {
  if (!matches.length) return [{ type: 'text', text }]

  const segments: Segment[] = []
  let cursor = 0
  matches.forEach((match, idx) => {
    if (match.index > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, match.index) })
    }
    segments.push({
      type: 'match',
      text: text.slice(match.index, match.index + match.length),
      matchIndex: idx,
    })
    cursor = match.index + match.length
  })
  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) })
  }
  return segments
}

export function getRegexExample(): { pattern: string; flags: string; text: string } {
  return {
    pattern: '\\b\\w+@\\w+\\.\\w+\\b',
    flags: 'g',
    text: '请联系我们：support@example.com 或 sales@example.com。',
  }
}
