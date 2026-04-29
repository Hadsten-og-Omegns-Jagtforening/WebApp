import Icon from '@/components/Icon'

const prizes = [
  {
    title: 'Fastelavnsskydning',
    when: 'Feb',
    icon: 'trophy' as const,
    text: 'Årets første præmieskydning med rundstykker i klubhuset fra kl. 09.00.',
  },
  {
    title: 'HOJ Cup',
    when: 'Apr-Sep',
    icon: 'trophy' as const,
    text: 'Seks runder henover sæsonen. Samlet vinder kåres til juleskydningen.',
  },
  {
    title: 'Skt. Hans / Midsommer',
    when: 'Jun',
    icon: 'trophy' as const,
    text: 'Midsommerskydning med grill og fællesspisning efter skydningen.',
  },
  {
    title: 'Mærkeskydning',
    when: 'Aug',
    icon: 'trophy' as const,
    text: 'Foreningsmesterskab med guld-, sølv- og bronzemærker.',
  },
  {
    title: '80 duers jagtskydning',
    when: 'Apr',
    icon: 'claypigeon' as const,
    text: '20 duer i streg på hver af de fire standpladser.',
  },
  {
    title: 'Juleskydning',
    when: 'Dec',
    icon: 'trophy' as const,
    text: 'Sæsonens sidste skydning med præmier, gløgg og æbleskiver.',
  },
]

export default function PremieskydningerPage() {
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
          {prizes.map((prize) => (
            <article key={prize.title} className="tile" aria-label={prize.title} style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div className="icon-wrap"><Icon name={prize.icon} size={22} /></div>
                <span className="badge">{prize.when}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, lineHeight: 1.15, margin: 0 }}>{prize.title}</h2>
              <p>{prize.text}</p>
              <span className="arrow">Reglement offentliggøres i kalenderen</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
