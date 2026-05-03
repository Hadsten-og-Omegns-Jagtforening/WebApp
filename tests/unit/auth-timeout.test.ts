import { afterEach, describe, expect, it, vi } from 'vitest'
import { getUserWithTimeout } from '@/lib/supabase/auth-timeout'

describe('getUserWithTimeout', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the Supabase user result when auth responds', async () => {
    const user = { id: 'user-1' }
    const supabase = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user }, error: null })),
      },
    }

    await expect(getUserWithTimeout(supabase as never, 10)).resolves.toEqual({
      data: { user },
      error: null,
    })
  })

  it('fails closed when Supabase auth does not respond in time', async () => {
    vi.useFakeTimers()
    const supabase = {
      auth: {
        getUser: vi.fn(() => new Promise(() => undefined)),
      },
    }

    const result = getUserWithTimeout(supabase as never, 10)
    await vi.advanceTimersByTimeAsync(10)

    await expect(result).resolves.toMatchObject({
      data: { user: null },
      error: expect.any(Error),
    })
  })
})
