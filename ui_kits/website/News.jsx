const NEWS = [
  { id: "n1", date: "13. april 2026", cat: "Nyheder", title: "Resultater — 80 duers jagtskydning",
    teaser: "Så fik vi afholdt vores første 80 duers jagtskydning — tak til alle der kom, støttede op og deltog",
    hasResults: true,
    body: "Så fik vi afholdt vores første 80 duers jagtskydning — tak til alle der kom, støttede op og deltog! På alle standpladser (bag-, højre-, venstre- og spidsduer) blev der skudt 20 duer i streg. Vejret artede sig, og stemningen i klubhuset bagefter var som den plejer at være: høj.",
    results: [
      ["1", "Peter Glavind", "76/81"],
      ["2", "Claus Horn", "72/82"],
      ["3", "Kenneth Egeholm", "72/82"],
      ["4", "Claus Christensen", "63/84"],
      ["5", "Claus Vinge", "52/81"],
    ]},
  { id: "n2", date: "28. marts 2026", cat: "Medlemsfordele", title: "Gratis indskydning af riffel hos Jafi",
    teaser: "Eksklusiv aften for vores medlemmer med gratis indskydning af riffel",
    body: "Bliv klar til bukkejagten! Vi har været så heldige, at Jafi igen i år åbner butikken kun for medlemmer af Hadsten & Omegns Jagtforening. Denne aften får du mulighed for at indskyde din riffel på 100m banen — helt gratis."},
  { id: "n3", date: "26. marts 2026", cat: "Jagt", title: "Lodtrækning til bukkejagt 2026",
    teaser: "Så er den 16. maj lige om hjørnet, og dermed også bukkejagten",
    body: "Foreningen tilbyder som altid bukkejagt på foreningens stykker — for at være med i lodtrækningen, kræves det at man på forhånd har købt billet. Lodtrækningen kommer til at foregå i klubhuset onsdag."},
  { id: "n4", date: "15. marts 2026", cat: "Flugtskydning", title: "80 duers jagtskydning",
    teaser: "Ja, du læste rigtig — en 80 duers jagtskydning",
    body: "Som noget nyt i år, har vi valgt at afholde vores første 80 duers jagtskydning. Det sker lørdag den 11. april fra kl. 09.00 til 12.00."},
  { id: "n5", date: "23. februar 2026", cat: "Begivenhed", title: "Fastelavnsskydning 2026",
    teaser: "Nu på lørdag den 28. februar afholder vi årets første præmieskydning",
    body: "Kig forbi til en hyggelig formiddag, hvor der vil være rundstykker i klubhuset fra kl. 09.00. Sidste kortsalg er kl. 11.30. Fra kl. 12.30 er banen åben for alle med almindelig træning."},
  { id: "n6", date: "10. januar 2026", cat: "Nyheder", title: "Generalforsamling 2026",
    teaser: "Indkaldelse til ordinær generalforsamling i klubhuset",
    body: "Vi afholder ordinær generalforsamling onsdag den 5. februar kl. 19.00 i klubhuset. Dagsorden følger vedtægterne."},
];

function NewsCard({ item, onOpen }) {
  return (
    <a className="newscard" onClick={() => onOpen(item.id)}>
      <div className="img">
        <span>FOTO · {item.cat.toUpperCase()}</span>
      </div>
      <div className="body">
        <div className="meta">{item.cat} · {item.date}</div>
        <h3>{item.title}</h3>
        <p className="teaser">{item.teaser}…</p>
        <span className="cta">Læs mere her →</span>
      </div>
    </a>
  );
}

function NewsFeed({ onOpen }) {
  return (
    <section className="section" style={{background: "var(--bg-alt)"}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Nyt fra foreningen</span>
            <h2>Seneste nyheder</h2>
          </div>
          <a className="link">Se alle nyheder →</a>
        </div>
        <div className="grid-3">
          {NEWS.slice(0, 6).map(n => <NewsCard key={n.id} item={n} onOpen={onOpen}/>)}
        </div>
      </div>
    </section>
  );
}

function NewsArticle({ id, onBack }) {
  const item = NEWS.find(n => n.id === id) || NEWS[0];
  return (
    <section className="section">
      <div className="container">
        <a className="btn ghost" onClick={onBack} style={{marginBottom:24,paddingLeft:0}}>← Tilbage til nyheder</a>
        <article className="article">
          <div className="meta">{item.cat.toUpperCase()} · {item.date} · Magnus Asmussen</div>
          <h1>{item.title}</h1>
          <div className="hero-img">FOTO · {item.cat.toUpperCase()}</div>
          <p>{item.body}</p>
          {item.hasResults && (
            <details className="results" open>
              <summary>Resultater</summary>
              <table><tbody>
                {item.results.map(r => (
                  <tr key={r[1]}><td>{r[0]}</td><td>{r[1]}</td><td style={{textAlign:"right"}}>{r[2]}</td></tr>
                ))}
              </tbody></table>
            </details>
          )}
          <p>Alle medlemmer er velkomne til at kigge forbi klubhuset efter skydningen — vi samles til kaffe og en sludder.</p>
        </article>
      </div>
    </section>
  );
}

window.NEWS = NEWS;
window.NewsCard = NewsCard;
window.NewsFeed = NewsFeed;
window.NewsArticle = NewsArticle;
