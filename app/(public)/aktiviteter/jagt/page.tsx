const bukkejagt = [
  'Essendrup på begge sider af vejen',
  'Moesgaard ved gravhøjene',
  'Nydam juletræer ved TV2-masten',
  'Nydam vest for grusvejen',
]

const rules = [
  'For al jagt på foreningens områder skal gældende jagtlovgivning og foreningens retningslinjer overholdes.',
  'Der må kun skydes ulige 6-ender og 6-ender, og der må maks. skydes 1 buk pr. udlejning.',
  'Send SMS til Søren eller Claus, når der er afgivet skud efter en buk.',
  'Bukken skal vejes i brækket tilstand. Prisen er 35 kr. pr. kg.',
  'Hvis bukken ikke findes, skal der ringes efter en schweisshundefører.',
  'Mårhund må skydes, hvis du er sikker. Husk at melde observationen.',
  'Det er tilladt at medbringe 1 gæst som observatør. Der må kun medbringes 1 våben pr. område.',
]

export default function JagtPage() {
  return (
    <section className="section">
      <div className="container copy-page">
        <div className="page-intro">
          <span className="eyebrow">Aktiviteter</span>
          <h1>Jagt</h1>
          <p className="lede">
            Hadsten og Omegns Jagtforening råder over mange hektar jagt i området omkring skydebanen.
            Her tilbyder vi efterårsjagter, bukkejagt og hjortejagt for medlemmer.
          </p>
        </div>

        <div className="copy-stack">
          <section>
            <p>
              Vi har altid pladser reserveret til nyjægere, der vil prøve kræfter med jagten for første gang.
              Alle jagter findes i kalenderen, og tilmelding og praktiske detaljer fremgår i vores nyheder.
            </p>
          </section>

          <section className="info-panel">
            <h2>Efterårsjagt</h2>
            <p>
              Vi afholder foreningsjagter for alle medlemmer gennem efteråret - med et fast antal pladser reserveret til nyjægere.
              Dagen starter i klubhuset med kaffe, rundstykker og parole, inden vi kører ud til dagens såter.
            </p>
            <p>
              Terrænet byder på varieret vildt, og er du ny, er det her de gode spørgsmål bliver besvaret.
            </p>
            <p>
              Pris: 350 kr. inkl. morgenmad. Nedlagt vildt afregnes efter gældende prisliste.
            </p>
            <p>
              Er du ikke medlem endnu? Din første jagt er gratis - send en mail til booking@hadstenjagtforening.dk og vi finder en plads til dig, så længe der er ledige.
            </p>
          </section>

          <section className="info-panel">
            <h2>Bukkejagt</h2>
            <p>Som medlem kan du leje dig ind på foreningens fire jagtstykker til bukkejagt:</p>
            <ul>
              {bukkejagt.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>
              Jagten udlejes ugevis til én person pr. uge. De første uger fordeles ved lodtrækning - dato fremgår af kalenderen.
              Resterende uger bookes direkte hos Claus Kaa Bach (40 31 16 13) eller Søren Mikkelsen (61 79 52 91).
            </p>
            <p>
              Pris: 500 kr. pr. uge. Nedlagt buk afregnes til 35 kr. pr. kg (brækket vægt) i klubhuset på førstkommende træningsaften.
            </p>
          </section>

          <section className="info-panel">
            <h2>Hjortejagt</h2>
            <p>
              Vi udlejer også jagtrevir til hjortejagt ugevis. Der må skydes alt sikavildt, dåvildt og kronvildt efter gældende jagttider.
              Vær opmærksom på lokale skydetider. Ræv og mårhund er gratis.
            </p>
            <p>
              Pris: 500 kr. pr. uge. Vildt afregnes til 35 kr. pr. kg (brækket vægt).
            </p>
            <p>
              Kontakt Claus Kaa Bach (40 31 16 13 / claus@kaabach.dk) eller Søren Mikkelsen (61 79 52 91 / sobmik46@gmail.com) for at høre nærmere.
            </p>
          </section>

          <section className="info-panel">
            <h2>Regler for riffeljagt</h2>
            <ol>
              {rules.map((rule) => <li key={rule}>{rule}</li>)}
            </ol>
          </section>
        </div>
      </div>
    </section>
  )
}
