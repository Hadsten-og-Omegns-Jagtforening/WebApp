'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateCropSourceRect } from '@/lib/image-crop'
import Icon from '@/components/Icon'

type Props = {
  initialUrl?: string | null
  onUpload: (url: string | null) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const MAX_BYTES = 5 * 1024 * 1024
const OUTPUT_WIDTH = 1200
const OUTPUT_HEIGHT = 800

export default function ImageUploader({ initialUrl, onUpload }: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function openCropper(file: File) {
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Kun JPG og PNG er tilladt.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Filen må maksimalt være 5 MB.')
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  function closeCropper() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPendingFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Image failed to load'))
      image.src = src
    })
  }

  async function uploadBlob(blob: Blob) {
    setUploading(true)
    const filename = `${crypto.randomUUID()}.jpg`
    const supabase = createClient()
    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filename, blob, { contentType: 'image/jpeg' })
    if (uploadError) {
      setError('Upload fejlede. Prøv igen.')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('news-images').getPublicUrl(filename)
    setUrl(data.publicUrl)
    onUpload(data.publicUrl)
    setUploading(false)
    closeCropper()
  }

  async function cropAndUpload() {
    if (!pendingFile || !previewUrl) return
    setError(null)
    try {
      const image = await loadImage(previewUrl)
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_WIDTH
      canvas.height = OUTPUT_HEIGHT
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas unavailable')
      const rect = calculateCropSourceRect({
        imageWidth: image.naturalWidth,
        imageHeight: image.naturalHeight,
        zoom,
        offsetX,
        offsetY,
      })
      ctx.drawImage(image, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.86))
      if (!blob) throw new Error('Crop failed')
      await uploadBlob(blob)
    } catch {
      setError('Billedet kunne ikke beskæres. Prøv et andet billede.')
      setUploading(false)
    }
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
          <img src={url} alt="" />
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
          <span>{uploading ? 'Uploader...' : 'Klik for at uploade billede'}</span>
          <span className="hint">JPG / PNG - maks 5 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) openCropper(file)
        }}
      />
      {previewUrl && (
        <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Beskær billede">
          <div className="crop-panel">
            <div className="crop-head">
              <h3>Tilpas billede</h3>
              <button type="button" className="btn ghost icon-only" onClick={closeCropper}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="crop-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                style={{
                  transform: `translate(${offsetX * -60}%, ${offsetY * -60}%) scale(${zoom})`,
                }}
              />
            </div>
            <div className="crop-controls">
              <label>
                Zoom
                <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={event => setZoom(Number(event.target.value))} />
              </label>
              <label>
                Vandret
                <input type="range" min="-0.35" max="0.35" step="0.01" value={offsetX} onChange={event => setOffsetX(Number(event.target.value))} />
              </label>
              <label>
                Lodret
                <input type="range" min="-0.35" max="0.35" step="0.01" value={offsetY} onChange={event => setOffsetY(Number(event.target.value))} />
              </label>
            </div>
            <div className="crop-actions">
              <button type="button" className="btn ghost" onClick={closeCropper}>Annuller</button>
              <button type="button" className="btn primary" onClick={cropAndUpload} disabled={uploading}>
                {uploading ? 'Uploader...' : 'Beskær og upload'}
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
