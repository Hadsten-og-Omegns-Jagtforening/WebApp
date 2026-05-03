import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NewsCard from '@/components/NewsCard'
import { getPublishedCutoffIso } from '@/lib/news-visibility'
import type { NewsPost } from '@/lib/database.types'

const PER_PAGE = 9

type Props = { searchParams: Promise<{ page?: string }> }

export default async function NyhederPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const raw = parseInt(pageParam ?? '1', 10)
  const page = Number.isFinite(raw) && raw > 0 ? raw : 1
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const supabase = await createClient()
  const { data: posts, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', getPublishedCutoffIso())
    .order('published_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE)

  return (
    <section className="section">
      <div className="container">
        <h1>Nyheder</h1>
        <p className="lede" style={{ marginTop: -12, marginBottom: 32 }}>
          Hold dig opdateret med, hvad der sker hos os.
        </p>
        <div className="grid-3">
          {((posts as NewsPost[]) ?? []).map(post => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/nyheder?page=${p}`}
                className={`page-btn${p === page ? ' active' : ''}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
