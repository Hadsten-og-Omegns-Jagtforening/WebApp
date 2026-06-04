// Normalisering af nyhedernes billedgalleri (felt: news.gallery_urls).
// Spejler rollen for lib/results.ts: én kilde til validering, brugt af både
// server actions (skrivning) og den offentlige render (læsning).

export const GALLERY_MAX = 6

// Kun absolutte https-URL'er accepteres (uploads producerer altid Supabase
// https-URL'er). Afviser tomme, relative, http:, javascript: og data: — så et
// gemt felt aldrig kan ende som en farlig eller utilsigtet ekstern reference.
function isHttpsUrl(value: string): boolean {
  if (!value) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((url): url is string => typeof url === 'string' && isHttpsUrl(url.trim()))
    .map((url) => url.trim())
    .slice(0, GALLERY_MAX)
}
