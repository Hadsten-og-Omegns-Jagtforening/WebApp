import Icon from '@/components/Icon'
import Link from 'next/link'

const activityTiles = [
  {
    href: '/aktiviteter/jagt',
    icon: 'tree-pine' as const,
    title: 'Jagt',
    text: 'Bukkejagt, hjortejagt og efterårsjagt - for medlemmer.',
    cta: 'Læs mere her',
  },
  {
    href: '/aktiviteter/hjalp-til-jagtproven',
    icon: 'claypigeon' as const,
    title: 'Hjælp til jagtprøven',
    text: 'Ekstra undervisning til jagtprøven - teori, afstandsbedømmelse og våbenhåndtering.',
    cta: 'Læs mere her',
  },
  {
    href: '/aktiviteter/premieskydninger',
    icon: 'trophy' as const,
    title: 'Præmieskydninger',
    text: 'Se hvilke præmieskydninger vi afholder i løbet af året.',
    cta: 'Læs mere her',
  },
]

export default function AktiviteterPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <span className="eyebrow">Aktiviteter</span>
          <h1>Det foregår hos os</h1>
          <p className="lede">
            Her finder du foreningens jagtaktiviteter, hjælp til jagtprøven samt oversigt over årets præmieskydninger.
          </p>
        </div>

        <div className="grid-3">
          {activityTiles.map((tile) => (
            <Link key={tile.href} className="tile" href={tile.href}>
              <div className="icon-wrap"><Icon name={tile.icon} size={22} /></div>
              <h2 className="tile-title">{tile.title}</h2>
              <p>{tile.text}</p>
              <span className="arrow">{tile.cta} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
