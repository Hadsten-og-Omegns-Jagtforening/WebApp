'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateCropSourceRect } from '@/lib/image-crop'
import {
  getCropFailureMessage,
  ImageCropError,
  IMAGE_UPLOAD_ALLOWED_TYPES,
  IMAGE_UPLOAD_MAX_BYTES,
  validateImageFile,
} from '@/lib/image-upload-validation'
import Icon from '@/components/Icon'

type Props = {
  initialUrl?: string | null
  onUpload: (url: string | null) => void
}

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
  const previewRequestId = useRef(0)

  useEffect(() => () => {
    previewRequestId.current += 1
  }, [])

  function readPreviewDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
          return
        }
        reject(new ImageCropError('image-load'))
      }
      reader.onerror = () => reject(new ImageCropError('image-load'))
      reader.readAsDataURL(file)
    })
  }

  async function openCropper(file: File) {
    setError(null)
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    const requestId = previewRequestId.current + 1
    previewRequestId.current = requestId
    setPreviewUrl(null)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    try {
      const dataUrl = await readPreviewDataUrl(file)
      if (previewRequestId.current !== requestId) return
      setPendingFile(file)
      setPreviewUrl(dataUrl)
    } catch (error) {
      if (previewRequestId.current !== requestId) return
      const reason = error instanceof ImageCropError ? error.reason : 'image-load'
      setPendingFile(null)
      setError(getCropFailureMessage(reason))
    }
  }

  function closeCropper() {
    previewRequestId.current += 1
    setPreviewUrl(null)
    setPendingFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
          reject(new ImageCropError('image-load'))
          return
        }
        resolve(image)
      }
      image.onerror = () => reject(new ImageCropError('image-load'))
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
      setUploading(false)
      throw new ImageCropError('upload')
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
      if (!ctx) throw new ImageCropError('canvas')
      const rect = calculateCropSourceRect({
        imageWidth: image.naturalWidth,
        imageHeight: image.naturalHeight,
        zoom,
        offsetX,
        offsetY,
      })
      ctx.drawImage(image, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.86))
      if (!blob) throw new ImageCropError('canvas')
      await uploadBlob(blob)
    } catch (error) {
      const reason = error instanceof ImageCropError ? error.reason : 'unknown'
      setError(getCropFailureMessage(reason))
      setUploading(false)
    }
  }

  function handleRemove() {
    setUrl(null)
    onUpload(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const cropPreviewStyle = {
    transform: `translate(${offsetX * -60}%, ${offsetY * -60}%) scale(${zoom})`,
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
          <span className="hint">JPG / PNG - maks {IMAGE_UPLOAD_MAX_BYTES / 1024 / 1024} MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_ALLOWED_TYPES.join(',')}
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
            <div className="crop-preview-layout">
              <div className="crop-adjust">
                <div className="label">Beskæring</div>
                <div className="crop-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" style={cropPreviewStyle} />
                </div>
              </div>

              <div className="crop-feed-preview" aria-label="Forhåndsvisning i nyhedsfeed">
                <div className="label">Forhåndsvisning i nyhedsfeed</div>
                <div className="newscard crop-feed-card">
                  <div className="img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="" style={cropPreviewStyle} />
                  </div>
                  <div className="body">
                    <div className="meta">Nyhed · forside</div>
                    <h3>Billedbeskæring</h3>
                    <p className="teaser">Sådan vises billedet i nyhedsfeedet.</p>
                    <span className="cta">Læs mere her →</span>
                  </div>
                </div>
              </div>
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
