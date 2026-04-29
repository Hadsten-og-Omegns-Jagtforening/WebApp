import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const notFound = vi.fn()
  const updatePost = vi.fn()
  const publishPost = vi.fn()
  const saveDraft = vi.fn()
  const deletePost = vi.fn()
  const single = vi.fn()
  const eq = vi.fn(() => ({ single }))
  const select = vi.fn(() => ({ eq }))
  const from = vi.fn(() => ({ select }))
  const createAdminClient = vi.fn(() => ({ from }))
  let latestNewsFormProps: Record<string, unknown> | null = null

  return {
    notFound,
    updatePost,
    publishPost,
    saveDraft,
    deletePost,
    single,
    eq,
    select,
    from,
    createAdminClient,
    getLatestNewsFormProps: () => latestNewsFormProps,
    setLatestNewsFormProps: (value: Record<string, unknown> | null) => {
      latestNewsFormProps = value
    },
  }
})

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: mocks.createAdminClient }))
vi.mock('@/lib/actions/news', () => ({
  updatePost: mocks.updatePost,
  publishPost: mocks.publishPost,
  saveDraft: mocks.saveDraft,
  deletePost: mocks.deletePost,
}))
vi.mock('@/components/admin/NewsForm', () => ({
  default: (props: Record<string, unknown>) => {
    mocks.setLatestNewsFormProps(props)
    return <div data-testid="news-form" />
  },
}))

import EditNyhedPage from '@/app/admin/nyheder/[id]/page'

describe('EditNyhedPage publish flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.setLatestNewsFormProps(null)
    mocks.single.mockResolvedValue({
      data: {
        id: 'post-1',
        slug: 'my-post',
        title: 'Test',
        category: 'forening',
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
      },
      error: null,
    })
    mocks.updatePost.mockResolvedValue({ error: 'Update failed' })
    mocks.publishPost.mockResolvedValue({ success: true })
  })

  it('does not publish when updatePost returns an error', async () => {
    const ui = await EditNyhedPage({ params: Promise.resolve({ id: 'post-1' }) })
    render(ui)

    expect(screen.getByTestId('news-form')).toBeInTheDocument()

    const props = mocks.getLatestNewsFormProps()
    expect(props).not.toBeNull()

    const formData = new FormData()
    formData.set('published_at', '2026-01-02T10:00:00.000Z')

    const result = await (props as { onPublish: (fd: FormData) => Promise<unknown> }).onPublish(formData)

    expect(mocks.updatePost).toHaveBeenCalledWith('post-1', formData, 'my-post')
    expect(mocks.publishPost).not.toHaveBeenCalled()
    expect(result).toEqual({ error: 'Update failed' })
  })
})
