import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminPostState } from '@/lib/news-visibility'
import type { NewsPost } from '@/lib/database.types'

function formatDateTime(iso: string | null) {
  if (!iso) return 'Ingen dato'
  return new Date(iso).toLocaleString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminKalenderPage() {
  let posts: NewsPost[] = []
  let loadError: string | null = null

  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('news')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: true })

    if (error) throw new Error(error.message)
    posts = (data as NewsPost[]) ?? []
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Ukendt serverfejl'
    console.error('[admin/kalender] Failed to load scheduled posts', error)
  }

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Kalender</div>
          <h1>Kalender</h1>
          <p className="subtitle">Planlagte og publicerede nyheder efter dato.</p>
        </div>
        <Link href="/admin/nyheder/ny" className="btn primary">+ Ny nyhed</Link>
      </div>

      {loadError && (
        <div className="adm-card" role="alert">
          <div className="adm-empty">Kunne ikke hente kalenderen. {loadError}</div>
        </div>
      )}

      <div className="adm-card">
        {posts.length === 0 ? (
          <div className="adm-empty">Ingen nyheder med publiceringsdato endnu</div>
        ) : (
          <div className="calendar-list">
            {posts.map(post => {
              const state = getAdminPostState(post.status, post.published_at)
              const label = state === 'scheduled' ? 'Planlagt' : state === 'published' ? 'Publiceret' : 'Kladde'
              return (
                <Link href={`/admin/nyheder/${post.id}`} key={post.id} className="calendar-item">
                  <time>{formatDateTime(post.published_at)}</time>
                  <div>
                    <strong>{post.title}</strong>
                    <span>{post.category}</span>
                  </div>
                  <span className={`adm-status ${state}`}>{label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
