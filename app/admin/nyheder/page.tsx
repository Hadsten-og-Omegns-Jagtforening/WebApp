import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deletePost } from '@/lib/actions/news'
import { getAdminPostState } from '@/lib/news-visibility'
import Icon from '@/components/Icon'
import DeletePostButton from '@/components/admin/DeletePostButton'
import type { NewsPost, NewsCategory } from '@/lib/database.types'

const CATEGORY_CLASS: Partial<Record<NewsCategory, string>> = {
  'Nyhed': 'cat-nyhed',
  'Jagt': 'cat-jagt',
  'Præmieskydning': 'cat-praemie',
  'Klubaften': 'cat-klub',
  'Praktisk info': 'cat-prakt',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function AdminNyhederPage() {
  let posts: NewsPost[] = []
  let count = 0
  let loadError: string | null = null

  try {
    const db = createAdminClient()
    const result = await db
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (result.error) {
      throw new Error(result.error.message)
    }

    posts = (result.data as NewsPost[]) ?? []
    count = result.count ?? 0
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Ukendt serverfejl'
    console.error('[admin/nyheder] Failed to load news posts', error)
  }

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Nyheder</div>
          <h1>Nyheder</h1>
          <p className="subtitle">{count} indl&aelig;g</p>
        </div>
        <Link href="/admin/nyheder/ny" className="btn primary">
          + Ny nyhed
        </Link>
      </div>

      {loadError && (
        <div className="adm-card" role="alert">
          <div className="adm-empty">
            Kunne ikke hente nyheder. Kontroller Supabase serverkonfigurationen i Vercel.
            <br />
            <small>{loadError}</small>
          </div>
        </div>
      )}

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Titel</th>
              <th>Dato</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="adm-empty">
                  {loadError ? 'Nyheder kunne ikke indlæses' : 'Ingen nyheder endnu'}
                </td>
              </tr>
            ) : posts.map(post => {
              const state = getAdminPostState(post.status, post.published_at)
              const label = state === 'scheduled' ? 'Planlagt' : state === 'published' ? 'Publiceret' : 'Kladde'
              return (
              <tr key={post.id}>
                <td>
                  <span className={`cat ${CATEGORY_CLASS[post.category] ?? 'cat-nyhed'}`}>
                    {post.category}
                  </span>
                </td>
                <td className="title-cell">
                  <div className="title">{post.title}</div>
                  <div className="excerpt">{post.teaser}</div>
                </td>
                <td className="date-cell">
                  {post.published_at ? formatDate(post.published_at) : '—'}
                </td>
                <td>
                  <span className={`adm-status ${state}`}>
                    {label}
                  </span>
                </td>
                <td className="actions-cell">
                  <Link href={`/admin/nyheder/${post.id}`} title="Rediger" className="btn ghost icon-only">
                    <Icon name="pencil" size={15} />
                  </Link>
                  <form action={deletePost.bind(null, post.id) as unknown as (formData: FormData) => Promise<void>} style={{ display: 'inline' }}>
                    <DeletePostButton />
                  </form>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
