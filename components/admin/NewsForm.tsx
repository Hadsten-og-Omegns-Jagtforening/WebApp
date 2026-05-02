'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TiptapLink from '@tiptap/extension-link'
import DateTimePicker from './DateTimePicker'
import ImageUploader from './ImageUploader'
import ResultsBuilder from './ResultsBuilder'
import type { NewsPost, ResultRow } from '@/lib/database.types'

type Props = {
  post?: NewsPost
  categories: string[]
  defaultCategory?: string
  onCreateCategory: (name: string) => Promise<{ category?: string; error?: string }>
  onSaveDraft: (formData: FormData) => Promise<{ error?: string } | void>
  onPublish: (formData: FormData) => Promise<{ error?: string } | void>
  onDelete?: () => Promise<void>
}

export default function NewsForm({
  post,
  categories,
  defaultCategory,
  onCreateCategory,
  onSaveDraft,
  onPublish,
  onDelete,
}: Props) {
  const baseCategories = categories.length ? categories : ['Nyhed']
  const initialCategory = post?.category ?? defaultCategory ?? baseCategories[0] ?? 'Nyhed'
  const initialOptions = baseCategories.some(category => category.toLowerCase() === initialCategory.toLowerCase())
    ? baseCategories
    : [...baseCategories, initialCategory]
  const [categoryOptions, setCategoryOptions] = useState<string[]>(initialOptions)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [newCategory, setNewCategory] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(post?.image_url ?? null)
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

  function buildFormData(title: string, teaser: string, publishedAt: string) {
    const fd = new FormData()
    fd.append('title', title)
    fd.append('teaser', teaser)
    fd.append('category', selectedCategory)
    fd.append('published_at', publishedAt)
    fd.append('body', editor?.getHTML() ?? '')
    fd.append('image_url', imageUrl ?? '')
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
      publishedAt: data.get('published_at') as string,
    }
  }

  function handleSaveDraft(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const { title, teaser, publishedAt } = getFormValues(e.currentTarget)
    const fd = buildFormData(title, teaser, publishedAt)
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
    e.preventDefault()
    setError(null)
    const form = e.currentTarget.closest('form') as HTMLFormElement | null
    if (!form) return
    const { title, teaser, publishedAt } = getFormValues(form)
    const fd = buildFormData(title, teaser, publishedAt)
    startTransition(async () => {
      const result = await onPublish(fd)
      if (result?.error) setError(result.error)
    })
  }

  function handleCreateCategory() {
    const name = newCategory.trim()
    setCategoryError(null)
    if (!name) {
      setCategoryError('Skriv et kategorinavn.')
      return
    }
    startTransition(async () => {
      const result = await onCreateCategory(name)
      if (result.error || !result.category) {
        setCategoryError(result.error ?? 'Kategorien kunne ikke oprettes.')
        return
      }
      setCategoryOptions(current => (
        current.some(category => category.toLowerCase() === result.category!.toLowerCase())
          ? current
          : [...current, result.category!]
      ))
      setSelectedCategory(result.category)
      setNewCategory('')
    })
  }

  return (
    <form onSubmit={handleSaveDraft}>
      <div className="news-form-grid">
        <div className="news-form-left">
          <div className="fld">
            <label htmlFor="title">Overskrift</label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={post?.title}
              required
              placeholder="Overskrift på nyheden"
            />
          </div>
          <div className="fld">
            <label htmlFor="teaser">
              Uddrag
              <span className="label-note">max 180 tegn</span>
            </label>
            <textarea
              id="teaser"
              name="teaser"
              rows={3}
              maxLength={180}
              defaultValue={post?.teaser}
              placeholder="Vises på nyhedskortet og forsiden"
            />
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
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>List</button>
                <button type="button" onClick={() => { const url = prompt('URL:'); if (url) editor?.chain().focus().setLink({ href: url }).run() }}>Link</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'active' : ''}>&quot;</button>
                <span className="ed-sep" />
                <button type="button" onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className="form-two-col">
            <div className="fld">
              <label htmlFor="category">Kategori</label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={event => setSelectedCategory(event.target.value)}
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="category-create">
                <input
                  type="text"
                  value={newCategory}
                  onChange={event => setNewCategory(event.target.value)}
                  placeholder="Ny kategori"
                  aria-label="Ny kategori"
                />
                <button type="button" className="btn ghost" onClick={handleCreateCategory} disabled={isPending}>
                  Tilføj
                </button>
              </div>
              {categoryError && <p className="field-error">{categoryError}</p>}
            </div>
            <div className="fld">
              <label>Publiceringsdato</label>
              <DateTimePicker name="published_at" initialValue={post?.published_at} />
            </div>
          </div>
        </div>

        <div className="news-form-right">
          <div className="panel">
            <h3 className="panel-heading">Hovedbillede</h3>
            <ImageUploader initialUrl={imageUrl} onUpload={setImageUrl} />
          </div>
          <div className="panel">
            <h3 className="panel-heading">Indstillinger</h3>
            <div className="panel-row">
              <label>Resultater / scoretabel</label>
              <label className="toggle">
                <input type="checkbox" checked={hasResults} onChange={event => setHasResults(event.target.checked)} />
                <span />
              </label>
            </div>
            <div className="panel-row">
              <label>Fremhæv på forsiden</label>
              <label className="toggle">
                <input type="checkbox" checked={highlighted} onChange={event => setHighlighted(event.target.checked)} />
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
            <><span className="dot live" />Kladde gemt - {savedAt}</>
          ) : (
            <span className="muted">Ikke gemt endnu</span>
          )}
        </div>
        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <Link href="/admin/nyheder" className="btn ghost">Annuller</Link>
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
