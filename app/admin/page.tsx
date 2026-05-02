import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminPostState } from '@/lib/news-visibility'
import LoginForm from './LoginForm'
import type { NewsPost } from '@/lib/database.types'

type Props = { searchParams: Promise<{ error?: string }> }

function formatDate(iso: string | null) {
  if (!iso) return 'Ingen dato'
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AdminPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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
            <div className="login-error">
              Forkert e-mail eller adgangskode.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    )
  }

  let posts: NewsPost[] = []
  let loadError: string | null = null

  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('news')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw new Error(error.message)
    posts = (data as NewsPost[]) ?? []
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Ukendt serverfejl'
    console.error('[admin] Failed to load dashboard', error)
  }

  const publishedCount = posts.filter(post => getAdminPostState(post.status, post.published_at) === 'published').length
  const scheduledCount = posts.filter(post => getAdminPostState(post.status, post.published_at) === 'scheduled').length
  const draftCount = posts.filter(post => post.status === 'draft').length
  const latestPosts = posts.slice(0, 6)

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard</div>
          <h1>Admin</h1>
          <p className="subtitle">Overblik over nyheder og planlagte opslag.</p>
        </div>
        <Link href="/admin/nyheder/ny" className="btn primary">
          + Ny nyhed
        </Link>
      </div>

      <div className="dashboard-stats">
        <Link href="/admin/nyheder" className="stat-card">
          <span>Alle opslag</span>
          <strong>{posts.length}</strong>
        </Link>
        <Link href="/admin/kalender" className="stat-card">
          <span>Planlagt</span>
          <strong>{scheduledCount}</strong>
        </Link>
        <Link href="/admin/nyheder" className="stat-card">
          <span>Kladder</span>
          <strong>{draftCount}</strong>
        </Link>
        <Link href="/nyheder" className="stat-card">
          <span>Publiceret</span>
          <strong>{publishedCount}</strong>
        </Link>
      </div>

      {loadError && (
        <div className="adm-card" role="alert">
          <div className="adm-empty">Kunne ikke hente dashboarddata. {loadError}</div>
        </div>
      )}

      <div className="adm-card">
        <div className="panel-heading-row">
          <h2>Seneste nyheder</h2>
          <Link href="/admin/nyheder" className="btn ghost">Se alle</Link>
        </div>
        {latestPosts.length === 0 ? (
          <div className="adm-empty">Ingen nyheder endnu</div>
        ) : (
          <div className="admin-list">
            {latestPosts.map(post => (
              <Link href={`/admin/nyheder/${post.id}`} className="admin-list-item" key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <span>{post.category} - {formatDate(post.published_at)}</span>
                </div>
                <span className={`adm-status ${getAdminPostState(post.status, post.published_at)}`}>
                  {getAdminPostState(post.status, post.published_at) === 'scheduled'
                    ? 'Planlagt'
                    : getAdminPostState(post.status, post.published_at) === 'published'
                      ? 'Publiceret'
                      : 'Kladde'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
