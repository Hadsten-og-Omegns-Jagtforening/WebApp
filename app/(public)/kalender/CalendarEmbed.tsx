'use client'

import { useState } from 'react'
import type { CalendarMode } from '@/lib/calendar-embed'

const VIEWS: { mode: CalendarMode; label: string }[] = [
  { mode: 'AGENDA', label: 'Liste' },
  { mode: 'WEEK', label: 'Uge' },
  { mode: 'MONTH', label: 'Måned' },
]

// Renders the view toggle + the embedded Google Calendar. Sits inside the
// existing kalender card (which already provides the header + badge). Sizing is
// owned by the .kalender-embed CSS, so the toggle only swaps the view mode.
export default function CalendarEmbed({ urls }: { urls: Record<CalendarMode, string> }) {
  // List view is the default everywhere: best "what's coming up" overview.
  const [mode, setMode] = useState<CalendarMode>('AGENDA')

  return (
    <>
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

      <div style={{ padding: 16 }}>
        <div className="kalender-embed" style={{ position: 'relative', width: '100%' }}>
          <iframe
            key={mode}
            src={urls[mode]}
            title="Hadsten og Omegns Jagtforening kalender"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: 6,
              background: 'var(--surface)',
            }}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

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
    </>
  )
}
