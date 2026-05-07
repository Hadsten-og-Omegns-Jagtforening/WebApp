export default function HistorienOmOsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(42px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 16px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Historien om os
          </h1>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '58ch', margin: '0 0 12px', lineHeight: 1.55 }}>
            Hadsten og Omegns Jagtforening blev stiftet den 7. november 1922 i Galten Forsamlingshus.
          </p>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '58ch', margin: '0 0 12px', lineHeight: 1.55 }}>
            Foreningen startede med 15 medlemmer og et kontingent på 4 kroner om året - og holdt allerede deres første generalforsamling fire dage senere, hjemme hos formanden.
          </p>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '58ch', margin: 0, lineHeight: 1.55 }}>
            Det siger noget om energien dengang. Og den er ikke forsvundet siden.
          </p>
        </div>
      </div>
    </section>
  )
}
