'use client'

import { useState } from 'react'
import type { CalendarMode } from '@/lib/calendar-embed'

const VIEWS: { mode: CalendarMode; label: string }[] = [
  { mode: 'AGENDA', label: 'Liste' },
  { mode: 'WEEK', label: 'Uge' },
  { mode: 'MONTH', label: 'Måned' },
]

// Agenda reads like an event feed and needs less height; the grid views need more.
const HEIGHTS: Record<CalendarMode, number> = {
  AGENDA: 520,
  WEEK: 640,
  MONTH: 640,
}

export default function CalendarEmbed({ urls }: { urls: Record<CalendarMode, string> }) {
  // List view is the default everywhere: best "what's coming up" overview.
  const [mode, setMode] = useState<CalendarMode>('AGENDA')

  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'var(--sh-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, margin: 0, lineHeight: 1.1 }}>
            Foreningens kalender
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--fg3)' }}>
            Opdateres automatisk fra foreningens Google Kalender
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '14px 22px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div className="cal-toggle" role="tablist" aria-label="Vælg visning">
          {VIEWS.map((view) => {
            const active = view.mode === mode
            return (
              <button
                key={view.mode}
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? 'active' : undefined}
                onClick={() => setMode(view.mode)}
              >
                {view.label}
              </button>
            )
          })}
        </div>

        <a
          href={urls[mode]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}
        >
          Åbn i Google Kalender ↗
        </a>
      </div>

      <iframe
        key={mode}
        src={urls[mode]}
        title="Hadsten og Omegns Jagtforening kalender"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ display: 'block', width: '100%', height: HEIGHTS[mode], border: 0, background: '#fff' }}
      />

      <style jsx>{`
        .cal-toggle {
          display: inline-flex;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: var(--r-full);
          padding: 4px;
        }
        .cal-toggle button {
          appearance: none;
          border: 0;
          background: transparent;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 600;
          color: var(--fg2);
          padding: 9px 20px;
          border-radius: var(--r-full);
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .cal-toggle button:hover {
          color: var(--fg1);
        }
        .cal-toggle button.active {
          background: var(--accent);
          color: #fff;
        }
        .cal-toggle button:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
