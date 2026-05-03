import Icon from '@/components/Icon'
import Link from 'next/link'

const infoTiles = [
  {
    href: '/book-skydebanen',
    icon: 'crosshair' as const,
    title: 'Book skydebanen',
    text: 'Book banen til dig selv, din virksomhed eller dit selskab - vi sørger for resten.',
    cta: 'Book skydebanen her',
  },
  {
    href: '/kalender',
    icon: 'calendar' as const,
    title: 'Se kalenderen',
    text: 'Skydetider, jagtdatoer og kommende arrangementer - opdateres løbende.',
    cta: 'Se kalenderen her',
  },
  {
    href: '/praktisk-info/aabningstider-og-skydetider',
    icon: 'clock' as const,
    title: 'Åbningstider og skydebanen',
    text: 'Åbningstider, adresse og alt det praktiske om banen.',
    cta: 'Find os her',
  },
  {
    href: '/praktisk-info/bestyrelsen',
    icon: 'users' as const,
    title: 'Folkene bag foreningen',
    text: 'Bag foreningen står et hold af frivillige. Kontakt os, eller spørg ind til at være med.',
    cta: 'Mød dem her',
  },
]

export default function PraktiskInfoPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <span className="eyebrow">Praktisk info</span>
          <h1>Alt du har brug for</h1>
        </div>

        <div className="grid-2">
          {infoTiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="tile">
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
