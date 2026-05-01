import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const redirect = vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`)
  })
  const signInWithPassword = vi.fn()
  const signOut = vi.fn()
  const resetPasswordForEmail = vi.fn()
  const updateUser = vi.fn()
  const getUser = vi.fn()
  const createClient = vi.fn(() => ({
    auth: {
      signInWithPassword,
      signOut,
      resetPasswordForEmail,
      updateUser,
      getUser,
    },
  }))
  const getRequestSiteUrl = vi.fn()

  return {
    redirect,
    signInWithPassword,
    signOut,
    resetPasswordForEmail,
    updateUser,
    getUser,
    createClient,
    getRequestSiteUrl,
  }
})

vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))
vi.mock('@/lib/site-url', () => ({ getRequestSiteUrl: mocks.getRequestSiteUrl }))

import { requestPasswordReset, signIn, signOut, updatePassword } from '@/lib/actions/auth'

describe('auth actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.signInWithPassword.mockResolvedValue({ error: null })
    mocks.signOut.mockResolvedValue({ error: null })
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null })
    mocks.updateUser.mockResolvedValue({ error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mocks.getRequestSiteUrl.mockResolvedValue('http://localhost:3000')
  })

  it('uses the callback route for password reset emails', async () => {
    const formData = new FormData()
    formData.set('email', 'admin@example.com')

    const result = await requestPasswordReset(formData)

    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith('admin@example.com', {
      redirectTo: 'http://localhost:3000/auth/callback?next=/auth/update-password',
    })
    expect(result).toEqual({
      success: 'Hvis e-mailadressen findes som admin-bruger, er der sendt et nulstillingslink.',
    })
  })

  it('rejects password update when the passwords do not match', async () => {
    const formData = new FormData()
    formData.set('password', 'new-password')
    formData.set('confirmPassword', 'other-password')

    const result = await updatePassword(formData)

    expect(result).toEqual({ error: 'Adgangskoderne matcher ikke.' })
    expect(mocks.updateUser).not.toHaveBeenCalled()
  })

  it('updates the password for a recovery-session user and redirects to admin', async () => {
    const formData = new FormData()
    formData.set('password', 'new-password')
    formData.set('confirmPassword', 'new-password')

    await expect(updatePassword(formData)).rejects.toThrow('REDIRECT:/admin')

    expect(mocks.getUser).toHaveBeenCalled()
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: 'new-password' })
  })

  it('signs in with email and password', async () => {
    const formData = new FormData()
    formData.set('email', 'admin@example.com')
    formData.set('password', 'secret-password')

    await expect(signIn(formData)).rejects.toThrow('REDIRECT:/admin/nyheder')

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'secret-password',
    })
  })

  it('signs out and redirects to admin', async () => {
    await expect(signOut()).rejects.toThrow('REDIRECT:/admin')
    expect(mocks.signOut).toHaveBeenCalled()
  })
})
