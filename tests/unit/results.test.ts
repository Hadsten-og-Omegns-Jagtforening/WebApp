import { describe, expect, it } from 'vitest'
import { normalizeResults } from '@/lib/results'

describe('normalizeResults', () => {
  it('preserves the admin order and manual numbering (no auto-sort)', () => {
    expect(normalizeResults([
      { raekke: 'M', rank: '1', name: 'Magnus', score: '38/40' },
      { raekke: 'M', rank: '2', name: 'Anders', score: '20/32' },
      { raekke: 'A', rank: '1', name: 'Jens', score: '30/40' },
      { raekke: 'M', rank: '1', name: 'Poul', score: '20/32' },
    ])).toEqual([
      { raekke: 'M', rank: '1', name: 'Magnus', score: '38/40' },
      { raekke: 'M', rank: '2', name: 'Anders', score: '20/32' },
      { raekke: 'A', rank: '1', name: 'Jens', score: '30/40' },
      { raekke: 'M', rank: '1', name: 'Poul', score: '20/32' },
    ])
  })

  it('trims fields and drops blank rows', () => {
    expect(normalizeResults([
      { raekke: ' M ', rank: ' 1 ', name: ' Poul ', score: ' 22/25 ' },
      { raekke: '', rank: '', name: '', score: '' },
    ])).toEqual([
      { raekke: 'M', rank: '1', name: 'Poul', score: '22/25' },
    ])
  })

  it('tolerates legacy rows without a raekke field (backward compatible)', () => {
    expect(normalizeResults([
      { rank: '1', name: 'Jens', score: '23/25' },
    ])).toEqual([
      { raekke: '', rank: '1', name: 'Jens', score: '23/25' },
    ])
  })
})
