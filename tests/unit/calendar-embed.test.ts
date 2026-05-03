import { describe, expect, it } from 'vitest'
import { getCalendarEmbedUrl } from '@/lib/calendar-embed'

describe('getCalendarEmbedUrl', () => {
  it('uses the public booking calendar when no override is provided', () => {
    expect(getCalendarEmbedUrl()).toContain('booking%40hadstenjagtforening.dk')
  })

  it('uses a raw Google Calendar embed URL override', () => {
    const url = 'https://calendar.google.com/calendar/embed?src=test%40example.dk&ctz=Europe%2FCopenhagen'

    expect(getCalendarEmbedUrl(url)).toBe(url)
  })

  it('extracts src when an iframe embed code is pasted as override', () => {
    const iframe = '<iframe src="https://calendar.google.com/calendar/embed?src=test%40example.dk"></iframe>'

    expect(getCalendarEmbedUrl(iframe)).toBe('https://calendar.google.com/calendar/embed?src=test%40example.dk')
  })
})
