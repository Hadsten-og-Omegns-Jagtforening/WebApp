'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Icon from '@/components/Icon'

type Props = {
  initialUrl?: string | null
  onUpload: (url: string | null) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const MAX_BYTES = 5 * 1024 * 1024

export default function ImageUploader({ initialUrl, onUpload }: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Kun JPG og PNG er tilladt.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Filen må maksimalt være 5 MB.')
      return
    }
    setUploading(true)
    const ext = file.type === 'image/png' ? 'png' : 'jpg'
    const filename = `${crypto.randomUUID()}.${ext}`
    const supabase = createClient()
    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filename, file, { contentType: file.type })
    if (uploadError) {
      setError('Upload fejlede. Prøv igen.')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('news-images').getPublicUrl(filename)
    setUrl(data.publicUrl)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  function handleRemove() {
    setUrl(null)
    onUpload(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={`uploader${url ? ' has' : ''}`}>
      {url ? (
        <div className="uploader-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" style={{ aspectRatio: '4/3', objectFit: 'cover', width: '100%' }} />
          <div className="uploader-actions">
            <button type="button" className="btn ghost" onClick={() => inputRef.current?.click()}>
              Erstat
            </button>
            <button type="button" className="btn danger" onClick={handleRemove}>
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="uploader-empty"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Icon name="image" size={24} />
          <span>{uploading ? 'Uploader…' : 'Klik for at uploade billede'}</span>
          <span className="hint">JPG / PNG · maks 5 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      {error && <p className="field-error" style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
    </div>
  )
}
