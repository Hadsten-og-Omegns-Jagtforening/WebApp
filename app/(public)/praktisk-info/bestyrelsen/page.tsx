import Icon from '@/components/Icon'

const areas = [
  'Bestyrelsen håndterer foreningens drift, medlemskab og fælles beslutninger.',
  'Udvalg koordinerer bane, jagt, riffel og skydning efter behov.',
  'Henvendelser kan sendes til foreningens fælles mail, så de lander det rigtige sted.',
]

export default function BestyrelsenPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
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
            Bestyrelsen
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Kontakt foreningen om medlemskab, aktiviteter, bane og praktiske spørgsmål.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 16px' }}>Opgaver</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {areas.map((area) => (
                <li key={area} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--fg1)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}><Icon name="check" size={16} /></span>
                  {area}
                </li>
              ))}
            </ul>
          </article>

          <aside style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 10px' }}>Skriv til foreningen</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Brug den fælles mail, hvis du er i tvivl om hvem du skal have fat i.
            </p>
            <a className="btn primary" href="mailto:info@hadstenjagtforening.dk">info@hadstenjagtforening.dk</a>
          </aside>
        </div>
      </div>
    </section>
  )
}
