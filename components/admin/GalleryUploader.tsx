'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import Icon from '@/components/Icon'
import { GALLERY_MAX } from '@/lib/gallery'

type Props = {
  initialUrls: string[]
  onChange: (urls: string[]) => void
}

// Håndterer en liste af galleri-billeder. Allerede uploadede billeder vises som
// statiske thumbnails (ingen intern state → ingen desync ved sletning), og der
// holdes præcis ÉN levende ImageUploader til at tilføje næste billede. Efter hver
// upload bumpes dens React-key, så den nulstilles til tom.
export default function GalleryUploader({ initialUrls, onChange }: Props) {
  const [urls, setUrls] = useState<string[]>(initialUrls)
  const [addKey, setAddKey] = useState(0)

  function commit(next: string[]) {
    setUrls(next)
    onChange(next)
  }

  function handleAdd(url: string | null) {
    if (!url || urls.length >= GALLERY_MAX) return
    commit([...urls, url])
    setAddKey((key) => key + 1)
  }

  function handleRemove(index: number) {
    commit(urls.filter((_, i) => i !== index))
  }

  return (
    <div className="gallery-uploader">
      {urls.length > 0 && (
        <ul className="gallery-thumbs">
          {urls.map((url, index) => (
            <li key={url} className="gallery-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <button
                type="button"
                className="btn danger icon-only"
                onClick={() => handleRemove(index)}
                aria-label="Fjern billede"
              >
                <Icon name="x" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {urls.length < GALLERY_MAX ? (
        <ImageUploader key={addKey} onUpload={handleAdd} />
      ) : (
        <p className="hint">Maks {GALLERY_MAX} billeder i galleriet.</p>
      )}
    </div>
  )
}
