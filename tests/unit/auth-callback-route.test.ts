import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const exchangeCodeForSession = vi.fn()
  const verifyOtp = vi.fn()
  const createClient = vi.fn(() => ({
    auth: {
      exchangeCodeForSession,
      verifyOtp,
    },
  }))

  return {
    exchangeCodeForSession,
    verifyOtp,
    createClient,
  }
})

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))

import { GET } from '@/app/auth/callback/route'

describe('auth callback route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.exchangeCodeForSession.mockResolvedValue({ error: null })
    mocks.verifyOtp.mockResolvedValue({ error: null })
  })

  it('exchanges the auth code and redirects to the requested internal path', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?code=test-code&next=/auth/update-password'))

    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith('test-code')
    expect(mocks.verifyOtp).not.toHaveBeenCalled()
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/update-password')
  })

  it('verifies an invite OTP token_hash and redirects to the requested path', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?token_hash=hash-123&type=invite&next=/auth/update-password'))

    expect(mocks.verifyOtp).toHaveBeenCalledWith({ type: 'invite', token_hash: 'hash-123' })
    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled()
    expect(response.headers.get('location')).toBe('http://localhost:3000/auth/update-password')
  })

  it('redirects with an error when neither code nor token_hash is present', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?next=/auth/update-password'))

    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled()
    expect(mocks.verifyOtp).not.toHaveBeenCalled()
    expect(response.headers.get('location')).toContain('/auth/update-password?error=')
  })

  it('rejects unsafe next paths', async () => {
    const response = await GET(new Request('http://localhost:3000/auth/callback?code=test-code&next=https://evil.example'))

    expect(response.headers.get('location')).toBe('http://localhost:3000/admin')
  })
})
