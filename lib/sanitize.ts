import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'p', 'strong', 'em', 'u', 'h2', 'h3',
  'ul', 'ol', 'li', 'a', 'blockquote',
]

const ALLOWED_ATTR = ['href']

export function sanitizeBody(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })

  // Strip any hrefs that are not https:// or relative /
  return clean.replace(
    /href="([^"]+)"/g,
    (match, url: string) => {
      if (url.startsWith('https://') || url.startsWith('/')) return match
      return ''
    }
  )
}
