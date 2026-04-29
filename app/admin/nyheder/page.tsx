import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deletePost } from '@/lib/actions/news'
import Icon from '@/components/Icon'
import DeletePostButton from '@/components/admin/DeletePostButton'
import type { NewsPost, NewsCategory } from '@/lib/database.types'

const CATEGORY_CLASS: Record<NewsCategory, string> = {
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
  const db = createAdminClient()
  const { data: posts, count, error } = await db
    .from('news')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Database error: ${error.message}`)

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Nyheder</div>
          <h1>Nyheder</h1>
          <p className="subtitle">{count ?? 0} indlæg</p>
        </div>
        <Link href="/admin/nyheder/ny" className="btn primary">
          + Ny nyhed
        </Link>
      </div>

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
            {((posts as NewsPost[]) ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="adm-empty">
                  Ingen nyheder endnu
                </td>
              </tr>
            ) : ((posts as NewsPost[]) ?? []).map(post => (
              <tr key={post.id}>
                <td>
                  <span className={`cat ${CATEGORY_CLASS[post.category as NewsCategory]}`}>
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
                  <span className={`adm-status${post.status === 'draft' ? ' draft' : ''}`}>
                    {post.status === 'published' ? 'Publiceret' : 'Kladde'}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
