const board = [
  { role: 'Formand', name: 'Peter Glavind' },
  { role: 'Næstformand', name: 'Keld Kristensen' },
  { role: 'Kasserer', name: 'Christian Krogh Hansen' },
  { role: 'Sekretær', name: 'Magnus Asmussen' },
  { role: 'Medlem', name: 'Bjarne Larsen' },
  { role: 'Medlem', name: 'Claus Horn' },
  { role: 'Medlem', name: 'Claus Vinge' },
  { role: 'Medlem', name: 'Claus Christensen' },
  { role: 'Medlem', name: 'Anders Glavind' },
  { role: 'Suppleant', name: 'Allan Søsted' },
  { role: 'Suppleant', name: 'Sten Nielsen' },
]

export default function FolkeneBagForeningenPage() {
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
              margin: '8px 0 12px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Folkene bag foreningen
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Bestyrelsen står for foreningens drift, medlemskab og fælles beslutninger. Henvendelser kan sendes til vores fælles mail.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <article style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 30px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: '0 0 20px' }}>Bestyrelsen</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <tbody>
                {board.map((member, i) => (
                  <tr key={i} style={{ borderBottom: i < board.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 12px 12px 0', color: 'var(--fg2)', whiteSpace: 'nowrap' }}>
                      {member.role}
                    </td>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--fg1)' }}>
                      {member.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
