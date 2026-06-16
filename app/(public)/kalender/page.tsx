import { getCalendarModeUrl, type CalendarMode } from '@/lib/calendar-embed'
import CalendarEmbed from './CalendarEmbed'

export default function KalenderPage() {
  const rawOverride = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL
  const urls: Record<CalendarMode, string> = {
    AGENDA: getCalendarModeUrl(rawOverride, 'AGENDA'),
    WEEK: getCalendarModeUrl(rawOverride, 'WEEK'),
    MONTH: getCalendarModeUrl(rawOverride, 'MONTH'),
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1080 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(42px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 12px',
            }}
          >
            Kalender
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0 }}>
            Skydetider, jagtdatoer og klubaftener. Kalenderen følger foreningens offentlige program.
          </p>
        </div>

        <CalendarEmbed urls={urls} />
      </div>
    </section>
  )
}
