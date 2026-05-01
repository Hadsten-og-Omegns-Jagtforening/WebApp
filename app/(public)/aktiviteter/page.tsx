import Icon from '@/components/Icon'
import Link from 'next/link'

const activityTiles = [
  {
    href: '/aktiviteter/jagt',
    icon: 'tree-pine' as const,
    title: 'Jagt',
    text: 'Bukkejagt, regulering og jagtdage for medlemmer.',
    cta: 'Se jagtaktiviteter',
  },
  {
    href: '/aktiviteter/hjalp-til-jagtproven',
    icon: 'claypigeon' as const,
    title: 'Hjælp til jagtprøven',
    text: 'Træning og praktisk hjælp til haglskydeprøven.',
    cta: 'Læs om hjælp',
  },
  {
    href: '/aktiviteter/premieskydninger',
    icon: 'trophy' as const,
    title: 'Præmieskydninger',
    text: 'Faste skydninger, HOJ Cup og traditionsrige klubdage.',
    cta: 'Se præmieskydninger',
  },
]

export default function AktiviteterPage() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Aktiviteter</span>
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
            Aktiviteter
          </h1>
          <p style={{ fontSize: 18, color: 'var(--fg2)', maxWidth: '56ch', margin: 0, lineHeight: 1.5 }}>
            HOJ samler lokale jægere og skytter omkring jagt, træning og faste traditioner på skydebanen.
          </p>
        </div>

        <div className="grid-3">
          {activityTiles.map((tile) => (
            <Link key={tile.href} className="tile" href={tile.href}>
              <div className="icon-wrap"><Icon name={tile.icon} size={22} /></div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, lineHeight: 1.15, margin: 0 }}>{tile.title}</h2>
              <p>{tile.text}</p>
              <span className="arrow">{tile.cta} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
