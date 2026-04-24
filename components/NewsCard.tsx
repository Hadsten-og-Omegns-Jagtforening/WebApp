import Link from 'next/link'
import type { NewsPost } from '@/lib/database.types'

type Props = { post: NewsPost }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function NewsCard({ post }: Props) {
  return (
    <Link href={`/nyheder/${post.slug}`} className="newscard">
      <div className="img">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image_url} alt="" />
        ) : (
          <span>FOTO · {post.category.toUpperCase()}</span>
        )}
      </div>
      <div className="body">
        <div className="meta">
          {post.category} · {post.published_at ? formatDate(post.published_at) : ''}
        </div>
        <h3>{post.title}</h3>
        <p className="teaser">{post.teaser}…</p>
        <span className="cta">Læs mere her →</span>
      </div>
    </Link>
  )
}
