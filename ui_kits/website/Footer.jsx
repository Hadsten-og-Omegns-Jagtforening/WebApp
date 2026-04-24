function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div>
            <img src="../../assets/logo-hoj.png" alt="Hadsten & Omegns Jagtforening" style={{width: 96, height: 96, marginBottom: 18, display: "block"}}/>
            <p style={{fontSize: 14, lineHeight: 1.5, color: "rgba(244,239,228,0.72)", margin: 0, maxWidth: "32ch"}}>
              Lokal jagt- og skydeforening i Hadsten siden 1968. Vi er for både erfarne jægere og nye på banen.
            </p>
          </div>
          <div>
            <h4>Kom forbi</h4>
            <ul>
              <li>Vissingvej 6</li>
              <li>8370 Hadsten</li>
              <li style={{marginTop: 10}}><a onClick={() => onNavigate("find")}>Find os på kortet →</a></li>
            </ul>
          </div>
          <div>
            <h4>Genveje</h4>
            <ul>
              <li><a onClick={() => onNavigate("book")}>Book skydebanen</a></li>
              <li><a onClick={() => onNavigate("kalender")}>Kalender</a></li>
              <li><a onClick={() => onNavigate("medlem")}>Bliv medlem</a></li>
              <li><a onClick={() => onNavigate("premie")}>Præmieskydninger</a></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a onClick={() => onNavigate("bestyrelsen")}>Bestyrelsen</a></li>
              <li><a>info@hadstenjagtforening.dk</a></li>
              <li><a>Få svar — Zendesk</a></li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© Hadsten &amp; Omegns Jagtforening · CVR 34123268</span>
          <span>Stiftet 1968</span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
