import Link from 'next/link'
import NewsCard from './NewsCard'
import type { NewsPost } from '@/lib/database.types'

type Props = { posts: NewsPost[] }

export default function NewsFeed({ posts }: Props) {
  return (
    <section className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Nyt fra foreningen</span>
            <h2>Seneste nyheder</h2>
          </div>
          <Link href="/nyheder" className="link">Se alle nyheder →</Link>
        </div>
        <div className="news-list grid-2">
          {posts.map(post => <NewsCard key={post.id} post={post} />)}
        </div>
      </div>
    </section>
  )
}
