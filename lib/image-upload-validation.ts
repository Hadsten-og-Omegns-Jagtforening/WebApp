export const IMAGE_UPLOAD_ALLOWED_TYPES = ['image/jpeg', 'image/png']
export const IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024

export type CropFailureReason = 'image-load' | 'canvas' | 'upload' | 'unknown'

export class ImageCropError extends Error {
  constructor(public readonly reason: CropFailureReason) {
    super(reason)
  }
}

export function validateImageFile(file: File) {
  if (!IMAGE_UPLOAD_ALLOWED_TYPES.includes(file.type)) return 'Kun JPG og PNG er tilladt.'
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) return 'Filen er for stor. Vælg et billede under 5 MB.'
  return null
}

export function getCropFailureMessage(reason: CropFailureReason) {
  if (reason === 'image-load') return 'Billedet kunne ikke læses. Gem det som JPG eller PNG og prøv igen.'
  if (reason === 'canvas') return 'Din browser kunne ikke beskære billedet. Prøv at genindlæse siden.'
  if (reason === 'upload') return 'Upload fejlede. Kontroller forbindelsen og prøv igen.'
  return 'Billedet kunne ikke beskæres. Prøv et andet billede.'
}
