'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Icon from '@/components/Icon'
import type { GalleryImage } from '@/lib/database.types'

type Props = {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const MAX_BYTES = 5 * 1024 * 1024

export default function GalleryUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    onChange([...images, { url: data.publicUrl, alt: '' }])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleRemove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ''}
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(21,30,24,0.8)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label="Fjern billede"
              >
                <Icon name="x" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn secondary"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{ alignSelf: 'flex-start' }}
      >
        <Icon name="plus" size={16} />
        {uploading ? 'Uploader…' : 'Tilføj billede'}
      </button>

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

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>{error}</p>
      )}

      <p style={{ fontSize: 12, color: 'var(--fg3)', margin: 0 }}>
        JPG / PNG · maks 5 MB · Vises som galleri under artiklen
      </p>
    </div>
  )
}
