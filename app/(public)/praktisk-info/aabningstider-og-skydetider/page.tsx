const openingHours = [
  { season: 'Februar - marts', day: 'Lørdag', time: '13.00 - 16.00' },
  { season: 'April - august', day: 'Onsdag', time: '18.00 - 21.30' },
  { season: 'September', day: 'Lørdag', time: '13.00 - 16.00' },
]

const environmentTimes = [
  { day: 'Mandag', summer: '07.00 - 22.00', winter: '07.00 - 22.00' },
  { day: 'Tirsdag', summer: '07.00 - 18.00', winter: '07.00 - 20.00' },
  { day: 'Onsdag', summer: '07.00 - 22.00', winter: '07.00 - 22.00' },
  { day: 'Lørdag', summer: '09.00 - 16.00', winter: '09.00 - 16.00' },
]

export default function AabningstiderOgSkydetiderPage() {
  return (
    <section className="section">
      <div className="container copy-page">
        <div className="page-intro">
          <span className="eyebrow">Praktisk info</span>
          <h1>Åbningstider og skydebanen</h1>
          <p className="lede">
            Her finder du de faste åbningstider, hvornår du kan booke banen - og de tidspunkter vores miljøgodkendelse tillader skydning.
          </p>
        </div>

        <section className="info-panel">
          <h2>Åbningstider</h2>
          <p>Banen har faste åbningsdage gennem sæsonen. Ændringer fremgår altid af kalenderen.</p>
          <div className="time-card-grid">
            {openingHours.map((item) => (
              <article key={item.season} className="time-card">
                <strong>{item.season}</strong>
                <span>{item.day}</span>
                <em>{item.time}</em>
              </article>
            ))}
          </div>
          <p>Januar samt oktober-december afholder vi som udgangspunkt ingen skydninger.</p>
        </section>

        <section className="info-panel">
          <h2>Miljøgodkendelse</h2>
          <p>Vores miljøgodkendelse fastlægger, hvornår der må skydes på banen.</p>
          <div className="permit-grid">
            {environmentTimes.map((item) => (
              <article key={item.day}>
                <strong>{item.day}</strong>
                <span>Sommer: {item.summer}</span>
                <span>Vinter: {item.winter}</span>
              </article>
            ))}
          </div>
          <p>
            Herudover afvikles der stævner, kurser og øvelser på 4 weekender i hvert halvår:
            lørdag/hverdag før helligdag kl. 09.00-20.00 og søndag/helligdag kl. 09.00-18.00.
          </p>
        </section>

        <section className="info-panel">
          <h2>Klubhuset</h2>
          <p>
            Klubhuset på Vissingvej er åbent i forbindelse med træning, præmieskydninger og foreningens arrangementer.
            Det er samlingspunktet - før og efter skydningen.
          </p>
          <h3>Er du i tvivl om noget?</h3>
          <p>Kig forbi en træningsaften eller skriv til os på info@hadstenjagtforening.dk.</p>
        </section>
      </div>
    </section>
  )
}
