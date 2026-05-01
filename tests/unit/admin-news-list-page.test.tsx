import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const order = vi.fn()
  const select = vi.fn(() => ({ order }))
  const from = vi.fn(() => ({ select }))
  const createAdminClient = vi.fn(() => ({ from }))
  const deletePost = vi.fn()

  return {
    order,
    select,
    from,
    createAdminClient,
    deletePost,
  }
})

vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: mocks.createAdminClient }))
vi.mock('@/lib/actions/news', () => ({ deletePost: mocks.deletePost }))

import AdminNyhederPage from '@/app/admin/nyheder/page'

describe('AdminNyhederPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders an empty state when there are no posts', async () => {
    mocks.order.mockResolvedValue({
      data: [],
      count: 0,
      error: null,
    })

    render(await AdminNyhederPage())

    expect(screen.getByText('Ingen nyheder endnu')).toBeInTheDocument()
  })

  it('renders a controlled error state when the admin client cannot initialize', async () => {
    mocks.createAdminClient.mockImplementationOnce(() => {
      throw new Error('supabaseKey is required.')
    })

    render(await AdminNyhederPage())

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Kunne ikke hente nyheder. Kontroller Supabase serverkonfigurationen i Vercel.'
    )
    expect(screen.getByText('supabaseKey is required.')).toBeInTheDocument()
    expect(screen.getByText('Nyheder kunne ikke indlæses')).toBeInTheDocument()
  })

  it('renders the post title and teaser when posts exist', async () => {
    mocks.order.mockResolvedValue({
      data: [{
        id: 'post-1',
        slug: 'test-post',
        title: 'Testpost',
        category: 'Nyhed',
        teaser: 'Kort teaser',
        body: '<p>Indhold</p>',
        image_url: null,
        has_results: false,
        results: null,
        status: 'draft',
        highlighted: false,
        allow_comments: false,
        published_at: null,
        created_by: 'user-1',
        created_at: '2026-01-01T10:00:00.000Z',
        updated_at: '2026-01-01T10:00:00.000Z',
      }],
      count: 1,
      error: null,
    })

    render(await AdminNyhederPage())

    expect(screen.getByText('Testpost')).toBeInTheDocument()
    expect(screen.getByText('Kort teaser')).toBeInTheDocument()
  })
})
