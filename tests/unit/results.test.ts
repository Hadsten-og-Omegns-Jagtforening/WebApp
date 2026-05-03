import { describe, expect, it } from 'vitest'
import { normalizeResults } from '@/lib/results'

describe('normalizeResults', () => {
  it('sorts best scores first and assigns ranks', () => {
    expect(normalizeResults([
      { rank: '', name: 'Poul', score: '22/25' },
      { rank: '', name: 'Jens', score: '23/25' },
      { rank: '', name: 'Anders', score: '23/25' },
      { rank: '', name: '', score: '' },
    ])).toEqual([
      { rank: '1', name: 'Anders', score: '23/25' },
      { rank: '2', name: 'Jens', score: '23/25' },
      { rank: '3', name: 'Poul', score: '22/25' },
    ])
  })
})
