import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import UpdatePasswordForm from './UpdatePasswordForm'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function UpdatePasswordPage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { error } = await searchParams

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 26 }}>
          <Image src="/assets/logo-hoj.png" alt="HOJ" width={52} height={52} />
          <div>
            <div className="mark" style={{ fontSize: 15 }}>HOJ Admin</div>
            <div className="sub">HADSTEN JAGTFORENING</div>
          </div>
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Opdater adgangskode</h1>
        <p style={{ fontSize: 14, marginBottom: 22 }}>
          Vælg en ny adgangskode for din admin-bruger.
        </p>
        <UpdatePasswordForm invalid={!user} errorMessage={error ?? null} />
        <p style={{ fontSize: 14, marginTop: 18, marginBottom: 0 }}>
          <Link href="/auth/reset-password">Bed om et nyt nulstillingslink</Link>
        </p>
      </div>
    </div>
  )
}
