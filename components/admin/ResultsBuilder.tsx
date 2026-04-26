'use client'

import { useState } from 'react'
import type { ResultRow } from '@/lib/database.types'

type Props = {
  initialResults?: ResultRow[] | null
  onChange: (results: ResultRow[]) => void
}

const emptyRow = (): ResultRow => ({ rank: '', name: '', score: '' })

export default function ResultsBuilder({ initialResults, onChange }: Props) {
  const [rows, setRows] = useState<ResultRow[]>(initialResults ?? [emptyRow()])

  function update(index: number, field: keyof ResultRow, value: string) {
    const next = rows.map((r, i) => i === index ? { ...r, [field]: value } : r)
    setRows(next)
    onChange(next)
  }

  function addRow() {
    const next = [...rows, emptyRow()]
    setRows(next)
    onChange(next)
  }

  function removeRow(index: number) {
    const next = rows.filter((_, i) => i !== index)
    setRows(next)
    onChange(next)
  }

  return (
    <div className="results-block">
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>Skytte</th>
            <th style={{ width: 90 }}>Duer</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td><input className="fld-inline" value={row.rank} onChange={(e) => update(i, 'rank', e.target.value)} placeholder={String(i + 1)} style={{ width: 32 }} /></td>
              <td><input className="fld-inline" value={row.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Navn" style={{ width: '100%' }} /></td>
              <td><input className="fld-inline" value={row.score} onChange={(e) => update(i, 'score', e.target.value)} placeholder="23/25" style={{ width: 80 }} /></td>
              <td>
                <button type="button" onClick={() => removeRow(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Fjern">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn ghost" style={{ marginTop: 8, fontSize: 13, borderStyle: 'dashed' }} onClick={addRow}>
        + Tilføj skytte
      </button>
    </div>
  )
}
