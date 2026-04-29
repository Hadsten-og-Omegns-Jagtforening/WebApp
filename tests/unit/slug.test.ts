import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/lib/slug'

describe('generateSlug', () => {
  it('lowercases and hyphenates ASCII titles', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('handles Danish characters', () => {
    expect(generateSlug('Præmieskydning 2026')).toBe('praemieskydning-2026')
  })

  it('strips punctuation', () => {
    expect(generateSlug('HOJ Cup — runde 2: sådan blev det')).toBe(
      'hoj-cup-runde-2-saadan-blev-det'
    )
  })

  it('collapses multiple hyphens', () => {
    expect(generateSlug('foo   bar')).toBe('foo-bar')
  })

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('  hello  ')).toBe('hello')
  })
})
