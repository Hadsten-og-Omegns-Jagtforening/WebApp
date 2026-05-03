const board = [
  ['Formand', 'Peter Glavind'],
  ['Næstformand', 'Keld Kristensen'],
  ['Kasserer', 'Christian Krogh Hansen'],
  ['Sekretær', 'Magnus Asmussen'],
  ['Medlem', 'Bjarne Larsen'],
  ['Medlem', 'Claus Horn'],
  ['Medlem', 'Claus Vinge'],
  ['Medlem', 'Claus Christensen'],
  ['Medlem', 'Anders Glavind'],
  ['Suppleant', 'Allan Søsted'],
  ['Suppleant', 'Sten Nielsen'],
]

export default function BestyrelsenPage() {
  return (
    <section className="section">
      <div className="container copy-page">
        <div className="page-intro">
          <span className="eyebrow">Praktisk info</span>
          <h1>Folkene bag foreningen</h1>
          <p className="lede">
            Hadsten og Omegns Jagtforening drives af frivillige mennesker, som bruger deres fritid på at holde banen i gang,
            arrangere jagter og sørge for at foreningslivet kører.
          </p>
        </div>

        <div className="copy-stack">
          <section className="info-panel">
            <h2>Bliv frivillig</h2>
            <p>
              En stor del af foreningens daglige drift hviler på vores vagthold, som består af frivillige medlemmer der hjælper
              med at afvikle træningsaftenerne og holde banen kørende.
            </p>
            <p>
              Det er en god måde at blive en del af fællesskabet på, og der er altid brug for flere hænder.
              Spørg endelig på banen, hvis det lyder som noget for dig.
            </p>
          </section>

          <section className="info-panel">
            <h2>Bestyrelsen</h2>
            <div className="compact-list">
              {board.map(([role, name]) => (
                <div key={`${role}-${name}`}>
                  <span>{role}</span>
                  <strong>{name}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="info-panel">
            <h2>Udvalg</h2>
            <p>
              Ud over bestyrelsen har vi et skyde- og jagtudvalg, der arbejder med alt fra baneforhold til jagtplanlægning.
              Har du gode ideer eller lyst til at bidrage, er du velkommen til at møde op og tage kontakt til os.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
