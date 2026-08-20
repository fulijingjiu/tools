import { marked } from 'marked'

const BLOCKED_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'meta',
  'link',
  'base',
  'style',
  'input',
  'textarea',
  'button',
  'select',
  'option',
])

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export function renderMarkdown(input: string): { html: string; error: string | null } {
  if (!input.trim()) return { html: '', error: null }

  try {
    const html = marked.parse(input, { breaks: true }) as string
    return { html: sanitizeHtml(html), error: null }
  } catch (e) {
    return {
      html: '',
      error: `Markdown 渲染失败：${e instanceof Error ? e.message : '未知错误'}`,
    }
  }
}

function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return html
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  BLOCKED_TAGS.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove())
  })

  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = (attr.value || '').trim().toLowerCase()

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        return
      }

      if (name === 'style') {
        el.removeAttribute(attr.name)
        return
      }

      if (name === 'href' || name === 'src' || name === 'xlink:href') {
        if (!value || value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:')) {
          el.removeAttribute(attr.name)
          return
        }

        const hasExplicitProtocol = value.includes(':')
        if (hasExplicitProtocol) {
          const url = value.startsWith('//') ? `https:${value}` : value
          const protocolEnd = url.indexOf(':')
          const scheme = protocolEnd > 0 ? url.slice(0, protocolEnd + 1) : ''
          if (scheme && !ALLOWED_PROTOCOLS.has(scheme)) {
            el.removeAttribute(attr.name)
            return
          }
        }
      }

      if (name === 'srcset') {
        el.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}
