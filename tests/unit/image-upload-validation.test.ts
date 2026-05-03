import { describe, expect, it } from 'vitest'
import {
  getCropFailureMessage,
  validateImageFile,
} from '@/lib/image-upload-validation'

function file(type: string, size: number) {
  return { type, size } as File
}

describe('validateImageFile', () => {
  it('accepts jpg and png files up to 5 MB', () => {
    expect(validateImageFile(file('image/jpeg', 5 * 1024 * 1024))).toBeNull()
    expect(validateImageFile(file('image/png', 1024))).toBeNull()
  })

  it('returns specific Danish errors for unsupported type and size', () => {
    expect(validateImageFile(file('image/webp', 1024))).toBe('Kun JPG og PNG er tilladt.')
    expect(validateImageFile(file('image/jpeg', 5 * 1024 * 1024 + 1))).toBe('Filen er for stor. Vælg et billede under 5 MB.')
  })
})

describe('getCropFailureMessage', () => {
  it('maps known crop failures to specific Danish messages', () => {
    expect(getCropFailureMessage('image-load')).toBe('Billedet kunne ikke læses. Gem det som JPG eller PNG og prøv igen.')
    expect(getCropFailureMessage('canvas')).toBe('Din browser kunne ikke beskære billedet. Prøv at genindlæse siden.')
    expect(getCropFailureMessage('upload')).toBe('Upload fejlede. Kontroller forbindelsen og prøv igen.')
  })
})
