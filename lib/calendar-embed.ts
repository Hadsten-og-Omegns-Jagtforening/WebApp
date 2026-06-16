const BOOKING_CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed?src=booking%40hadstenjagtforening.dk&ctz=Europe%2FCopenhagen'

function decodeAttribute(value: string) {
  return value.replace(/&amp;/g, '&')
}

export function getCalendarEmbedUrl(rawValue?: string | null) {
  const value = rawValue?.trim()
  if (!value) return BOOKING_CALENDAR_EMBED_URL

  const iframeSrc = value.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
  return decodeAttribute(iframeSrc ?? value)
}

export type CalendarMode = 'AGENDA' | 'WEEK' | 'MONTH'

// Display tweaks applied on top of the source calendar so the Google chrome
// blends with the HOJ card. These only affect the embed wrapper — the calendar
// grid itself lives in a cross-origin iframe and cannot be restyled with CSS.
const DISPLAY_DEFAULTS: Record<string, string> = {
  ctz: 'Europe/Copenhagen',
  wkst: '2', // weeks start Monday
  showTitle: '0',
  showNav: '1',
  showTabs: '0',
  showCalendars: '0',
  showPrint: '0',
  showTz: '0',
  bgcolor: '#FFFFFF',
}

// Builds a Google Calendar embed URL for a given view (mode), applying the HOJ
// display defaults. `rawValue` is the optional env override (URL or iframe code).
export function getCalendarModeUrl(rawValue: string | null | undefined, mode: CalendarMode) {
  const url = new URL(getCalendarEmbedUrl(rawValue))
  for (const [key, fallback] of Object.entries(DISPLAY_DEFAULTS)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, fallback)
  }
  url.searchParams.set('mode', mode)
  return url.toString()
}
