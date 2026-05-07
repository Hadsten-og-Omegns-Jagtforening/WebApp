'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TiptapLink from '@tiptap/extension-link'
import ImageUploader from './ImageUploader'
import GalleryUploader from './GalleryUploader'
import ResultsBuilder from './ResultsBuilder'
import type { NewsPost, NewsCategory, ResultRow, GalleryImage } from '@/lib/database.types'

const CATEGORIES: NewsCategory[] = [
  'Nyhed', 'Jagt', 'Præmieskydning', 'Klubaften', 'Praktisk info',
]

type Props = {
  post?: NewsPost
  onSaveDraft: (formData: FormData) => Promise<{ error?: string } | void>
  onPublish: (formData: FormData) => Promise<{ error?: string } | void>
  onDelete?: () => Promise<void>
}

export default function NewsForm({ post, onSaveDraft, onPublish, onDelete }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(post?.image_url ?? null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(post?.gallery_images ?? [])
  const [hasResults, setHasResults] = useState(post?.has_results ?? false)
  const [results, setResults] = useState<ResultRow[]>(post?.results ?? [])
  const [highlighted, setHighlighted] = useState(post?.highlighted ?? false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: post?.body ?? '',
  })

  function buildFormData(title: string, teaser: string, category: string, publishedAt: string) {
    const fd = new FormData()
    fd.append('title', title)
    fd.append('teaser', teaser)
    fd.append('category', category)
    fd.append('published_at', publishedAt)
    fd.append('body', editor?.getHTML() ?? '')
    fd.append('image_url', imageUrl ?? '')
    fd.append('gallery_images', JSON.stringify(galleryImages))
    fd.append('has_results', String(hasResults))
    fd.append('results', JSON.stringify(results))
    fd.append('highlighted', String(highlighted))
    return fd
  }

  function getFormValues(form: HTMLFormElement) {
    const data = new FormData(form)
    return {
      title: data.get('title') as string,
      teaser: data.get('teaser') as string,
      category: data.get('category') as string,
      publishedAt: data.get('published_at') as string,
    }
  }

  function handleSaveDraft(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { title, teaser, category, publishedAt } = getFormValues(e.currentTarget)
    const fd = buildFormData(title, teaser, category, publishedAt)
    startTransition(async () => {
      const result = await onSaveDraft(fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setSavedAt(new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }))
      }
    })
  }

  function handlePublish(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest('form') as HTMLFormElement
    const { title, teaser, category, publishedAt } = getFormValues(form)
    const fd = buildFormData(title, teaser, category, publishedAt)
    startTransition(async () => {
      const result = await onPublish(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSaveDraft}>
      <div className="news-form-grid">
        <div className="news-form-left">
          <div className="fld">
            <label htmlFor="title">Overskrift</label>
            <input id="title" name="title" type="text" defaultValue={post?.title} required placeholder="Overskrift på nyheden" />
          </div>
          <div className="fld">
            <label htmlFor="teaser">
              Uddrag
              <span style={{ fontWeight: 400, float: 'right', color: 'var(--fg3)', fontSize: 12 }}>max 180 tegn</span>
            </label>
            <textarea id="teaser" name="teaser" rows={2} maxLength={180} defaultValue={post?.teaser} placeholder="Vises på nyhedskortet og forsiden…" />
          </div>
          <div className="fld">
            <label>Indhold</label>
            <div className="editor">
              <div className="ed-tools">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>B</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>I</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'active' : ''}>U</button>
                <span className="ed-sep" />
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
                <span className="ed-sep" />
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>☰</button>
                <button type="button" onClick={() => { const url = prompt('URL:'); if (url) editor?.chain().focus().setLink({ href: url }).run() }}>🔗</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'active' : ''}>&quot;</button>
                <span className="ed-sep" />
                <button type="button" onClick={() => editor?.chain().focus().undo().run()}>↩</button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="fld">
              <label htmlFor="category">Kategori</label>
              <select id="category" name="category" defaultValue={post?.category ?? 'Nyhed'}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="published_at">Publiceringsdato</label>
              <input id="published_at" name="published_at" type="date" defaultValue={post?.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
        </div>

        <div className="news-form-right">
          <div className="panel">
            <h3 className="panel-heading">Hovedbillede</h3>
            <ImageUploader initialUrl={imageUrl} onUpload={setImageUrl} />
          </div>
          <div className="panel">
            <h3 className="panel-heading">Galleri</h3>
            <GalleryUploader images={galleryImages} onChange={setGalleryImages} />
          </div>
          <div className="panel">
            <h3 className="panel-heading">Indstillinger</h3>
            <div className="panel-row">
              <label>Resultater / scoretabel</label>
              <label className="toggle">
                <input type="checkbox" checked={hasResults} onChange={e => setHasResults(e.target.checked)} />
                <span />
              </label>
            </div>
            <div className="panel-row">
              <label>Fremhæv på forsiden</label>
              <label className="toggle">
                <input type="checkbox" checked={highlighted} onChange={e => setHighlighted(e.target.checked)} />
                <span />
              </label>
            </div>
          </div>
          {hasResults && (
            <div className="panel">
              <h3 className="panel-heading">Resultater</h3>
              <ResultsBuilder initialResults={results} onChange={setResults} />
            </div>
          )}
        </div>
      </div>

      <div className="form-footer">
        <div className="save-indicator">
          {savedAt ? (
            <><span className="dot live" />Kladde gemt · {savedAt}</>
          ) : (
            <span style={{ color: 'var(--fg3)' }}>Ikke gemt endnu</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {error && <span style={{ color: 'var(--danger)', alignSelf: 'center', fontSize: 13 }}>{error}</span>}
          <Link href="/admin/nyheder" className="btn ghost">Annullér</Link>
          <button type="submit" className="btn secondary" disabled={isPending}>Gem som kladde</button>
          {onDelete && (
            <button type="button" className="btn danger" onClick={async () => {
              if (confirm('Slet denne nyhed permanent?')) await onDelete()
            }}>Slet</button>
          )}
          <button type="button" className="btn primary" onClick={handlePublish} disabled={isPending}>Udgiv</button>
        </div>
      </div>
    </form>
  )
}
