'use client'

import { useEffect, useState } from 'react'

/**
 * Live "banen åben/lukket" status, derived from the same opening schedule
 * shown on /praktisk-info/aabningstider-og-skydetider:
 *   Feb–marts & september : lørdage 13.00–16.00
 *   April–august          : onsdage 18.30–21.30
 *   Januar, oktober–december: ingen skydninger (lukket)
 * Evaluated in Europe/Copenhagen time so it is correct regardless of host/visitor TZ.
 */

type Rule = { weekday: number; startMin: number; endMin: number; start: string; end: string; dayName: string }

const SAT: Rule = { weekday: 6, startMin: 13 * 60, endMin: 16 * 60, start: '13.00', end: '16.00', dayName: 'lørdag' }
const WED: Rule = { weekday: 3, startMin: 18 * 60 + 30, endMin: 21 * 60 + 30, start: '18.30', end: '21.30', dayName: 'onsdag' }

// month 1–12 → rule (or null when the banen is closed that part of the year)
const SCHEDULE: Record<number, Rule | null> = {
  1: null,
  2: SAT, 3: SAT,
  4: WED, 5: WED, 6: WED, 7: WED, 8: WED,
  9: SAT,
  10: null, 11: null, 12: null,
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

function computeStatus(): { open: boolean; label: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Copenhagen',
    hour12: false,
    weekday: 'short',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date())

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const month = Number(get('month'))
  const weekday = WEEKDAY_INDEX[get('weekday')] ?? -1
  let hour = Number(get('hour'))
  if (hour === 24) hour = 0 // some environments emit "24" for midnight
  const minutesNow = hour * 60 + Number(get('minute'))

  const rule = SCHEDULE[month]
  if (!rule) return { open: false, label: 'Banen lukket' }

  if (weekday === rule.weekday && minutesNow >= rule.startMin && minutesNow < rule.endMin) {
    return { open: true, label: `Banen åben nu · lukker kl. ${rule.end}` }
  }
  return {
    open: false,
    label: `Banen lukket nu · åbner ${rule.dayName} kl. ${rule.start} - ${rule.end}`,
  }
}

export default function HeroStatus() {
  const [status, setStatus] = useState(computeStatus)

  useEffect(() => {
    const tick = () => setStatus(computeStatus())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hero-status" suppressHydrationWarning>
      <span className={status.open ? 'dot' : 'dot closed'} />
      {status.label}
    </div>
  )
}
