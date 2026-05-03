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
