import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const select = vi.fn()
  const single = vi.fn()
  const insert = vi.fn(() => ({ select: vi.fn(() => ({ single })) }))
  const order = vi.fn()
  const from = vi.fn(() => ({ insert, select: vi.fn(() => ({ order })) }))
  const createAdminClient = vi.fn(() => ({ from }))
  const getUser = vi.fn()
  const createClient = vi.fn(async () => ({ auth: { getUser } }))
  const redirect = vi.fn()

  return { createAdminClient, createClient, from, insert, select, single, order, getUser, redirect }
})

vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: mocks.createAdminClient }))
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

import { createNewsCategory } from '@/lib/actions/categories'

describe('createNewsCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('rejects empty category names', async () => {
    await expect(createNewsCategory('   ')).resolves.toEqual({ error: 'Skriv et kategorinavn.' })
  })

  it('creates a trimmed category', async () => {
    mocks.single.mockResolvedValue({ data: { name: 'Klubtur' }, error: null })

    await expect(createNewsCategory('  Klubtur  ')).resolves.toEqual({ category: 'Klubtur' })
    expect(mocks.insert).toHaveBeenCalledWith({ name: 'Klubtur' })
  })
})
