import { useState } from "react";

const D = {
  bg:"#F8F7F3",surface:"#FFFFFF",s2:"#F2F1ED",s3:"#E7E6E1",
  bdr:"rgba(14,13,11,0.08)",bdrH:"rgba(14,13,11,0.16)",
  navy:"#1B2D4F",navyH:"#243D6B",navyL:"#EDF2FA",
  navyDim:"rgba(27,45,79,0.07)",
  navyGrd:"linear-gradient(140deg,#2A4A82 0%,#1B2D4F 55%,#111D33 100%)",
  gold:"#9A6F2F",goldL:"#FAF4EA",
  txt:"#0E0D0B",muted:"#57534A",dim:"#9B978F",
  green:"#166534",greenL:"#ECFDF5",
  red:"#9B1C1C",redL:"#FEF2F2",
  orange:"#92400E",orangeL:"#FFFBEB",
  e1:"0 1px 2px rgba(14,13,11,0.04),0 0 1px rgba(14,13,11,0.02)",
  e2:"0 2px 8px rgba(14,13,11,0.06),0 1px 2px rgba(14,13,11,0.03)",
  e3:"0 4px 16px rgba(14,13,11,0.08),0 2px 4px rgba(14,13,11,0.04)",
  e4:"0 8px 32px rgba(14,13,11,0.11),0 3px 8px rgba(14,13,11,0.05)",
  e5:"0 16px 48px rgba(14,13,11,0.14),0 6px 14px rgba(14,13,11,0.06)",
};
const FT="'Lora','Georgia',serif";
const FB="'DM Sans',system-ui,sans-serif";

const IcoBriefcase=({size=36,color=D.navy})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/></svg>);
const IcoScales=({size=36,color=D.navy})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><path d="m3 9 3-3-3-3M21 9l-3-3 3-3"/></svg>);
const IcoHouse=({size=36,color=D.navy})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IcoPeople=({size=36,color=D.navy})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M2 21v-1a6 6 0 0 1 6-6h.5M22 21v-1a6 6 0 0 0-6-6h-.5"/></svg>);
const IcoGavel=({size=28,color=D.dim})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 12.5-8 8a2.119 2.119 0 0 1-3-3l8-8M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"/></svg>);
const IcoArrow=({size=16,color="#fff"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const IcoChevron=({size=14,color=D.dim,dir="right"})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:dir==="left"?"rotate(180deg)":"none",flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>);

const Btn=({children,onClick,variant="primary",size="md",icon})=>{
  const [hov,setHov]=useState(false);
  const base={fontFamily:FB,fontWeight:600,borderRadius:10,cursor:"pointer",transition:"all .2s ease",display:"inline-flex",alignItems:"center",gap:8,letterSpacing:0.2,whiteSpace:"nowrap"};
  const vars={
    primary:{background:hov?"linear-gradient(140deg,#334E8A 0%,#243D6B 55%,#162540 100%)":D.navyGrd,color:"#fff",border:"none",boxShadow:hov?D.e4:D.e2},
    outline:{background:hov?D.navyDim:"transparent",color:D.navy,border:`1px solid ${D.navy}55`,boxShadow:"none"},
    ghost:{background:hov?"rgba(255,255,255,0.12)":"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",boxShadow:"none"},
  };
  const sizes={sm:{padding:"7px 14px",fontSize:12},md:{padding:"10px 20px",fontSize:14},lg:{padding:"13px 26px",fontSize:15}};
  return(<button onClick={onClick} style={{...base,...vars[variant],...sizes[size]}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>{children}{icon}</button>);
};

const Badge=({children,color="navy"})=>{
  const c={navy:{bg:D.navyL,txt:D.navy},gold:{bg:D.goldL,txt:D.gold},green:{bg:D.greenL,txt:D.green},gray:{bg:D.s2,txt:D.muted},orange:{bg:D.orangeL,txt:D.orange}}[color]||{bg:D.navyL,txt:D.navy};
  return(<span style={{display:"inline-block",padding:"3px 10px",borderRadius:100,background:c.bg,color:c.txt,fontSize:11,fontFamily:FB,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase"}}>{children}</span>);
};

const SituationCard=({number,icon,title,desc,onClick,accent})=>{
  const [hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:D.surface,border:`1px solid ${hov?D.bdrH:D.bdr}`,borderRadius:16,padding:"32px 28px",cursor:"pointer",boxShadow:hov?D.e4:D.e2,transform:hov?"translateY(-4px)":"translateY(0)",transition:"all .25s ease",display:"flex",flexDirection:"column",gap:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent||D.navy,opacity:hov?1:0,transition:"opacity .25s ease"}}/>
      <div style={{fontFamily:FB,fontSize:11,fontWeight:800,color:D.dim,letterSpacing:1,textAlign:"right"}}>{number}</div>
      <div style={{width:56,height:56,borderRadius:14,background:hov?D.navyDim:D.navyL,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .25s"}}>{icon}</div>
      <div>
        <div style={{fontFamily:FT,fontSize:20,fontWeight:700,color:D.txt,marginBottom:8,lineHeight:1.3}}>{title}</div>
        <p style={{fontFamily:FB,fontSize:13,color:D.muted,margin:0,lineHeight:1.6}}>{desc}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:FB,fontSize:13,fontWeight:700,color:hov?D.navyH:D.navy,marginTop:"auto",paddingTop:8,transition:"color .2s"}}>
        Commencer <IcoArrow size={14} color={hov?D.navyH:D.navy}/>
      </div>
    </div>
  );
};

const ToolCard=({title,desc,onClick})=>{
  const [hov,setHov]=useState(false);
  return(<div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:D.surface,border:`1px solid ${hov?D.bdrH:D.bdr}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",boxShadow:hov?D.e3:D.e1,transform:hov?"translateY(-2px)":"translateY(0)",transition:"all .2s ease"}}><div style={{fontFamily:FB,fontSize:14,fontWeight:700,color:D.txt,marginBottom:4}}>{title}</div><div style={{fontFamily:FB,fontSize:12,color:D.muted,lineHeight:1.5}}>{desc}</div></div>);
};

const ResourceCard=({cat,title,desc,onClick})=>{
  const [hov,setHov]=useState(false);
  return(<div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:D.surface,border:`1px solid ${hov?D.bdrH:D.bdr}`,borderLeft:`3px solid ${D.navy}`,borderRadius:12,padding:"24px",cursor:"pointer",boxShadow:hov?D.e3:D.e1,transition:"all .2s ease"}}><Badge color="navy">{cat}</Badge><div style={{fontFamily:FT,fontSize:18,fontWeight:700,color:D.txt,margin:"12px 0 8px"}}>{title}</div><p style={{fontFamily:FB,fontSize:13,color:D.muted,margin:0,lineHeight:1.6}}>{desc}</p></div>);
};

const SITUATIONS=[
  {id:"perte_emploi",number:"01",icon:<IcoBriefcase size={28} color={D.navy}/>,title:"Perte d'emploi",desc:"Préavis, indemnités, délais ONEM, droits et documents à rassembler.",accent:"#1B2D4F"},
  {id:"heritage",number:"02",icon:<IcoScales size={28} color={D.navy}/>,title:"Héritage",desc:"Droits de succession, délais de déclaration, checklist notariale par région.",accent:"#2A6049"},
  {id:"achat_immo",number:"03",icon:<IcoHouse size={28} color={D.navy}/>,title:"Achat immobilier",desc:"Frais totaux, conditions régionales 2026, documents et étapes du dossier.",accent:"#92400E"},
  {id:"separation",number:"04",icon:<IcoPeople size={28} color={D.navy}/>,title:"Séparation",desc:"Frais d'enfant, garde, logement familial, succession et démarches légales.",accent:"#6B21A8"},
];
const OUTILS=[
  {id:"preavis",title:"Simulateur de préavis",desc:"Barème SPF Emploi post/pré-2014."},
  {id:"immo",title:"Achat immobilier",desc:"Frais par région, conditions 2026."},
  {id:"succession",title:"Droits de succession",desc:"Calcul par région et parenté."},
  {id:"routier",title:"Infractions routières",desc:"Perception immédiate SPF Mobilité."},
  {id:"indexation",title:"Indexation loyer",desc:"Indice Santé Statbel 2024-2026."},
  {id:"fraisjustice",title:"Frais de justice",desc:"IP indexée mars 2025."},
  {id:"pension",title:"Frais d'enfant",desc:"Méthode Renard, indicatif."},
  {id:"checklists",title:"Dossiers notariaux",desc:"Checklists adaptables."},
  {id:"juridometre",title:"Diagnostic de vigilance",desc:"Profil de risque juridique."},
];
const RESSOURCES=[
  {id:"jurisprudence",cat:"Décisions",title:"Jurisprudence",desc:"Juportal, Lex.be, BelgiqueLex, Cour constitutionnelle, CJUE, CEDH."},
  {id:"doctrine",cat:"Doctrine",title:"Doctrine & Recherche",desc:"Strada lex, Jura, Jurisquare, bibliothèque structurée par matière."},
  {id:"legislation",cat:"Textes",title:"Législation",desc:"Justel, Moniteur belge, EUR-Lex, Wallex, Gallilex, DroitBelge.net."},
];
const TOOL_PAGES=["preavis","immo","succession","routier","indexation","fraisjustice","pension","checklists","juridometre","jurisprudence","doctrine","legislation","guide"];

const HomePage=({setPg})=>(
  <div>
    <section style={{background:D.bg,padding:"96px 0 80px"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>
        <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}><Badge color="navy">Belgique</Badge><Badge color="green">Gratuit</Badge><Badge color="gold">Français</Badge></div>
        <h1 style={{fontFamily:FT,fontSize:"clamp(40px,5vw,64px)",fontWeight:700,color:D.txt,margin:"0 0 20px",lineHeight:1.1,letterSpacing:-1}}>Vos droits.<br/><span style={{color:D.navy}}>En clair.</span></h1>
        <p style={{fontFamily:FB,fontSize:17,color:D.muted,maxWidth:520,margin:"0 0 40px",lineHeight:1.7}}>La première plateforme belge qui explique le droit en langage humain, calcule vos délais et vous guide selon votre situation de vie.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn size="lg" icon={<IcoArrow size={16} color="#fff"/>} onClick={()=>document.getElementById("situations")?.scrollIntoView({behavior:"smooth"})}>Ma situation</Btn>
          <Btn variant="outline" size="lg" onClick={()=>document.getElementById("outils")?.scrollIntoView({behavior:"smooth"})}>Outils pratiques</Btn>
        </div>
      </div>
    </section>
    <section id="situations" style={{background:D.surface,padding:"80px 0"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:40}}>
          <p style={{fontFamily:FB,fontSize:11,fontWeight:800,color:D.dim,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 12px"}}>POINT DE DÉPART</p>
          <h2 style={{fontFamily:FT,fontSize:32,fontWeight:700,color:D.txt,margin:"0 0 10px"}}>Quelle est votre situation ?</h2>
          <p style={{fontFamily:FB,fontSize:14,color:D.muted,margin:0}}>Choisissez ce qui vous concerne. La plateforme regroupe automatiquement tout ce dont vous avez besoin.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>
          {SITUATIONS.map(s=><SituationCard key={s.id} {...s} onClick={()=>setPg(s.id)}/>)}
        </div>
      </div>
    </section>
    <section id="outils" style={{background:D.bg,padding:"80px 0"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:32}}>
          <p style={{fontFamily:FB,fontSize:11,fontWeight:800,color:D.dim,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 12px"}}>CALCULATEURS</p>
          <h2 style={{fontFamily:FT,fontSize:28,fontWeight:700,color:D.txt,margin:0}}>Simulateurs & outils pratiques</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {OUTILS.map(o=><ToolCard key={o.id} {...o} onClick={()=>setPg(o.id)}/>)}
        </div>
      </div>
    </section>
    <section style={{background:D.surface,padding:"80px 0"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:32}}>
          <p style={{fontFamily:FB,fontSize:11,fontWeight:800,color:D.dim,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 12px"}}>DOCUMENTATION</p>
          <h2 style={{fontFamily:FT,fontSize:28,fontWeight:700,color:D.txt,margin:0}}>Sources juridiques officielles</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          {RESSOURCES.map(r=><ResourceCard key={r.id} {...r} onClick={()=>setPg(r.id)}/>)}
        </div>
      </div>
    </section>
    <section style={{background:D.navy,padding:"64px 32px",textAlign:"center"}}>
      <p style={{fontFamily:FT,fontSize:26,fontWeight:700,color:"#fff",margin:"0 0 10px"}}>Juratone Pro est gratuit. Pour tous.</p>
      <p style={{fontFamily:FB,fontSize:15,color:"rgba(255,255,255,0.55)",margin:"0 0 32px"}}>Aucun abonnement. Aucune publicité. Construit pour les citoyens belges.</p>
      <Btn variant="ghost" size="lg" icon={<IcoArrow size={16} color="#fff"/>} onClick={()=>document.getElementById("situations")?.scrollIntoView({behavior:"smooth"})}>Commencer maintenant</Btn>
    </section>
  </div>
);

const SituationPlaceholder=({title,desc,icon,setPg})=>(
  <div style={{maxWidth:900,margin:"0 auto",padding:"64px 32px"}}>
    <button onClick={()=>setPg("home")} style={{fontFamily:FB,fontSize:13,color:D.muted,background:"none",border:"none",cursor:"pointer",padding:"0 0 36px",display:"flex",alignItems:"center",gap:6}}><IcoChevron size={14} color={D.muted} dir="left"/> Accueil</button>
    <div style={{display:"flex",alignItems:"flex-start",gap:24,marginBottom:48}}>
      <div style={{width:72,height:72,borderRadius:18,background:D.navyL,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:D.e2}}>{icon}</div>
      <div><h1 style={{fontFamily:FT,fontSize:36,fontWeight:700,color:D.txt,margin:"0 0 8px"}}>{title}</h1><p style={{fontFamily:FB,fontSize:15,color:D.muted,margin:0,lineHeight:1.6}}>{desc}</p></div>
    </div>
    {["Vos droits essentiels","Vos délais légaux","Vos démarches","Vos documents"].map((mod,i)=>(
      <div key={i} style={{background:D.surface,border:`1px solid ${D.bdr}`,borderRadius:14,padding:"24px 28px",marginBottom:14,boxShadow:D.e1,display:"flex",alignItems:"center",gap:20}}>
        <div style={{width:40,height:40,borderRadius:10,background:D.s2,flexShrink:0}}/>
        <div style={{flex:1}}><div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:D.txt,marginBottom:8}}>{mod}</div><div style={{height:8,borderRadius:4,background:D.s3,width:`${55+i*12}%`}}/></div>
        <Badge color="gray">Bientôt</Badge>
      </div>
    ))}
    <div style={{marginTop:28,padding:"18px 22px",background:D.navyL,borderRadius:12,border:`1px solid ${D.navyDim}`,fontFamily:FB,fontSize:13,color:D.navy,lineHeight:1.6}}><strong>En cours de développement.</strong> Ce module sera disponible prochainement.</div>
  </div>
);

const GenericPlaceholder=({setPg})=>(
  <div style={{maxWidth:900,margin:"0 auto",padding:"64px 32px"}}>
    <button onClick={()=>setPg("home")} style={{fontFamily:FB,fontSize:13,color:D.muted,background:"none",border:"none",cursor:"pointer",padding:"0 0 36px",display:"flex",alignItems:"center",gap:6}}><IcoChevron size={14} color={D.muted} dir="left"/> Retour</button>
    <div style={{background:D.surface,border:`1px solid ${D.bdr}`,borderRadius:16,padding:"56px",textAlign:"center",boxShadow:D.e2}}>
      <IcoGavel size={32} color={D.dim}/>
      <h2 style={{fontFamily:FT,fontSize:24,color:D.txt,margin:"20px 0 10px"}}>Module en cours de migration</h2>
      <p style={{fontFamily:FB,fontSize:14,color:D.muted,margin:"0 0 28px",lineHeight:1.6}}>Les outils existants seront intégrés ici avec la nouvelle interface.</p>
      <Btn onClick={()=>setPg("home")}>Retour à l'accueil</Btn>
    </div>
  </div>
);

const Header=({setPg})=>{
  const links=[
    {label:"Ma situation",action:()=>{setPg("home");setTimeout(()=>document.getElementById("situations")?.scrollIntoView({behavior:"smooth"}),60);}},
    {label:"Outils",action:()=>{setPg("home");setTimeout(()=>document.getElementById("outils")?.scrollIntoView({behavior:"smooth"}),60);}},
    {label:"Ressources",action:()=>setPg("jurisprudence")},
    {label:"Guide",action:()=>setPg("guide")},
  ];
  return(
    <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(248,247,243,0.94)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${D.bdr}`,boxShadow:D.e1}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>setPg("home")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <div style={{width:36,height:36,borderRadius:9,background:D.navyGrd,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:D.e2}}>
            <span style={{fontFamily:FT,fontSize:14,fontWeight:700,color:"#fff",letterSpacing:-0.5}}>JT</span>
          </div>
          <div>
            <div style={{fontFamily:FT,fontSize:16,fontWeight:700,color:D.txt,letterSpacing:-0.3,lineHeight:1.1}}>Juratone</div>
            <div style={{fontFamily:FB,fontSize:8,color:D.dim,letterSpacing:2,textTransform:"uppercase"}}>Pro · Belgique</div>
          </div>
        </div>
        <nav style={{display:"flex",gap:2}}>
          {links.map((n,i)=>(
            <button key={i} onClick={n.action} style={{fontFamily:FB,fontSize:13,fontWeight:500,color:D.muted,background:"none",border:"none",cursor:"pointer",padding:"6px 12px",borderRadius:8,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.color=D.navy;e.currentTarget.style.background=D.navyDim;}}
              onMouseLeave={e=>{e.currentTarget.style.color=D.muted;e.currentTarget.style.background="none";}}>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

const Footer=()=>(
  <footer style={{background:D.s2,borderTop:`1px solid ${D.bdr}`,padding:"28px 32px"}}>
    <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <span style={{fontFamily:FB,fontSize:10,color:D.dim,letterSpacing:1,textTransform:"uppercase"}}>Juratone Pro v2.0 — Belgique</span>
      <span style={{fontFamily:FB,fontSize:10,color:D.dim,maxWidth:480,textAlign:"right",lineHeight:1.6}}>Simulation indicative. Ne constitue pas un avis juridique. Consultez un professionnel du droit.</span>
    </div>
  </footer>
);

export default function JuratonePro(){
  const [pg,setPg]=useState("home");
  return(
    <div style={{fontFamily:FB,background:D.bg,color:D.txt,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet"/>
      <style dangerouslySetInnerHTML={{__html:`*{box-sizing:border-box;}body{margin:0;background:${D.bg};}::selection{background:${D.navyL};color:${D.navy};}`}}/>
      <Header setPg={setPg}/>
      <main>
        {pg==="home"&&<HomePage setPg={setPg}/>}
        {pg==="perte_emploi"&&<SituationPlaceholder title="Perte d'emploi" desc="Vos droits, délais et démarches après la perte de votre emploi en Belgique." icon={<IcoBriefcase size={32} color={D.navy}/>} setPg={setPg}/>}
        {pg==="heritage"&&<SituationPlaceholder title="Héritage" desc="Succession, droits régionaux, délais de déclaration et checklist notariale." icon={<IcoScales size={32} color={D.navy}/>} setPg={setPg}/>}
        {pg==="achat_immo"&&<SituationPlaceholder title="Achat immobilier" desc="Frais totaux, conditions 2026 par région, étapes du dossier notarial." icon={<IcoHouse size={32} color={D.navy}/>} setPg={setPg}/>}
        {pg==="separation"&&<SituationPlaceholder title="Séparation" desc="Frais d'enfant, garde alternée, logement familial et démarches légales." icon={<IcoPeople size={32} color={D.navy}/>} setPg={setPg}/>}
        {TOOL_PAGES.includes(pg)&&<GenericPlaceholder setPg={setPg}/>}
      </main>
      <Footer/>
    </div>
  );
}
