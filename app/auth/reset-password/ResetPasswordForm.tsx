'use client'

import { useState, useTransition } from 'react'
import { requestPasswordReset } from '@/lib/actions/auth'

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await requestPasswordReset(formData)
      if (result?.error) {
        setError(result.error)
        return
      }

      setMessage(result?.success ?? 'Nulstillingsmail sendt.')
      e.currentTarget.reset()
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
      {error && (
        <div style={{ color: 'var(--danger)', background: 'rgba(220,53,69,0.08)', padding: '10px 14px', borderRadius: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ color: 'var(--fg1)', background: 'rgba(94,115,71,0.12)', padding: '10px 14px', borderRadius: 6, fontSize: 14 }}>
          {message}
        </div>
      )}
      <button type="submit" className="btn primary lg block" disabled={isPending}>
        {isPending ? 'Sender link…' : 'Send nulstillingslink'}
      </button>
    </form>
  )
}
