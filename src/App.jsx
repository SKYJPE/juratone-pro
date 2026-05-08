import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   BLOC 1 — THÈME & STYLES GLOBAUX
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:          "#F8F7F3",
  surface:     "#FFFFFF",
  s2:          "#F2F1ED",
  s3:          "#E7E6E1",
  border:      "rgba(14,13,11,0.08)",
  borderHover: "rgba(14,13,11,0.16)",
  navy:        "#1B2D4F",
  navyHover:   "#243D6B",
  navyLight:   "#EDF2FA",
  navyDim:     "rgba(27,45,79,0.07)",
  navyGrd:     "linear-gradient(140deg,#2A4A82 0%,#1B2D4F 55%,#111D33 100%)",
  gold:        "#9A6F2F",
  goldLight:   "#FAF4EA",
  text:        "#0E0D0B",
  muted:       "#57534A",
  dim:         "#9B978F",
  green:       "#166534",
  greenLight:  "#ECFDF5",
  orange:      "#92400E",
  orangeLight: "#FFFBEB",
  sh1: "0 1px 2px rgba(14,13,11,0.04),0 0 1px rgba(14,13,11,0.02)",
  sh2: "0 2px 8px rgba(14,13,11,0.06),0 1px 2px rgba(14,13,11,0.03)",
  sh3: "0 4px 16px rgba(14,13,11,0.08),0 2px 4px rgba(14,13,11,0.04)",
  sh4: "0 8px 32px rgba(14,13,11,0.11),0 3px 8px rgba(14,13,11,0.05)",
  sh5: "0 16px 48px rgba(14,13,11,0.14),0 6px 14px rgba(14,13,11,0.06)",
};
const SERIF = "'Lora','Georgia',serif";
const SANS  = "'DM Sans',system-ui,sans-serif";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: ${T.bg}; }
  ::selection { background: ${T.navyLight}; color: ${T.navy}; }

  .card-sit {
    background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 16px;
    padding: 32px 28px; cursor: pointer; box-shadow: ${T.sh2}; transform: translateY(0);
    transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
    display: flex; flex-direction: column; gap: 16px;
    position: relative; overflow: hidden;
    text-align: left; width: 100%; appearance: none; -webkit-appearance: none; font-family: inherit;
  }
  .card-sit:hover { border-color: ${T.borderHover}; box-shadow: ${T.sh4}; transform: translateY(-4px); }
  .card-sit .accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; opacity: 0; transition: opacity .25s; }
  .card-sit:hover .accent { opacity: 1; }
  .card-sit .ico-wrap { width: 56px; height: 56px; border-radius: 14px; background: ${T.navyLight}; display: flex; align-items: center; justify-content: center; transition: background .25s; flex-shrink: 0; }
  .card-sit:hover .ico-wrap { background: ${T.navyDim}; }
  .card-sit .cta { display: flex; align-items: center; gap: 6px; font-family: ${SANS}; font-size: 13px; font-weight: 700; color: ${T.navy}; margin-top: auto; padding-top: 8px; transition: color .2s; }
  .card-sit:hover .cta { color: ${T.navyHover}; }

  .card-tool {
    background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 12px;
    padding: 18px 20px; cursor: pointer; box-shadow: ${T.sh1}; transform: translateY(0);
    transition: box-shadow .2s, transform .2s, border-color .2s;
    text-align: left; width: 100%; appearance: none; -webkit-appearance: none; font-family: inherit;
  }
  .card-tool:hover { border-color: ${T.borderHover}; box-shadow: ${T.sh3}; transform: translateY(-2px); }

  .card-res {
    background: ${T.surface}; border: 1px solid ${T.border}; border-left: 3px solid ${T.navy};
    border-radius: 12px; padding: 24px; cursor: pointer; box-shadow: ${T.sh1};
    transition: box-shadow .2s, border-color .2s;
    text-align: left; width: 100%; appearance: none; -webkit-appearance: none; font-family: inherit;
  }
  .card-res:hover { border-top-color: ${T.borderHover}; border-right-color: ${T.borderHover}; border-bottom-color: ${T.borderHover}; box-shadow: ${T.sh3}; }

  .btn { display: inline-flex; align-items: center; gap: 8px; font-family: ${SANS}; font-weight: 600; border-radius: 10px; cursor: pointer; transition: box-shadow .2s, background .2s; letter-spacing: .2px; white-space: nowrap; }
  .btn-sm  { padding: 7px 14px;  font-size: 12px; }
  .btn-md  { padding: 10px 20px; font-size: 14px; }
  .btn-lg  { padding: 13px 26px; font-size: 15px; }
  .btn-primary { background: ${T.navyGrd}; color: #fff; border: none; box-shadow: ${T.sh2}; }
  .btn-primary:hover { background: linear-gradient(140deg,#334E8A 0%,#243D6B 55%,#162540 100%); box-shadow: ${T.sh4}; }
  .btn-outline { background: transparent; color: ${T.navy}; border: 1px solid ${T.navy}55; }
  .btn-outline:hover { background: ${T.navyDim}; }
  .btn-ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.25); }
  .btn-ghost:hover { background: rgba(255,255,255,.12); }

  .nav-link { font-family: ${SANS}; font-size: 13px; font-weight: 500; color: ${T.muted}; background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: color .15s, background .15s; }
  .nav-link:hover { color: ${T.navy}; background: ${T.navyDim}; }

  .btn-back { font-family: ${SANS}; font-size: 13px; color: ${T.muted}; background: none; border: none; cursor: pointer; padding: 0 0 36px; display: flex; align-items: center; gap: 6px; transition: color .15s; }
  .btn-back:hover { color: ${T.navy}; }
  .logo-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 10px; }
`;

/* ═══════════════════════════════════════════════════════════════
   BLOC 2 — ICÔNES SVG
   aria-hidden : décoration pure. IcoArrow/IcoChevron héritent
   la couleur du parent CSS via currentColor.
═══════════════════════════════════════════════════════════════ */
const IcoBriefcase = ({ size = 28, color = T.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/>
  </svg>
);
const IcoScales = ({ size = 28, color = T.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><path d="m3 9 3-3-3-3M21 9l-3-3 3-3"/>
  </svg>
);
const IcoHouse = ({ size = 28, color = T.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoPeople = ({ size = 28, color = T.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M2 21v-1a6 6 0 0 1 6-6h.5M22 21v-1a6 6 0 0 0-6-6h-.5"/>
  </svg>
);
const IcoGavel = ({ size = 28, color = T.dim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m14.5 12.5-8 8a2.119 2.119 0 0 1-3-3l8-8M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"/>
  </svg>
);
const IcoArrow = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IcoChevron = ({ size = 14, color = "currentColor", dir = "right" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: dir === "left" ? "rotate(180deg)" : "none", flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   BLOC 3 — COMPOSANTS UI PRIMITIFS
   Zéro useState. Hover 100% CSS.
═══════════════════════════════════════════════════════════════ */
const Btn = ({ children, onClick, variant = "primary", size = "md", icon }) => (
  <button onClick={onClick} className={`btn btn-${size} btn-${variant}`}>
    {children}{icon}
  </button>
);

const BADGE_COLORS = {
  navy:   { background: T.navyLight,   color: T.navy },
  gold:   { background: T.goldLight,   color: T.gold },
  green:  { background: T.greenLight,  color: T.green },
  gray:   { background: T.s2,          color: T.muted },
  orange: { background: T.orangeLight, color: T.orange },
};
const Badge = ({ children, color = "navy" }) => {
  const s = BADGE_COLORS[color] ?? BADGE_COLORS.navy;
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontFamily: SANS, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", background: s.background, color: s.color }}>
      {children}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOC 4 — DONNÉES & CONTENU
   Icônes stockées comme références de composant (pas de JSX).
   desc → card, fullDesc → page situation.
═══════════════════════════════════════════════════════════════ */
const SITUATIONS = [
  { id: "perte_emploi", number: "01", Icon: IcoBriefcase,
    title: "Perte d'emploi",
    desc: "Préavis, indemnités, délais ONEM, droits et documents à rassembler.",
    fullDesc: "Vos droits, délais et démarches après la perte de votre emploi en Belgique.",
    accent: "#1B2D4F" },
  { id: "heritage",     number: "02", Icon: IcoScales,
    title: "Héritage",
    desc: "Droits de succession, délais de déclaration, checklist notariale par région.",
    fullDesc: "Succession, droits régionaux, délais de déclaration et checklist notariale.",
    accent: "#2A6049" },
  { id: "achat_immo",   number: "03", Icon: IcoHouse,
    title: "Achat immobilier",
    desc: "Frais totaux, conditions régionales 2026, documents et étapes du dossier.",
    fullDesc: "Frais totaux, conditions 2026 par région, étapes du dossier notarial.",
    accent: "#92400E" },
  { id: "separation",   number: "04", Icon: IcoPeople,
    title: "Séparation",
    desc: "Frais d'enfant, garde, logement familial, succession et démarches légales.",
    fullDesc: "Frais d'enfant, garde alternée, logement familial et démarches légales.",
    accent: "#6B21A8" },
];

const OUTILS = [
  { id: "preavis",      title: "Simulateur de préavis",   desc: "Barème SPF Emploi post/pré-2014." },
  { id: "immo",         title: "Achat immobilier",        desc: "Frais par région, conditions 2026." },
  { id: "succession",   title: "Droits de succession",    desc: "Calcul par région et parenté." },
  { id: "routier",      title: "Infractions routières",   desc: "Perception immédiate SPF Mobilité." },
  { id: "indexation",   title: "Indexation loyer",        desc: "Indice Santé Statbel 2024-2026." },
  { id: "fraisjustice", title: "Frais de justice",        desc: "IP indexée mars 2025." },
  { id: "pension",      title: "Frais d'enfant",          desc: "Méthode Renard, indicatif." },
  { id: "checklists",   title: "Dossiers notariaux",      desc: "Checklists adaptables." },
  { id: "juridometre",  title: "Diagnostic de vigilance", desc: "Profil de risque juridique." },
];

const RESSOURCES = [
  { id: "jurisprudence", cat: "Décisions", title: "Jurisprudence",        desc: "Juportal, Lex.be, BelgiqueLex, Cour constitutionnelle, CJUE, CEDH." },
  { id: "doctrine",      cat: "Doctrine",  title: "Doctrine & Recherche", desc: "Strada lex, Jura, Jurisquare, bibliothèque structurée par matière." },
  { id: "legislation",   cat: "Textes",    title: "Législation",          desc: "Justel, Moniteur belge, EUR-Lex, Wallex, Gallilex, DroitBelge.net." },
];

const TOOL_PAGE_IDS  = new Set(["preavis","immo","succession","routier","indexation","fraisjustice","pension","checklists","juridometre","jurisprudence","doctrine","legislation","guide"]);
const SITUATION_MAP  = Object.fromEntries(SITUATIONS.map(s => [s.id, s]));

/* ═══════════════════════════════════════════════════════════════
   BLOC 5 — CARDS
   Tous en <button> : accessibles clavier + lecteur d'écran.
   Zéro useState : hover géré intégralement par CSS.
═══════════════════════════════════════════════════════════════ */
const SituationCard = ({ number, Icon, title, desc, onClick, accent }) => (
  <button onClick={onClick} className="card-sit">
    <div className="accent" style={{ background: accent || T.navy }} />
    <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, color: T.dim, letterSpacing: 1, textAlign: "right" }}>{number}</div>
    <div className="ico-wrap"><Icon size={28} color={T.navy} /></div>
    <div>
      <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>{title}</div>
      <p style={{ fontFamily: SANS, fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
    <div className="cta">Commencer <IcoArrow size={14} /></div>
  </button>
);

const ToolCard = ({ title, desc, onClick }) => (
  <button onClick={onClick} className="card-tool">
    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{title}</div>
    <div style={{ fontFamily: SANS, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{desc}</div>
  </button>
);

const ResourceCard = ({ cat, title, desc, onClick }) => (
  <button onClick={onClick} className="card-res">
    <Badge color="navy">{cat}</Badge>
    <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: T.text, margin: "12px 0 8px" }}>{title}</div>
    <p style={{ fontFamily: SANS, fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
  </button>
);

/* ═══════════════════════════════════════════════════════════════
   BLOC 6 — LAYOUT & UTILITAIRES
═══════════════════════════════════════════════════════════════ */
const goToSection = (setPage, id) => {
  setPage("home");
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
};

const BackButton = ({ setPage }) => (
  <button className="btn-back" onClick={() => setPage("home")}>
    <IcoChevron size={14} dir="left" /> Accueil
  </button>
);

const Section = ({ id, bg = T.surface, children }) => (
  <section id={id} style={{ background: bg, padding: "80px 0" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>{children}</div>
  </section>
);

const SectionHeader = ({ eyebrow, title, subtitle, mb = 40 }) => (
  <div style={{ marginBottom: mb }}>
    {eyebrow && <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, color: T.dim, letterSpacing: 2.5, textTransform: "uppercase", margin: "0 0 12px" }}>{eyebrow}</p>}
    <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: T.text, margin: "0 0 10px" }}>{title}</h2>
    {subtitle && <p style={{ fontFamily: SANS, fontSize: 14, color: T.muted, margin: 0 }}>{subtitle}</p>}
  </div>
);

const Header = ({ setPage }) => (
  <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(248,247,243,0.94)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${T.border}`, boxShadow: T.sh1 }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button className="logo-btn" onClick={() => setPage("home")} aria-label="Juratone Pro — Accueil">
        <div style={{ width: 36, height: 36, borderRadius: 9, background: T.navyGrd, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: T.sh2 }}>
          <span style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>JT</span>
        </div>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: -0.3, lineHeight: 1.1 }}>Juratone</div>
          <div style={{ fontFamily: SANS, fontSize: 8, color: T.dim, letterSpacing: 2, textTransform: "uppercase" }}>Pro · Belgique</div>
        </div>
      </button>
      <nav style={{ display: "flex", gap: 2 }} aria-label="Navigation principale">
        <button className="nav-link" onClick={() => goToSection(setPage, "situations")}>Ma situation</button>
        <button className="nav-link" onClick={() => goToSection(setPage, "outils")}>Outils</button>
        <button className="nav-link" onClick={() => setPage("jurisprudence")}>Ressources</button>
        <button className="nav-link" onClick={() => setPage("guide")}>Guide</button>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer style={{ background: T.s2, borderTop: `1px solid ${T.border}`, padding: "28px 32px" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: SANS, fontSize: 10, color: T.dim, letterSpacing: 1, textTransform: "uppercase" }}>Juratone Pro v2.0 — Belgique</span>
      <span style={{ fontFamily: SANS, fontSize: 10, color: T.dim, maxWidth: 480, textAlign: "right", lineHeight: 1.6 }}>Simulation indicative. Ne constitue pas un avis juridique. Consultez un professionnel du droit.</span>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════
   BLOC 7 — PAGES
═══════════════════════════════════════════════════════════════ */
const HomePage = ({ setPage }) => (
  <div>
    <section style={{ background: T.bg, padding: "96px 0 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          <Badge color="navy">Belgique</Badge>
          <Badge color="green">Gratuit</Badge>
          <Badge color="gold">Français</Badge>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5vw,64px)", fontWeight: 700, color: T.text, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: -1 }}>
          Vos droits.<br /><span style={{ color: T.navy }}>En clair.</span>
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 17, color: T.muted, maxWidth: 520, margin: "0 0 40px", lineHeight: 1.7 }}>
          La première plateforme belge qui explique le droit en langage humain, calcule vos délais et vous guide selon votre situation de vie.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn size="lg" icon={<IcoArrow size={16} color="#fff" />} onClick={() => goToSection(setPage, "situations")}>Ma situation</Btn>
          <Btn variant="outline" size="lg" onClick={() => goToSection(setPage, "outils")}>Outils pratiques</Btn>
        </div>
      </div>
    </section>

    <Section id="situations" bg={T.surface}>
      <SectionHeader
        eyebrow="POINT DE DÉPART"
        title="Quelle est votre situation ?"
        subtitle="Choisissez ce qui vous concerne. La plateforme regroupe automatiquement tout ce dont vous avez besoin."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
        {SITUATIONS.map(s => <SituationCard key={s.id} {...s} onClick={() => setPage(s.id)} />)}
      </div>
    </Section>

    <Section id="outils" bg={T.bg}>
      <SectionHeader eyebrow="CALCULATEURS" title="Simulateurs & outils pratiques" mb={32} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {OUTILS.map(o => <ToolCard key={o.id} {...o} onClick={() => setPage(o.id)} />)}
      </div>
    </Section>

    <Section bg={T.surface}>
      <SectionHeader eyebrow="DOCUMENTATION" title="Sources juridiques officielles" mb={32} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {RESSOURCES.map(r => <ResourceCard key={r.id} {...r} onClick={() => setPage(r.id)} />)}
      </div>
    </Section>

    <section style={{ background: T.navy, padding: "64px 32px", textAlign: "center" }}>
      <p style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Juratone Pro est gratuit. Pour tous.</p>
      <p style={{ fontFamily: SANS, fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>Aucun abonnement. Aucune publicité. Construit pour les citoyens belges.</p>
      <Btn variant="ghost" size="lg" icon={<IcoArrow size={16} color="#fff" />} onClick={() => goToSection(setPage, "situations")}>Commencer maintenant</Btn>
    </section>
  </div>
);

const MODULE_STUBS = ["Vos droits essentiels", "Vos délais légaux", "Vos démarches", "Vos documents"];

const SituationPage = ({ title, fullDesc, Icon, setPage }) => (
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px" }}>
    <BackButton setPage={setPage} />
    <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 48 }}>
      <div style={{ width: 72, height: 72, borderRadius: 18, background: T.navyLight, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: T.sh2 }}>
        <Icon size={32} color={T.navy} />
      </div>
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{title}</h1>
        <p style={{ fontFamily: SANS, fontSize: 15, color: T.muted, margin: 0, lineHeight: 1.6 }}>{fullDesc}</p>
      </div>
    </div>
    {MODULE_STUBS.map((label, i) => (
      <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "24px 28px", marginBottom: 14, boxShadow: T.sh1, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.s2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>{label}</div>
          <div style={{ height: 8, borderRadius: 4, background: T.s3, width: `${55 + i * 12}%` }} />
        </div>
        <Badge color="gray">Bientôt</Badge>
      </div>
    ))}
    <div style={{ marginTop: 28, padding: "18px 22px", background: T.navyLight, borderRadius: 12, border: `1px solid ${T.navyDim}`, fontFamily: SANS, fontSize: 13, color: T.navy, lineHeight: 1.6 }}>
      <strong>En cours de développement.</strong> Ce module sera disponible prochainement.
    </div>
  </div>
);

const GenericPage = ({ setPage }) => (
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px" }}>
    <BackButton setPage={setPage} />
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "56px", textAlign: "center", boxShadow: T.sh2 }}>
      <IcoGavel size={32} color={T.dim} />
      <h2 style={{ fontFamily: SERIF, fontSize: 24, color: T.text, margin: "20px 0 10px" }}>Module en cours de migration</h2>
      <p style={{ fontFamily: SANS, fontSize: 14, color: T.muted, margin: "0 0 28px", lineHeight: 1.6 }}>Les outils existants seront intégrés ici avec la nouvelle interface.</p>
      <Btn onClick={() => setPage("home")}>Retour à l'accueil</Btn>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   BLOC 8 — APP ROOT
   1 seul useState. Routing par map lookup O(1).
═══════════════════════════════════════════════════════════════ */
export default function JuratonePro() {
  const [page, setPage] = useState("home");
  const situation = SITUATION_MAP[page];

  return (
    <div style={{ fontFamily: SANS, background: T.bg, color: T.text, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Header setPage={setPage} />
      <main>
        {page === "home"                        && <HomePage      setPage={setPage} />}
        {situation                              && <SituationPage {...situation} setPage={setPage} />}
        {!situation && TOOL_PAGE_IDS.has(page)  && <GenericPage   setPage={setPage} />}
      </main>
      <Footer />
    </div>
  );

/* ═══════════════════════════════════════════════════════════════
   MONOLITHE 2 — CODE JUDICIAIRE
   Coller après le Monolithe 1. T, SERIF, SANS doivent être définis.

   Workflow données :
   · Ce monolithe contient un placeholder CODE_JUDICIAIRE.
   · Quand le Monolithe Données sera prêt, supprimer la const
     CODE_JUDICIAIRE ci-dessous et coller le Monolithe Données.
     LIVRE_MAP et ALL_ARTICLES se recalculent automatiquement.
═══════════════════════════════════════════════════════════════ */

/* ── BLOC 1 — Styles locaux (namespaced .cj-*) ── */
const LEG_CSS = `
  .cj-search-wrap { position: relative; margin-bottom: 28px; }
  .cj-search-ico  { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: ${T.dim}; pointer-events: none; display: flex; }
  .cj-search-input {
    width: 100%; padding: 12px 44px; box-sizing: border-box;
    font-family: ${SANS}; font-size: 14px; color: ${T.text};
    background: ${T.surface}; border: 1.5px solid ${T.border}; border-radius: 12px;
    outline: none; box-shadow: ${T.sh1}; transition: border-color .15s, box-shadow .15s;
  }
  .cj-search-input:focus { border-color: ${T.navy}66; box-shadow: ${T.sh2}; }
  .cj-search-input::placeholder { color: ${T.dim}; }
  .cj-search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: ${T.dim}; font-size: 16px; line-height: 1; padding: 4px; transition: color .15s; }
  .cj-search-clear:hover { color: ${T.navy}; }

  .cj-livre {
    background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 14px;
    padding: 24px 20px; cursor: pointer; box-shadow: ${T.sh1};
    transition: box-shadow .2s, transform .2s, border-color .2s;
    text-align: left; appearance: none; -webkit-appearance: none; font-family: inherit; width: 100%;
  }
  .cj-livre:not(.empty):hover { border-color: ${T.borderHover}; box-shadow: ${T.sh3}; transform: translateY(-2px); }
  .cj-livre.empty { border-style: dashed; opacity: .5; cursor: not-allowed; }

  .cj-titre-btn {
    width: 100%; background: none; border: none; border-top: 1px solid ${T.border};
    padding: 15px 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px;
    font-family: ${SANS}; font-size: 13px; font-weight: 700; color: ${T.navy};
    text-align: left; transition: color .15s;
  }
  .cj-titre-btn:first-of-type { border-top: none; }
  .cj-titre-btn:hover { color: ${T.navyHover}; }

  .cj-chap-btn {
    width: 100%; background: ${T.bg}; border: 1px solid ${T.border}; border-radius: 8px;
    padding: 11px 14px; margin-bottom: 6px; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    font-family: ${SANS}; font-size: 13px; color: ${T.text}; text-align: left;
    transition: background .15s, border-color .15s; appearance: none; -webkit-appearance: none;
  }
  .cj-chap-btn:hover { background: ${T.navyLight}; border-color: ${T.navy}33; }

  .cj-art-btn {
    width: 100%; background: ${T.surface}; border: none; border-bottom: 1px solid ${T.border};
    padding: 16px 20px; cursor: pointer; display: flex; align-items: flex-start; gap: 16px;
    text-align: left; font-family: inherit; transition: background .15s; appearance: none; -webkit-appearance: none;
  }
  .cj-art-btn:first-child { border-radius: 12px 12px 0 0; }
  .cj-art-btn:last-child  { border-radius: 0 0 12px 12px; border-bottom: none; }
  .cj-art-btn:only-child  { border-radius: 12px; border-bottom: none; }
  .cj-art-btn:hover { background: ${T.navyLight}; }

  .cj-result-btn {
    width: 100%; background: ${T.surface}; border: none; border-bottom: 1px solid ${T.border};
    padding: 16px 20px; cursor: pointer; text-align: left; font-family: inherit;
    transition: background .15s; appearance: none; -webkit-appearance: none; display: block;
  }
  .cj-result-btn:first-child { border-top: 1px solid ${T.border}; border-radius: 12px 12px 0 0; }
  .cj-result-btn:last-child  { border-radius: 0 0 12px 12px; border-bottom: none; }
  .cj-result-btn:hover { background: ${T.navyLight}; }

  .cj-nav-btn {
    flex: 1; background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 10px;
    padding: 12px 16px; cursor: pointer; font-family: ${SANS}; font-size: 13px; color: ${T.muted};
    transition: border-color .15s, color .15s; appearance: none; -webkit-appearance: none;
  }
  .cj-nav-btn:hover:not(:disabled) { border-color: ${T.navy}55; color: ${T.navy}; }
  .cj-nav-btn:disabled { opacity: .3; cursor: default; }
`;

/* ── BLOC 2 — Données placeholder ──────────────────────────────
   ⚠️ Supprimer ce bloc quand le Monolithe Données est disponible.
─────────────────────────────────────────────────────────────── */
const CODE_JUDICIAIRE = {
  livres: [
    {
      id: "L1", numero: "Ier",
      titre: "Des principes généraux", details: "Art. 1 à 57",
      titres: [
        {
          id: "L1T1", titre: "TITRE Ier. — De l'action en justice",
          chapitres: [
            {
              id: "L1T1C1", titre: "CHAPITRE Ier. — De l'action",
              articles: [
                { numero: "17", texte: "L'action ne peut être admise si le demandeur n'a pas qualité et intérêt pour la former." },
                { numero: "18", texte: "L'intérêt doit être né et actuel. L'action peut cependant être admise dès à présent s'il est certain que la naissance de l'intérêt ne peut être contestée et que celle-ci ne peut se réaliser qu'après l'expiration du délai prescrit par la loi." },
                { numero: "19", texte: "[Placeholder — texte officiel à importer via le Monolithe Données]" },
              ]
            },
            {
              id: "L1T1C2", titre: "CHAPITRE II. — De la demande en justice",
              articles: [
                { numero: "23", texte: "[Placeholder — texte officiel à importer]" },
                { numero: "24", texte: "[Placeholder — texte officiel à importer]" },
              ]
            }
          ]
        },
        {
          id: "L1T2", titre: "TITRE II. — Du principe de la contradiction",
          chapitres: [
            {
              id: "L1T2C1", titre: "CHAPITRE Ier. — De la communication",
              articles: [
                { numero: "27", texte: "[Placeholder — texte officiel à importer]" },
                { numero: "28", texte: "[Placeholder — texte officiel à importer]" },
              ]
            }
          ]
        }
      ]
    },
    { id: "L2", numero: "II",   titre: "De la compétence",                                         details: "Art. 58 à 569",    titres: [] },
    { id: "L3", numero: "III",  titre: "Des actes de procédure",                                   details: "Art. 570 à 867",   titres: [] },
    { id: "L4", numero: "IV",   titre: "Des voies de recours",                                     details: "Art. 868 à 1147",  titres: [] },
    { id: "L5", numero: "V",    titre: "De la liquidation",                                        details: "Art. 1148 à 1224", titres: [] },
    { id: "L6", numero: "VI",   titre: "Des saisies conservatoires et voies d'exécution",          details: "Art. 1225 à 1675", titres: [] },
    { id: "L7", numero: "VII",  titre: "De l'arbitrage",                                           details: "Art. 1676 à 1723", titres: [] },
    { id: "L8", numero: "VIII", titre: "De la médiation",                                          details: "Art. 1724 à 1737", titres: [] },
  ]
};

/* ── BLOC 3 — Index calculés (recalculés automatiquement si CODE_JUDICIAIRE change) ── */
const LIVRE_MAP = Object.fromEntries(CODE_JUDICIAIRE.livres.map(l => [l.id, l]));

const ALL_ARTICLES = (() => {
  const out = [];
  for (const livre of CODE_JUDICIAIRE.livres)
    for (const titre of livre.titres)
      for (const chap of titre.chapitres)
        for (const art of chap.articles)
          out.push({ ...art, livreId: livre.id, livreNumero: livre.numero, livreTitre: livre.titre, titreId: titre.id, chapitreId: chap.id, chapitreTitre: chap.titre });
  return out;
})();

function findChapitre(livreId, chapitreId) {
  const livre = LIVRE_MAP[livreId];
  if (!livre) return null;
  for (const titre of livre.titres) {
    const chap = titre.chapitres.find(c => c.id === chapitreId);
    if (chap) return { chap, titre };
  }
  return null;
}

/* ── BLOC 4 — Icônes locales ── */
const IcoBook    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoMagnify = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoDown    = ({ open }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>;
const IcoRight   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>;

/* ── BLOC 5 — Sous-composants ── */
const CjBreadcrumb = ({ items }) => (
  <nav aria-label="Fil d'Ariane" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px 0", marginBottom: 24 }}>
    {items.map((item, i) => (
      <span key={i} style={{ display: "flex", alignItems: "center" }}>
        {i > 0 && <span style={{ color: T.dim, fontSize: 13, padding: "0 6px" }}>›</span>}
        {item.onClick
          ? <button onClick={item.onClick} style={{ fontFamily: SANS, fontSize: 12, color: T.navy, background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 4, textDecoration: "underline", textDecorationColor: T.navy + "44" }}>{item.label}</button>
          : <span style={{ fontFamily: SANS, fontSize: 12, color: T.muted, padding: "2px 4px" }}>{item.label}</span>
        }
      </span>
    ))}
  </nav>
);

const CjSearchBar = ({ value, onChange, onClear }) => (
  <div className="cj-search-wrap">
    <span className="cj-search-ico"><IcoMagnify /></span>
    <input className="cj-search-input" type="text" placeholder="Rechercher un article, un mot-clé…" value={value} onChange={e => onChange(e.target.value)} aria-label="Recherche dans le Code judiciaire" />
    {value && <button className="cj-search-clear" onClick={onClear} aria-label="Effacer">✕</button>}
  </div>
);

const CjLivresGrid = ({ onSelect }) => (
  <div>
    <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, color: T.dim, letterSpacing: 2.5, textTransform: "uppercase", margin: "0 0 16px" }}>8 LIVRES</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
      {CODE_JUDICIAIRE.livres.map(livre => {
        const hasData = livre.titres.length > 0;
        return (
          <button key={livre.id} className={`cj-livre${hasData ? "" : " empty"}`} onClick={() => hasData && onSelect(livre.id)} disabled={!hasData}>
            <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: T.navy, lineHeight: 1, marginBottom: 10 }}>{livre.numero}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6, lineHeight: 1.35 }}>{livre.titre}</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: T.dim }}>{livre.details}</div>
            {!hasData && <div style={{ marginTop: 10, display: "inline-block", padding: "2px 8px", borderRadius: 100, background: T.s2, fontFamily: SANS, fontSize: 10, fontWeight: 700, color: T.dim, letterSpacing: 0.5 }}>À importer</div>}
          </button>
        );
      })}
    </div>
  </div>
);

const CjLivreView = ({ livre, openTitres, onToggleTitre, onSelectChapitre }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "4px 24px 20px", boxShadow: T.sh1 }}>
    {livre.titres.map(titre => {
      const isOpen = openTitres.has(titre.id);
      const total  = titre.chapitres.reduce((n, c) => n + c.articles.length, 0);
      return (
        <div key={titre.id}>
          <button className="cj-titre-btn" onClick={() => onToggleTitre(titre.id)} aria-expanded={isOpen}>
            <span style={{ flex: 1 }}>{titre.titre}</span>
            <span style={{ fontFamily: SANS, fontSize: 11, color: T.dim, flexShrink: 0, marginRight: 8 }}>{total} art.</span>
            <IcoDown open={isOpen} />
          </button>
          {isOpen && (
            <div style={{ paddingBottom: 12 }}>
              {titre.chapitres.map(chap => (
                <button key={chap.id} className="cj-chap-btn" onClick={() => onSelectChapitre(chap.id)}>
                  <span style={{ fontWeight: 600 }}>{chap.titre}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: T.dim, fontSize: 12, flexShrink: 0 }}>
                    {chap.articles.length} art. <IcoRight />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const CjChapitreView = ({ chap, onSelectArticle }) => (
  <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.sh1 }}>
    {chap.articles.map(art => (
      <button key={art.numero} className="cj-art-btn" onClick={() => onSelectArticle(art.numero)}>
        <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: T.navy, flexShrink: 0, minWidth: 44, lineHeight: 1.2 }}>{art.numero}</span>
        <span style={{ fontFamily: SANS, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
          {art.texte.length > 120 ? art.texte.slice(0, 120) + "…" : art.texte}
        </span>
        <span style={{ color: T.dim, flexShrink: 0, marginLeft: "auto" }}><IcoRight /></span>
      </button>
    ))}
  </div>
);

const CjArticleView = ({ article, prevArt, nextArt, onNav }) => (
  <div>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "32px 36px", boxShadow: T.sh2 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 800, color: T.dim, letterSpacing: 2, textTransform: "uppercase" }}>Article</span>
        <span style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: T.navy, lineHeight: 1 }}>{article.numero}</span>
      </div>
      <p style={{ fontFamily: SERIF, fontSize: 17, color: T.text, lineHeight: 1.9, margin: 0 }}>{article.texte}</p>
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
      <button className="cj-nav-btn" style={{ textAlign: "left" }} onClick={() => prevArt && onNav(prevArt.numero)} disabled={!prevArt}>
        {prevArt
          ? <><div style={{ fontFamily: SANS, fontSize: 10, color: T.dim, marginBottom: 3 }}>← Précédent</div><div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: T.navy }}>Art. {prevArt.numero}</div></>
          : <span style={{ fontFamily: SANS, fontSize: 13 }}>—</span>}
      </button>
      <button className="cj-nav-btn" style={{ textAlign: "right" }} onClick={() => nextArt && onNav(nextArt.numero)} disabled={!nextArt}>
        {nextArt
          ? <><div style={{ fontFamily: SANS, fontSize: 10, color: T.dim, marginBottom: 3 }}>Suivant →</div><div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: T.navy }}>Art. {nextArt.numero}</div></>
          : <span style={{ fontFamily: SANS, fontSize: 13 }}>—</span>}
      </button>
    </div>
  </div>
);

const CjSearchResults = ({ results, query, onSelect }) => (
  <div>
    <p style={{ fontFamily: SANS, fontSize: 13, color: T.muted, margin: "0 0 16px" }}>
      {results.length === 0 ? `Aucun résultat pour « ${query} »` : `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`}
    </p>
    {results.length > 0 && (
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.sh1 }}>
        {results.map(art => (
          <button key={`${art.chapitreId}-${art.numero}`} className="cj-result-btn" onClick={() => onSelect(art)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: T.navy }}>Art. {art.numero}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, color: T.dim, letterSpacing: 0.3 }}>
                Livre {art.livreNumero} · {art.chapitreTitre.replace(/CHAPITRE [IVX]+\. — /, "")}
              </span>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}>
              {art.texte.length > 160 ? art.texte.slice(0, 160) + "…" : art.texte}
            </p>
          </button>
        ))}
      </div>
    )}
  </div>
);

/* ── BLOC 6 — Composant principal ── */
const LegislationPage = ({ setPage }) => {
  const [navLivreId,    setNavLivreId]    = useState(null);
  const [navChapitreId, setNavChapitreId] = useState(null);
  const [navArticleNo,  setNavArticleNo]  = useState(null);
  const [openTitres,    setOpenTitres]    = useState(new Set());
  const [search,        setSearch]        = useState("");

  const goLivres   = () => { setNavLivreId(null); setNavChapitreId(null); setNavArticleNo(null); };
  const goLivre    = (id) => {
    setNavLivreId(id); setNavChapitreId(null); setNavArticleNo(null);
    const first = LIVRE_MAP[id]?.titres[0];
    if (first) setOpenTitres(new Set([first.id]));
  };
  const goChapitre = (id) => { setNavChapitreId(id); setNavArticleNo(null); };
  const goArticle  = (no) => setNavArticleNo(no);
  const toggleTitre = (id) => setOpenTitres(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete
        (id) : next.add(id);
    return next;
  });

  const currentLivre    = navLivreId    ? LIVRE_MAP[navLivreId] : null;
  const currentChapitre = navChapitreId ? findChapitre(navLivreId, navChapitreId) : null;
  const currentArticle  = navArticleNo && currentChapitre
    ? currentChapitre.chap.articles.find(a => a.numero === navArticleNo) : null;

  const artIdx  = currentChapitre && navArticleNo
    ? currentChapitre.chap.articles.findIndex(a => a.numero === navArticleNo) : -1;
  const prevArt = artIdx > 0 ? currentChapitre.chap.articles[artIdx - 1] : null;
  const nextArt = artIdx >= 0 && artIdx < currentChapitre?.chap.articles.length - 1
    ? currentChapitre.chap.articles[artIdx + 1] : null;

  const searchResults = (() => {
    if (search.trim().length < 2) return [];
    const q = search.toLowerCase();
    return ALL_ARTICLES.filter(a =>
      a.numero.includes(q) || a.texte.toLowerCase().includes(q)
    ).slice(0, 40);
  })();

  const crumbs = [{ label: "Législation", onClick: goLivres }];
  if (currentLivre)    crumbs.push({ label: `Livre ${currentLivre.numero} — ${currentLivre.titre}`, onClick: (currentChapitre || currentArticle) ? () => goLivre(currentLivre.id) : null });
  if (currentChapitre) crumbs.push({ label: currentChapitre.chap.titre.replace(/CHAPITRE [IVX]+\. — /, ""), onClick: currentArticle ? () => goChapitre(currentChapitre.chap.id) : null });
  if (currentArticle)  crumbs.push({ label: `Article ${currentArticle.numero}` });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
      <style dangerouslySetInnerHTML={{ __html: LEG_CSS }} />

      <button className="btn-back" onClick={() => setPage("home")}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "rotate(180deg)", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
        Accueil
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0 28px" }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: T.navyGrd, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: T.sh2 }}>
          <IcoBook />
        </div>
        <div>
          <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: T.text, margin: "0 0 3px", lineHeight: 1.2 }}>Code judiciaire</h1>
          <p style={{ fontFamily: SANS, fontSize: 12, color: T.muted, margin: 0 }}>Loi du 10 octobre 1967 · Belgique</p>
        </div>
      </div>

      <CjBreadcrumb items={crumbs} />
      <CjSearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />

      {search.trim().length >= 2 ? (
        <CjSearchResults
          results={searchResults}
          query={search}
          onSelect={art => { setSearch(""); setNavLivreId(art.livreId); setNavChapitreId(art.chapitreId); setNavArticleNo(art.numero); }}
        />
      ) : !currentLivre ? (
        <CjLivresGrid onSelect={goLivre} />
      ) : !currentChapitre ? (
        <>
          <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 20px" }}>
            Livre {currentLivre.numero} — {currentLivre.titre}
          </h2>
          <CjLivreView livre={currentLivre} openTitres={openTitres} onToggleTitre={toggleTitre} onSelectChapitre={goChapitre} />
        </>
      ) : !currentArticle ? (
        <>
          <h2 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: T.text, margin: "0 0 20px", lineHeight: 1.4 }}>
            {currentChapitre.chap.titre}
          </h2>
          <CjChapitreView chap={currentChapitre.chap} onSelectArticle={goArticle} />
        </>
      ) : (
        <CjArticleView article={currentArticle} prevArt={prevArt} nextArt={nextArt} onNav={goArticle} />
      )}
    </div>
  );
};
