import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div>
            <Image
              src="/assets/logo-hoj.png"
              alt="Hadsten og Omegns Jagtforening"
              width={96}
              height={96}
              style={{ marginBottom: 18, display: 'block' }}
            />
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: 'rgba(244,239,228,0.72)',
                margin: 0,
                maxWidth: '34ch',
              }}
            >
              Jagt, flugtskydning og fællesskab i hjertet af Østjylland siden 1933.
            </p>
          </div>

          <div>
            <h4>Kom forbi</h4>
            <ul>
              <li>Vissingvej 6</li>
              <li>8370 Hadsten</li>
              <li style={{ marginTop: 10 }}>
                <Link href="/find-os">Find os på kortet →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Genveje</h4>
            <ul>
              <li>
                <Link href="/book-skydebanen">Book skydebanen</Link>
              </li>
              <li>
                <Link href="/kalender">Kalender</Link>
              </li>
              <li>
                <Link href="/aktiviteter">Aktiviteter</Link>
              </li>
              <li>
                <Link href="/om-hoj">Om HOJ</Link>
              </li>
              <li>
                <Link href="/nyheder">Nyheder</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>
                <a href="mailto:booking@hadstenjagtforening.dk">booking@hadstenjagtforening.dk</a>
              </li>
              <li>
                <a href="https://hoj.zendesk.com/hc/da">Få svar - Zendesk</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <span>© Hadsten og Omegns Jagtforening · CVR 34123268</span>
          <span>Stiftet 1933</span>
        </div>
      </div>
    </footer>
  )
}
