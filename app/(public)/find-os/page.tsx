import Icon from '@/components/Icon'

export default function FindOsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Find os</span>
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
            Find os
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Skydebanen og klubhuset ligger på Vissingvej 6 i Hadsten.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'stretch', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <div className="icon-wrap" style={{ marginBottom: 18 }}><Icon name="map-pin" size={22} /></div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 12px' }}>Adresse</h2>
            <p style={{ color: 'var(--fg1)', lineHeight: 1.6, margin: '0 0 18px' }}>
              Hadsten &amp; Omegns Jagtforening<br />
              Vissingvej 6<br />
              8370 Hadsten
            </p>
            <a className="btn primary" href="https://www.google.com/maps/search/?api=1&query=Vissingvej%206%2C%208370%20Hadsten">
              Åbn i Google Maps
            </a>
          </article>

          <aside style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 12px' }}>Kontakt</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Skriv til foreningen, hvis du har spørgsmål om banen, medlemskab eller arrangementer.
            </p>
            <a className="btn secondary" href="mailto:info@hadstenjagtforening.dk">info@hadstenjagtforening.dk</a>
          </aside>
        </div>
      </div>
    </section>
  )
}
