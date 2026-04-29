import Icon from '@/components/Icon'
import Link from 'next/link'

const steps = [
  'Vi hjælper med praktisk træning på banen før haglskydeprøven.',
  'Du får rolig vejledning i sikkerhed, standplads og skydeteknik.',
  'Nye skytter kan låne udstyr efter aftale på træningsaftener.',
]

export default function HjaelpTilJagtprovenPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Aktiviteter</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(40px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 12px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Hjælp til jagtprøven
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '58ch', margin: 0, lineHeight: 1.5 }}>
            Har du brug for mere træning før haglskydeprøven, kan du bruge HOJ som et praktisk og roligt træningssted.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 16px' }}>Det kan vi hjælpe med</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {steps.map((step) => (
                <li key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--fg1)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}><Icon name="check" size={16} /></span>
                  {step}
                </li>
              ))}
            </ul>
          </article>

          <aside style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 10px' }}>Start med en træningsaften</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Se de kommende træningsaftener, eller send en forespørgsel om at bruge banen med instruktør.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link className="btn secondary" href="/kalender">Se kalender</Link>
              <Link className="btn primary" href="/book-skydebanen">Book banen</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
