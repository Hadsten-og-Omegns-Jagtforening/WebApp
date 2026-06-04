export default function BlivMedlemPage() {
  return (
    <section className="section">
      <div className="container copy-page">
        <div className="page-intro">
          <span className="eyebrow">Bliv medlem</span>
          <h1>Bliv en del af fællesskabet</h1>
          <p className="lede">
            Hos Hadsten og Omegns Jagtforening er medlemskabet mere end en tilmelding.
          </p>
          <p className="lede">
            Det er adgang til foreningens jagter - bukkejagt, hjortejagt og efterårsjagt - og til et fællesskab,
            der har holdt sammen om jagt og flugtskydning i Østjylland siden 1933.
          </p>
          <p className="lede">Skydebanen, kurserne og arrangementerne er åbne for alle. Men vil du med på jagt, skal du være medlem.</p>
        </div>

        <section className="info-panel">
          <h2>Sådan bliver du medlem</h2>
          <p>
            Medlemskab tegnes gennem Danmarks Jægerforbund, som er dem, der administrerer medlemskaber for landets frivillige jagtforeninger,
            herunder os.
          </p>
          <p>Du bliver medlem i tre trin:</p>
          <ol>
            <li>Gå ind på jaegerforbundet.dk og find Hadsten og Omegns Jagtforening i listen over foreninger lidt længere nede på siden.</li>
            <li>Vælg din medlemstype - ordinært eller ekstraordinært medlemskab.</li>
            <li>Udfyld formularen med dine oplysninger - så er du officielt medlem ved os.</li>
          </ol>
          <p>Har du spørgsmål undervejs, kan du altid kontakte Danmarks Jægerforbund direkte eller skrive til os.</p>
          <a
            className="btn primary lg"
            href="https://minprofil.jaegerforbundet.dk/bliv-medlem"
            target="_blank"
            rel="noreferrer"
          >
            Bliv medlem hos os
          </a>
        </section>
      </div>
    </section>
  )
}
