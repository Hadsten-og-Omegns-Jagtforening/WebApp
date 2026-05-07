import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { createClient } from '@/lib/supabase/server'
import type { PremieEvent } from '@/lib/database.types'
import type { IconName } from '@/components/Icon'

type Props = { params: Promise<{ slug: string }> }

export default async function PremieDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('premieskydninger')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) notFound()
  const event = data as PremieEvent

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 8 }}>
          <Link
            href="/aktiviteter/premieskydninger"
            style={{ fontSize: 14, color: 'var(--fg3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            ← Alle præmieskydninger
          </Link>
        </div>

        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Præmieskydninger</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 12px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(36px, 6vw, 52px)',
                letterSpacing: '-0.02em',
                margin: 0,
                fontVariationSettings: '"opsz" 144',
              }}
            >
              {event.title}
            </h1>
            <span className="badge" style={{ flexShrink: 0 }}>{event.month_label}</span>
          </div>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            {event.description}
          </p>
        </div>

        {event.reglement ? (
          <article
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '28px 30px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="icon-wrap">
                <Icon name={event.icon as IconName} size={22} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, margin: 0 }}>Reglement</h2>
            </div>
            <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line' }}>
              {event.reglement}
            </p>
          </article>
        ) : (
          <aside
            style={{
              background: 'var(--bg-alt)',
              borderRadius: 8,
              padding: '24px 28px',
              color: 'var(--fg2)',
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Reglement offentliggøres i kalenderen inden arrangementet.{' '}
            <Link href="/kalender" style={{ color: 'var(--accent)' }}>Se kalender</Link>
          </aside>
        )}
      </div>
    </section>
  )
}
