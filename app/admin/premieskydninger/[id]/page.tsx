import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { updatePremie } from '@/lib/actions/premieskydninger'
import type { PremieEvent } from '@/lib/database.types'

type Props = { params: Promise<{ id: string }> }

export default async function EditPremieSkydningPage({ params }: Props) {
  const { id } = await params
  const db = createAdminClient()
  const { data, error } = await db
    .from('premieskydninger')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`Database error: ${error.message}`)
  if (!data) notFound()
  const event = data as PremieEvent

  async function save(formData: FormData) {
    'use server'
    await updatePremie(id, formData)
  }

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Præmieskydninger / Rediger</div>
          <h1>Rediger: {event.title}</h1>
          <p className="subtitle">Sidst opdateret {new Date(event.updated_at).toLocaleString('da-DK')}</p>
        </div>
      </div>

      <div className="adm-card" style={{ maxWidth: 680 }}>
        <form action={save} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="field">
            <label htmlFor="title">Titel</label>
            <input id="title" name="title" type="text" defaultValue={event.title} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label htmlFor="month_label">Periode (fx &quot;Apr-Sep&quot;)</label>
              <input id="month_label" name="month_label" type="text" defaultValue={event.month_label} required />
            </div>
            <div className="field">
              <label htmlFor="sort_order">Rækkefølge</label>
              <input id="sort_order" name="sort_order" type="number" defaultValue={event.sort_order} min={0} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="icon">Ikon</label>
            <select id="icon" name="icon" defaultValue={event.icon}>
              <option value="trophy">trophy (pokal)</option>
              <option value="claypigeon">claypigeon (duertallerken)</option>
              <option value="crosshair">crosshair (sigtekorn)</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="description">Kort beskrivelse (vises på oversigtskortet)</label>
            <textarea id="description" name="description" rows={3} defaultValue={event.description} />
          </div>

          <div className="field">
            <label htmlFor="reglement">Reglement / uddybende info (vises på detailsiden)</label>
            <textarea id="reglement" name="reglement" rows={8} defaultValue={event.reglement}
              placeholder="Beskriv regler, tilmelding, præmier osv." />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn primary">Gem ændringer</button>
            <Link href="/admin/premieskydninger" className="btn secondary">Tilbage</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
