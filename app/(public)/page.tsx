import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/Hero'
import NewsFeed from '@/components/NewsFeed'
import Icon from '@/components/Icon'
import Link from 'next/link'
import { getPublishedCutoffIso } from '@/lib/news-visibility'
import type { NewsPost } from '@/lib/database.types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', getPublishedCutoffIso())
    .order('highlighted', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <>
      <Hero />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Find det du leder efter</span>
              <h2>Her starter de fleste</h2>
            </div>
          </div>
          <div className="grid-3">
            <Link href="/book-skydebanen" className="tile">
              <div className="icon-wrap"><Icon name="crosshair" size={22} /></div>
              <h3>Book skydebanen</h3>
              <p>Book banen til dig selv, din virksomhed eller dit selskab - vi sørger for resten.</p>
              <span className="arrow">Book skydebanen her →</span>
            </Link>
            <Link href="/kalender" className="tile">
              <div className="icon-wrap"><Icon name="calendar" size={22} /></div>
              <h3>Se kalenderen</h3>
              <p>Skydetider, jagtdatoer og kommende arrangementer - opdateres løbende.</p>
              <span className="arrow">Se kalenderen her →</span>
            </Link>
            <Link href="/bliv-medlem" className="tile">
              <div className="icon-wrap"><Icon name="ticket" size={22} /></div>
              <h3>Bliv medlem</h3>
              <p>Kom med på jagt, deltag i arrangementer - og bliv en del af fællesskabet.</p>
              <span className="arrow">Bliv medlem her →</span>
            </Link>
          </div>
        </div>
      </section>
      <NewsFeed posts={(posts as NewsPost[]) ?? []} />
    </>
  )
}
