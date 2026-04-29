function Booking({ onDone }) {
  const [day, setDay] = useState(22);
  const [time, setTime] = useState("17:00");
  const [group, setGroup] = useState("Privat gruppe");
  const [size, setSize] = useState(4);
  const [submitted, setSubmitted] = useState(false);

  const days = Array.from({length: 35}, (_, i) => i - 2);
  const hasBooking = new Set([5, 8, 12, 16, 19, 22, 26]);

  if (submitted) {
    return (
      <section className="section">
        <div className="container" style={{maxWidth: 680}}>
          <div style={{background:"var(--surface-raised)",border:"1px solid var(--border)",borderRadius:8,padding:"48px 40px",textAlign:"center"}}>
            <div style={{width:56,height:56,background:"rgba(94,115,71,0.15)",color:"#5E7347",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
              <Icon name="check" size={28}/>
            </div>
            <h2 style={{fontFamily:"var(--font-display)",fontWeight:500,fontSize:36,margin:"0 0 12px",letterSpacing:"-0.01em"}}>Booking modtaget</h2>
            <p style={{fontSize:17,color:"var(--fg2)",maxWidth:"42ch",margin:"0 auto 24px"}}>
              Tak! Vi sender en bekræftelse på mail inden for 24 timer. Har du spørgsmål, ring til banen på 21 88 12 34.
            </p>
            <div style={{display:"inline-flex",gap:12,flexWrap:"wrap",justifyContent:"center",fontFamily:"var(--font-mono)",fontSize:13,color:"var(--fg3)"}}>
              <span>maj {day} · {time}</span><span>·</span>
              <span>{group}</span><span>·</span>
              <span>{size} pers.</span>
            </div>
            <div style={{marginTop:32}}><a className="btn primary" onClick={onDone}>Tilbage til forsiden</a></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{maxWidth: 980}}>
        <div style={{marginBottom:40}}>
          <span className="eyebrow" style={{color:"var(--accent)"}}>Book skydebanen</span>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:500,fontSize:56,letterSpacing:"-0.02em",margin:"8px 0 16px",fontVariationSettings:'"opsz" 144'}}>Reservér banen</h1>
          <p style={{fontSize:19,color:"var(--fg2)",maxWidth:"56ch",margin:0,lineHeight:1.5}}>
            Flugtskydning i Hadsten for private grupper, firmaer og polterabender. Vi har udstyr klar — du møder bare op.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:32}}>
          <div style={{background:"var(--surface-raised)",border:"1px solid var(--border)",borderRadius:8,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:20,margin:0}}>Vælg dato — maj 2026</h3>
              <div style={{display:"flex",gap:4}}>
                <button className="btn secondary sm" style={{padding:"6px 10px"}}>←</button>
                <button className="btn secondary sm" style={{padding:"6px 10px"}}>→</button>
              </div>
            </div>
            <div className="daygrid">
              {["M","T","O","T","F","L","S"].map((d, i) => <div key={`dow-${i}`} className="dow">{d}</div>)}
              {days.map((d, i) => {
                const isOff = d < 1 || d > 31;
                const n = isOff ? (d < 1 ? 30 + d : d - 31) : d;
                const has = hasBooking.has(d);
                return (
                  <div key={`d-${i}`}
                    className={`day${isOff ? " off" : ""}${has ? " has" : ""}${day === d ? " selected" : ""}${d === 14 ? " today" : ""}`}
                    onClick={() => !isOff && setDay(d)}>{n}</div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:14,fontSize:12,color:"var(--fg3)",marginTop:14,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)"}}/>Andre bookinger</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:10,height:10,borderRadius:2,border:"1px solid var(--accent)"}}/>I dag</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:10,height:10,borderRadius:2,background:"var(--hoj-forest-800)"}}/>Valgt</span>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div className="field">
              <label>Tidsrum</label>
              <select value={time} onChange={e => setTime(e.target.value)}>
                <option>16:00 – 18:00</option>
                <option>17:00 – 19:00</option>
                <option>18:00 – 20:00</option>
                <option>19:00 – 21:00</option>
              </select>
            </div>
            <div className="field">
              <label>Hvem er I?</label>
              <select value={group} onChange={e => setGroup(e.target.value)}>
                <option>Privat gruppe</option>
                <option>Firmaarrangement</option>
                <option>Polterabend</option>
                <option>Nybegyndere — instruktør bedes</option>
              </select>
            </div>
            <div className="field">
              <label>Antal deltagere</label>
              <input type="number" min="1" max="20" value={size} onChange={e => setSize(+e.target.value)}/>
            </div>
            <div className="field">
              <label>Kontaktperson — telefon</label>
              <input placeholder="+45 12 34 56 78"/>
            </div>
            <button className="btn primary lg" onClick={() => setSubmitted(true)} style={{marginTop:4}}>
              Send booking-anmodning
            </button>
            <p style={{fontSize:13,color:"var(--fg3)",margin:0,lineHeight:1.5}}>
              Du modtager en bekræftelse på mail. Betaling sker på stedet eller via MobilePay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Booking = Booking;
