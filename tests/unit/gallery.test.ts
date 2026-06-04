import { describe, expect, it } from 'vitest'
import { GALLERY_MAX, normalizeGallery } from '@/lib/gallery'

describe('normalizeGallery', () => {
  it('returns an empty array for non-array input', () => {
    expect(normalizeGallery(null)).toEqual([])
    expect(normalizeGallery(undefined)).toEqual([])
    expect(normalizeGallery('not-an-array')).toEqual([])
    expect(normalizeGallery({})).toEqual([])
  })

  it('keeps valid URL strings and trims them', () => {
    expect(normalizeGallery(['  https://a.dk/1.jpg  ', 'https://a.dk/2.jpg'])).toEqual([
      'https://a.dk/1.jpg',
      'https://a.dk/2.jpg',
    ])
  })

  it('drops empty strings and non-string entries', () => {
    expect(normalizeGallery(['https://a.dk/1.jpg', '', '   ', 42, null, { x: 1 }])).toEqual([
      'https://a.dk/1.jpg',
    ])
  })

  it('caps the list at GALLERY_MAX', () => {
    const many = Array.from({ length: GALLERY_MAX + 4 }, (_, i) => `https://a.dk/${i}.jpg`)
    const result = normalizeGallery(many)
    expect(result).toHaveLength(GALLERY_MAX)
    expect(result[0]).toBe('https://a.dk/0.jpg')
  })

  it('preserves order', () => {
    expect(normalizeGallery(['https://a.dk/c.jpg', 'https://a.dk/a.jpg', 'https://a.dk/b.jpg'])).toEqual([
      'https://a.dk/c.jpg',
      'https://a.dk/a.jpg',
      'https://a.dk/b.jpg',
    ])
  })
})
