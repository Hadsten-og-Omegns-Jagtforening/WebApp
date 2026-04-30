import Link from 'next/link'
import Icon from './Icon'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/placeholder-hero.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div className="hero-shade" />
      {/* TODO: replace placeholder-hero.svg with a customer-approved hero image before production launch. */}
      {/* TODO: replace with dynamic open/closed status in Phase 2 */}
      <div className="hero-status"><span className="dot" />Banen åben · ons 17–20</div>
      <div className="container hero-inner">
        <div className="hero-badge">Siden 1968 · Hadsten</div>
        <h1>Kom med<br />på banen.</h1>
        <p className="lede">Flugtskydning, jagt og fællesskab i hjertet af Østjylland. Book banen, tilmeld dig et arrangement, eller kig forbi klubhuset onsdag aften.</p>
        <div className="hero-ctas">
          <Link href="/book-skydebanen" className="btn primary lg">
            <Icon name="crosshair" size={18} />Book skydebanen
          </Link>
          <Link
            href="/kalender"
            className="btn secondary lg"
            style={{
              color: '#151E18',
              borderColor: 'rgba(244,239,228,0.9)',
              background: 'rgba(244,239,228,0.92)',
            }}
          >
            Se kalender
          </Link>
        </div>
      </div>
    </section>
  )
}
