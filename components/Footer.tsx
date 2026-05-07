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
              alt="Hadsten & Omegns Jagtforening"
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
                maxWidth: '32ch',
              }}
            >
              Lokal jagt- og skydeforening i Hadsten siden 1968. Vi er for både erfarne jægere og
              nye på banen.
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
                <Link href="/bliv-medlem">Bliv medlem</Link>
              </li>
              <li>
                <Link href="/nyheder">Nyheder</Link>
              </li>
              <li>
                <Link href="/kalender">Kalender</Link>
              </li>
              <li>
                <Link href="/praktisk-info/historien-om-os">Historien om os</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>
                <Link href="/praktisk-info/folkene-bag-foreningen">Folkene bag foreningen</Link>
              </li>
              <li>
                <a href="mailto:info@hadstenjagtforening.dk">info@hadstenjagtforening.dk</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <span>© Hadsten &amp; Omegns Jagtforening · CVR 34123268</span>
          <span>Stiftet 1968</span>
        </div>
      </div>
    </footer>
  )
}
