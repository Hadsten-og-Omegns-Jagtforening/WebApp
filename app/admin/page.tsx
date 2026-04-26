import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function AdminLoginPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/admin/nyheder')

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
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Log ind</h1>
        <p style={{ fontSize: 14, marginBottom: 22 }}>
          For bestyrelsen og redaktører.
        </p>
        {error && (
          <div style={{ color: 'var(--danger)', background: 'rgba(220,53,69,0.08)', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            Forkert e-mail eller adgangskode.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
