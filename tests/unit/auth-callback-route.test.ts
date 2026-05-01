import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const exchangeCodeForSession = vi.fn()
  const createClient = vi.fn(() => ({
    auth: {
      exchangeCodeForSession,
    },
  }))

  return {
    exchangeCodeForSession,
    createClient,
  }
})

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))

import { GET } from '@/app/auth/callback/route'

describe('auth callback route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.exchangeCodeForSession.mockResolvedValue({ error: null })
  })

  it('exchanges the auth code and redirects to the requested internal path', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?code=test-code&next=/auth/update-password'))

    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith('test-code')
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/update-password')
  })

  it('rejects unsafe next paths', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?code=test-code&next=https://evil.example'))

    expect(response.headers.get('location')).toBe('http://localhost:3000/admin')
  })
})
