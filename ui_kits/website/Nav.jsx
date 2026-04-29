function Nav({ current, onNavigate }) {
  const items = [
    { id: "home",     label: "Forside" },
    { id: "activities", label: "Aktiviteter", children: [
      { id: "jagt",     label: "Jagt",                      meta: "Bukkejagt · Hjort · Efterårsjagt" },
      { id: "jagtprove",label: "Hjælp til jagtprøven",      meta: "Dumpet? Vi hjælper dig videre" },
      { id: "premie",   label: "Præmieskydninger",          meta: "HOJ Cup · Fastelavn · Skt. Hans · Jul" },
    ]},
    { id: "praktisk", label: "Praktisk info", children: [
      { id: "kalender", label: "Kalender" },
      { id: "tider",    label: "Åbningstider og skydetider" },
      { id: "book",     label: "Lej skydebanen" },
      { id: "bestyrelsen", label: "Bestyrelsen" },
    ]},
    { id: "omhoj",    label: "Om HOJ", children: [
      { id: "medlem",   label: "Bliv medlem" },
      { id: "find",     label: "Find os" },
      { id: "arkiv",    label: "Arkiv" },
    ]},
  ];

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="logo" onClick={() => onNavigate("home")}>
          <img src="../../assets/logo-hoj.png" alt="Hadsten & Omegns Jagtforening"/>
          <div className="words">
            <span className="mark">Hadsten &amp; Omegns</span>
            <span className="sub">Jagtforening · stiftet 1968</span>
          </div>
        </a>
        <ul>
          {items.map(it => (
            <li key={it.id} className={it.children ? "dropdown" : ""}>
              <a className={current === it.id ? "active" : ""}
                 onClick={() => onNavigate(it.children ? it.children[0].id : it.id)}>
                {it.label}{it.children && <span className="caret">▾</span>}
              </a>
              {it.children && (
                <div className="dropdown-menu">
                  {it.children.map(c => (
                    <a key={c.id} onClick={(e) => { e.stopPropagation(); onNavigate(c.id); }}>
                      <div>{c.label}</div>
                      {c.meta && <div className="meta">{c.meta}</div>}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <a className="btn primary sm nav-cta" onClick={() => onNavigate("book")}>
          <Icon name="crosshair" size={16}/>Book skydebanen
        </a>
      </div>
    </header>
  );
}
window.Nav = Nav;
