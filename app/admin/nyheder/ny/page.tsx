import NewsForm from '@/components/admin/NewsForm'
import { createPost } from '@/lib/actions/news'

export default async function NyNyhedPage() {
  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Nyheder / Opret</div>
          <h1>Ny nyhed</h1>
        </div>
      </div>
      <NewsForm
        onSaveDraft={async (fd) => {
          'use server'
          return createPost(fd)
        }}
        onPublish={async (fd) => {
          'use server'
          fd.append('publish', 'true')
          return createPost(fd)
        }}
      />
    </div>
  )
}
