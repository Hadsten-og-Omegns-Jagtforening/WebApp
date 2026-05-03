import type { ResultRow } from './database.types'

function parseScore(score: string) {
  const trimmed = score.trim()
  const ratio = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/)
  if (ratio) {
    const value = Number(ratio[1].replace(',', '.'))
    const max = Number(ratio[2].replace(',', '.'))
    return {
      value,
      ratio: max > 0 ? value / max : value,
    }
  }

  const numeric = Number(trimmed.replace(',', '.'))
  return {
    value: Number.isFinite(numeric) ? numeric : Number.NEGATIVE_INFINITY,
    ratio: Number.isFinite(numeric) ? numeric : Number.NEGATIVE_INFINITY,
  }
}

export function normalizeResults(rows: ResultRow[] | null | undefined): ResultRow[] {
  return (rows ?? [])
    .map((row) => ({
      rank: '',
      name: row.name.trim(),
      score: row.score.trim(),
      parsed: parseScore(row.score),
    }))
    .filter((row) => row.name || row.score)
    .sort((a, b) => {
      if (b.parsed.ratio !== a.parsed.ratio) return b.parsed.ratio - a.parsed.ratio
      if (b.parsed.value !== a.parsed.value) return b.parsed.value - a.parsed.value
      return a.name.localeCompare(b.name, 'da')
    })
    .map((row, index) => ({
      rank: String(index + 1),
      name: row.name,
      score: row.score,
    }))
}
