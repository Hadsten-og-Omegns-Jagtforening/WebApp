import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import Icon from '@/components/Icon'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page: no sidebar
  if (!user) {
    return <>{children}</>
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'AD'

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="brand">
          <Image src="/assets/logo-hoj.png" alt="HOJ" width={38} height={38} />
          <div>
            <div className="mark">HOJ Admin</div>
            <div className="sub">Hadsten Jagtforening</div>
          </div>
        </div>
        <nav>
          <div className="section-label">Indhold</div>
          <Link href="/admin" className="adm-link">
            <Icon name="eye" size={16} /> Dashboard
          </Link>
          <Link href="/admin/nyheder" className="adm-link">
            <Icon name="pencil" size={16} /> Nyheder
          </Link>
          <Link href="/admin/kalender" className="adm-link">
            <Icon name="calendar" size={16} /> Kalender
          </Link>
          <Link href="/admin/premieskydninger" className="adm-link">
            <Icon name="trophy" size={16} /> Præmieskydninger
          </Link>
          <Link href="/" className="adm-link">
            <Icon name="arrow-right" size={16} /> Se hjemmeside
          </Link>
        </nav>
        <div className="who">
          <div className="avatar">{initials}</div>
          <div className="who-meta">
            <div className="name">{user?.email ?? 'Admin'}</div>
            <div className="role">Administrator</div>
          </div>
          <form action={signOut}>
            <button type="submit" title="Log ud" className="btn ghost icon-only">
              <Icon name="log-out" size={16} />
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  )
}
