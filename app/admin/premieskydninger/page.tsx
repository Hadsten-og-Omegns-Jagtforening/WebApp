import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminPostState } from '@/lib/news-visibility'
import type { NewsPost } from '@/lib/database.types'

function formatDate(iso: string | null) {
  if (!iso) return 'Ingen dato'
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AdminPremieskydningerPage() {
  let posts: NewsPost[] = []
  let loadError: string | null = null

  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('news')
      .select('*')
      .eq('category', 'Præmieskydning')
      .order('published_at', { ascending: false })

    if (error) throw new Error(error.message)
    posts = (data as NewsPost[]) ?? []
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Ukendt serverfejl'
    console.error('[admin/premieskydninger] Failed to load posts', error)
  }

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Præmieskydninger</div>
          <h1>Præmieskydninger</h1>
          <p className="subtitle">Nyheder og resultater i kategorien Præmieskydning.</p>
        </div>
        <Link href="/admin/nyheder/ny?category=Præmieskydning" className="btn primary">
          + Ny præmieskydning
        </Link>
      </div>

      {loadError && (
        <div className="adm-card" role="alert">
          <div className="adm-empty">Kunne ikke hente præmieskydninger. {loadError}</div>
        </div>
      )}

      <div className="adm-card">
        {posts.length === 0 ? (
          <div className="adm-empty">Ingen præmieskydninger endnu</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Dato</th>
                <th>Status</th>
                <th>Resultater</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const state = getAdminPostState(post.status, post.published_at)
                const label = state === 'scheduled' ? 'Planlagt' : state === 'published' ? 'Publiceret' : 'Kladde'
                return (
                  <tr key={post.id}>
                    <td className="title-cell">
                      <Link href={`/admin/nyheder/${post.id}`} className="title">{post.title}</Link>
                      <div className="excerpt">{post.teaser}</div>
                    </td>
                    <td className="date-cell">{formatDate(post.published_at)}</td>
                    <td><span className={`adm-status ${state}`}>{label}</span></td>
                    <td>{post.has_results ? 'Ja' : 'Nej'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
