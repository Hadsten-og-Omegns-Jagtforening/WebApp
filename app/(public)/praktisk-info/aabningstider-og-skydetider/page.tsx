import Icon from '@/components/Icon'
import Link from 'next/link'

const notes = [
  'Træningsaftener og særlige skydedage fremgår af kalenderen.',
  'Kortsalg og praktiske tider meldes ud sammen med den enkelte aktivitet.',
  'Ved private arrangementer aftales tidspunkt og behov direkte med foreningen.',
]

export default function AabningstiderOgSkydetiderPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
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
            Åbningstider og skydetider
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '58ch', margin: 0, lineHeight: 1.5 }}>
            Brug kalenderen som den aktuelle oversigt over skydetider, træning og arrangementer.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 16px' }}>Praktisk at vide</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notes.map((note) => (
                <li key={note} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--fg1)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}><Icon name="check" size={16} /></span>
                  {note}
                </li>
              ))}
            </ul>
          </article>

          <aside style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 10px' }}>Se næste aktivitet</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Kalenderen viser de kommende træningsaftener, jagtdatoer og klubaftener.
            </p>
            <Link className="btn primary" href="/kalender">Åbn kalender</Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
