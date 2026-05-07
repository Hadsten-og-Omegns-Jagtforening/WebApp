import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import Icon from '@/components/Icon'
import type { PremieEvent } from '@/lib/database.types'

export default async function AdminPremieskydningerPage() {
  const db = createAdminClient()
  const { data: events, error } = await db
    .from('premieskydninger')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`Database error: ${error.message}`)

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Præmieskydninger</div>
          <h1>Præmieskydninger</h1>
          <p className="subtitle">{(events ?? []).length} arrangementer</p>
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Rækkefølge</th>
              <th>Titel</th>
              <th>Periode</th>
              <th style={{ textAlign: 'right' }}>Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {((events as PremieEvent[]) ?? []).map(event => (
              <tr key={event.id}>
                <td style={{ color: 'var(--fg3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  {event.sort_order}
                </td>
                <td className="title-cell">
                  <div className="title">{event.title}</div>
                  <div className="excerpt">{event.description}</div>
                </td>
                <td className="date-cell">{event.month_label}</td>
                <td className="actions-cell">
                  <Link href={`/admin/premieskydninger/${event.id}`} title="Rediger" className="btn ghost icon-only">
                    <Icon name="pencil" size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
