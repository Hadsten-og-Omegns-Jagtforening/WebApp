// Henter og parser foreningens offentlige Google Calendar ICS-feed, så
// "Kommende aktiviteter" kan vise ægte events i stedet for hardkodede datoer.
// Ingen API-nøgle nødvendig — feedet er offentligt for en delt kalender.

const ICS_URL =
  'https://calendar.google.com/calendar/ical/booking%40hadstenjagtforening.dk/public/basic.ics'

const TIME_ZONE = 'Europe/Copenhagen'
const DAY_MS = 24 * 60 * 60 * 1000

export interface CalendarEvent {
  start: Date
  end: Date | null
  allDay: boolean
  title: string
}

interface RawEvent {
  dtstart: { value: string; params: Record<string, string> }
  dtend: { value: string; params: Record<string, string> } | null
  summary: string
  rrule: Record<string, string> | null
}

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] // index = JS getUTCDay()

// --- Lavniveau ICS-parsing ----------------------------------------------------

// ICS folder lange linjer: en fortsættelse starter med mellemrum/tab.
export function unfoldLines(raw: string): string[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  for (const line of lines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length > 0) {
      out[out.length - 1] += line.slice(1)
    } else {
      out.push(line)
    }
  }
  return out
}

function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, ' ')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim()
}

// Splitter "DTSTART;TZID=Europe/Copenhagen:20260401T180000" i navn, params, værdi.
function parseProperty(line: string): { name: string; params: Record<string, string>; value: string } | null {
  const colon = line.indexOf(':')
  if (colon === -1) return null
  const left = line.slice(0, colon)
  const value = line.slice(colon + 1)
  const [name, ...paramParts] = left.split(';')
  const params: Record<string, string> = {}
  for (const part of paramParts) {
    const eq = part.indexOf('=')
    if (eq !== -1) params[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1)
  }
  return { name: name.toUpperCase(), params, value }
}

function parseRRule(value: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of value.split(';')) {
    const eq = part.indexOf('=')
    if (eq !== -1) out[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1)
  }
  return out
}

export function parseEvents(ics: string): RawEvent[] {
  const lines = unfoldLines(ics)
  const events: RawEvent[] = []
  let current: Partial<RawEvent> | null = null

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = { dtend: null, summary: '', rrule: null }
      continue
    }
    if (line === 'END:VEVENT') {
      if (current?.dtstart) events.push(current as RawEvent)
      current = null
      continue
    }
    if (!current) continue

    const prop = parseProperty(line)
    if (!prop) continue
    switch (prop.name) {
      case 'DTSTART':
        current.dtstart = { value: prop.value, params: prop.params }
        break
      case 'DTEND':
        current.dtend = { value: prop.value, params: prop.params }
        break
      case 'SUMMARY':
        current.summary = unescapeText(prop.value)
        break
      case 'RRULE':
        current.rrule = parseRRule(prop.value)
        break
    }
  }
  return events
}

// --- Tidszone-håndtering ------------------------------------------------------

// Offset (ms) mellem en tidszones vægur og UTC for et givent UTC-øjeblik.
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const map: Record<string, number> = {}
  for (const part of dtf.formatToParts(new Date(utcMs))) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  let hour = map.hour
  if (hour === 24) hour = 0 // nogle motorer angiver midnat som 24
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second)
  return asUtc - utcMs
}

// Vægur-tid i en tidszone → korrekt UTC-instant (DST-bevidst).
function wallClockToInstant(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  s: number,
  timeZone: string,
): Date {
  const naiveUtc = Date.UTC(y, mo - 1, d, h, mi, s)
  const offset = tzOffsetMs(naiveUtc, timeZone)
  return new Date(naiveUtc - offset)
}

interface WallClock {
  y: number
  mo: number
  d: number
  h: number
  mi: number
  s: number
  allDay: boolean
}

// Parser en ICS-datoværdi til både UTC-instant og Københavns vægur.
function parseIcsDate(value: string, params: Record<string, string>): { instant: Date; wall: WallClock } {
  // Heldags: VALUE=DATE → "20260913"
  if (params.VALUE === 'DATE' || /^\d{8}$/.test(value)) {
    const y = Number(value.slice(0, 4))
    const mo = Number(value.slice(4, 6))
    const d = Number(value.slice(6, 8))
    return {
      instant: wallClockToInstant(y, mo, d, 0, 0, 0, TIME_ZONE),
      wall: { y, mo, d, h: 0, mi: 0, s: 0, allDay: true },
    }
  }

  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
  if (!m) {
    // Ukendt format — fald tilbage til Date-konstruktøren.
    const fallback = new Date(value)
    return { instant: fallback, wall: { y: 0, mo: 0, d: 0, h: 0, mi: 0, s: 0, allDay: false } }
  }

  const [, ys, mos, ds, hs, mis, ss, z] = m
  const y = Number(ys)
  const mo = Number(mos)
  const d = Number(ds)
  const h = Number(hs)
  const mi = Number(mis)
  const s = Number(ss)

  let instant: Date
  if (z === 'Z') {
    instant = new Date(Date.UTC(y, mo - 1, d, h, mi, s))
  } else {
    // TZID-angivet eller flydende — behandl som Københavns vægur.
    instant = wallClockToInstant(y, mo, d, h, mi, s, TIME_ZONE)
  }

  // Vægur i København (uanset kildens form) til gentagelses-beregning.
  const wall = instantToWallClock(instant)
  return { instant, wall }
}

function instantToWallClock(instant: Date): WallClock {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const map: Record<string, number> = {}
  for (const part of dtf.formatToParts(instant)) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  let h = map.hour
  if (h === 24) h = 0
  return { y: map.year, mo: map.month, d: map.day, h, mi: map.minute, s: map.second, allDay: false }
}

// --- Hjælp til gentagelser ----------------------------------------------------

function weekdayOf(y: number, mo: number, d: number): number {
  // Bruger middag for at undgå tidszone-kant ved døgnskifte.
  return new Date(Date.UTC(y, mo - 1, d, 12)).getUTCDay()
}

// Mandag i ugen for en given dato, som dag-tal siden epoch (til INTERVAL-tjek).
function mondayIndex(y: number, mo: number, d: number): number {
  const dow = weekdayOf(y, mo, d) // 0=søn
  const offsetToMonday = (dow + 6) % 7
  const dayNumber = Math.floor(Date.UTC(y, mo - 1, d) / DAY_MS)
  return Math.floor((dayNumber - offsetToMonday) / 7)
}

// n'te ugedag i en måned (ordinal -1 = sidste).
function nthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number): number {
  if (ordinal > 0) {
    const firstDow = weekdayOf(year, month, 1)
    const offset = (weekday - firstDow + 7) % 7
    return 1 + offset + (ordinal - 1) * 7
  }
  // ordinal < 0: tæl fra månedens sidste dag
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const lastDow = weekdayOf(year, month, lastDay)
  const offset = (lastDow - weekday + 7) % 7
  return lastDay - offset - (-ordinal - 1) * 7
}

// --- Ekspandér occurrences ----------------------------------------------------

function expandEvent(event: RawEvent, now: Date, windowEnd: Date): CalendarEvent[] {
  const start = parseIcsDate(event.dtstart.value, event.dtstart.params)
  const end = event.dtend ? parseIcsDate(event.dtend.value, event.dtend.params) : null
  const durationMs = end ? end.instant.getTime() - start.instant.getTime() : null
  const allDay = start.wall.allDay
  const title = event.summary || 'Aktivitet'

  const makeOccurrence = (instant: Date): CalendarEvent => ({
    start: instant,
    end: durationMs != null ? new Date(instant.getTime() + durationMs) : null,
    allDay,
    title,
  })

  // Et event "vises" hvis det ikke er afsluttet endnu og starter før vinduets slut.
  const isUpcoming = (occ: CalendarEvent) =>
    (occ.end ?? occ.start).getTime() >= now.getTime() && occ.start.getTime() <= windowEnd.getTime()

  if (!event.rrule) {
    const occ = makeOccurrence(start.instant)
    return isUpcoming(occ) ? [occ] : []
  }

  const rule = event.rrule
  const freq = rule.FREQ
  const interval = Math.max(1, Number(rule.INTERVAL || 1))
  const count = rule.COUNT ? Number(rule.COUNT) : Infinity
  const until = rule.UNTIL ? parseIcsDate(rule.UNTIL, {}).instant : null
  const { h, mi, s } = start.wall

  const results: CalendarEvent[] = []
  let produced = 0

  const tryAdd = (y: number, mo: number, d: number): 'stop' | 'continue' => {
    const instant = allDay
      ? wallClockToInstant(y, mo, d, 0, 0, 0, TIME_ZONE)
      : wallClockToInstant(y, mo, d, h, mi, s, TIME_ZONE)
    if (instant.getTime() < start.instant.getTime()) return 'continue' // før DTSTART
    produced += 1
    if (produced > count) return 'stop'
    if (until && instant.getTime() > until.getTime()) return 'stop'
    if (instant.getTime() > windowEnd.getTime()) return 'stop'
    const occ = makeOccurrence(instant)
    if (isUpcoming(occ)) results.push(occ)
    return 'continue'
  }

  if (freq === 'WEEKLY') {
    const bydays = rule.BYDAY
      ? rule.BYDAY.split(',').map((d) => WEEKDAYS.indexOf(d.replace(/[^A-Z]/g, '')))
      : [weekdayOf(start.wall.y, start.wall.mo, start.wall.d)]
    const baseWeek = mondayIndex(start.wall.y, start.wall.mo, start.wall.d)

    // Itererer dag-for-dag fra DTSTART; billigt over et 1-årigt vindue.
    let cursor = Date.UTC(start.wall.y, start.wall.mo - 1, start.wall.d)
    const hardStop = windowEnd.getTime() + DAY_MS
    while (cursor <= hardStop) {
      const cd = new Date(cursor)
      const y = cd.getUTCFullYear()
      const mo = cd.getUTCMonth() + 1
      const d = cd.getUTCDate()
      const dow = weekdayOf(y, mo, d)
      if (bydays.includes(dow)) {
        const wk = mondayIndex(y, mo, d)
        if ((wk - baseWeek) % interval === 0) {
          if (tryAdd(y, mo, d) === 'stop') break
        }
      }
      cursor += DAY_MS
    }
  } else if (freq === 'YEARLY' && rule.BYMONTH && rule.BYDAY && /^-?\d/.test(rule.BYDAY)) {
    // Positionel årlig regel, fx BYMONTH=10;BYDAY=-1SU (sidste søndag i oktober).
    const month = Number(rule.BYMONTH)
    const ordMatch = rule.BYDAY.match(/^(-?\d+)([A-Z]{2})$/)
    if (ordMatch) {
      const ordinal = Number(ordMatch[1])
      const weekday = WEEKDAYS.indexOf(ordMatch[2])
      for (let year = start.wall.y; ; year += interval) {
        const day = nthWeekdayOfMonth(year, month, weekday, ordinal)
        const verdict = tryAdd(year, month, day)
        if (verdict === 'stop') break
        // Stop hvis vi er forbi vinduet (tryAdd returnerer 'continue' for før-DTSTART).
        const instant = wallClockToInstant(year, month, day, h, mi, s, TIME_ZONE)
        if (instant.getTime() > windowEnd.getTime()) break
        if (year - start.wall.y > 5) break // sikkerhedsstop
      }
    }
  } else {
    // Uunderstøttet frekvens — vis i det mindste basis-forekomsten.
    const occ = makeOccurrence(start.instant)
    if (isUpcoming(occ)) results.push(occ)
  }

  return results
}

// --- Offentligt API -----------------------------------------------------------

// Private banelejer ("Privat", "Privat (med skydning)") deler kalender med
// klub-aktiviteterne, men hører ikke hjemme på den offentlige aktivitetsliste.
export function isPublicEvent(title: string): boolean {
  return !/\bprivat/i.test(title)
}

// Ren funktion (testbar): udtræk de næste `limit` events fra rå ICS-tekst.
export function getUpcomingEvents(ics: string, now: Date, limit = 6, windowDays = 365): CalendarEvent[] {
  const windowEnd = new Date(now.getTime() + windowDays * DAY_MS)
  const events = parseEvents(ics)
  const occurrences: CalendarEvent[] = []
  for (const event of events) {
    if (!isPublicEvent(event.summary)) continue
    occurrences.push(...expandEvent(event, now, windowEnd))
  }
  occurrences.sort((a, b) => a.start.getTime() - b.start.getTime())
  return occurrences.slice(0, limit)
}

// Henter feedet og returnerer de kommende events. Fejler aldrig hårdt —
// ved netværks-/parse-fejl returneres en tom liste, så siden stadig renderer.
export async function fetchUpcomingEvents(limit = 6): Promise<CalendarEvent[]> {
  try {
    const res = await fetch(ICS_URL, { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error('[calendar-events] ICS-feed svarede med status', res.status)
      return []
    }
    const ics = await res.text()
    return getUpcomingEvents(ics, new Date(), limit)
  } catch (error) {
    console.error('[calendar-events] Kunne ikke hente kalender-feed', error)
    return []
  }
}
