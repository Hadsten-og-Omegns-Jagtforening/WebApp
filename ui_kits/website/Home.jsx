const { useState } = React;

function Hero({ onNavigate }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="../../assets/placeholder-hero.svg" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      </div>
      <div className="hero-shade"/>
      <div className="hero-status"><span className="dot"/>Banen åben · ons 17–20</div>
      <div className="container hero-inner">
        <div className="hero-badge">Siden 1968 · Hadsten</div>
        <h1>Kom med<br/>på banen.</h1>
        <p className="lede">Flugtskydning, jagt og fællesskab i hjertet af Østjylland. Book banen, tilmeld dig et arrangement, eller kig forbi klubhuset onsdag aften.</p>
        <div className="hero-ctas">
          <a className="btn primary lg" onClick={() => onNavigate("book")}>
            <Icon name="crosshair" size={18}/>Book skydebanen
          </a>
          <a className="btn secondary lg" style={{color:"#F4EFE4",borderColor:"rgba(244,239,228,0.4)"}}
             onClick={() => onNavigate("kalender")}>
            Se kalender
          </a>
        </div>
      </div>
    </section>
  );
}

function Tile({ icon, title, desc, onClick, cta }) {
  return (
    <a className="tile" onClick={onClick}>
      <div className="icon-wrap"><Icon name={icon} size={22}/></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="arrow">{cta} →</span>
    </a>
  );
}

function QuickNav({ onNavigate }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Kom hurtigt i gang</span>
            <h2>Det, folk oftest leder efter</h2>
          </div>
        </div>
        <div className="grid-3">
          <Tile icon="crosshair" title="Book skydebanen"
            desc="Privat, firma eller polterabend. Udstyr står klar — bare at komme."
            onClick={() => onNavigate("book")} cta="Book nu"/>
          <Tile icon="calendar" title="Kalender"
            desc="Skydetider, jagtdatoer og klubaftener — opdateret løbende."
            onClick={() => onNavigate("kalender")} cta="Se kalenderen"/>
          <Tile icon="ticket" title="Bliv medlem"
            desc="Adgang til egne jagtrevirer, træning og rabat ved arrangementer."
            onClick={() => onNavigate("medlem")} cta="Indmeldelse"/>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.Tile = Tile;
window.QuickNav = QuickNav;
