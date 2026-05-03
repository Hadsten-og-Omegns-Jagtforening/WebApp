import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { sanitizeBody } from '@/lib/sanitize'
import { getPublishedCutoffIso } from '@/lib/news-visibility'
import { normalizeResults } from '@/lib/results'
import type { NewsPost, ResultRow } from '@/lib/database.types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('title, teaser')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', getPublishedCutoffIso())
    .single()

  if (!data) return {}
  return { title: `${data.title} — HOJ`, description: data.teaser }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', getPublishedCutoffIso())
    .single()

  if (!post) notFound()

  const article = post as NewsPost
  const results = normalizeResults(article.results as ResultRow[] | null)

  return (
    <section className="section">
      <div className="container">
        <Link href="/nyheder" className="btn ghost" style={{ marginBottom: 24, paddingLeft: 0 }}>
          ← Tilbage til nyheder
        </Link>
        <article className="article">
          <div className="meta">
            {article.category.toUpperCase()} · {article.published_at ? formatDate(article.published_at) : ''}
          </div>
          <h1>{article.title}</h1>
          {article.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image_url}
              alt=""
              className="hero-img"
            />
          )}
          {/* Body is sanitised HTML — safe to render */}
          <div dangerouslySetInnerHTML={{ __html: sanitizeBody(article.body) }} />
          {article.has_results && results.length > 0 && (
            <details className="results" open>
              <summary>Resultater</summary>
              <table>
                <thead>
                  <tr>
                    <th>Placering</th>
                    <th>Navn</th>
                    <th style={{ textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.rank}</td>
                      <td>{r.name}</td>
                      <td style={{ textAlign: 'right' }}>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </article>
      </div>
    </section>
  )
}
