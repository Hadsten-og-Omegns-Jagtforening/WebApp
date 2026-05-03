import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ImageUploader from '@/components/admin/ImageUploader'

class SuccessfulFileReader {
  result: string | ArrayBuffer | null = null
  error: DOMException | null = null
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null

  readAsDataURL() {
    this.result = 'data:image/jpeg;base64,ZmFzYW4='
    this.onload?.({} as ProgressEvent<FileReader>)
  }
}

describe('ImageUploader crop preview', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the actual selected image in the news-feed preview while adjusting the crop', async () => {
    vi.stubGlobal('FileReader', SuccessfulFileReader)

    const { container } = render(<ImageUploader onUpload={vi.fn()} />)
    const input = container.querySelector('input[type="file"]')
    expect(input).not.toBeNull()

    const file = new File(['image-bytes'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })

    const dialog = await screen.findByRole('dialog', { name: 'Beskær billede' })
    expect(dialog).toBeVisible()
    expect(screen.getByText('Forhåndsvisning i nyhedsfeed')).toBeVisible()
    expect(container.querySelector('.crop-feed-preview img')).toHaveAttribute('src', 'data:image/jpeg;base64,ZmFzYW4=')

  })

  it('keeps the actual selected image visible when crop controls change', async () => {
    vi.stubGlobal('FileReader', SuccessfulFileReader)

    const { container } = render(<ImageUploader onUpload={vi.fn()} />)
    const input = container.querySelector('input[type="file"]')
    expect(input).not.toBeNull()

    const file = new File(['image-bytes'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })
    await screen.findByRole('dialog', { name: 'Beskær billede' })
    fireEvent.change(screen.getByLabelText('Zoom'), { target: { value: '1.4' } })

    expect(container.querySelector('.crop-frame img')).toHaveAttribute('src', 'data:image/jpeg;base64,ZmFzYW4=')
    expect(container.querySelector('.crop-feed-preview img')).toHaveAttribute('src', 'data:image/jpeg;base64,ZmFzYW4=')
  })
})
