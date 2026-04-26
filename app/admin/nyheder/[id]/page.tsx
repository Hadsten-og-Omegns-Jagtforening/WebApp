import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import NewsForm from '@/components/admin/NewsForm'
import { updatePost, publishPost, saveDraft, deletePost } from '@/lib/actions/news'
import type { NewsPost } from '@/lib/database.types'

type Props = { params: Promise<{ id: string }> }

export default async function EditNyhedPage({ params }: Props) {
  const { id } = await params
  const db = createAdminClient()
  const { data, error } = await db.from('news').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw new Error(`Database error: ${error.message}`)
  if (!data) notFound()
  const post = data as NewsPost

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Nyheder / Rediger</div>
          <h1>Rediger nyhed</h1>
          <p className="subtitle">Sidst opdateret {new Date(post.updated_at).toLocaleString('da-DK')}</p>
        </div>
      </div>
      <NewsForm
        post={post}
        onSaveDraft={async (fd) => {
          'use server'
          return saveDraft(id, fd)
        }}
        onPublish={async (fd) => {
          'use server'
          await updatePost(id, fd)
          return publishPost(id, fd.get('published_at') as string | null)
        }}
        onDelete={async () => {
          'use server'
          await deletePost(id)
        }}
      />
    </div>
  )
}
