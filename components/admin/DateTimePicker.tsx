'use client'

import { useMemo, useState } from 'react'

type Props = {
  name: string
  initialValue?: string | null
}

const weekdays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toLocalParts(value?: string | null) {
  const date = value ? new Date(value) : new Date()
  const safe = Number.isNaN(date.getTime()) ? new Date() : date
  return {
    date: `${safe.getFullYear()}-${pad(safe.getMonth() + 1)}-${pad(safe.getDate())}`,
    time: `${pad(safe.getHours())}:${pad(safe.getMinutes())}`,
  }
}

function toIso(dateValue: string, timeValue: string) {
  const date = new Date(`${dateValue}T${timeValue || '00:00'}`)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })
}

export default function DateTimePicker({ name, initialValue }: Props) {
  const initial = toLocalParts(initialValue)
  const [selectedDate, setSelectedDate] = useState(initial.date)
  const [selectedTime, setSelectedTime] = useState(initial.time)
  const [month, setMonth] = useState(() => {
    const [year, monthIndex] = initial.date.split('-').map(Number)
    return new Date(year, monthIndex - 1, 1)
  })

  const days = useMemo(() => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const first = new Date(year, monthIndex, 1)
    const offset = (first.getDay() + 6) % 7
    const total = new Date(year, monthIndex + 1, 0).getDate()
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, index) => {
        const day = index + 1
        return `${year}-${pad(monthIndex + 1)}-${pad(day)}`
      }),
    ]
  }, [month])

  return (
    <div className="date-picker">
      <input type="hidden" name={name} value={toIso(selectedDate, selectedTime)} />
      <div className="date-picker-head">
        <button
          type="button"
          className="date-nav"
          aria-label="Forrige måned"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          &lt;
        </button>
        <div className="date-month">{formatMonth(month)}</div>
        <button
          type="button"
          className="date-nav"
          aria-label="Næste måned"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          &gt;
        </button>
      </div>
      <div className="date-grid date-weekdays">
        {weekdays.map(day => <span key={day}>{day}</span>)}
      </div>
      <div className="date-grid">
        {days.map((day, index) => day ? (
          <button
            type="button"
            key={day}
            className={`date-day${day === selectedDate ? ' selected' : ''}`}
            onClick={() => setSelectedDate(day)}
          >
            {Number(day.slice(-2))}
          </button>
        ) : (
          <span key={`empty-${index}`} />
        ))}
      </div>
      <label className="date-time">
        Tidspunkt
        <input
          type="time"
          value={selectedTime}
          onChange={event => setSelectedTime(event.target.value)}
        />
      </label>
    </div>
  )
}
