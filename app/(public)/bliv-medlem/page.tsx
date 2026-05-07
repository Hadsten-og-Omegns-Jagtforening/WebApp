export default function BlivMedlemPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>

        {/* Intro */}
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Bliv medlem</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(44px, 8vw, 64px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 16px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Bliv en del af fællesskabet
          </h1>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '56ch', margin: '0 0 16px', lineHeight: 1.5 }}>
            Hos Hadsten og Omegns Jagtforening er medlemskabet mere end en tilmelding.
          </p>
          <p style={{ fontSize: 16, color: 'var(--fg2)', maxWidth: '64ch', margin: '0 0 12px', lineHeight: 1.6 }}>
            Det er adgang til foreningens jagter - bukkejagt, hjortejagt og efterårsjagt - og til et fællesskab, der har holdt sammen om jagt og flugtskydning i Østjylland siden 1933.
          </p>
          <p style={{ fontSize: 16, color: 'var(--fg2)', maxWidth: '64ch', margin: 0, lineHeight: 1.6 }}>
            Skydebanen, kurserne og arrangementerne er åbne for alle. Men vil du med på jagt, skal du være medlem.
          </p>
        </div>

        {/* Sådan bliver du medlem */}
        <article style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '28px 30px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 16px' }}>
            Sådan bliver du medlem
          </h2>
          <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.6, margin: '0 0 12px' }}>
            Medlemskab tegnes gennem Danmarks Jægerforbund, som er dem, der administrerer medlemskaber for landets frivillige jagtforeninger, herunder os.
          </p>
          <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.6, margin: '0 0 12px' }}>
            Du bliver medlem i tre trin:
          </p>
          <ol style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.6, margin: '0 0 16px', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Gå ind på jaegerforbundet.dk og find Hadsten og Omegns Jagtforening i listen over foreninger lidt længere nede på siden.</li>
            <li>Vælg din medlemstype - ordinært eller ekstraordinært medlemskab.</li>
            <li>Udfyld formularen med dine oplysninger - så er du officielt medlem ved os.</li>
          </ol>
          <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.6, margin: '0 0 24px' }}>
            Har du spørgsmål undervejs, kan du altid kontakte Danmarks Jægerforbund direkte eller skrive til os.
          </p>
          <a
            className="btn primary lg"
            href="https://www.jaegerforbundet.dk/om-dj/medlemskab-for-din-og-for-jagtens-skyld/bliv-medlem/"
            target="_blank"
            rel="noreferrer"
          >
            Bliv medlem hos os
          </a>
        </article>

      </div>
    </section>
  )
}
