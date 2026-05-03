const ALLOWED_TAGS = new Set([
  'p', 'strong', 'em', 'u', 'h2', 'h3',
  'ul', 'ol', 'li', 'a', 'blockquote',
])

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function sanitizeHref(value: string): string | null {
  const trimmed = value.trim()
  const isRelativePath = trimmed.startsWith('/') && !trimmed.startsWith('//')
  if (trimmed.startsWith('https://') || isRelativePath) return trimmed
  return null
}

function sanitizeTag(rawTag: string): string {
  const match = rawTag.match(/^<\s*(\/)?\s*([a-zA-Z0-9-]+)([^>]*)>$/)
  if (!match) return escapeHtml(rawTag)

  const [, closingSlash, rawName, rawAttributes] = match
  const name = rawName.toLowerCase()
  if (!ALLOWED_TAGS.has(name)) return ''

  if (closingSlash) return VOID_TAGS.has(name) ? '' : `</${name}>`

  if (name !== 'a') return `<${name}>`

  const hrefMatch = rawAttributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i)
  const href = hrefMatch ? sanitizeHref(hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '') : null

  return href ? `<a href="${escapeAttribute(href)}">` : '<a>'
}

export function sanitizeBody(html: string): string {
  const withoutUnsafeBlocks = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')

  let sanitized = ''
  let lastIndex = 0
  const tagPattern = /<\/?[a-zA-Z][^>]*>/g

  for (const match of withoutUnsafeBlocks.matchAll(tagPattern)) {
    const tag = match[0]
    const index = match.index ?? 0
    sanitized += escapeHtml(withoutUnsafeBlocks.slice(lastIndex, index))
    sanitized += sanitizeTag(tag)
    lastIndex = index + tag.length
  }

  sanitized += escapeHtml(withoutUnsafeBlocks.slice(lastIndex))
  return sanitized
}
