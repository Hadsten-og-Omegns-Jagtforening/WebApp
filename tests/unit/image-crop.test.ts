import { describe, expect, it } from 'vitest'
import { calculateCropSourceRect } from '@/lib/image-crop'

describe('calculateCropSourceRect', () => {
  it('returns a centered 3:2 crop by default', () => {
    expect(calculateCropSourceRect({
      imageWidth: 2400,
      imageHeight: 1800,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    })).toEqual({
      sx: 0,
      sy: 100,
      sw: 2400,
      sh: 1600,
    })
  })
})
