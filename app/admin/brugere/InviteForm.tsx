'use client'

import { useState, useTransition } from 'react'
import { inviteUser } from '@/lib/actions/auth'

export default function InviteForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await inviteUser(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      setMessage(result?.success ?? 'Invitation sendt.')
      form.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 8, alignItems: 'end' }}>
        <div className="fld">
          <label htmlFor="invite-email">E-mail</label>
          <input
            id="invite-email"
            name="email"
            type="email"
            placeholder="ny.bruger@example.com"
            required
          />
        </div>
        <button type="submit" className="btn primary" disabled={isPending} style={{ whiteSpace: 'nowrap' }}>
          {isPending ? 'Sender…' : 'Send invitation'}
        </button>
      </div>
      {error && <p className="field-error" style={{ marginTop: 8 }}>{error}</p>}
      {message && <p style={{ marginTop: 8, color: 'var(--hoj-moss-600)', fontSize: 14 }}>{message}</p>}
    </form>
  )
}
