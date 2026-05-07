const seasons = [
  { title: 'Februar - marts', detail: 'Lørdage fra kl. 13.00 - 16.00' },
  { title: 'April - august', detail: 'Onsdage fra kl. 18.30 - 21.30' },
  { title: 'September', detail: 'Lørdage fra kl. 13.00 - 16.00' },
]

const permitDays = [
  { day: 'Mandag',  sommer: '07.00 - 22.00', vinter: '07.00 - 22.00' },
  { day: 'Tirsdag', sommer: '07.00 - 18.00', vinter: '07.00 - 20.00' },
  { day: 'Onsdag',  sommer: '07.00 - 22.00', vinter: '07.00 - 22.00' },
  { day: 'Lørdag',  sommer: '09.00 - 16.00', vinter: '09.00 - 16.00' },
]

const innerCard = {
  background: 'var(--bg-alt)',
  borderRadius: 8,
  padding: '18px 20px',
}

const wrapperCard = {
  background: 'var(--surface-raised)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '28px 30px',
}

const gridResponsive: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
}

export default function AabningstiderOgSkydetiderPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(40px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 12px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Åbningstider og skydetider
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '58ch', margin: 0, lineHeight: 1.5 }}>
            Herunder finder du de faste skydetider. Følg kalenderen for ændringer og særlige arrangementer.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Åbningstider */}
          <article style={wrapperCard}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 8px' }}>Åbningstider</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Banen har faste åbningsdage gennem sæsonen. Ændringer fremgår altid af kalenderen.
            </p>
            <div style={gridResponsive}>
              {seasons.map((s) => (
                <div key={s.title} style={innerCard}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'block', marginBottom: 6 }}>{s.title}</strong>
                  <span style={{ color: 'var(--fg2)', fontSize: 15 }}>{s.detail}</span>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '16px 0 0', fontSize: 15 }}>
              Januar samt oktober-december afholder vi som udgangspunkt ingen skydninger.
            </p>
          </article>

          {/* Miljøgodkendelse */}
          <article style={wrapperCard}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 8px' }}>Miljøgodkendelse</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Vores miljøgodkendelse fastlægger, hvornår der må skydes på banen.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {permitDays.slice(0, 3).map((d) => (
                <div key={d.day} style={innerCard}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'block', marginBottom: 6 }}>{d.day}</strong>
                  <span style={{ color: 'var(--fg2)', fontSize: 14, display: 'block' }}>Sommer: {d.sommer}</span>
                  <span style={{ color: 'var(--fg2)', fontSize: 14, display: 'block' }}>Vinter: {d.vinter}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
              <div style={innerCard}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'block', marginBottom: 6 }}>{permitDays[3].day}</strong>
                <span style={{ color: 'var(--fg2)', fontSize: 14, display: 'block' }}>Sommer: {permitDays[3].sommer}</span>
                <span style={{ color: 'var(--fg2)', fontSize: 14, display: 'block' }}>Vinter: {permitDays[3].vinter}</span>
              </div>
            </div>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.6, margin: '16px 0 0', fontSize: 15 }}>
              Herudover må vi afvikle stævner, kurser og øvelser på 4 weekender i hvert halvår: lørdag/hverdag før helligdag kl. 09.00-20.00 og søndag/helligdag kl. 09.00-18.00.
            </p>
          </article>

          {/* Klubhuset */}
          <article style={wrapperCard}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: '0 0 12px' }}>Klubhuset</h2>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Klubhuset på Vissingvej er åbent i forbindelse med træning, præmieskydninger og foreningens arrangementer. Det er samlingspunktet - før og efter skydningen.
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, margin: '0 0 6px' }}>Er du i tvivl om noget?</h3>
            <p style={{ color: 'var(--fg2)', lineHeight: 1.5, margin: 0 }}>
              Kig forbi en træningsaften eller skriv til os på{' '}
              <a href="mailto:booking@hadstenjagtforening.dk" style={{ color: 'var(--accent)' }}>booking@hadstenjagtforening.dk</a>.
            </p>
          </article>

        </div>
      </div>
    </section>
  )
}
