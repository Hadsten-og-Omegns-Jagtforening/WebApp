import Link from 'next/link'
import Icon from '@/components/Icon'
import { createClient } from '@/lib/supabase/server'
import type { PremieEvent } from '@/lib/database.types'
import type { IconName } from '@/components/Icon'

export default async function PremieskydningerPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('premieskydninger')
    .select('*')
    .order('sort_order', { ascending: true })

  const events = (data as PremieEvent[]) ?? []

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Aktiviteter</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(42px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 12px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Præmieskydninger
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Gennem året afholder vi faste præmieskydninger. Alle er åbne for medlemmer, og gæster er velkomne på udvalgte dage.
          </p>
        </div>

        <div className="grid-3">
          {events.map((event) => (
            <Link key={event.id} href={`/aktiviteter/premieskydninger/${event.slug}`} className="tile">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div className="icon-wrap">
                  <Icon name={event.icon as IconName} size={22} />
                </div>
                <span className="badge">{event.month_label}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, lineHeight: 1.15, margin: 0 }}>
                {event.title}
              </h2>
              <p>{event.description}</p>
              <span className="arrow">Læs mere →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
