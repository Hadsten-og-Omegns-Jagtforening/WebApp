import { getCalendarModeUrl, type CalendarMode } from '@/lib/calendar-embed'
import { fetchUpcomingEvents, type CalendarEvent } from '@/lib/calendar-events'
import CalendarEmbed from './CalendarEmbed'

const TIME_ZONE = 'Europe/Copenhagen'

function formatDay(date: Date) {
  return new Intl.DateTimeFormat('da-DK', { timeZone: TIME_ZONE, day: 'numeric' }).format(date)
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('da-DK', { timeZone: TIME_ZONE, month: 'short' })
    .format(date)
    .replace('.', '')
    .toUpperCase()
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function sameCalendarDay(a: Date, b: Date) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
  return fmt.format(a) === fmt.format(b)
}

function formatTimeRange(event: CalendarEvent) {
  if (event.allDay) return 'Hele dagen'
  if (event.end && sameCalendarDay(event.start, event.end)) {
    return `${formatTime(event.start)}-${formatTime(event.end)}`
  }
  return formatTime(event.start)
}

function categoryTag(title: string) {
  // Specifik kategori før det generiske "skydning" — næsten alle titler
  // ender på "(med skydning)", så det må ikke vinde over fx en prøve.
  const t = title.toLowerCase()
  if (/jagttegn|haglprøve|prøve/.test(t)) return 'Jagttegn'
  if (/træning/.test(t)) return 'Træning'
  if (/cup/.test(t)) return 'HOJ Cup'
  if (/klubaften|foredrag|generalforsamling|fest/.test(t)) return 'Klub'
  if (/jagt|buk|riffel/.test(t)) return 'Jagt'
  if (/skydning|flugt|bane/.test(t)) return 'Skydning'
  return 'Aktivitet'
}

export const revalidate = 3600

export default async function KalenderPage() {
  const rawEmbed = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL
  const urls: Record<CalendarMode, string> = {
    AGENDA: getCalendarModeUrl(rawEmbed, 'AGENDA'),
    WEEK: getCalendarModeUrl(rawEmbed, 'WEEK'),
    MONTH: getCalendarModeUrl(rawEmbed, 'MONTH'),
  }
  const events = await fetchUpcomingEvents(6)

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
            Skydetider, jagtdatoer og klubaftener. Kalenderen foelger foreningens offentlige program.
          </p>
        </div>

        <div className="kalender-grid">
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: 0 }}>Foreningens kalender</h2>
              <span className="badge">Google Kalender</span>
            </div>

            <CalendarEmbed urls={urls} />
          </div>

          <aside>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, margin: '0 0 16px' }}>Kommende aktiviteter</h2>
            {events.length === 0 ? (
              <p style={{ fontSize: 15, color: 'var(--fg3)', margin: 0 }}>
                Ingen kommende aktiviteter lige nu. Se kalenderen for det fulde program.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {events.map((event) => (
                  <article
                    key={`${event.start.toISOString()}-${event.title}`}
                    style={{
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '14px 16px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 40 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, lineHeight: 1, color: 'var(--fg1)' }}>{formatDay(event.start)}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{formatMonth(event.start)}</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg1)', marginBottom: 2 }}>{event.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{formatTimeRange(event)}</div>
                      <div style={{ marginTop: 6 }}>
                        <span className="badge" style={{ padding: '3px 8px', fontSize: 11 }}>{categoryTag(event.title)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
