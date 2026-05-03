import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

import { createNewsCategory, listNewsCategories } from '@/lib/actions/categories'

describe('createNewsCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('rejects empty category names', async () => {
    await expect(createNewsCategory('   ')).resolves.toEqual({ error: 'Skriv et kategorinavn.' })
  })

  it('creates a trimmed category', async () => {
    mocks.single.mockResolvedValue({ data: { name: 'Klubtur' }, error: null })

    await expect(createNewsCategory('  Klubtur  ')).resolves.toEqual({ category: 'Klubtur' })
    expect(mocks.insert).toHaveBeenCalledWith({ name: 'Klubtur' })
  })

  it('uses fallback categories without logging an error when the categories table is missing', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const missingTable = {
      code: 'PGRST205',
      message: "Could not find the table 'public.news_categories' in the schema cache",
    }
    mocks.order
      .mockReturnValueOnce({ order: mocks.order })
      .mockResolvedValueOnce({ data: null, error: missingTable })

    await expect(listNewsCategories()).resolves.toContain('Præmieskydning')
    expect(consoleError).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('uses fallback categories when the category query times out', async () => {
    vi.useFakeTimers()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    mocks.order
      .mockReturnValueOnce({ order: mocks.order })
      .mockReturnValueOnce(new Promise(() => undefined))

    const result = listNewsCategories()
    await vi.advanceTimersByTimeAsync(4_000)

    await expect(result).resolves.toContain('Præmieskydning')
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })
})
