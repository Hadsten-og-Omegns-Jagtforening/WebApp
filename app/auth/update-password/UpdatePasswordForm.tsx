'use client'

import { useState, useTransition } from 'react'
import { updatePassword } from '@/lib/actions/auth'

type Props = {
  invalid?: boolean
  errorMessage?: string | null
}

export default function UpdatePasswordForm({ invalid = false, errorMessage }: Props) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(errorMessage ?? null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setFormError(result.error)
      }
    })
  }

  if (invalid) {
    return (
      <div style={{ color: 'var(--danger)', background: 'rgba(220,53,69,0.08)', padding: '10px 14px', borderRadius: 6, fontSize: 14 }}>
        {errorMessage ?? 'Linket er ugyldigt eller udloeber. Bed om et nyt nulstillingslink.'}
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {formError && (
        <div style={{ color: 'var(--danger)', background: 'rgba(220,53,69,0.08)', padding: '10px 14px', borderRadius: 6, fontSize: 14 }}>
          {formError}
        </div>
      )}
      <div className="fld">
        <label htmlFor="password">Ny adgangskode</label>
        <input id="password" name="password" type="password" placeholder="Mindst 8 tegn" autoFocus required />
      </div>
      <div className="fld">
        <label htmlFor="confirmPassword">Gentag ny adgangskode</label>
        <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Gentag adgangskoden" required />
      </div>
      <button type="submit" className="btn primary lg block" disabled={isPending}>
        {isPending ? 'Opdaterer…' : 'Opdater adgangskode'}
      </button>
    </form>
  )
}
