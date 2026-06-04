import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const revalidatePath = vi.fn()
  const redirect = vi.fn()
  const getUser = vi.fn()
  const eq = vi.fn()
  const update = vi.fn(() => ({ eq }))
  const from = vi.fn(() => ({ update }))
  const createAdminClient = vi.fn(() => ({ from }))
  const createClient = vi.fn(async () => ({
    auth: {
      getUser,
    },
  }))

  return {
    revalidatePath,
    redirect,
    getUser,
    eq,
    update,
    from,
    createAdminClient,
    createClient,
  }
})

vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: mocks.createAdminClient }))
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))

import { publishPost, updatePost } from '@/lib/actions/news'

function buildFormData() {
  const formData = new FormData()
  formData.set('title', 'Test title')
  formData.set('category', 'forening')
  formData.set('teaser', 'Kort teaser')
  formData.set('body', '<p>Indhold</p>')
  formData.set('highlighted', 'false')
  formData.set('has_results', 'false')
  formData.set('gallery_urls', JSON.stringify(['https://a.dk/1.jpg', '', 'https://a.dk/2.jpg']))
  return formData
}

describe('news actions cache invalidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })
    mocks.eq.mockResolvedValue({ error: null })
  })

  it('revalidates the article slug path when updating a post', async () => {
    const formData = buildFormData()

    await (updatePost as unknown as (id: string, formData: FormData, slug: string) => Promise<unknown>)(
      'post-1',
      formData,
      'my-post',
    )

    expect(mocks.revalidatePath).toHaveBeenCalledWith('/nyheder/my-post')
  })

  it('persists a normalized gallery when updating a post', async () => {
    const formData = buildFormData()

    await (updatePost as unknown as (id: string, formData: FormData, slug: string) => Promise<unknown>)(
      'post-1',
      formData,
      'my-post',
    )

    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ gallery_urls: ['https://a.dk/1.jpg', 'https://a.dk/2.jpg'] }),
    )
  })

  it('revalidates the article slug path when publishing a post', async () => {
    await (publishPost as unknown as (id: string, publishedAt: string | null, slug: string) => Promise<unknown>)(
      'post-1',
      null,
      'my-post',
    )

    expect(mocks.revalidatePath).toHaveBeenCalledWith('/nyheder/my-post')
  })
})
