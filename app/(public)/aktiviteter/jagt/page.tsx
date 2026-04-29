import Icon from '@/components/Icon'
import Link from 'next/link'

const items = [
  'Bukkejagt og efterårsjagt for medlemmer, når jagtudvalget åbner for tilmelding.',
  'Rågeregulering og andre lokale opgaver koordineres gennem foreningen.',
  'Nye jægere kan følge med i kalenderen og spørge jagtudvalget om muligheder.',
]

export default function JagtPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
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
            Jagt
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Foreningen tilbyder jagtaktiviteter for medlemmer med fokus på lokale traditioner, sikkerhed og fællesskab.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 16px' }}>Sådan foregår det</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--fg1)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}><Icon name="check" size={16} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 10px' }}>Hold øje med kalenderen</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Jagtaktiviteter bliver meldt ud efter sæson og tilgængelige pladser.
            </p>
            <Link className="btn secondary" href="/kalender">Se kalenderen</Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
