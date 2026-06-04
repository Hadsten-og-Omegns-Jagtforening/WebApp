import { describe, expect, it } from 'vitest'
import { getUpcomingEvents, isPublicEvent, parseEvents, unfoldLines } from '@/lib/calendar-events'

const NOW = new Date('2026-06-03T12:00:00Z')

function ics(...events: string[]): string {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', ...events, 'END:VCALENDAR'].join('\n')
}

function vevent(props: Record<string, string>): string {
  return ['BEGIN:VEVENT', ...Object.entries(props).map(([k, v]) => `${k}:${v}`), 'END:VEVENT'].join('\n')
}

function cphWeekday(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Copenhagen', weekday: 'short' }).format(date)
}

function cphHour(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', hour12: false }).format(date)
}

function cphMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Copenhagen', month: '2-digit' }).format(date)
}

describe('unfoldLines', () => {
  it('joins folded continuation lines', () => {
    const lines = unfoldLines('SUMMARY:Lang titel der\n  fortsætter\nDTSTART:20260615T100000Z')
    expect(lines[0]).toBe('SUMMARY:Lang titel der fortsætter')
    expect(lines[1]).toBe('DTSTART:20260615T100000Z')
  })
})

describe('getUpcomingEvents', () => {
  it('includes a single upcoming event and skips past ones', () => {
    const text = ics(
      vevent({ DTSTART: '20260615T100000Z', DTEND: '20260615T120000Z', SUMMARY: 'Testmøde' }),
      vevent({ DTSTART: '20250101T100000Z', SUMMARY: 'Gammelt event' }),
    )
    const result = getUpcomingEvents(text, NOW)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Testmøde')
  })

  it('converts a UTC time to Copenhagen wall clock for display (summer +2)', () => {
    const result = getUpcomingEvents(ics(vevent({ DTSTART: '20260608T060000Z', SUMMARY: 'Morgen' })), NOW)
    // 06:00 UTC i juni = 08:00 i København
    expect(cphHour(result[0].start)).toBe('08')
  })

  it('decodes escaped commas in summaries', () => {
    const result = getUpcomingEvents(ics(vevent({ DTSTART: '20260615T100000Z', SUMMARY: 'Jagt\\, skydning og kaffe' })), NOW)
    expect(result[0].title).toBe('Jagt, skydning og kaffe')
  })

  it('drops a weekly series whose UNTIL is in the past', () => {
    const text = ics(
      vevent({ DTSTART: '20240103T160000Z', SUMMARY: 'Død serie', RRULE: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20250321T225959Z' }),
    )
    expect(getUpcomingEvents(text, NOW)).toHaveLength(0)
  })

  it('expands a live weekly series and keeps only matching weekdays in range', () => {
    const text = ics(
      vevent({ DTSTART: '20250101T160000Z', SUMMARY: 'Onsdagstræning', RRULE: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20260831T215959Z' }),
    )
    const result = getUpcomingEvents(text, NOW, 6)
    expect(result).toHaveLength(6)
    for (const occ of result) {
      expect(cphWeekday(occ.start)).toBe('Wed')
      expect(occ.start.getTime()).toBeGreaterThanOrEqual(NOW.getTime())
      expect(occ.start.getTime()).toBeLessThanOrEqual(new Date('2026-08-31T21:59:59Z').getTime())
    }
  })

  it('respects COUNT when expanding a weekly series', () => {
    const text = ics(
      vevent({ DTSTART: '20260604T100000Z', SUMMARY: 'Tre gange', RRULE: 'FREQ=WEEKLY;BYDAY=TH;COUNT=3' }),
    )
    const result = getUpcomingEvents(text, NOW, 10)
    expect(result).toHaveLength(3)
    for (const occ of result) expect(cphWeekday(occ.start)).toBe('Thu')
  })

  it('handles a positional yearly rule (last Sunday of October)', () => {
    const text = ics(
      vevent({ DTSTART: '20221030T080000Z', SUMMARY: 'Sidste søndag okt', RRULE: 'FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU' }),
    )
    const result = getUpcomingEvents(text, NOW, 6)
    expect(result.length).toBeGreaterThanOrEqual(1)
    const first = result[0]
    expect(cphWeekday(first.start)).toBe('Sun')
    expect(cphMonth(first.start)).toBe('10')
  })

  it('parses all-day events', () => {
    const text = ics(vevent({ 'DTSTART;VALUE=DATE': '20260920', SUMMARY: 'Heldagsarrangement' }))
    const result = getUpcomingEvents(text, NOW)
    expect(result).toHaveLength(1)
    expect(result[0].allDay).toBe(true)
    expect(result[0].title).toBe('Heldagsarrangement')
  })

  it('excludes private bookings from the public list', () => {
    const text = ics(
      vevent({ DTSTART: '20260615T100000Z', SUMMARY: 'Privat (med skydning)' }),
      vevent({ DTSTART: '20260616T100000Z', SUMMARY: 'Privat' }),
      vevent({ DTSTART: '20260617T100000Z', SUMMARY: 'Træning for alle (med skydning)' }),
    )
    const result = getUpcomingEvents(text, NOW)
    expect(result.map((e) => e.title)).toEqual(['Træning for alle (med skydning)'])
  })

  it('sorts occurrences chronologically and limits the count', () => {
    const text = ics(
      vevent({ DTSTART: '20260901T100000Z', SUMMARY: 'September' }),
      vevent({ DTSTART: '20260701T100000Z', SUMMARY: 'Juli' }),
      vevent({ DTSTART: '20260801T100000Z', SUMMARY: 'August' }),
    )
    const result = getUpcomingEvents(text, NOW, 2)
    expect(result.map((e) => e.title)).toEqual(['Juli', 'August'])
  })
})

describe('isPublicEvent', () => {
  it('treats club activities as public and private bookings as not', () => {
    expect(isPublicEvent('Træning for alle (med skydning)')).toBe(true)
    expect(isPublicEvent('Jagttegnsprøve - Med skydning')).toBe(true)
    expect(isPublicEvent('Privat')).toBe(false)
    expect(isPublicEvent('Privat (med skydning)')).toBe(false)
  })
})

describe('parseEvents', () => {
  it('extracts dtstart, summary and rrule from VEVENT blocks', () => {
    const events = parseEvents(
      ics(vevent({ DTSTART: '20260615T100000Z', SUMMARY: 'Møde', RRULE: 'FREQ=WEEKLY;BYDAY=MO' })),
    )
    expect(events).toHaveLength(1)
    expect(events[0].summary).toBe('Møde')
    expect(events[0].rrule).toEqual({ FREQ: 'WEEKLY', BYDAY: 'MO' })
  })
})
