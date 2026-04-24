import { describe, it, expect } from 'vitest'
import { sanitizeBody } from '@/lib/sanitize'

describe('sanitizeBody', () => {
  it('allows permitted tags', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    expect(sanitizeBody(input)).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('strips disallowed tags', () => {
    expect(sanitizeBody('<script>alert(1)</script><p>ok</p>')).toBe('<p>ok</p>')
  })

  it('strips disallowed attributes', () => {
    expect(sanitizeBody('<p class="foo" onclick="bad()">text</p>')).toBe(
      '<p>text</p>'
    )
  })

  it('allows href on anchor tags', () => {
    expect(sanitizeBody('<a href="https://example.com">link</a>')).toBe(
      '<a href="https://example.com">link</a>'
    )
  })

  it('strips javascript: hrefs', () => {
    const result = sanitizeBody('<a href="javascript:alert(1)">click</a>')
    expect(result).not.toContain('javascript:')
  })

  it('strips non-https hrefs', () => {
    const result = sanitizeBody('<a href="http://evil.com">click</a>')
    expect(result).not.toContain('http://evil.com')
  })
})
