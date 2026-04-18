import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════
   JURATONE PRO — Outil juridique belge complet
   FR ↔ NL · Glossaire · Traduction IA
   Jurisprudence · Doctrine · Législation
   ══════════════════════════════════════════════ */

// ─── Theme ───
const T = {
  bg: "#0B0D12", surface: "#12151D", s2: "#181C27", s3: "#1F2433",
  bdr: "#262C3D", bdrH: "#3A4260",
  gold: "#C49B4F", goldDim: "rgba(196,155,79,0.10)", goldTxt: "#DFCB96",
  txt: "#E4E2DC", muted: "#878A96", dim: "#505360",
  fr: "#5A8FD4", nl: "#D97B42",
  green: "#4EA86A", red: "#D45050", cyan: "#4AC2C9",
};

// ═══════════════════════════════════════
//  MODULE SÉCURITÉ — Protection complète
// ═══════════════════════════════════════

const SEC = {
  MAX_INPUT_LEN: 500,        // Max caractères champs texte
  MAX_TRANSLATE_LEN: 5000,   // Max caractères traduction
  MAX_TAGS: 10,              // Max tags par entrée
  MAX_TAG_LEN: 30,           // Max caractères par tag
  MAX_CUSTOM_ENTRIES: 200,   // Max entrées personnelles par section
  RATE_LIMIT_MS: 4000,       // 4 secondes entre chaque appel API
  MAX_URL_LEN: 500,          // Max caractères URL
  ALLOWED_PROTOCOLS: ["https:", "http:"],
};

// 1. Anti-XSS : Nettoie les entrées utilisateur (supprime HTML/scripts)
const sanitize = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "")                    // supprime < >
    .replace(/javascript\s*:/gi, "")         // bloque javascript:
    .replace(/on\w+\s*=/gi, "")              // bloque onclick=, onerror=, etc.
    .replace(/data\s*:/gi, "")               // bloque data: URIs
    .replace(/vbscript\s*:/gi, "")           // bloque vbscript:
    .replace(/expression\s*\(/gi, "")        // bloque CSS expression()
    .trim();
};

// 2. Validation d'URL : N'autorise que http(s)
const isValidUrl = (url) => {
  if (!url || url.trim() === "") return true; // URL optionnelle
  try {
    const parsed = new URL(url);
    return SEC.ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
};

// 3. Sanitize URL
const sanitizeUrl = (url) => {
  if (!url || url.trim() === "") return "";
  const cleaned = sanitize(url).slice(0, SEC.MAX_URL_LEN);
  return isValidUrl(cleaned) ? cleaned : "";
};

// 4. Rate limiter pour l'API
const createRateLimiter = (delayMs) => {
  let lastCall = 0;
  return {
    canCall: () => Date.now() - lastCall >= delayMs,
    remaining: () => Math.max(0, Math.ceil((delayMs - (Date.now() - lastCall)) / 1000)),
    call: () => { lastCall = Date.now(); },
  };
};

// 5. Validation de structure (données du stockage)
const validateStoredData = (data) => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item && typeof item === "object" && typeof item.id === "string")
    .slice(0, SEC.MAX_CUSTOM_ENTRIES)
    .map(item => ({
      id: sanitize(String(item.id || "")).slice(0, 20),
      title: sanitize(String(item.title || "")).slice(0, SEC.MAX_INPUT_LEN),
      desc: sanitize(String(item.desc || "")).slice(0, SEC.MAX_INPUT_LEN),
      url: sanitizeUrl(String(item.url || "")),
      cat: sanitize(String(item.cat || "")).slice(0, 50),
      tags: Array.isArray(item.tags)
        ? item.tags.filter(t => typeof t === "string").slice(0, SEC.MAX_TAGS).map(t => sanitize(t).slice(0, SEC.MAX_TAG_LEN))
        : [],
    }));
};

// 6. Validation favoris (données glossaire)
const validateFavorites = (data) => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item && typeof item.fr === "string" && typeof item.nl === "string")
    .slice(0, 300);
};

// ─── Legal Glossary ───
const GLOSSARY = [
  { fr:"contrat", nl:"contract / overeenkomst", d:"Civil", n:"Art. 1101 C.civ. — 'Overeenkomst' plus courant en droit belge." },
  { fr:"obligation", nl:"verbintenis", d:"Civil", n:"Au sens juridique, pas 'verplichting' (devoir moral)." },
  { fr:"créancier", nl:"schuldeiser", d:"Civil" },
  { fr:"débiteur", nl:"schuldenaar", d:"Civil" },
  { fr:"responsabilité civile", nl:"burgerlijke aansprakelijkheid", d:"Civil" },
  { fr:"dommages et intérêts", nl:"schadevergoeding", d:"Civil" },
  { fr:"prescription", nl:"verjaring", d:"Civil", n:"Extinctive = bevrijdende ; acquisitive = verkrijgende verjaring." },
  { fr:"mise en demeure", nl:"ingebrekestelling", d:"Civil" },
  { fr:"clause résolutoire", nl:"ontbindend beding", d:"Civil" },
  { fr:"vice caché", nl:"verborgen gebrek", d:"Civil" },
  { fr:"bonne foi", nl:"goede trouw", d:"Civil" },
  { fr:"abus de droit", nl:"rechtsmisbruik", d:"Civil" },
  { fr:"force majeure", nl:"overmacht", d:"Civil" },
  { fr:"caution", nl:"borg / borgstelling", d:"Civil" },
  { fr:"hypothèque", nl:"hypotheek", d:"Civil" },
  { fr:"usufruit", nl:"vruchtgebruik", d:"Civil" },
  { fr:"servitude", nl:"erfdienstbaarheid", d:"Civil" },
  { fr:"copropriété", nl:"mede-eigendom", d:"Civil" },
  { fr:"indivision", nl:"onverdeeldheid", d:"Civil" },
  { fr:"donation", nl:"schenking", d:"Civil" },
  { fr:"testament", nl:"testament", d:"Civil" },
  { fr:"succession", nl:"erfenis / nalatenschap", d:"Civil" },
  { fr:"héritier", nl:"erfgenaam", d:"Civil" },
  { fr:"légataire", nl:"legataris", d:"Civil" },
  { fr:"procuration", nl:"volmacht", d:"Civil" },
  { fr:"mandat", nl:"lastgeving", d:"Civil" },
  { fr:"enrichissement sans cause", nl:"ongerechtvaardigde verrijking", d:"Civil" },
  { fr:"stipulation pour autrui", nl:"beding ten behoeve van een derde", d:"Civil" },
  { fr:"subrogation", nl:"indeplaatsstelling / subrogatie", d:"Civil" },
  { fr:"novation", nl:"schuldvernieuwing", d:"Civil" },
  { fr:"compensation", nl:"schuldvergelijking", d:"Civil" },
  { fr:"infraction", nl:"misdrijf", d:"Pénal" },
  { fr:"contravention", nl:"overtreding", d:"Pénal" },
  { fr:"délit", nl:"wanbedrijf", d:"Pénal" },
  { fr:"crime", nl:"misdaad", d:"Pénal" },
  { fr:"peine", nl:"straf", d:"Pénal" },
  { fr:"amende", nl:"boete / geldboete", d:"Pénal" },
  { fr:"récidive", nl:"herhaling / recidive", d:"Pénal" },
  { fr:"prévenu", nl:"beklaagde", d:"Pénal" },
  { fr:"inculpé", nl:"inverdenkinggestelde", d:"Pénal", n:"Terme spécifique au droit belge (instruction)." },
  { fr:"acquittement", nl:"vrijspraak", d:"Pénal" },
  { fr:"condamnation", nl:"veroordeling", d:"Pénal" },
  { fr:"plainte", nl:"klacht", d:"Pénal" },
  { fr:"constitution de partie civile", nl:"burgerlijke partijstelling", d:"Pénal" },
  { fr:"mandat d'arrêt", nl:"aanhoudingsbevel", d:"Pénal" },
  { fr:"détention préventive", nl:"voorlopige hechtenis", d:"Pénal" },
  { fr:"sursis", nl:"uitstel", d:"Pénal" },
  { fr:"circonstance atténuante", nl:"verzachtende omstandigheid", d:"Pénal" },
  { fr:"non-lieu", nl:"buitenvervolgingstelling", d:"Pénal" },
  { fr:"casier judiciaire", nl:"strafregister", d:"Pénal" },
  { fr:"légitime défense", nl:"wettige verdediging / noodweer", d:"Pénal" },
  { fr:"tentative", nl:"poging", d:"Pénal" },
  { fr:"complicité", nl:"medeplichtigheid", d:"Pénal" },
  { fr:"tribunal", nl:"rechtbank", d:"Judiciaire" },
  { fr:"cour d'appel", nl:"hof van beroep", d:"Judiciaire" },
  { fr:"Cour de cassation", nl:"Hof van Cassatie", d:"Judiciaire" },
  { fr:"juge", nl:"rechter", d:"Judiciaire" },
  { fr:"avocat", nl:"advocaat", d:"Judiciaire" },
  { fr:"greffier", nl:"griffier", d:"Judiciaire" },
  { fr:"huissier de justice", nl:"gerechtsdeurwaarder", d:"Judiciaire" },
  { fr:"notaire", nl:"notaris", d:"Judiciaire" },
  { fr:"citation", nl:"dagvaarding", d:"Judiciaire" },
  { fr:"requête", nl:"verzoekschrift", d:"Judiciaire" },
  { fr:"conclusions", nl:"conclusies", d:"Judiciaire" },
  { fr:"jugement", nl:"vonnis", d:"Judiciaire" },
  { fr:"arrêt", nl:"arrest", d:"Judiciaire" },
  { fr:"appel", nl:"hoger beroep", d:"Judiciaire" },
  { fr:"pourvoi en cassation", nl:"cassatieberoep", d:"Judiciaire" },
  { fr:"compétence", nl:"bevoegdheid", d:"Judiciaire" },
  { fr:"juridiction", nl:"rechtsmacht", d:"Judiciaire" },
  { fr:"référé", nl:"kort geding", d:"Judiciaire" },
  { fr:"saisie", nl:"beslag", d:"Judiciaire" },
  { fr:"exécution forcée", nl:"gedwongen tenuitvoerlegging", d:"Judiciaire" },
  { fr:"dépens", nl:"gerechtskosten", d:"Judiciaire" },
  { fr:"chose jugée", nl:"gezag van gewijsde", d:"Judiciaire" },
  { fr:"délai", nl:"termijn", d:"Judiciaire" },
  { fr:"astreinte", nl:"dwangsom", d:"Judiciaire" },
  { fr:"tierce opposition", nl:"derdenverzet", d:"Judiciaire" },
  { fr:"société", nl:"vennootschap", d:"Commercial" },
  { fr:"société anonyme (SA)", nl:"naamloze vennootschap (NV)", d:"Commercial" },
  { fr:"société à responsabilité limitée (SRL)", nl:"besloten vennootschap (BV)", d:"Commercial", n:"Depuis le CSA 2019." },
  { fr:"administrateur", nl:"bestuurder", d:"Commercial" },
  { fr:"assemblée générale", nl:"algemene vergadering", d:"Commercial" },
  { fr:"faillite", nl:"faillissement", d:"Commercial" },
  { fr:"réorganisation judiciaire", nl:"gerechtelijke reorganisatie", d:"Commercial" },
  { fr:"créance", nl:"schuldvordering", d:"Commercial" },
  { fr:"curateur", nl:"curator", d:"Commercial" },
  { fr:"capital social", nl:"maatschappelijk kapitaal", d:"Commercial" },
  { fr:"apport", nl:"inbreng", d:"Commercial" },
  { fr:"action (titre)", nl:"aandeel", d:"Commercial" },
  { fr:"dividende", nl:"dividend", d:"Commercial" },
  { fr:"contrat de travail", nl:"arbeidsovereenkomst", d:"Travail" },
  { fr:"licenciement", nl:"ontslag", d:"Travail" },
  { fr:"préavis", nl:"opzegging / opzeggingstermijn", d:"Travail" },
  { fr:"indemnité de rupture", nl:"verbrekingsvergoeding", d:"Travail" },
  { fr:"convention collective (CCT)", nl:"collectieve arbeidsovereenkomst (CAO)", d:"Travail" },
  { fr:"conseil d'entreprise", nl:"ondernemingsraad", d:"Travail" },
  { fr:"règlement de travail", nl:"arbeidsreglement", d:"Travail" },
  { fr:"salaire", nl:"loon", d:"Travail" },
  { fr:"employeur", nl:"werkgever", d:"Travail" },
  { fr:"travailleur", nl:"werknemer", d:"Travail" },
  { fr:"acte administratif", nl:"bestuurshandeling", d:"Administratif" },
  { fr:"arrêté royal", nl:"koninklijk besluit", d:"Administratif" },
  { fr:"Conseil d'État", nl:"Raad van State", d:"Administratif" },
  { fr:"recours en annulation", nl:"annulatieberoep", d:"Administratif" },
  { fr:"marché public", nl:"overheidsopdracht", d:"Administratif" },
  { fr:"urbanisme", nl:"stedenbouw", d:"Administratif" },
  { fr:"permis d'urbanisme", nl:"omgevingsvergunning", d:"Administratif" },
  { fr:"fonctionnaire", nl:"ambtenaar", d:"Administratif" },
  { fr:"Constitution", nl:"Grondwet", d:"Constitutionnel" },
  { fr:"Cour constitutionnelle", nl:"Grondwettelijk Hof", d:"Constitutionnel" },
  { fr:"loi", nl:"wet", d:"Constitutionnel" },
  { fr:"décret", nl:"decreet", d:"Constitutionnel" },
  { fr:"ordonnance", nl:"ordonnantie", d:"Constitutionnel" },
  { fr:"Moniteur belge", nl:"Belgisch Staatsblad", d:"Constitutionnel" },
  { fr:"communauté", nl:"gemeenschap", d:"Constitutionnel" },
  { fr:"région", nl:"gewest", d:"Constitutionnel" },
  { fr:"impôt", nl:"belasting", d:"Fiscal" },
  { fr:"impôt des personnes physiques (IPP)", nl:"personenbelasting (PB)", d:"Fiscal" },
  { fr:"impôt des sociétés (ISOC)", nl:"vennootschapsbelasting (VenB)", d:"Fiscal" },
  { fr:"TVA", nl:"btw", d:"Fiscal" },
  { fr:"déclaration fiscale", nl:"belastingaangifte", d:"Fiscal" },
  { fr:"précompte immobilier", nl:"onroerende voorheffing", d:"Fiscal" },
  { fr:"précompte mobilier", nl:"roerende voorheffing", d:"Fiscal" },
  { fr:"contribuable", nl:"belastingplichtige", d:"Fiscal" },
  { fr:"mariage", nl:"huwelijk", d:"Famille" },
  { fr:"divorce", nl:"echtscheiding", d:"Famille" },
  { fr:"cohabitation légale", nl:"wettelijke samenwoning", d:"Famille" },
  { fr:"autorité parentale", nl:"ouderlijk gezag", d:"Famille" },
  { fr:"pension alimentaire", nl:"onderhoudsgeld / alimentatie", d:"Famille" },
  { fr:"adoption", nl:"adoptie", d:"Famille" },
  { fr:"filiation", nl:"afstamming", d:"Famille" },
  { fr:"tutelle", nl:"voogdij", d:"Famille" },
  { fr:"régime matrimonial", nl:"huwelijksvermogensstelsel", d:"Famille" },
  { fr:"tribunal de la famille", nl:"familierechtbank", d:"Famille" },
  { fr:"droit", nl:"recht", d:"Général" },
  { fr:"jurisprudence", nl:"rechtspraak", d:"Général" },
  { fr:"doctrine", nl:"rechtsleer", d:"Général" },
  { fr:"législation", nl:"wetgeving", d:"Général" },
  { fr:"article", nl:"artikel", d:"Général" },
  { fr:"alinéa", nl:"lid", d:"Général" },
  { fr:"disposition", nl:"bepaling", d:"Général" },
  { fr:"personne morale", nl:"rechtspersoon", d:"Général" },
  { fr:"personne physique", nl:"natuurlijk persoon", d:"Général" },
  { fr:"capacité juridique", nl:"rechtsbevoegdheid", d:"Général" },
];

const DOMAINS = [...new Set(GLOSSARY.map(e => e.d))].sort();

// ─── Jurisprudence Sources ───
const JURIS_DATA = [
  { id:"j1", title:"Juridat — Jurisprudence belge", desc:"Base de données officielle de la jurisprudence belge (Cour de cassation, cours d'appel, tribunaux).", url:"https://www.juridat.be", cat:"Base de données", tags:["cassation","appel","officiel"] },
  { id:"j2", title:"Juportal", desc:"Portail de recherche dans la jurisprudence des cours et tribunaux belges.", url:"https://juportal.be/moteur/formulaire", cat:"Base de données", tags:["recherche","tribunaux"] },
  { id:"j3", title:"Cour constitutionnelle", desc:"Arrêts de la Cour constitutionnelle belge (Grondwettelijk Hof).", url:"https://www.const-court.be", cat:"Cour", tags:["constitutionnel","arrêts"] },
  { id:"j4", title:"Conseil d'État — Arrêts", desc:"Jurisprudence du Conseil d'État / Raad van State.", url:"https://www.raadvst-consetat.be", cat:"Cour", tags:["administratif","annulation"] },
  { id:"j5", title:"CJUE — InfoCuria", desc:"Jurisprudence de la Cour de justice de l'Union européenne.", url:"https://curia.europa.eu/juris/recherche.jsf?language=fr", cat:"Européen", tags:["europe","CJUE","UE"] },
  { id:"j6", title:"CEDH — HUDOC", desc:"Base de données de la Cour européenne des droits de l'homme.", url:"https://hudoc.echr.coe.int", cat:"Européen", tags:["droits de l'homme","CEDH","Strasbourg"] },
  { id:"j7", title:"Jure.juridat.just.fgov.be", desc:"Recherche avancée dans la jurisprudence belge par mots-clés, date, juridiction.", url:"https://jure.juridat.just.fgov.be", cat:"Base de données", tags:["recherche avancée","belgique"] },
];

// ─── Doctrine Sources ───
const DOCTRINE_DATA = [
  { id:"d1", title:"Jura — Kluwer", desc:"Plateforme de doctrine et législation belge (accès payant, consultable en bibliothèque).", url:"https://jura.kluwer.be", cat:"Plateforme", tags:["kluwer","revues","payant"] },
  { id:"d2", title:"Stradalex", desc:"Base de données juridiques belge : doctrine, jurisprudence, législation.", url:"https://www.stradalex.com", cat:"Plateforme", tags:["doctrine","jurisprudence","belgique"] },
  { id:"d3", title:"Jurisquare", desc:"Bibliothèque numérique juridique belge — revues, livres, codes commentés.", url:"https://www.jurisquare.be", cat:"Plateforme", tags:["revues","livres","numérique"] },
  { id:"d4", title:"Journal des Tribunaux (J.T.)", desc:"Revue juridique belge de référence depuis 1882.", url:"https://jt.larcier.be", cat:"Revue", tags:["JT","larcier","revue"] },
  { id:"d5", title:"Revue de Droit Pénal et de Criminologie (RDPC)", desc:"Revue de référence en droit pénal belge.", url:"https://www.rdpc.be", cat:"Revue", tags:["pénal","criminologie"] },
  { id:"d6", title:"Tijdschrift voor Belgisch Burgerlijk Recht (TBBR)", desc:"Revue de droit civil belge (bilingue FR/NL).", url:"", cat:"Revue", tags:["civil","NL","bilingue"] },
  { id:"d7", title:"Rechtskundig Weekblad (R.W.)", desc:"Hebdomadaire juridique néerlandophone de référence.", url:"https://www.rw.be", cat:"Revue", tags:["NL","hebdomadaire"] },
  { id:"d8", title:"Administration Publique (A.P.T.)", desc:"Revue trimestrielle de droit administratif.", url:"", cat:"Revue", tags:["administratif","trimestriel"] },
  { id:"d9", title:"JLMB — Jurisprudence de Liège, Mons et Bruxelles", desc:"Jurisprudence commentée des cours et tribunaux.", url:"", cat:"Revue", tags:["jurisprudence","commentée","JLMB"] },
  { id:"d10", title:"CAIRN.info — Droit", desc:"Portail de revues académiques francophones, section Droit (accès libre partiel).", url:"https://www.cairn.info/disc-droit.htm", cat:"Plateforme", tags:["académique","revues","gratuit partiel"] },
  { id:"d11", title:"KU Leuven — Bibliotheek Rechtsgeleerdheid", desc:"Ressources de la bibliothèque de droit de la KU Leuven.", url:"https://bib.kuleuven.be/rechten", cat:"Université", tags:["KU Leuven","bibliothèque","NL"] },
  { id:"d12", title:"UCLouvain — Bibliothèque de droit", desc:"Ressources juridiques de l'UCLouvain.", url:"https://uclouvain.be/fr/bibliotheques", cat:"Université", tags:["UCLouvain","bibliothèque","FR"] },
];

// ─── Legislation Sources ───
const LEGIS_DATA = [
  { id:"l1", title:"Moniteur belge / Belgisch Staatsblad", desc:"Journal officiel — Publication de toutes les lois, arrêtés royaux et décrets.", url:"https://www.ejustice.just.fgov.be/cgi/welcome.pl", cat:"Source officielle", tags:["officiel","publication","lois"] },
  { id:"l2", title:"Justel — Législation consolidée", desc:"Textes légaux belges consolidés et coordonnés (SPF Justice).", url:"https://www.ejustice.just.fgov.be/cgi_loi/loi.pl", cat:"Source officielle", tags:["consolidé","coordonné","recherche"] },
  { id:"l3", title:"Constitution belge / Belgische Grondwet", desc:"Texte intégral de la Constitution (version coordonnée).", url:"https://www.senate.be/doc/const_fr.html", cat:"Constitution", tags:["constitution","grondwet","droits fondamentaux"] },
  { id:"l4", title:"Code civil / Burgerlijk Wetboek", desc:"Nouveau Code civil belge (Livres 1, 2, 3, 5, 8 en vigueur).", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1804032130&table_name=loi", cat:"Code", tags:["civil","obligations","biens"] },
  { id:"l5", title:"Code pénal / Strafwetboek", desc:"Code pénal belge.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1867060801&table_name=loi", cat:"Code", tags:["pénal","infractions","peines"] },
  { id:"l6", title:"Code judiciaire / Gerechtelijk Wetboek", desc:"Organisation judiciaire, procédure civile, voies d'exécution.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1967101001&table_name=loi", cat:"Code", tags:["judiciaire","procédure","tribunaux"] },
  { id:"l7", title:"Code des sociétés et associations (CSA)", desc:"Wetboek van Vennootschappen en Verenigingen (WVV) — en vigueur depuis 2019.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2019032309&table_name=loi", cat:"Code", tags:["sociétés","CSA","WVV","associations"] },
  { id:"l8", title:"Code d'instruction criminelle", desc:"Wetboek van Strafvordering — procédure pénale.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1808111730&table_name=loi", cat:"Code", tags:["instruction","procédure pénale"] },
  { id:"l9", title:"Code de droit économique (CDE)", desc:"Wetboek van Economisch Recht — concurrence, consommation, propriété intellectuelle.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2013022819&table_name=loi", cat:"Code", tags:["économique","consommation","concurrence","PI"] },
  { id:"l10", title:"Loi du 3 juillet 1978 — Contrats de travail", desc:"Wet betreffende de arbeidsovereenkomsten.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1978070301&table_name=loi", cat:"Loi spéciale", tags:["travail","contrat","emploi"] },
  { id:"l11", title:"RGPD / AVG", desc:"Règlement Général sur la Protection des Données (UE 2016/679).", url:"https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679", cat:"Européen", tags:["données","vie privée","RGPD","AVG"] },
  { id:"l12", title:"EUR-Lex — Droit de l'UE", desc:"Accès au droit de l'Union européenne : règlements, directives, traités.", url:"https://eur-lex.europa.eu/homepage.html?locale=fr", cat:"Européen", tags:["UE","directives","règlements","traités"] },
  { id:"l13", title:"Loi spéciale du 8 août 1980 — Réformes institutionnelles", desc:"Bijzondere wet tot hervorming der instellingen — répartition des compétences.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1980080802&table_name=loi", cat:"Loi spéciale", tags:["institutionnel","compétences","fédéralisme"] },
  { id:"l14", title:"Loi du 15 juin 1935 — Emploi des langues judiciaires", desc:"Wet op het gebruik der talen in gerechtszaken.", url:"https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1935061501&table_name=loi", cat:"Loi spéciale", tags:["langues","judiciaire","bilingue"] },
  { id:"l15", title:"Gallilex — Législation wallonne", desc:"Législation de la Région wallonne.", url:"https://wallex.wallonie.be", cat:"Régional", tags:["wallonie","décrets","régional"] },
  { id:"l16", title:"Vlaamse Codex", desc:"Législation flamande consolidée / Vlaamse wetgeving.", url:"https://codex.vlaanderen.be", cat:"Régional", tags:["flandre","vlaams","décrets"] },
  { id:"l17", title:"Législation bruxelloise", desc:"Ordonnances et arrêtés de la Région de Bruxelles-Capitale.", url:"https://www.ejustice.just.fgov.be/cgi/welcome.pl", cat:"Régional", tags:["bruxelles","ordonnances"] },
];

// ─── Helper ───
const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Storage (sécurisé — localStorage) ───
const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (key === "jl_favs") return validateFavorites(parsed);
    return validateStoredData(parsed);
  } catch { return []; }
};
const save = (key, data) => {
  try {
    const clean = key === "jl_favs" ? validateFavorites(data) : validateStoredData(data);
    localStorage.setItem(key, JSON.stringify(clean));
  } catch (e) { console.error(e); }
};

// ─── Reusable Components ───
const Input = ({ value, onChange, placeholder, icon, style, maxLen, ...rest }) => (
  <div style={{ position: "relative", flex: 1, ...style }}>
    {icon && <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.dim, fontSize: 15 }}>{icon}</span>}
    <input value={value} onChange={e => onChange(sanitize(e.target.value).slice(0, maxLen || SEC.MAX_INPUT_LEN))} placeholder={placeholder}
      maxLength={maxLen || SEC.MAX_INPUT_LEN}
      style={{
        width: "100%", padding: icon ? "11px 14px 11px 38px" : "11px 14px",
        background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 9,
        color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 13,
        outline: "none", boxSizing: "border-box",
      }}
      onFocus={e => e.target.style.borderColor = T.gold}
      onBlur={e => e.target.style.borderColor = T.bdr}
      {...rest}
    />
  </div>
);

const ResourceCard = ({ item, onDelete, isCustom }) => {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 12,
      marginBottom: 6, transition: "all .15s",
    }}>
      <div style={{ padding: "13px 16px" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: T.txt }}>{item.title}</span>
              <span style={{
                padding: "2px 9px", borderRadius: 16, background: T.goldDim,
                color: T.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: .5,
              }}>{item.cat}</span>
              {isCustom && <span style={{
                padding: "2px 9px", borderRadius: 16, background: T.cyan + "18",
                color: T.cyan, fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700,
              }}>PERSONNEL</span>}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: T.muted, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{item.desc}</p>
            {item.tags && item.tags.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {item.tags.map(t => (
                  <span key={t} style={{
                    padding: "2px 8px", borderRadius: 10, background: T.s3,
                    color: T.dim, fontFamily: "'DM Sans',sans-serif", fontSize: 10,
                  }}>#{t}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            {item.url && isValidUrl(item.url) && (
              <a href={sanitizeUrl(item.url)} target="_blank" rel="noopener noreferrer" style={{
                padding: "6px 14px", borderRadius: 8,
                background: hov ? T.gold : T.s3,
                color: hov ? T.bg : T.muted,
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
                textDecoration: "none", transition: "all .15s",
              }}>Ouvrir ↗</a>
            )}
            {isCustom && onDelete && (
              <button onClick={() => onDelete(item.id)} style={{
                background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: 14, padding: 4,
              }}>✕</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddForm = ({ onAdd, catOptions, label, currentCount }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [cat, setCat] = useState(catOptions[0] || "");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    setError("");
    const cleanTitle = sanitize(title).slice(0, SEC.MAX_INPUT_LEN);
    if (!cleanTitle.trim()) { setError("Le titre est obligatoire."); return; }
    if ((currentCount || 0) >= SEC.MAX_CUSTOM_ENTRIES) { setError(`Limite de ${SEC.MAX_CUSTOM_ENTRIES} entrées personnelles atteinte.`); return; }
    const cleanUrl = url.trim();
    if (cleanUrl && !isValidUrl(cleanUrl)) { setError("URL invalide — seuls http:// et https:// sont autorisés."); return; }
    onAdd({
      id: uid(),
      title: cleanTitle,
      desc: sanitize(desc).slice(0, SEC.MAX_INPUT_LEN),
      url: sanitizeUrl(cleanUrl),
      cat: sanitize(cat || catOptions[0]).slice(0, 50),
      tags: sanitize(tags).split(",").map(t => t.trim()).filter(Boolean).slice(0, SEC.MAX_TAGS).map(t => t.slice(0, SEC.MAX_TAG_LEN)),
    });
    setTitle(""); setDesc(""); setUrl(""); setTags(""); setError(""); setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      width: "100%", padding: "12px", background: T.goldDim,
      border: `1px dashed ${T.gold}44`, borderRadius: 12,
      color: T.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
      cursor: "pointer", marginBottom: 14,
    }}>+ Ajouter {label}</button>
  );

  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.gold}33`, borderRadius: 12,
      padding: 16, marginBottom: 14,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {error && (
          <div style={{
            padding: "8px 12px", borderRadius: 8, background: T.red + "15",
            border: `1px solid ${T.red}33`, color: T.red,
            fontFamily: "'DM Sans',sans-serif", fontSize: 12,
          }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Input value={title} onChange={setTitle} placeholder="Titre *" style={{ flex: 2 }} />
          <select value={cat} onChange={e => setCat(e.target.value)} style={{
            padding: "8px 12px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 9,
            color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 12, outline: "none",
          }}>
            {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input value={desc} onChange={setDesc} placeholder="Description" />
        <Input value={url} onChange={setUrl} placeholder="URL (https://...)" maxLen={SEC.MAX_URL_LEN} />
        <Input value={tags} onChange={setTags} placeholder="Tags (séparés par des virgules, max 10)" />
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: T.dim }}>
            🛡 Entrées nettoyées et validées
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setOpen(false); setError(""); }} style={{
              padding: "7px 16px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 9,
              color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Annuler</button>
            <button onClick={handleAdd} disabled={!title.trim()} style={{
              padding: "7px 16px", background: !title.trim() ? T.dim : `linear-gradient(135deg,${T.gold},#8B7340)`,
              border: "none", borderRadius: 9, color: T.bg,
              fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
              cursor: !title.trim() ? "not-allowed" : "pointer",
            }}>Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Resource Section Component ───
const ResourceSection = ({ icon, title, label, preloaded, customItems, setCustomItems, storageKey, catOptions, search, setSearch, cat, setCat }) => {
  const addItem = (item) => {
    const next = [item, ...customItems];
    setCustomItems(next);
    save(storageKey, next);
  };
  const delItem = (id) => {
    const next = customItems.filter(x => x.id !== id);
    setCustomItems(next);
    save(storageKey, next);
  };

  const allItems = [...customItems.map(c => ({ ...c, isCustom: true })), ...preloaded];
  const cats = [...new Set(allItems.map(r => r.cat))].sort();

  const filtered = allItems.filter(r => {
    const catMatch = cat === "Tous" || r.cat === cat;
    if (!search.trim()) return catMatch;
    const q = search.toLowerCase();
    return catMatch && (
      r.title.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      (r.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: T.txt }}>{title}</span>
        <span style={{
          padding: "2px 10px", borderRadius: 20, background: T.goldDim,
          color: T.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
        }}>{allItems.length}</span>
      </div>

      <AddForm onAdd={addItem} catOptions={catOptions} label={label} currentCount={customItems.length} />

      <div style={{
        background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 12,
        padding: 14, marginBottom: 14,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Input value={search} onChange={setSearch} placeholder={`Rechercher dans ${title.toLowerCase()}...`} icon="⌕" />
          <select value={cat} onChange={e => setCat(e.target.value)} style={{
            padding: "8px 12px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 9,
            color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 12, outline: "none", minWidth: 130,
          }}>
            <option value="Tous">Toutes catégories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: T.dim, marginBottom: 8, paddingLeft: 4 }}>
        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        {search && ` pour "${search}"`}
      </div>

      {filtered.map(r => (
        <ResourceCard key={r.id} item={r} isCustom={r.isCustom} onDelete={delItem} />
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: T.dim, fontFamily: "'DM Sans',sans-serif" }}>
          <div style={{ fontSize: 32, marginBottom: 10, opacity: .3 }}>{icon}</div>
          <p style={{ fontSize: 13 }}>Aucun résultat trouvé.</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
export default function JuratonePro() {
  const [tab, setTab] = useState("glossary");
  const [search, setSearch] = useState("");
  const [searchLang, setSearchLang] = useState("fr");
  const [domain, setDomain] = useState("Tous");
  const [expanded, setExpanded] = useState(new Set());
  const [favorites, setFavorites] = useState([]);
  const [showFav, setShowFav] = useState(false);

  const [txText, setTxText] = useState("");
  const [txDir, setTxDir] = useState("fr-nl");
  const [txResult, setTxResult] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");
  const [rateLimiter] = useState(() => createRateLimiter(SEC.RATE_LIMIT_MS));

  const [customJuris, setCustomJuris] = useState([]);
  const [customDoctrine, setCustomDoctrine] = useState([]);
  const [customLegis, setCustomLegis] = useState([]);

  const [jurisSearch, setJurisSearch] = useState("");
  const [jurisCat, setJurisCat] = useState("Tous");
  const [docSearch, setDocSearch] = useState("");
  const [docCat, setDocCat] = useState("Tous");
  const [legSearch, setLegSearch] = useState("");
  const [legCat, setLegCat] = useState("Tous");

  useEffect(() => {
    setCustomJuris(load("jl_juris"));
    setCustomDoctrine(load("jl_doctrine"));
    setCustomLegis(load("jl_legis"));
    setFavorites(load("jl_favs"));
  }, []);

  const toggleFav = (entry) => {
    const next = favorites.find(f => f.fr === entry.fr) ? favorites.filter(f => f.fr !== entry.fr) : [...favorites, entry];
    setFavorites(next); save("jl_favs", next);
  };
  const isFav = e => favorites.some(f => f.fr === e.fr);

  const glossaryFiltered = (showFav ? favorites : GLOSSARY).filter(e => {
    const dm = domain === "Tous" || e.d === domain;
    if (!search.trim()) return dm;
    const q = search.toLowerCase();
    if (searchLang === "fr") return e.fr.toLowerCase().includes(q) && dm;
    if (searchLang === "nl") return e.nl.toLowerCase().includes(q) && dm;
    return (e.fr.toLowerCase().includes(q) || e.nl.toLowerCase().includes(q)) && dm;
  });

  const doTranslate = async () => {
    setTxError("");
    if (!txText.trim()) return;
    // Rate limiting
    if (!rateLimiter.canCall()) {
      setTxError(`Anti-spam : attendez ${rateLimiter.remaining()} seconde(s) avant la prochaine traduction.`);
      return;
    }
    // Input length check
    if (txText.length > SEC.MAX_TRANSLATE_LEN) {
      setTxError(`Le texte est trop long (${txText.length}/${SEC.MAX_TRANSLATE_LEN} caractères).`);
      return;
    }
    rateLimiter.call();
    setTxLoading(true); setTxResult(null);
    const cleanText = sanitize(txText);
    try {
      const r = await fetch("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, direction: txDir })
      });
      const data = await r.json();
      if (!r.ok) { setTxError(data.error || "Erreur serveur."); setTxLoading(false); return; }
      setTxResult(data.translation || "Erreur.");
    } catch { setTxResult("Erreur de connexion. Réessayez."); }
    setTxLoading(false);
  };

  const TABS = [
    { id: "glossary", label: "Glossaire", icon: "§", short: "Glossaire" },
    { id: "translate", label: "Traduction IA", icon: "⟷", short: "Trad. IA" },
    { id: "juris", label: "Jurisprudence", icon: "⚖", short: "Jurispr." },
    { id: "doctrine", label: "Doctrine", icon: "📖", short: "Doctrine" },
    { id: "legis", label: "Législation", icon: "📜", short: "Législ." },
  ];

  return (
    <div style={{ fontFamily: "'Cormorant Garamond','Georgia',serif", background: T.bg, color: T.txt, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <header style={{
        padding: "24px 16px 20px",
        borderBottom: `1px solid ${T.bdr}`,
        background: `linear-gradient(180deg,${T.s2} 0%,${T.bg} 100%)`,
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, background: `linear-gradient(135deg,${T.gold},#8B7340)`,
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: 800, color: T.bg, fontFamily: "'DM Sans',sans-serif", letterSpacing: -1,
            flexShrink: 0,
          }}>JT</div>
          <div>
            <h1 style={{
              margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: -.5,
              background: `linear-gradient(135deg,${T.gold},${T.goldTxt})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Juratone Pro</h1>
            <p style={{ margin: 0, fontSize: 9, color: T.muted, fontFamily: "'DM Sans',sans-serif", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Plateforme juridique belge complète &nbsp;·&nbsp; FR ↔ NL
            </p>
          </div>
        </div>
      </header>

      {/* ═══ TABS ═══ */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "12px 16px 0" }}>
        <div style={{
          display: "flex", gap: 2, background: T.surface, borderRadius: 11, padding: 3,
          border: `1px solid ${T.bdr}`, overflowX: "auto",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 4px", minWidth: 0,
              background: tab === t.id ? T.goldDim : "transparent",
              border: tab === t.id ? `1px solid ${T.gold}30` : "1px solid transparent",
              borderRadius: 8, color: tab === t.id ? T.gold : T.muted,
              fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer",
              transition: "all .15s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              <span style={{ marginRight: 3 }}>{t.icon}</span>{t.short}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "16px 16px 50px" }}>

        {/* ═══ GLOSSAIRE ═══ */}
        {tab === "glossary" && (
          <div>
            <div style={{ background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <Input value={search} onChange={setSearch} placeholder="Rechercher un terme juridique..." icon="⌕" />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
                <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.bdr}` }}>
                  {[{ v: "fr", l: "FR →", c: T.fr }, { v: "nl", l: "NL →", c: T.nl }, { v: "both", l: "↔", c: T.gold }].map(o => (
                    <button key={o.v} onClick={() => setSearchLang(o.v)} style={{
                      padding: "5px 12px", background: searchLang === o.v ? o.c + "20" : "transparent",
                      border: "none", borderRight: `1px solid ${T.bdr}`,
                      color: searchLang === o.v ? o.c : T.muted,
                      fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    }}>{o.l}</button>
                  ))}
                </div>
                <select value={domain} onChange={e => setDomain(e.target.value)} style={{
                  padding: "5px 10px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 8,
                  color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 11, outline: "none",
                }}>
                  <option value="Tous">Tous les domaines</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={() => setShowFav(!showFav)} style={{
                  padding: "5px 13px", borderRadius: 20, border: `1px solid ${showFav ? T.gold + "55" : T.bdr}`,
                  background: showFav ? T.gold + "18" : "transparent",
                  color: showFav ? T.gold : T.muted,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>★ Favoris ({favorites.length})</button>
              </div>
            </div>

            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: T.dim, marginBottom: 8, paddingLeft: 4 }}>
              {glossaryFiltered.length} terme{glossaryFiltered.length !== 1 ? "s" : ""}
              {search && ` pour "${search}"`}
            </div>

            {glossaryFiltered.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: T.dim, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ fontSize: 32, marginBottom: 10, opacity: .3 }}>§</div>
                <p style={{ fontSize: 13 }}>{showFav ? "Aucun favori." : "Aucun terme trouvé."}</p>
              </div>
            )}

            {glossaryFiltered.map((e, i) => {
              const gi = GLOSSARY.indexOf(e);
              const isExp = expanded.has(gi);
              return (
                <div key={e.fr + i} style={{
                  background: T.surface, border: `1px solid ${isExp ? T.gold + "33" : T.bdr}`,
                  borderRadius: 12, marginBottom: 5, overflow: "hidden",
                }}>
                  <div onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(gi) ? n.delete(gi) : n.add(gi); return n; })}
                    style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.fr }}>{e.fr}</span>
                      <span style={{ color: T.dim, fontSize: 13 }}>→</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.nl }}>{e.nl}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{
                        padding: "2px 9px", borderRadius: 16, background: T.goldDim, color: T.gold,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                      }}>{e.d}</span>
                      <button onClick={ev => { ev.stopPropagation(); toggleFav(e); }} style={{
                        background: "none", border: "none", cursor: "pointer", color: isFav(e) ? T.gold : T.dim, fontSize: 14, padding: 2,
                      }}>{isFav(e) ? "★" : "☆"}</button>
                    </div>
                  </div>
                  {isExp && e.n && (
                    <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${T.bdr}`, paddingTop: 10 }}>
                      <div style={{ padding: "9px 12px", background: T.goldDim, borderRadius: 8, borderLeft: `3px solid ${T.gold}` }}>
                        <p style={{ margin: 0, fontSize: 12, color: T.goldTxt, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>
                          <strong style={{ color: T.gold }}>Note :</strong> {e.n}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ TRADUCTION IA ═══ */}
        {tab === "translate" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: txDir === "fr-nl" ? T.fr : T.nl }}>
                {txDir === "fr-nl" ? "Français" : "Nederlands"}
              </span>
              <button onClick={() => setTxDir(d => d === "fr-nl" ? "nl-fr" : "fr-nl")} style={{
                width: 44, height: 30, background: `linear-gradient(135deg,${T.fr},${T.nl})`,
                border: "none", borderRadius: 18, cursor: "pointer", color: "white", fontSize: 15, fontWeight: 700,
              }}>⇄</button>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: txDir === "fr-nl" ? T.nl : T.fr }}>
                {txDir === "fr-nl" ? "Nederlands" : "Français"}
              </span>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: txDir === "fr-nl" ? T.fr : T.nl, fontWeight: 600 }}>
                  {txDir === "fr-nl" ? "Texte source (FR)" : "Brontekst (NL)"}
                </span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: txText.length > SEC.MAX_TRANSLATE_LEN ? T.red : T.dim }}>
                  {txText.length}/{SEC.MAX_TRANSLATE_LEN} car.
                </span>
              </div>
              {txError && (
                <div style={{
                  padding: "8px 12px", borderRadius: 8, background: T.red + "15",
                  border: `1px solid ${T.red}33`, color: T.red, marginBottom: 8,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                }}>🛡 {txError}</div>
              )}
              <textarea value={txText} onChange={e => { setTxError(""); setTxText(e.target.value.slice(0, SEC.MAX_TRANSLATE_LEN + 100)); }}
                placeholder={txDir === "fr-nl" ? "Collez votre texte juridique en français..." : "Plak hier uw juridische tekst in het Nederlands..."}
                style={{
                  width: "100%", minHeight: 140, background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 9, padding: 12,
                  color: T.txt, fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.bdr}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={doTranslate} disabled={txLoading || !txText.trim()} style={{
                  padding: "11px 26px",
                  background: txLoading || !txText.trim() ? T.dim : `linear-gradient(135deg,${T.gold},#8B7340)`,
                  border: "none", borderRadius: 9, color: T.bg,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
                  cursor: txLoading || !txText.trim() ? "not-allowed" : "pointer",
                }}>{txLoading ? "Traduction en cours..." : "Traduire"}</button>
              </div>
            </div>

            {txLoading && (
              <div style={{ background: T.surface, border: `1px solid ${T.gold}33`, borderRadius: 12, padding: 28, textAlign: "center" }}>
                <div style={{ display: "inline-flex", gap: 5, marginBottom: 10 }}>
                  {[0, 1, 2].map(i => (<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.gold, animation: `pulse 1.2s ease-in-out ${i * .2}s infinite` }} />))}
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.muted, margin: 0 }}>Analyse terminologique en cours...</p>
                <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
              </div>
            )}

            {txResult && !txLoading && (
              <div style={{ background: T.surface, border: `1px solid ${T.gold}33`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: txDir === "fr-nl" ? T.nl : T.fr, fontWeight: 600 }}>
                    {txDir === "fr-nl" ? "Vertaling (NL)" : "Traduction (FR)"}
                  </span>
                  <button onClick={() => navigator.clipboard?.writeText(txResult)} style={{
                    padding: "4px 12px", background: T.goldDim, border: `1px solid ${T.gold}33`, borderRadius: 6,
                    color: T.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 11, cursor: "pointer", fontWeight: 600,
                  }}>Copier</button>
                </div>
                <div style={{ background: T.s2, borderRadius: 9, padding: 14, borderLeft: `3px solid ${txDir === "fr-nl" ? T.nl : T.fr}` }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.8, color: T.txt, whiteSpace: "pre-wrap" }}>{txResult}</div>
                </div>
              </div>
            )}

            {!txResult && !txLoading && (
              <div style={{ background: T.goldDim, border: `1px solid ${T.gold}22`, borderRadius: 12, padding: 18, marginTop: 6 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 14, color: T.gold }}>Traduction juridique intelligente</h3>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
                  <p style={{ margin: "0 0 4px" }}>Propulsé par l'IA Claude — spécialisé droit belge :</p>
                  {["Terminologie belge officielle (pas FR/France ni NL/Pays-Bas)", "Contexte juridique — pas de traduction littérale", "Détection des faux-amis juridiques", "Notes terminologiques détaillées"].map(t => (
                    <p key={t} style={{ margin: "0 0 3px", paddingLeft: 10 }}>→ <strong style={{ color: T.goldTxt }}>{t}</strong></p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ JURISPRUDENCE ═══ */}
        {tab === "juris" && (
          <ResourceSection
            icon="⚖" title="Jurisprudence" label="une jurisprudence"
            preloaded={JURIS_DATA} customItems={customJuris} setCustomItems={setCustomJuris}
            storageKey="jl_juris"
            catOptions={["Base de données", "Cour", "Européen", "Personnel", "Autre"]}
            search={jurisSearch} setSearch={setJurisSearch} cat={jurisCat} setCat={setJurisCat}
          />
        )}

        {/* ═══ DOCTRINE ═══ */}
        {tab === "doctrine" && (
          <ResourceSection
            icon="📖" title="Doctrine" label="une doctrine"
            preloaded={DOCTRINE_DATA} customItems={customDoctrine} setCustomItems={setCustomDoctrine}
            storageKey="jl_doctrine"
            catOptions={["Plateforme", "Revue", "Université", "Manuel", "Personnel", "Autre"]}
            search={docSearch} setSearch={setDocSearch} cat={docCat} setCat={setDocCat}
          />
        )}

        {/* ═══ LÉGISLATION ═══ */}
        {tab === "legis" && (
          <ResourceSection
            icon="📜" title="Législation" label="une source législative"
            preloaded={LEGIS_DATA} customItems={customLegis} setCustomItems={setCustomLegis}
            storageKey="jl_legis"
            catOptions={["Source officielle", "Constitution", "Code", "Loi spéciale", "Européen", "Régional", "Personnel", "Autre"]}
            search={legSearch} setSearch={setLegSearch} cat={legCat} setCat={setLegCat}
          />
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.bdr}`, padding: "14px 16px",
        textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: T.dim,
        letterSpacing: 1,
      }}>
        JURATONE PRO · OUTIL GRATUIT · DROIT BELGE FR ↔ NL · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
