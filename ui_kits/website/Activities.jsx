const PRIZES = [
  { id: "fastelavn", title: "Fastelavnsskydning", when: "Feb", desc: "Årets første præmieskydning — rundstykker i klubhuset fra kl. 09.00.", icon: "trophy" },
  { id: "hoj-cup",   title: "HOJ Cup",            when: "Apr–Sep", desc: "Seks runder henover sæsonen. Samlet vinder kåres til juleskydningen.", icon: "trophy" },
  { id: "skthans",   title: "Skt. Hans / Midsommer", when: "Jun", desc: "Midsommerskydning med grill og fællesspisning efter.", icon: "trophy" },
  { id: "merke",     title: "Mærkeskydning",      when: "Aug", desc: "Foreningsmesterskab — guld-, sølv- og bronzemærker.", icon: "trophy" },
  { id: "80duer",    title: "80 duers jagtskydning", when: "Apr", desc: "Ny i 2026: 20 duer i streg på hver af de fire standpladser.", icon: "claypigeon" },
  { id: "jul",       title: "Juleskydning",       when: "Dec", desc: "Sæsonens sidste — præmier, gløgg og æbleskiver i klubhuset.", icon: "trophy" },
];

function ActivitiesHub({ onNavigate }) {
  return (
    <section className="section">
      <div className="container">
        <div style={{marginBottom:40}}>
          <span className="eyebrow" style={{color:"var(--accent)"}}>Aktiviteter</span>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:500,fontSize:56,letterSpacing:"-0.02em",margin:"8px 0 12px",fontVariationSettings:'"opsz" 144'}}>Præmieskydninger</h1>
          <p style={{fontSize:18,color:"var(--fg2)",maxWidth:"56ch",margin:0,lineHeight:1.5}}>
            Gennem året afholder vi seks faste præmieskydninger. Alle er åbne for medlemmer — og gæster er velkomne på udvalgte dage.
          </p>
        </div>
        <div className="grid-3">
          {PRIZES.map(p => (
            <a key={p.id} className="tile" onClick={() => onNavigate("premie-detail")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="icon-wrap"><Icon name={p.icon} size={22}/></div>
                <span className="badge">{p.when}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="arrow">Se reglement →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrizeDetail({ onBack }) {
  return (
    <section className="section">
      <div className="container">
        <a className="btn ghost" onClick={onBack} style={{paddingLeft:0,marginBottom:16}}>← Tilbage til Præmieskydninger</a>
        <article className="article">
          <div className="meta">PRÆMIESKYDNING · GÆLDER FRA FEB 2026</div>
          <h1>Fastelavnsskydning</h1>
          <div className="hero-img">FOTO · FASTELAVNSSKYDNING</div>
          <p>Fastelavnsskydningen er årets første præmieskydning i HOJ, og den samler både faste flugtskytter og dem der bare kigger forbi til en hyggelig formiddag i klubhuset.</p>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:600,margin:"28px 0 12px"}}>Sådan foregår det</h3>
          <p>Kortsalg starter kl. 09.00 i klubhuset, hvor der også er rundstykker. Sidste kortsalg er kl. 11.30. Fra kl. 12.30 er banen åben for alle med almindelig træning.</p>
          <details className="results" open>
            <summary>Reglement og præmier</summary>
            <table><tbody>
              <tr><td>1.</td><td>25 duer, seriegevær</td><td style={{textAlign:"right"}}>—</td></tr>
              <tr><td>2.</td><td>Serie á 5 på bag-, højre-, venstre-, spidsdue og skrå</td><td style={{textAlign:"right"}}>—</td></tr>
              <tr><td>3.</td><td>Præmier til top 3 i M/V og A/SV</td><td style={{textAlign:"right"}}>—</td></tr>
            </tbody></table>
          </details>
          <p>Der sælges øl, vand og kaffe. Tag gerne børnene med — der er fastelavnsboller.</p>
        </article>
      </div>
    </section>
  );
}

window.ActivitiesHub = ActivitiesHub;
window.PrizeDetail = PrizeDetail;
