// Normalisering af nyhedernes billedgalleri (felt: news.gallery_urls).
// Spejler rollen for lib/results.ts: én kilde til validering, brugt af både
// server actions (skrivning) og den offentlige render (læsning).

export const GALLERY_MAX = 6

export function normalizeGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    .map((url) => url.trim())
    .slice(0, GALLERY_MAX)
}
