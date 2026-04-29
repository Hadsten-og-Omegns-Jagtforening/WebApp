import Icon from '@/components/Icon'

const bookedDays = new Set([5, 8, 12, 16, 19, 22, 26])
const days = Array.from({ length: 35 }, (_, index) => index - 2)

export default function BookSkydebanenPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Book skydebanen</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(42px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 16px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Reservér banen
          </h1>
          <p style={{ fontSize: 19, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            Flugtskydning i Hadsten for private grupper, firmaer og polterabender. Vi har udstyr klar, så du møder bare op.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: 32 }}>
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, margin: 0 }}>Vælg dato - maj 2026</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn secondary sm" type="button" aria-label="Forrige måned" disabled style={{ padding: '6px 10px' }}>
                  <Icon name="chevron-left" size={16} />
                </button>
                <button className="btn secondary sm" type="button" aria-label="Næste måned" disabled style={{ padding: '6px 10px' }}>
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>

            <div className="daygrid" aria-label="Statisk bookingkalender for maj 2026">
              {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((day, index) => (
                <div key={`${day}-${index}`} className="dow">{day}</div>
              ))}
              {days.map((day, index) => {
                const isOff = day < 1 || day > 31
                const label = isOff ? (day < 1 ? 30 + day : day - 31) : day
                const hasBooking = bookedDays.has(day)

                return (
                  <div
                    key={`booking-day-${index}`}
                    className={`day${isOff ? ' off' : ''}${hasBooking ? ' has' : ''}${day === 22 ? ' selected' : ''}${day === 14 ? ' today' : ''}`}
                    aria-label={`${label}. maj${hasBooking ? ', optaget' : ''}`}
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--fg3)', marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                Andre bookinger
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, border: '1px solid var(--accent)' }} />
                I dag
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--hoj-forest-800)' }} />
                Valgt
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="field">
              <label htmlFor="booking-time">Tidsrum</label>
              <select id="booking-time" defaultValue="17:00 - 19:00" disabled>
                <option>16:00 - 18:00</option>
                <option>17:00 - 19:00</option>
                <option>18:00 - 20:00</option>
                <option>19:00 - 21:00</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="booking-group">Hvem er I?</label>
              <select id="booking-group" defaultValue="Privat gruppe" disabled>
                <option>Privat gruppe</option>
                <option>Firmaarrangement</option>
                <option>Polterabend</option>
                <option>Nybegyndere - instruktør bedes</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="booking-size">Antal deltagere</label>
              <input id="booking-size" type="number" min="1" max="20" defaultValue="4" disabled />
            </div>
            <div className="field">
              <label htmlFor="booking-phone">Kontaktperson - telefon</label>
              <input id="booking-phone" placeholder="+45 12 34 56 78" disabled />
            </div>
            <a className="btn primary lg" href="mailto:info@hadstenjagtforening.dk?subject=Booking%20af%20skydebane" style={{ marginTop: 4 }}>
              Send booking-anmodning
            </a>
            <p style={{ fontSize: 13, color: 'var(--fg3)', margin: 0, lineHeight: 1.5 }}>
              Du modtager en bekræftelse på mail. Betaling sker på stedet eller via MobilePay.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
