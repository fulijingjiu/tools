import { marked } from 'marked'

export function renderMarkdown(input: string): string {
  if (!input.trim()) return ''
  return marked.parse(input) as string
}
