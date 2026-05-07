import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NewsCard from '@/components/NewsCard'
import type { NewsPost } from '@/lib/database.types'

const mockPost: NewsPost = {
  id: '1',
  slug: 'test-nyhed',
  title: 'Test nyhed',
  category: 'Nyhed',
  teaser: 'Dette er en teaser',
  body: '<p>Indhold</p>',
  image_url: null,
  gallery_images: null,
  has_results: false,
  results: null,
  status: 'published',
  highlighted: false,
  allow_comments: false,
  published_at: '2026-04-24T12:00:00Z',
  created_by: 'user-1',
  created_at: '2026-04-24T12:00:00Z',
  updated_at: '2026-04-24T12:00:00Z',
}

describe('NewsCard', () => {
  it('renders title', () => {
    render(<NewsCard post={mockPost} />)
    expect(screen.getByText('Test nyhed')).toBeInTheDocument()
  })

  it('renders teaser', () => {
    render(<NewsCard post={mockPost} />)
    expect(screen.getByText(/Dette er en teaser/)).toBeInTheDocument()
  })

  it('renders a link to the article', () => {
    render(<NewsCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/nyheder/test-nyhed')
  })
})
