import Icon from '@/components/Icon'

const memberships = [
  {
    name: 'Aktivt medlemskab',
    price: '825',
    bullets: [
      'Fri træning på skydebanen',
      'Adgang til lodtrækninger og jagtaktiviteter',
      'Medlemsrabat på præmieskydninger',
      'Klubaftener og foredrag',
    ],
  },
  {
    name: 'Familiemedlem',
    price: '1.150',
    bullets: [
      'Alt i aktivt medlemskab',
      'For dig og din husstand',
      'Op til 2 voksne og børn under 18',
      'Fællesskab omkring klubhus og bane',
    ],
  },
]

export default function BlivMedlemPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Om HOJ</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(44px, 8vw, 64px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 16px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Bliv medlem
          </h1>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Adgang til jagt, træning på banen og fællesskab omkring klubhuset siden 1968.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 20, marginBottom: 48 }}>
          {memberships.map((membership) => (
            <article key={membership.name} style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 8 }}>
                {membership.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 44, letterSpacing: '-0.02em', color: 'var(--fg1)' }}>{membership.price}</span>
                <span style={{ fontSize: 15, color: 'var(--fg3)' }}>kr / år</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {membership.bullets.map((bullet) => (
                  <li key={bullet} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, color: 'var(--fg1)' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}><Icon name="check" size={16} /></span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a className="btn primary" href="mailto:info@hadstenjagtforening.dk?subject=Medlemskab" style={{ width: '100%', justifyContent: 'center' }}>
                Tilmeld dig
              </a>
            </article>
          ))}
        </div>

        <div style={{ background: 'var(--bg-alt)', borderRadius: 8, padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>Usikker på om det er noget for dig?</h2>
            <p style={{ margin: 0, color: 'var(--fg2)', fontSize: 15 }}>
              Kig forbi en træningsaften. Vi har udstyr klar, så du kan prøve flugtskydning uden selv at have udstyr.
            </p>
          </div>
          <a className="btn secondary" href="/book-skydebanen">Prøv en træningsaften</a>
        </div>
      </div>
    </section>
  )
}
