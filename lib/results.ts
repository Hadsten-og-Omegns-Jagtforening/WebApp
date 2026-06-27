import type { ResultRow } from './database.types'

// Cleans up result rows for storage/display without reordering: the admin's
// entered order and manual numbering (`rank`) are kept as-is. `raekke` is a free
// per-row column (e.g. M/A/B/C) that may repeat across blocks, so we never group
// or sort by it. Blank rows are dropped; legacy rows without `raekke` are tolerated.
export function normalizeResults(rows: ResultRow[] | null | undefined): ResultRow[] {
  return (rows ?? [])
    .map((row) => ({
      raekke: (row.raekke ?? '').trim(),
      rank: (row.rank ?? '').trim(),
      name: (row.name ?? '').trim(),
      score: (row.score ?? '').trim(),
    }))
    .filter((row) => row.name || row.score)
}
