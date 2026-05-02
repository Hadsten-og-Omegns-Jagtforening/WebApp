import NewsForm from '@/components/admin/NewsForm'
import { createPost } from '@/lib/actions/news'
import { createNewsCategory, listNewsCategories } from '@/lib/actions/categories'

type Props = { searchParams: Promise<{ category?: string }> }

export default async function NyNyhedPage({ searchParams }: Props) {
  const categories = await listNewsCategories()
  const { category } = await searchParams

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Nyheder / Opret</div>
          <h1>Ny nyhed</h1>
        </div>
      </div>
      <NewsForm
        categories={categories}
        defaultCategory={category}
        onCreateCategory={createNewsCategory}
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
