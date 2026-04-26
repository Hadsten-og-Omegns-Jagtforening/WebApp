import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import Icon from '@/components/Icon'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'AD'

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
          <Link href="/admin/nyheder" className="adm-link">
            <Icon name="pencil" size={16} /> Nyheder
          </Link>
          <span className="adm-link disabled" aria-disabled="true">
            <Icon name="calendar" size={16} /> Kalender
          </span>
          <span className="adm-link disabled" aria-disabled="true">
            <Icon name="trophy" size={16} /> Præmieskydninger
          </span>
        </nav>
        <div className="who">
          <div className="avatar">{initials}</div>
          <div>
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
