'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Icon, { type IconName } from '@/components/Icon'
import { PRIZE_ACTIVITY_ICONS } from '@/lib/prize-activity-options'
import type { PrizeActivity } from '@/lib/database.types'

type Props = {
  activity?: PrizeActivity
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>
}

const ICON_LABELS: Record<string, string> = {
  trophy: 'Pokaler',
  claypigeon: 'Lerduer',
  crosshair: 'Sigte',
  calendar: 'Kalender',
  shotshell: 'Patron',
  ticket: 'Billet',
  'tree-pine': 'Jagt',
}

export default function PrizeActivityForm({ activity, onSubmit }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(activity?.icon ?? 'trophy')
  const [isPending, startTransition] = useTransition()
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
    ],
    content: activity?.body ?? '',
    immediatelyRender: false,
  })

  function preventToolbarMouseDown(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    const formData = new FormData(event.currentTarget)
    formData.set('body', editor?.getHTML() ?? '')
    startTransition(async () => {
      const result = await onSubmit(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="prize-form">
      <div className="news-form-grid">
        <div className="news-form-left">
          <div className="fld">
            <label htmlFor="title">Titel</label>
            <input id="title" name="title" defaultValue={activity?.title} required />
          </div>

          <div className="form-two-col">
            <div className="fld">
              <label htmlFor="month_label">Måned eller periode</label>
              <input id="month_label" name="month_label" defaultValue={activity?.month_label} required />
            </div>
            <div className="fld">
              <label htmlFor="sort_order">Sortering</label>
              <input id="sort_order" name="sort_order" type="number" defaultValue={activity?.sort_order ?? 0} />
            </div>
          </div>

          <div className="fld">
            <label htmlFor="card_description">Kort beskrivelse</label>
            <textarea
              id="card_description"
              name="card_description"
              rows={4}
              defaultValue={activity?.card_description}
              required
            />
          </div>

          <div className="fld">
            <label>Detaljeindhold</label>
            <div className="editor">
              <div className="ed-tools">
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>B</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>I</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>List</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'active' : ''}>&quot;</button>
                <button type="button" onMouseDown={preventToolbarMouseDown} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="news-form-right">
          <div className="panel">
            <h3 className="panel-heading">Kortvisning</h3>
            <div className="fld">
              <label htmlFor="icon">Ikon</label>
              <select
                id="icon"
                name="icon"
                value={selectedIcon}
                onChange={event => setSelectedIcon(event.currentTarget.value)}
              >
                {PRIZE_ACTIVITY_ICONS.map(icon => (
                  <option key={icon} value={icon}>{ICON_LABELS[icon]}</option>
                ))}
              </select>
            </div>
            <div className="prize-icon-preview" aria-hidden="true">
              <Icon name={selectedIcon as IconName} />
              <span>Ikonet vises på kortet</span>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-heading">Synlighed</h3>
            <div className="panel-row">
              <label>Vis på hjemmesiden</label>
              <label className="toggle">
                <input
                  type="checkbox"
                  defaultChecked={activity?.is_active ?? true}
                  onChange={event => {
                    event.currentTarget.value = event.currentTarget.checked ? 'true' : 'false'
                  }}
                  name="is_active"
                  value="true"
                />
                <span />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <div className="save-indicator">
          {saved ? <><Icon name="check" size={15} /> Gemt</> : <span className="muted">Ikke gemt endnu</span>}
        </div>
        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <Link href="/admin/premieskydninger" className="btn ghost">Annuller</Link>
          <button type="submit" className="btn primary" disabled={isPending}>
            {isPending ? 'Gemmer...' : 'Gem præmieskydning'}
          </button>
        </div>
      </div>
    </form>
  )
}
