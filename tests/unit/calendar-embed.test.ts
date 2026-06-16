import { describe, expect, it } from 'vitest'
import { getCalendarEmbedUrl, getCalendarModeUrl } from '@/lib/calendar-embed'

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

describe('getCalendarModeUrl', () => {
  it('sets the requested view mode', () => {
    expect(getCalendarModeUrl(undefined, 'AGENDA')).toContain('mode=AGENDA')
    expect(getCalendarModeUrl(undefined, 'WEEK')).toContain('mode=WEEK')
    expect(getCalendarModeUrl(undefined, 'MONTH')).toContain('mode=MONTH')
  })

  it('applies the HOJ display defaults to the booking calendar', () => {
    const url = getCalendarModeUrl(undefined, 'AGENDA')
    expect(url).toContain('src=booking%40hadstenjagtforening.dk')
    expect(url).toContain('showTabs=0')
    expect(url).toContain('showCalendars=0')
    expect(url).toContain('wkst=2')
  })

  it('overrides the mode when the source URL already specifies one', () => {
    const override = 'https://calendar.google.com/calendar/embed?src=test%40example.dk&mode=MONTH'
    const url = getCalendarModeUrl(override, 'AGENDA')
    expect(url).toContain('mode=AGENDA')
    expect(url).not.toContain('mode=MONTH')
  })
})
