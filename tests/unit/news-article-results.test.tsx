import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const single = vi.fn()
  const eq = vi.fn(() => ({ eq, single }))
  const from = vi.fn(() => ({ select: vi.fn(() => ({ eq })) }))
  const createClient = vi.fn(async () => ({ from }))
  const notFound = vi.fn()

  return {
    single,
    eq,
    from,
    createClient,
    notFound,
  }
})

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }))

import NewsArticlePage from '@/app/(public)/nyheder/[slug]/page'

describe('NewsArticlePage results rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.single.mockResolvedValue({
      data: {
        id: 'post-1',
        slug: 'cup-resultat',
        title: 'Cup resultat',
        category: 'Præmieskydning',
        teaser: 'Kort teaser',
        body: '<p>Indhold</p>',
        image_url: null,
        has_results: true,
        results: [
          { rank: '1', name: 'Jens', score: '23' },
          { rank: '2', name: 'Poul', score: '22' },
        ],
        status: 'published',
        highlighted: false,
        allow_comments: false,
        published_at: '2026-01-01T10:00:00.000Z',
        created_by: 'user-1',
        created_at: '2026-01-01T10:00:00.000Z',
        updated_at: '2026-01-01T10:00:00.000Z',
      },
    })
  })

  it('renders the results table when a published article has results enabled', async () => {
    render(await NewsArticlePage({ params: Promise.resolve({ slug: 'cup-resultat' }) }))

    expect(screen.getByText('Resultater')).toBeInTheDocument()
    expect(screen.getByText('Jens')).toBeInTheDocument()
    expect(screen.getByText('Poul')).toBeInTheDocument()
  })
})
