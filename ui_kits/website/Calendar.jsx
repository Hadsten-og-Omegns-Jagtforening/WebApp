const EVENTS_MAY = [
  { d: 6,  t: "17:00–20:00", title: "Træningsaften", tag: "Flugtskydning", kind: "train" },
  { d: 13, t: "17:00–20:00", title: "Træningsaften", tag: "Flugtskydning", kind: "train" },
  { d: 16, t: "05:00",       title: "Bukkejagt — premiere", tag: "Jagt", kind: "hunt" },
  { d: 20, t: "19:00",       title: "Klubaften · foredrag", tag: "Klubhus", kind: "club" },
  { d: 24, t: "09:00–12:00", title: "HOJ Cup — runde 2", tag: "Præmie", kind: "prize" },
  { d: 27, t: "17:00–20:00", title: "Træningsaften", tag: "Flugtskydning", kind: "train" },
];
const KIND_DOT = { train: "var(--hoj-brass-600)", hunt: "var(--hoj-forest-700)", club: "var(--hoj-loam-500)", prize: "var(--hoj-clay-600)" };

function Calendar() {
  return (
    <section className="section">
      <div className="container">
        <div style={{marginBottom:32}}>
          <span className="eyebrow" style={{color:"var(--accent)"}}>Praktisk info</span>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:500,fontSize:56,letterSpacing:"-0.02em",margin:"8px 0 12px",fontVariationSettings:'"opsz" 144'}}>Kalender</h1>
          <p style={{fontSize:18,color:"var(--fg2)",maxWidth:"56ch",margin:0}}>
            Skydetider, jagtdatoer og klubaftener. Synkroniseret med foreningens offentlige Google Calendar.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:32}}>
          <div style={{background:"var(--surface-raised)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"18px 22px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:22,margin:0}}>Maj 2026</h3>
              <div style={{display:"flex",gap:6}}>
                <button className="btn secondary sm">I dag</button>
                <button className="btn secondary sm" style={{padding:"8px 12px"}}>←</button>
                <button className="btn secondary sm" style={{padding:"8px 12px"}}>→</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"var(--border)",gap:1}}>
              {["Man","Tir","Ons","Tor","Fre","Lør","Søn"].map(d => (
                <div key={d} style={{background:"var(--bg-alt)",padding:"10px 12px",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--fg3)"}}>{d}</div>
              ))}
              {Array.from({length: 35}, (_, i) => {
                const d = i - 2;
                const inMonth = d >= 1 && d <= 31;
                const num = inMonth ? d : (d < 1 ? 28 + d : d - 31);
                const events = EVENTS_MAY.filter(e => e.d === d);
                return (
                  <div key={i} style={{background:"var(--surface-raised)",minHeight:90,padding:"8px 10px",display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:13,color: inMonth ? "var(--fg1)" : "var(--fg3)",fontWeight: d === 14 ? 700 : 400}}>
                      {num}
                    </div>
                    {events.map((e,j) => (
                      <div key={j} style={{fontSize:11,lineHeight:1.3,padding:"3px 6px",borderRadius:3,background:"var(--bg-alt)",color:"var(--fg1)",display:"flex",alignItems:"center",gap:5}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:KIND_DOT[e.kind],flexShrink:0}}/>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <aside>
            <h3 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:20,margin:"0 0 16px"}}>Kommende aktiviteter</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {EVENTS_MAY.map((e,i) => (
                <div key={i} style={{background:"var(--surface-raised)",border:"1px solid var(--border)",borderRadius:6,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{textAlign:"center",flexShrink:0,minWidth:40}}>
                    <div style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:24,lineHeight:1,color:"var(--fg1)"}}>{e.d}</div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--fg3)",marginTop:2}}>MAJ</div>
                  </div>
                  <div style={{flex:1,borderLeft:"1px solid var(--border)",paddingLeft:14}}>
                    <div style={{fontSize:15,fontWeight:600,color:"var(--fg1)",marginBottom:2}}>{e.title}</div>
                    <div style={{fontSize:13,color:"var(--fg3)",fontFamily:"var(--font-mono)"}}>{e.t}</div>
                    <div style={{marginTop:6}}><span className="badge" style={{padding:"3px 8px",fontSize:11}}>{e.tag}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
window.Calendar = Calendar;
