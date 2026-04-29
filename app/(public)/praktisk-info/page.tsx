import Icon from '@/components/Icon'
import Link from 'next/link'

const infoTiles = [
  {
    href: '/kalender',
    icon: 'calendar' as const,
    title: 'Kalender',
    text: 'Skydetider, jagtdatoer og klubaftener samlet ét sted.',
  },
  {
    href: '/praktisk-info/aabningstider-og-skydetider',
    icon: 'clock' as const,
    title: 'Åbningstider og skydetider',
    text: 'Praktiske tider for træning, kortsalg og særlige skydedage.',
  },
  {
    href: '/book-skydebanen',
    icon: 'crosshair' as const,
    title: 'Lej skydebanen',
    text: 'Information om private grupper, firmaarrangementer og polterabender.',
  },
  {
    href: '/praktisk-info/bestyrelsen',
    icon: 'users' as const,
    title: 'Bestyrelsen',
    text: 'Kontakt foreningen og se hvordan opgaverne er fordelt.',
  },
  {
    href: '/find-os',
    icon: 'map-pin' as const,
    title: 'Find os',
    text: 'Adresse, klubhus og praktisk ankomst til banen i Hadsten.',
  },
]

export default function PraktiskInfoPage() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Praktisk info</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(42px, 7vw, 56px)',
              letterSpacing: '-0.02em',
              margin: '8px 0 12px',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Praktisk info
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            De mest brugte oplysninger om tider, bane, bestyrelse og adresse.
          </p>
        </div>

        <div className="grid-3">
          {infoTiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="tile">
              <div className="icon-wrap"><Icon name={tile.icon} size={22} /></div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, lineHeight: 1.15, margin: 0 }}>{tile.title}</h2>
              <p>{tile.text}</p>
              <span className="arrow">Læs mere →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
