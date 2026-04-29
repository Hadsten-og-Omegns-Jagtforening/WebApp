const events = [
  { day: 6, time: '17:00-20:00', title: 'Træningsaften', tag: 'Flugtskydning', color: 'var(--hoj-brass-600)' },
  { day: 13, time: '17:00-20:00', title: 'Træningsaften', tag: 'Flugtskydning', color: 'var(--hoj-brass-600)' },
  { day: 16, time: '05:00', title: 'Bukkejagt - premiere', tag: 'Jagt', color: 'var(--hoj-forest-700)' },
  { day: 20, time: '19:00', title: 'Klubaften - foredrag', tag: 'Klubhus', color: 'var(--hoj-loam-500)' },
  { day: 24, time: '09:00-12:00', title: 'HOJ Cup - runde 2', tag: 'Præmie', color: 'var(--hoj-clay-600)' },
  { day: 27, time: '17:00-20:00', title: 'Træningsaften', tag: 'Flugtskydning', color: 'var(--hoj-brass-600)' },
]

export default function KalenderPage() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
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
            Kalender
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0 }}>
            Skydetider, jagtdatoer og klubaftener. Kalenderen følger foreningens offentlige program.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: 0 }}>Maj 2026</h2>
              <span className="badge">Statisk oversigt</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(40px, 1fr))', background: 'var(--border)', gap: 1, overflowX: 'auto' }}>
              {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map((day) => (
                <div key={day} style={{ background: 'var(--bg-alt)', padding: '10px 12px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, index) => {
                const day = index - 2
                const inMonth = day >= 1 && day <= 31
                const label = inMonth ? day : day < 1 ? 28 + day : day - 31
                const dayEvents = events.filter((event) => event.day === day)

                return (
                  <div key={`calendar-day-${index}`} style={{ background: 'var(--surface-raised)', minHeight: 90, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: inMonth ? 'var(--fg1)' : 'var(--fg3)', fontWeight: day === 14 ? 700 : 400 }}>
                      {label}
                    </div>
                    {dayEvents.map((event) => (
                      <div key={event.title} style={{ fontSize: 11, lineHeight: 1.3, padding: '3px 6px', borderRadius: 3, background: 'var(--bg-alt)', color: 'var(--fg1)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: event.color, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          <aside>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, margin: '0 0 16px' }}>Kommende aktiviteter</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((event) => (
                <article key={`${event.day}-${event.title}`} style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 40 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, lineHeight: 1, color: 'var(--fg1)' }}>{event.day}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>MAJ</div>
                  </div>
                  <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg1)', marginBottom: 2 }}>{event.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{event.time}</div>
                    <div style={{ marginTop: 6 }}><span className="badge" style={{ padding: '3px 8px', fontSize: 11 }}>{event.tag}</span></div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
