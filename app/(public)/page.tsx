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
      {/* QuickNav tiles — inline in page.tsx since it's simple */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Kom hurtigt i gang</span>
              <h2>Det, folk oftest leder efter</h2>
            </div>
          </div>
          <div className="grid-3">
            <Link href="/book-skydebanen" className="tile">
              <div className="icon-wrap"><Icon name="crosshair" size={22} /></div>
              <h3>Book skydebanen</h3>
              <p>Privat, firma eller polterabend. Udstyr står klar — bare at komme.</p>
              <span className="arrow">Book nu →</span>
            </Link>
            <Link href="/kalender" className="tile">
              <div className="icon-wrap"><Icon name="calendar" size={22} /></div>
              <h3>Kalender</h3>
              <p>Skydetider, jagtdatoer og klubaftener — opdateret løbende.</p>
              <span className="arrow">Se kalenderen →</span>
            </Link>
            <Link href="/bliv-medlem" className="tile">
              <div className="icon-wrap"><Icon name="ticket" size={22} /></div>
              <h3>Bliv medlem</h3>
              <p>Adgang til egne jagtrevirer, træning og rabat ved arrangementer.</p>
              <span className="arrow">Indmeldelse →</span>
            </Link>
          </div>
        </div>
      </section>
      <NewsFeed posts={(posts as NewsPost[]) ?? []} />
    </>
  )
}
