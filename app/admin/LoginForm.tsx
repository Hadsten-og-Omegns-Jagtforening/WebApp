'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { signIn } from '@/lib/actions/auth'

export default function LoginForm() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await signIn(fd)
      if (result?.error) {
        window.location.href = '/admin?error=1'
      }
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="fld">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="dit.navn@hadstenjagtforening.dk"
          autoFocus
          required
        />
      </div>
      <div className="fld">
        <label htmlFor="pw">Adgangskode</label>
        <input
          id="pw"
          name="password"
          type="password"
          placeholder="**********"
          required
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6, marginBottom: 8 }}>
        <Link href="/auth/reset-password" style={{ fontSize: 14 }}>
          Glemt adgangskode?
        </Link>
      </div>
      <button type="submit" className="btn primary lg block" disabled={isPending}>
        {isPending ? 'Logger ind...' : 'Log ind'}
      </button>
    </form>
  )
}
