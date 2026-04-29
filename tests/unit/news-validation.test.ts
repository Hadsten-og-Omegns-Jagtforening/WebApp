import { describe, expect, it } from 'vitest'
import { validatePostInput } from '@/lib/news-validation'

describe('validatePostInput', () => {
  it.each([
    [{ title: '', teaser: 'Teaser', category: 'Nyhed', body: '<p>Body</p>' }, 'Overskrift er påkrævet.'],
    [{ title: 'Titel', teaser: '', category: 'Nyhed', body: '<p>Body</p>' }, 'Uddrag er påkrævet.'],
    [{ title: 'Titel', teaser: 'Teaser', category: '', body: '<p>Body</p>' }, 'Kategori er påkrævet.'],
    [{ title: 'Titel', teaser: 'Teaser', category: 'Nyhed', body: '   ' }, 'Indhold er påkrævet.'],
  ])('rejects missing required fields: %o', (input, expected) => {
    expect(validatePostInput(input)).toBe(expected)
  })

  it('accepts valid input', () => {
    expect(validatePostInput({
      title: 'Titel',
      teaser: 'Teaser',
      category: 'Nyhed',
      body: '<p>Body</p>',
    })).toBeNull()
  })
})
