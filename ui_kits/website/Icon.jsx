// Small Lucide-style icon set used across the kit.
function Icon({ name, size = 22, stroke = 1.75, className = "" }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round", className,
  };
  switch (name) {
    case "crosshair": return (
      <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>
        <line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="22" x2="12" y2="18"/></svg>);
    case "calendar": return (
      <svg {...common}><rect x="3" y="5" width="18" height="16" rx="1.5"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>);
    case "claypigeon": return (
      <svg {...common}><ellipse cx="12" cy="12" rx="9" ry="3.2"/>
        <path d="M3 12 C 5 9, 19 9, 21 12"/></svg>);
    case "shotshell": return (
      <svg {...common}><rect x="7" y="3" width="10" height="11" rx="1.5"/>
        <rect x="7" y="14" width="10" height="7" rx="1"/>
        <line x1="7" y1="17" x2="17" y2="17"/></svg>);
    case "map-pin": return (
      <svg {...common}><path d="M12 21s-7-5-7-11a7 7 0 0 1 14 0c0 6-7 11-7 11Z"/>
        <circle cx="12" cy="10" r="2.5"/></svg>);
    case "users": return (
      <svg {...common}><circle cx="9" cy="8" r="3.5"/>
        <path d="M2 21c0-4 3-6 7-6s7 2 7 6"/>
        <circle cx="17" cy="6" r="2.5"/><path d="M22 17c0-3-2-5-5-5"/></svg>);
    case "trophy": return (
      <svg {...common}><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/>
        <path d="M4 4h2v2a2 2 0 0 1-2 2V4Zm16 0h-2v2a2 2 0 0 0 2 2V4Z"/>
        <path d="M12 14v4m-3 2h6"/></svg>);
    case "ticket": return (
      <svg {...common}><path d="M3 7h18v4a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4V7Z"/>
        <path d="M9 7v10"/></svg>);
    case "tree-pine": return (
      <svg {...common}><path d="M12 3 L7 9 h3 v4 h-4 l6 6 6-6 h-4 v-4 h3 Z"/></svg>);
    case "mail": return (
      <svg {...common}><rect x="3" y="5" width="18" height="14" rx="1.5"/>
        <path d="M3 7 L12 13 L21 7"/></svg>);
    case "phone": return (
      <svg {...common}><path d="M5 4h3l2 5-2 1a10 10 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>);
    case "arrow-right": return (
      <svg {...common}><line x1="4" y1="12" x2="20" y2="12"/>
        <polyline points="14 6 20 12 14 18"/></svg>);
    case "chevron-down": return (
      <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>);
    case "chevron-right": return (
      <svg {...common}><polyline points="9 6 15 12 9 18"/></svg>);
    case "check": return (
      <svg {...common}><polyline points="5 12 10 17 19 8"/></svg>);
    case "clock": return (
      <svg {...common}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>);
    case "menu": return (
      <svg {...common}><line x1="4" y1="7" x2="20" y2="7"/>
        <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>);
    default: return null;
  }
}

window.Icon = Icon;
