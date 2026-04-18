import { useState, useEffect } from "react";
/*  ══════════════════════════════════════════════════════════
   JURATONE PRO v8.7.0 — Edition Expert (Belgique)
   Patch v8.7.0 (avril 2026) :
   1. JURISPRUDENCE — Ajout de 3 sources officielles :
      - Lex.be (plate-forme gratuite full-text)
      - BelgiqueLex (Banque Carrefour interinstitutionnelle)
      - Reflex (Conseil d'Etat, base relationnelle)
   2. LEGISLATION — Ajout de 5 sources :
      - EUR-Lex (droit UE, Journal officiel faisant foi)
      - DroitBelge.net Codes (codes consolides gratuits)
      - Gallilex (Communaute francaise / FWB)
      - Lex.be (legislation full-text)
      - Livre IX Code civil — Suretes (en vigueur 01/01/2026)
   3. INDEXATION — Donnees officielles Statbel etendues :
      - De Mars 2024 a Mars 2026 (25 mois)
      - Base 2013=100 maintenue (coef 0.7376 pour conversion 2026)
      - Source : bestat.statbel.fgov.be (API JSON officielle)
   4. CORRECTIONS JURIDIQUES (calcReducedHomeTax) :
      - Wallonie : baremes tranches corrigees (25k/50k/175k/250k/500k)
        Source : Code des droits de succession wallon art. 60ter
      - Bruxelles : baremes tranches corrigees (50k/100k/175k/250k)
        Source : notaire.be + Code droits succession RBC
   5. Ajout notes documentaires : reforme Wallonie 2028, Flandre 2026,
      nouvelle base 2025=100 pour l'indice (depuis janvier 2026).
  ══════════════════════════════════════════════════════════  */
const T = {
  bg: "linear-gradient(165deg, #FDFAFA 0%, #FDF4F5 40%, #FCEAEB 70%, #F8DCDD 100%)",
  bgFlat: "#FCF6F6", surface: "#FFFFFF", s2: "#FDF4F5", s3: "#F9E6E8",
  bdr: "#EED6D8", bdrH: "#E0C2C5",
  pri: "#A65D67", priH: "#B86B76", priL: "#FDF0F2",
  priDim: "rgba(166, 93, 103, 0.06)",
  priGrad: "linear-gradient(135deg, #B86B76 0%, #A65D67 50%, #8F4C55 100%)",
  warmGrad: "linear-gradient(135deg, #D49A9F 0%, #A65D67 50%, #8F4C55 100%)",
  softGrad: "linear-gradient(135deg, #FDF0F2 0%, #F5D5D8 100%)",
  txt: "#2D1E20", muted: "#7D676A", dim: "#B5A1A3",
  accent: "#A65D67", green: "#5A8A63", red: "#B54A4A",
  orange: "#C67A58", cyan: "#50858B", fr: "#5A7FA8", nl: "#A65D67",
};
const fmt = n => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(n);
//  ═══  DONNEES & CONSTANTES  ═══
//  🔴  PATCH v8.7.0 : Ajout de Lex.be, BelgiqueLex, Reflex Conseil d'Etat
const JURIS = [
  { id: "j2", title: "Juportal", desc: "Portail de recherche principal dans la jurisprudence des cours et tribunaux belges.", url: "https://juportal.be/moteur/formulaire", cat: "Officiel" },
  { id: "j1", title: "Juridat (Archives)", desc: "Ancienne base de la Cour de cassation (remplacee progressivement par Juportal).", url: "https://www.juridat.be", cat: "Officiel" },
  { id: "j3", title: "Cour constitutionnelle", desc: "Arrets du Grondwettelijk Hof / Cour constitutionnelle.", url: "https://www.const-court.be", cat: "Cour" },
  { id: "j4", title: "Conseil d'État", desc: "Jurisprudence du Conseil d'État / Raad van State.", url: "https://www.raadvst-consetat.be", cat: "Cour" },
  { id: "j9", title: "Reflex (Conseil d'État)", desc: "Base relationnelle officielle : travaux parlementaires, chronos legislatifs, jurisprudence, avec liens vers Justel, Moniteur, EUR-Lex.", url: "https://www.raadvst-consetat.be/?page=caselaw&lang=fr", cat: "Cour" },
  { id: "j7", title: "Lex.be", desc: "Plate-forme gratuite full-text (type Google) : +1 million de documents de legislation et jurisprudence belges. Acces libre et universel.", url: "https://www.lex.be", cat: "Gratuit" },
  { id: "j8", title: "BelgiqueLex — Banque Carrefour", desc: "Portail interinstitutionnel (Chambre, Senat, Cassation, Cour constitutionnelle, Conseil d'Etat, Gouvernement federal). Acces unifie a la legislation et a la jurisprudence.", url: "https://belgiquelex.be/fr/jurisprudence/", cat: "Officiel" },
  { id: "j5", title: "CJUE — InfoCuria", desc: "Cour de justice de l'Union europeenne.", url: "https://curia.europa.eu/juris/recherche.jsf?language=fr", cat: "Europeen" },
  { id: "j6", title: "CEDH — HUDOC", desc: "Cour europeenne des droits de l'homme.", url: "https://hudoc.echr.coe.int", cat: "Europeen" },
];
const DOC_PLATFORMS = [
  { id: "d1", title: "Strada lex", desc: "Doctrine et legislation belge (Larcier-Intersentia).", url: "https://www.stradalex.com", cat: "Plateforme", acc: "Abonnement payant / Uni" },
  { id: "d2", title: "Jura (Wolters Kluwer)", desc: "Legislation, jurisprudence et doctrine.", url: "https://jura.kluwer.be", cat: "Plateforme", acc: "Abonnement payant / Uni" },
  { id: "d3", title: "Jurisquare", desc: "Bibliotheque numerique juridique belge.", url: "https://www.jurisquare.be", cat: "Plateforme", acc: "Payant a l'acte / Uni" },
  { id: "d4", title: "CAIRN.info — Droit", desc: "Revues academiques francophones.", url: "https://www.cairn.info/disc-droit.htm", cat: "Plateforme", acc: "Acces partiel gratuit" },
];
const DOC_BIBLIO = [
  { id: "b1", title: "Droit des obligations", author: "P. Van Ommeslaghe", ed: "Bruylant", mat: "Civil", niv: "Niveau 3 - Recherche", type: "Traite", desc: "Reference absolue en droit des obligations belge." },
  { id: "b2", title: "Traite de droit civil belge", author: "H. De Page", ed: "Bruylant", mat: "Civil", niv: "Niveau 3 - Recherche", type: "Traite", desc: "Monument du droit civil belge." },
  { id: "b3", title: "Manuel de droit civil", author: "Y.-H. Leleu", ed: "Larcier", mat: "Civil", niv: "Niveau 1 - Etudiant", type: "Manuel", desc: "Introduction claire et structuree." },
  { id: "b4", title: "Droit penal general", author: "F. Tulkens et al.", ed: "Larcier", mat: "Penal", niv: "Niveau 1 - Etudiant", type: "Manuel", desc: "Manuel universitaire classique." },
  { id: "b5", title: "Les infractions (5 vol.)", author: "A. De Nauw, F. Kuty", ed: "Larcier", mat: "Penal", niv: "Niveau 2 - Pratique", type: "Code commente", desc: "Analyse exhaustive de chaque infraction." },
  { id: "b6", title: "Droit judiciaire", author: "G. de Leval, F. Georges", ed: "Larcier", mat: "Judiciaire", niv: "Niveau 2 - Pratique", type: "Traite", desc: "Reference sur la procedure civile." },
  { id: "b7", title: "Manuel de droit des societes", author: "Y. De Cordt", ed: "Larcier", mat: "Societes", niv: "Niveau 1 - Etudiant", type: "Manuel", desc: "A jour du CSA/WVV (2019)." },
];
const DOC_MATIERES = [...new Set(DOC_BIBLIO.map(b => b.mat))].sort();
//  🔴  PATCH v8.7.0 : Ajout de EUR-Lex, DroitBelge codes, Gallilex, Lex.be, Livre IX
const LEGIS = [
  { id: "l1", title: "Justel — Legislation consolidee", desc: "Textes legaux belges consolides (SPF Justice).", url: "https://www.ejustice.just.fgov.be/cgi_loi/loi.pl", cat: "Source officielle" },
  { id: "l2", title: "Moniteur belge", desc: "Publications officielles journalieres.", url: "https://www.ejustice.just.fgov.be/cgi/welcome.pl", cat: "Source officielle" },
  { id: "l3", title: "SenLex", desc: "Constitution et normes institutionnelles.", url: "https://www.senate.be/doc/const_fr.html", cat: "Source officielle" },
  { id: "l10", title: "Lex.be — Legislation", desc: "Alternative gratuite a Justel : legislation consolidee belge avec moteur de recherche full-text. Acces libre et universel.", url: "https://www.lex.be", cat: "Gratuit" },
  { id: "l4", title: "Reforme du Code civil — vue d'ensemble", desc: "Nouveaux Livres en vigueur (SPF Justice).", url: "https://justice.belgium.be/fr/themes_et_dossiers/droit_civil/nouveau_code_civil", cat: "Code" },
  { id: "l6", title: "DroitBelge.net — Codes consolides", desc: "Acces gratuit aux codes belges : nouveau Code civil (Livres I a IX), ancien Code civil, Code judiciaire, Code penal, CSA, CIR92, etc.", url: "https://www.droitbelge.be/codes.asp", cat: "Code" },
  { id: "l11", title: "Code civil — Livre IX (Suretes)", desc: "Nouveau Livre IX du Code civil relatif aux suretes (cautionnement, gages, privileges, hypotheques). En vigueur depuis le 1er janvier 2026.", url: "https://www.droitbelge.be/codes.asp", cat: "Code" },
  { id: "l4b", title: "Ancien Code civil (1804)", desc: "Dispositions residuelles non encore reformees.", url: "https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=1804032130&table_name=loi", cat: "Code" },
  { id: "l7", title: "Code des societes et des associations (CSA / WVV)", desc: "En vigueur depuis 2019.", url: "https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2019032309&table_name=loi", cat: "Code" },
  { id: "l8", title: "Wallex / Vlaamse Codex", desc: "Legislation regionale (Wallonie / Flandre).", url: "https://wallex.wallonie.be/", cat: "Regional" },
  { id: "l9", title: "Gallilex (Federation Wallonie-Bruxelles)", desc: "Legislation consolidee de la Communaute francaise : decrets, arretes du Gouvernement, arretes ministeriels, circulaires, actes de (sub)delegation.", url: "https://gallilex.cfwb.be/", cat: "Regional" },
  { id: "l5", title: "EUR-Lex", desc: "Acces officiel au droit de l'Union europeenne : traites, reglements, directives, textes consolides, jurisprudence CJUE, Journal officiel UE (seule edition faisant foi depuis 2013).", url: "https://eur-lex.europa.eu/homepage.html?locale=fr", cat: "Europeen" },
];
const CHECKS = [
  { id: "cl1", title: "Achat immobilier",
    options: [{ id: "copro", l: "Le bien est en copropriete (Appartement)" }, { id: "credit", l: "Achat via credit hypothecaire" }, { id: "loue", l: "Le bien est actuellement loue" }],
    items: [
      { l: "Carte d'identite (Vendeur et Acheteur)" },
      { l: "Compromis de vente signe (Commun)" },
      { l: "Titre de propriete actuel (Vendeur)" },
      { l: "Certificat PEB valide (Vendeur)" },
      { l: "Attestation de sol (Vendeur)" },
      { l: "Renseignements urbanistiques (Vendeur)" },
      { l: "Dossier d'intervention ulterieure (DIU) (Vendeur)" },
      { l: "Preuve de financement / Offre de la banque (Acheteur)", cond: "credit" },
      { l: "Copie du bail en cours et etat des lieux (Vendeur)", cond: "loue" },
      { l: "PV des 3 dernieres AG de copropriete (Vendeur/Syndic)", cond: "copro" },
      { l: "Decompte des charges et fonds de reserve (Syndic)", cond: "copro" }
    ]
  },
  { id: "cl3", title: "Succession (Premieres demarches)",
    options: [{ id: "immo", l: "Le defunt possedait de l'immobilier" }, { id: "testament", l: "Un testament est connu" }],
    items: [
      { l: "Extrait de l'acte de deces (Commune)" },
      { l: "Cartes d'identite de tous les heritiers presumes" },
      { l: "Releves de tous les comptes bancaires a la date du deces" },
      { l: "Copie du testament ou acte de donation", cond: "testament" },
      { l: "Titres de propriete des biens immobiliers", cond: "immo" },
      { l: "Contrats d'assurance-vie et factures de frais funeraires" }
    ]
  },
];
const GUIDE_SECTIONS = [
  { id: "g-juris", title: "Jurisprudence", category: "juridique", intro: "La section Jurisprudence regroupe les liens directs vers les bases de donnees officielles de jurisprudence belge et europeenne. Depuis v8.7.0 : Lex.be, BelgiqueLex et Reflex ont ete  ajoutes.", steps: ["Identifiez la juridiction concernee.", "Pour les decisions recentes : Juportal (moteur SPF Justice) ou Lex.be (gratuit, full-text).", "Pour un panorama institutionnel : BelgiqueLex (Banque Carrefour).", "Pour les aspects administratifs : Reflex (Conseil d'Etat).", "Pour les droits fondamentaux : HUDOC (CEDH) en parallele."], tips: ["Commencez par Juportal ou Lex.be pour la jurisprudence publique.", "Les arrets de la Cour constitutionnelle sont numerotes par annee.", "Reflex relie chaque arret aux travaux parlementaires correspondants."], pitfalls: ["Ne confondez pas un arret de cassation avec un jugement de premiere instance.", "La jurisprudence belge n'est pas un systeme de precedent obligatoire."] },
  { id: "g-doctrine", title: "Doctrine", category: "juridique", intro: "La section Doctrine propose trois niveaux : plateformes, bibliotheque et controverses.", steps: ["Plateformes : Strada lex et Jura sont les plus complets mais payants.", "Bibliotheque : filtrez par matiere et par niveau.", "Controverses : chaque fiche presente deux positions opposees."], tips: ["Les ouvrages 'Etudiant' sont des manuels structures.", "Les controverses sont frequemment posees en examen."], pitfalls: ["Ne vous limitez pas a un seul auteur.", "Verifiez toujours l'edition."] },
  { id: "g-legis", title: "Legislation", category: "juridique", intro: "Liens vers les textes legaux officiels. v8.7.0 ajoute EUR-Lex, DroitBelge.net, Gallilex, Lex.be, et le nouveau Livre IX du Code civil (suretes, en vigueur depuis 01/01/2026).", steps: ["Pour la legislation federale belge : Justel, Lex.be (gratuit), ou DroitBelge.net pour les codes consolides.", "Pour les textes recents : Moniteur belge (publication officielle).", "Pour le droit UE : EUR-Lex (Journal officiel faisant foi).", "Pour le regional : Vlaamse Codex, Wallex (general), Gallilex (FWB / Communaute francaise)."], tips: ["Justel reste la reference, Lex.be est une excellente alternative gratuite.", "SenLex est utile pour la Constitution et les normes institutionnelles.", "EUR-Lex depuis 2013 : seule l'edition electronique du JO fait foi."], pitfalls: ["Ne citez jamais un article sans verifier la version consolidee a jour.", "Pas de hierarchie entre loi federale et decret regional dans leurs domaines respectifs.", "Le Livre IX du Code civil (suretes) a remplace de nombreuses dispositions au 01/01/2026 : verifiez la date."] },
  { id: "g-immo", title: "Frais d'achat immobilier", category: "outils", intro: "Estimez le cout total de l'achat d'un bien immobilier en Belgique.", steps: ["Entrez le prix d'achat convenu.", "Selectionnez la region du bien.", "Cochez les conditions legales pour les taux reduits.", "Cliquez sur Calculer."], tips: ["Les honoraires du notaire sont fixes par arrete royal.", "Le taux flamand a 2 % (depuis 2025, conditions durcies en 2026) suppose notamment un achat par personnes physiques, en pleine propriete, pour l'habitation propre et unique, avec inscription dans les 3 ans et maintien au moins 1 an.", "A Bruxelles, l'abattement de 200.000 EUR pour les biens jusqu'a 600.000 EUR."], pitfalls: ["L'administration peut requalifier le prix.", "L'acquisition scindee (usufruit/nue-propriete) exclut le taux reduit en Flandre depuis 2026."] },
  { id: "g-succession", title: "Droits de succession", category: "outils", intro: "Estimation des droits de succession par region et lien de parente. v8.7.0 : baremes logement familial corriges pour la Wallonie et Bruxelles (conformement aux sources notariales officielles).", steps: ["Entrez le montant herite net.", "Selectionnez la region du dernier domicile du defunt.", "Choisissez le lien de parente.", "Cliquez sur Calculer."], tips: ["Les droits s'appliquent par tranche progressive.", "Le logement familial peut etre exonere sous conditions regionales.", "Declaration : 4 mois (Belgique), 5 mois (Europe), 6 mois (hors Europe).", "Wallonie : reforme 2028 reduira les taux max (30%→15% ligne directe).", "Flandre 2026 : exoneration mobiliere partenaire passe de 50k a 75k EUR."], pitfalls: ["Le calcul ne tient pas compte des assurances-vie.", "Le calcul ne vaut que si la valeur saisie correspond exclusivement a la part nette concernee par le regime applicable."] },
  { id: "g-routier", title: "Infractions routieres", category: "outils", intro: "Estimation de l'amende de perception immediate pour un exces de vitesse.", steps: ["Entrez la vitesse constatee par le radar.", "Selectionnez la limite de zone.", "Selectionnez le type de voirie.", "Cliquez sur Simuler."], tips: ["La perception immediate est une transaction : si vous payez, l'affaire est close.", "Une redevance administrative en sus s'applique (montant variable)."], pitfalls: ["Au-dela du seuil, le dossier est transmis au parquet.", "La marge technique (6 km/h sous 100, 6% au-dessus) n'est pas deduite."] },
  { id: "g-preavis", title: "Simulateur de preavis", category: "outils", intro: "Calcul du delai de preavis selon le bareme SPF Emploi. Calcul exact pour les contrats post-2014, estimation indicative pour les contrats pre-2014.", steps: ["Entrez la date de debut du contrat.", "Selectionnez le mode de notification. Le delai commence le lundi suivant.", "Entrez votre salaire brut ANNUEL complet.", "Selectionnez Licenciement ou Demission.", "Cliquez sur Calculer."], tips: ["L'indemnite de rupture = le salaire du si licenciement sans preavis.", "La demission est strictement plafonnee a 13 semaines.", "La lettre recommandee prend effet le 3e jour ouvrable apres l'expedition."], pitfalls: ["Le preavis commence TOUJOURS le lundi suivant la date d'effet.", "L'anciennete se calcule jusqu'a la veille de la prise de cours du preavis.", "Entrez le salaire brut ANNUEL, pas mensuel."] },
  { id: "g-indexation", title: "Module d'indexation", category: "outils", intro: "Calcul d'indexation base sur l'Indice Sante Statbel. Donnees officielles etendues de Mars 2024 a Mars 2026 (v8.7.0). Base 2013=100. NB : depuis janvier 2026, Statbel utilise la nouvelle base 2025=100 pour ses publications officielles ; les valeurs 2026 affichees ici sont converties via le coefficient officiel 0,7376 pour la coherence.", steps: ["Chargez le jeu de donnees officiel 2024-2026.", "Entrez le montant de base.", "Selectionnez la region et le PEB pour les verifications de blocage.", "Cliquez sur Calculer."], tips: ["Pour les baux, l'indexation ne peut se faire qu'une fois par an.", "A Bruxelles, certaines indexations supposent un bail enregistre et un certificat PEB valide communique. En Wallonie, le calcul peut devenir specifique selon le PEB et la date pertinente du bail.",  "L'indice pivot depasse en decembre 2025 = coefficient de majoration 2,1647 applicable depuis mars 2026."], pitfalls: ["Les donnees officielles sont issues de Statbel (API JSON) ; verifiez pour les mois tres recents.", "En Flandre post-2019, l'indice de base est le mois precedant l'entree en vigueur.", "Coefficient de conversion 2013→2025 : x 0,7376 (pour l'indice sante)."] },
];
//  ═══  ALGORITHMES  ═══
const NF_BR = [{ max: 7500, r: .0456 }, { max: 17500, r: .0285 }, { max: 30000, r: .0228 }, { max: 45495, r: .0171 }, { max: 64095, r: .0114 }, { max: 250095, r: .0057 }, { max: Infinity, r: .00057 }];
const calcNF = p => { let f = 0, v = 0; for (const b of NF_BR) { const s = Math.min(p, b.max) - v; if (s <= 0) break; f += s * b.r; v = b.max; } return f; };

/* ============================================================
   ✅ CORRECTIF CRITIQUE 1 — ACHAT IMMOBILIER BRUXELLES
   Le plafond 600.000€ pour l'abattement doit être testé sur taxableBase
   et non sur le prix seul.
   Source : SPF Finances / Région Bruxelles-Capitale
   ============================================================ */
const calcRR = (p, reg, conditionsMet, sautsPEB = 0, flandreCond2026 = null, charges = 0, valeurVenale = 0) => {
  const prix = parseFloat(p) || 0;
  const taxableBase = Math.max(prix + charges, valeurVenale || 0, prix); 
  if (reg === "flandre") {
    if (flandreCond2026 && flandreCond2026.natural && flandreCond2026.fullOwnership && flandreCond2026.register3Y && flandreCond2026.stay1Y && conditionsMet) {
      return taxableBase * 0.02;
    }
    return taxableBase * 0.12;
  }
  if (!conditionsMet) {
    return taxableBase * (reg === "bruxelles" ? 0.125 : 0.125);
  }
  if (reg === "wallonie") return taxableBase * 0.03;
  if (reg === "bruxelles") {
    let abattementTotal = 0;
    // ✅ FIX CRITIQUE : plafond testé sur la BASE TAXABLE
    if (taxableBase <= 600000) abattementTotal += 200000;
    if (sautsPEB >= 2) {
      abattementTotal += sautsPEB * 25000;
    }
    return Math.max(0, taxableBase - abattementTotal) * 0.125;
  }
  return taxableBase * 0.125;
};

/* ============================================================
   ✅ CORRECTIF CRITIQUE 2 — SUCCESSION BRUXELLES
   Logement familial en ligne directe :
   le tarif réduit est plafonné à 250.000 €,
   MAIS le surplus est taxé au tarif normal.
   Source : notaire.be / Code des droits de succession RBC
   ============================================================ */
const calcReducedHomeTaxBrussels = (amount) => {
  const REDUCED = [
    { max: 50000, r: 0.02 },
    { max: 100000, r: 0.053 },
    { max: 175000, r: 0.06 },
    { max: 250000, r: 0.12 },
  ];
  const NORMAL = [
    { max: 50000, r: 0.03 },
    { max: 100000, r: 0.08 },
    { max: 175000, r: 0.09 },
    { max: 250000, r: 0.18 },
    { max: 500000, r: 0.24 },
    { max: Infinity, r: 0.30 },
  ];
  const progressive = (value, bars, startAt = 0) => {
    let tax = 0;
    let prev = 0;
    for (const b of bars) {
      const lower = Math.max(prev, startAt);
      const upper = Math.min(value, b.max);
      const slice = upper - lower;
      if (slice > 0) tax += slice * b.r;
      prev = b.max;
      if (value <= prev) break;
    }
    return tax;
  };
  const reducedPart = Math.min(amount, 250000);
  const excess = Math.max(0, amount - 250000);
  const taxReduced = progressive(reducedPart, REDUCED);
  const taxExcess = excess > 0 ? progressive(amount, NORMAL, 250000) : 0;
  return Math.round((taxReduced + taxExcess) * 100) / 100;
};

//  🔴  PATCH v8.7.0 : CORRECTION des baremes officiels logement familial
// Sources : notaire.be (Fednot), Code droits succession wallon art. 60ter, 
//           Code droits succession RBC.
// 
// Bareme WALLONIE (ligne directe, logement familial, apres exoneration conjoint) :
//   0 - 25.000€     : 1%
//   25.000 - 50.000 : 2%
//   50.000 - 175.000: 5%   (tranches 50-160k et 160-175k fusionnees, meme taux)
//   175.000 - 250.000: 12%
//   250.000 - 500.000: 24%
//   > 500.000       : 30%
// 
// Bareme BRUXELLES (ligne directe, logement familial, plafond 250.000€ pour reduit) :
//   0 - 50.000€     : 2%
//   50.000 - 100.000: 5,3%
//   100.000 - 175.000: 6%
//   175.000 - 250.000: 12%
//   > 250.000 : tarif normal s'applique (plafond du tarif reduit)
const calcReducedHomeTax = (amount, reg) => {
  const BR_WAL = [
    { max: 25000,  r: 0.01 },
    { max: 50000,  r: 0.02 },
    { max: 175000, r: 0.05 },
    { max: 250000, r: 0.12 },
    { max: 500000, r: 0.24 },
    { max: Infinity, r: 0.30 }
  ];
  const BR_BRU = [
    { max: 50000,  r: 0.02  },
    { max: 100000, r: 0.053 },
    { max: 175000, r: 0.06  },
    { max: 250000, r: 0.12  },
    { max: Infinity, r: 0.12  }  // Plafond : le tarif reduit ne s'applique que jusqu'a 250.000€
  ];
  const bars = reg === "wallonie" ? BR_WAL : reg === "bruxelles" ? BR_BRU : null;
  if (!bars) return null;
  let tax = 0, prevMax = 0;
  // Bruxelles : plafond strict a 250.000€ pour l'application du tarif reduit
  const taxableAmount = reg === "bruxelles" ? Math.min(amount, 250000) : amount;
  for (const b of bars) {
    const tranche = Math.min(taxableAmount, b.max) - prevMax;
    if (tranche <= 0) break;
    tax += tranche * b.r;
    prevMax = b.max;
  }
  return Math.round(tax * 100) / 100;
};

const SUCC_T = {
  flandre: { "Conjoint/Ligne directe": [{ m: 50000, r: .03 }, { m: 250000, r: .09 }, { m: Infinity, r: .27 }], "Frere/Sœur": [{ m: 35000, r: .25 }, { m: 75000, r: .30 }, { m: Infinity, r: .55 }], "Oncle/Tante/Neveu/Niece": [{ m: 35000, r: .25 }, { m: 75000, r: .45 }, { m: Infinity, r: .55 }], "Autres": [{ m: 35000, r: .25 }, { m: 75000, r: .45 }, { m: Infinity, r: .55 }] },
  wallonie: { "Conjoint/Ligne directe": [{ m: 12500, r: .03 }, { m: 25000, r: .04 }, { m: 50000, r: .05 }, { m: 100000, r: .07 }, { m: 150000, r: .10 }, { m: 200000, r: .14 }, { m: 250000, r: .18 }, { m: 500000, r: .24 }, { m: Infinity, r: .30 }], "Frere/Sœur": [{ m: 12500, r: .20 }, { m: 25000, r: .25 }, { m: 75000, r: .35 }, { m: 175000, r: .50 }, { m: Infinity, r: .65 }], "Oncle/Tante/Neveu/Niece": [{ m: 12500, r: .25 }, { m: 25000, r: .30 }, { m: 75000, r: .40 }, { m: 175000, r: .55 }, { m: Infinity, r: .70 }], "Autres": [{ m: 12500, r: .30 }, { m: 25000, r: .35 }, { m: 75000, r: .60 }, { m: Infinity, r: .80 }] },
  bruxelles: { "Conjoint/Ligne directe": [{ m: 50000, r: .03 }, { m: 100000, r: .08 }, { m: 175000, r: .09 }, { m: 250000, r: .18 }, { m: 500000, r: .24 }, { m: Infinity, r: .30 }], "Frere/Sœur": [{ m: 12500, r: .20 }, { m: 25000, r: .25 }, { m: 50000, r: .30 }, { m: 100000, r: .40 }, { m: 175000, r: .55 }, { m: 250000, r: .60 }, { m: Infinity, r: .65 }], "Oncle/Tante/Neveu/Niece": [{ m: 50000, r: .35 }, { m: 100000, r: .50 }, { m: 175000, r: .60 }, { m: Infinity, r: .70 }], "Autres": [{ m: 50000, r: .40 }, { m: 75000, r: .55 }, { m: 175000, r: .65 }, { m: Infinity, r: .80 }] },
};
const calcSucc = (amount, reg, rel) => { const br = SUCC_T[reg]?.[rel]; if (!br) return 0; let t = 0, p = 0; for (const b of br) { const s = Math.min(amount, b.m) - p; if (s <= 0) break; t += s * b.r; p = b.m; } return t; };
const calcSpeedFine = (over, isAgglo, isBelgianResident = false) => {
  if (over <= 0) return null;
  const perKm = isAgglo ? 11 : 6;
  const immFine = 53 + (over > 10 ? (over - 10) * perKm : 0);
  const grave = over > (isAgglo ? 30 : 40);
  const exceedsCap = isBelgianResident && immFine > 347;
  const tribFine = grave ? "Dossier transmis au parquet (sanctions judiciaires probables)" : `Risque tribunal : De ${80 * 8} EUR a ${250 * 8} EUR (decimes inclus)`;
  const dech = grave ? "Retrait immediat et/ou decheance possibles" : over > 20 && isAgglo ? "Possible (a l'appreciation du juge)" : "Faible (sauf recidive)";
  return { immFine, tribFine, dech, grave, isAgglo, exceedsCap };
};
const toIsoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const getEasterSunday = (year) => {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};
const getBelgianLegalHolidays = (year) => {
  const easterSunday = getEasterSunday(year);
  const holidays = new Set([
    `${year}-01-01`,
    toIsoLocal(new Date(easterSunday.getTime() + 86400000)),
    `${year}-05-01`,
    toIsoLocal(new Date(easterSunday.getTime() + 39 * 86400000)),
    toIsoLocal(new Date(easterSunday.getTime() + 50 * 86400000)),
    `${year}-07-21`, `${year}-08-15`, `${year}-11-01`, `${year}-11-11`, `${year}-12-25`
  ]);
  return holidays;
};
const isBelgianWorkingDay = (date) => {
  const day = date.getDay();
  if (day === 0) return false;
  return !getBelgianLegalHolidays(date.getFullYear()).has(toIsoLocal(date));
};
const addThreeWorkingDays = (date) => {
  const result = new Date(date);
  let added = 0;
  while (added < 3) {
    result.setDate(result.getDate() + 1);
    if (isBelgianWorkingDay(result)) added++;
  }
  return result;
};
const calcNewRegime = (months, isDemission) => {
  const years = Math.floor(months / 12);
  if (isDemission) {
    if (months < 3) return 1; if (months < 6) return 2; if (months < 12) return 3;
    if (months < 18) return 4; if (months < 24) return 5;
    if (years < 4) return 6; if (years < 5) return 7; if (years < 6) return 9;
    if (years < 7) return 10; if (years < 8) return 12;
    return 13;
  } else {
    if (months < 3) return 1; if (months < 4) return 3; if (months < 5) return 4;
    if (months < 6) return 5; if (months < 9) return 6; if (months < 12) return 7;
    if (months < 15) return 8; if (months < 18) return 9; if (months < 21) return 10;
    if (months < 24) return 11; if (years < 3) return 12; if (years < 4) return 13;
    if (years < 5) return 15; if (years < 6) return 18; if (years < 7) return 21;
    if (years < 8) return 24; if (years < 9) return 27; if (years < 10) return 30;
    if (years < 11) return 33; if (years < 12) return 36; if (years < 13) return 39;
    if (years < 14) return 42; if (years < 15) return 45; if (years < 16) return 48;
    if (years < 17) return 51; if (years < 18) return 54; if (years < 19) return 57;
    if (years < 20) return 60; if (years < 21) return 62;
    return 62 + (years - 20);
  }
};

/* ============================================================
   ✅ CORRECTIF CRITIQUE 3 — PRÉAVIS : SUPPRESSION DE L'ARRONDI DANGEREUX
   Bug critique : conversion jours → mois via 30,44 + round()
   pouvait faire basculer dans une mauvaise tranche.
   Solution minimale : floor() au lieu de round().
   ============================================================ */
const calcPreavis = (startDate, notifDate, notifType, salaryBrut, isOuvrier, isDemission) => {
  const start = new Date(startDate), notif = new Date(notifDate);
  if (isNaN(start) || isNaN(notif)) return null;
  let effectiveDate = new Date(notif);
  if (notifType === "recommande") effectiveDate = addThreeWorkingDays(notif);
  const day = effectiveDate.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  let preavisStart = new Date(effectiveDate);
  preavisStart.setDate(preavisStart.getDate() + daysUntilMonday);
  const ancienneteFin = new Date(preavisStart);
  ancienneteFin.setDate(ancienneteFin.getDate() - 1);
  const cutoff = new Date("2014-01-01");
  // ✅ FIX CRITIQUE : floor() au lieu de round() pour éviter les basculements de tranche
  const totalMonths = Math.max(0, Math.floor((ancienneteFin - start) / (1000 * 60 * 60 * 24 * 30.44)));
  const totalYears = totalMonths / 12;
  let weeksOld = 0, weeksNew = 0;
  if (isDemission) {
    weeksNew = calcNewRegime(totalMonths, isDemission);
  } else {
    if (start < cutoff) {
      const oldMonths = Math.max(0, Math.round((Math.min(ancienneteFin, cutoff) - start) / (1000 * 60 * 60 * 24 * 30.44)));
      const oldYears = oldMonths / 12;
      weeksOld = isOuvrier ? Math.round(oldYears * 2.86) : Math.round(oldYears * 3);
      const newMonths = Math.max(0, Math.round((ancienneteFin - cutoff) / (1000 * 60 * 60 * 24 * 30.44)));
      weeksNew = calcNewRegime(newMonths, isDemission);
    } else {
      weeksNew = calcNewRegime(totalMonths, isDemission);
    }
  }
  const finalWeeks = Math.max(1, weeksOld + weeksNew);
  const weeklyGross = salaryBrut / 52;
  const indemnity = finalWeeks * weeklyGross;
  return { weeksOld, weeksNew, totalWeeks: finalWeeks, totalMonths, indemnity, totalYears: totalYears.toFixed(1), isDemission, preavisStart, effectiveDate, ancienneteFin };
};

const getCoutEnfantParAge = (age) => { if (age < 3) return 450; if (age < 6) return 480; if (age < 12) return 520; if (age < 18) return 580; return 550; };
const calcRenard = (revP1, revP2, nEnfants, ages, jours1, allocMontant, allocParent) => {
  if (revP1 === undefined || revP2 === undefined || !nEnfants) return null;
  const coutTotalBrut = ages.reduce((s, age) => s + getCoutEnfantParAge(age), 0);
  const alloc = allocMontant || 0; const coutTotalNet = Math.max(0, coutTotalBrut - alloc);
  const totalRev = revP1 + revP2; const partP1 = totalRev > 0 ? revP1 / totalRev : 0.5;
  const contributionP1 = coutTotalNet * partP1; const fractionP1 = jours1 / 365;
  const coutDirectP1 = coutTotalNet * fractionP1; const transfertBrut = contributionP1 - coutDirectP1;
  let ajustAlloc = 0;
  if (allocParent === 1) ajustAlloc = alloc * (1 - fractionP1); else ajustAlloc = -alloc * fractionP1;
  const transfertFinal = Math.round(transfertBrut + ajustAlloc);
  return { costChildBrut: coutTotalBrut, costChild: Math.round(coutTotalNet), alloc, partP1: (partP1 * 100).toFixed(0), partP2: ((1 - partP1) * 100).toFixed(0), transfer: transfertFinal, fromP1: transfertFinal > 0, monthlyMin: Math.abs(Math.round(transfertFinal * 0.85)), monthlyMax: Math.abs(Math.round(transfertFinal * 1.15)) };
};
const INDEMNITE_PROC = [
  { max: 250, base: 235.47, min: 117.73, mx: 470.93 }, { max: 750, base: 313.95, min: 196.22, mx: 784.88 },
  { max: 2500, base: 627.91, min: 313.95, mx: 1569.77 }, { max: 5000, base: 1020.35, min: 588.66, mx: 2354.65 },
  { max: 10000, base: 1412.80, min: 784.88, mx: 3139.55 }, { max: 20000, base: 1726.74, min: 981.10, mx: 3924.42 },
  { max: 40000, base: 3139.55, min: 1569.77, mx: 6279.10 }, { max: 60000, base: 3924.44, min: 1962.22, mx: 7848.88 },
  { max: 100000, base: 4709.33, min: 2354.66, mx: 9418.66 }, { max: 250000, base: 7848.84, min: 1569.77, mx: 15697.67 },
  { max: 500000, base: 10988.37, min: 1569.77, mx: 21976.74 }, { max: 1000000, base: 15697.67, min: 1569.77, mx: 31395.35 },
  { max: Infinity, base: 23546.51, min: 1569.77, mx: 47093.02 },
];
const GREFFE_FEES = { paix: 50, premiere: 165, entreprise: 165, appel: 210 };
const calcFraisJustice = (amount, jurisdiction, isAcq, isNonEvaluable) => {
  let ipBase, ipMin, ipMax;
  if (isNonEvaluable) { ipBase = 1883.72; ipMin = 117.73; ipMax = 15697.67; }
  else { const ip = INDEMNITE_PROC.find(b => amount <= b.max) || INDEMNITE_PROC[INDEMNITE_PROC.length - 1]; ipBase = ip.base; ipMin = ip.min; ipMax = ip.mx; }
  if (isAcq) ipBase = Math.min(ipBase * 0.25, 1400);
  const miseAuRole = GREFFE_FEES[jurisdiction] || 165; const huissier = 280; const divers = 150;
  const totalWin = miseAuRole + huissier + divers; const totalLose = miseAuRole + huissier + divers + ipBase;
  return { ip: ipBase, ipMin, ipMax, miseAuRole, huissier, divers, totalWin, totalLose, jpWarning: jurisdiction === "paix" && amount > 5000 && !isNonEvaluable, isAcq, isNonEvaluable };
};
const getJuridometreResult = (a) => {
  let travail = 3, famille = 3, immo = 2, route = 2, fiscal = 3, succession = 4; let recs = [];
  if (a[0] === "Employe CDD") { travail = 7; recs.push({ z: "Travail", t: "Verifiez les clauses de rupture et de renouvellement de votre CDD." }); }
  if (a[0] === "Independant") { travail = 5; fiscal = 6; recs.push({ z: "Fiscal & Statut", t: "Assurez-vous d'avoir une assurance revenu garanti et une protection juridique." }); }
  if (a[1] === "Marie(e)" && a[3] === "Pas de contrat") { famille = 6; recs.push({ z: "Famille", t: "Sans contrat, vous etes soumis au regime legal. Consultez un notaire." }); }
  if (a[1] === "Cohabitant(e) de fait") { famille = 7; recs.push({ z: "Famille", t: "La cohabitation de fait n'offre aucune protection successorale automatique. Un testament est recommande." }); }
  if (a[4] === "Oui, avec credit") { immo = 5; recs.push({ z: "Immobilier", t: "Verifiez que votre assurance solde restant du couvre la totalite du capital." }); }
  if (a[7] === "Non") { succession = 7; recs.push({ z: "Succession", t: "Sans testament, la devolution legale stricte s'applique. Une planification peut optimiser la fiscalite." }); }
  if (recs.length === 0) recs.push({ z: "General", t: "Votre profil de risque est faible. Maintenez vos documents a jour." });
  return { travail, famille, immo, route, fiscal, succession, total: Math.round((travail + famille + immo + route + fiscal + succession) / 6 * 10) / 10, recs };
};
const J_QUESTIONS = [
  { q: "Situation professionnelle", opts: ["Employe CDI", "Employe CDD", "Independant", "Fonctionnaire", "Sans emploi"] },
  { q: "Situation familiale", opts: ["Marie(e)", "Cohabitant(e) legal(e)", "Cohabitant(e) de fait", "Celibataire"] },
  { q: "Enfants a charge", opts: ["Aucun", "1-2 enfants", "3+ enfants"] },
  { q: "Regime matrimonial", opts: ["Legal (communaute)", "Separation de biens", "Pas de contrat", "Ne sait pas"] },
  { q: "Proprietaire immobilier", opts: ["Oui, avec credit", "Oui, sans credit", "Locataire"] },
  { q: "Vehicule", opts: ["Oui, +15.000 km/an", "Oui, -15.000 km/an", "Non"] },
  { q: "Gerant/administrateur de societe", opts: ["Oui", "Non"] },
  { q: "Testament redige", opts: ["Oui", "Non"] },
];
//  ═══  COMPOSANTS  ═══
const Input = ({ value, onChange, placeholder, type, style: st, disabled }) => (<input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type || "text"} disabled={disabled} style={{ width: "100%", padding: "12px 16px", background: disabled ? T.s3 : T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border .2s", opacity: disabled ? 0.6 : 1, ...st }} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.bdr} />);
const Pill = ({ active, onClick, children, color }) => (<button className="no-print" onClick={onClick} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${active ? (color || T.pri) + "44" : T.bdr}`, background: active ? `linear-gradient(135deg, ${(color || T.pri) + "12"}, ${(color || T.pri) + "06"})` : "transparent", color: active ? color || T.pri : T.muted, fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>{children}</button>);
const Card = ({ children, highlight, onClick, style: st, isPrintable, className }) => (<div onClick={onClick} className={`${isPrintable ? "print-section " : ""}${className || ""}`} style={{ background: T.surface, border: `1px solid ${highlight ? T.pri + "33" : T.bdr}`, borderRadius: 14, padding: "20px 22px", marginBottom: 10, boxShadow: "0 1px 4px rgba(44,31,20,0.04)", transition: "all .25s", cursor: onClick ? "pointer" : "default", ...st }}  onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 6px 24px rgba(166,93,103,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; } }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(44,31,20,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>{children}</div>);
const LinkBtn = ({ href, children }) => (<a className="no-print" href={href} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 18px", borderRadius: 8, background: T.priGrad, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(166,93,103,0.25)" }}>{children}</a>);
const SectionHead = ({ title, sub }) => (<div className="no-print" style={{ marginBottom: 24 }}><h2 style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 24, fontWeight: 700, color: T.txt, margin: 0 }}>{title}</h2>{sub && <p style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, color: T.muted, marginTop: 6, lineHeight: 1.6 }}>{sub}</p>}</div>);
const Divider = ({ label, color }) => (<div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 16px" }}><div style={{ width: 3, height: 16, background: `linear-gradient(180deg, ${color || T.pri}, ${color || T.pri}44)`, borderRadius: 2 }} /><span style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700, color: color || T.pri, textTransform: "uppercase", letterSpacing: 2 }}>{label}</span><div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.bdr}, transparent)` }} /></div>);
const Disclaimer = ({ children }) => (<div style={{ padding: "14px 18px", background: T.s2, borderRadius: 10, marginTop: 20, border: `1px solid ${T.bdr}` }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 9, fontWeight: 700, color: T.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Orientation Assistee</div><p style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, color: T.muted, lineHeight: 1.6, margin: 0 }}>{children || "Cet outil fournit une simulation indicative qui ne se substitue pas a une consultation juridique professionnelle."}</p></div>);
const PrintBtn = () => (<button className="no-print" onClick={() => window.print()} style={{ marginTop: 16, width: "100%", padding: "12px", background: T.s2, border: `1px dashed ${T.pri}`, borderRadius: 8, color: T.pri, fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>Telecharger en PDF ou Imprimer le rapport</button>);
const SourceBadge = ({ type, source, bareme }) => (<div className="no-print" style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 6, padding: "6px 10px", background: T.s2, borderRadius: 6, border: `1px solid ${T.bdr}`, fontSize: 10, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", marginTop: 12 }}><span style={{ color: T.pri, fontWeight: 'bold' }}>{type} :</span> {source} {bareme && <><span style={{ opacity:  0.5 }}>|</span> <span style={{ fontWeight: 'bold' }}>Bareme :</span> {bareme}</>}</div>);
const GuideCard = ({ g }) => { const [isE, setIsE] = useState(false); return (<Card highlight={isE} onClick={() => setIsE(!isE)} style={{ borderLeft: isE ? `3px solid ${T.pri}` : `1px solid ${T.bdr}` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 16, fontWeight: 600 }}>{g.title}</div><span style={{ color: T.dim, transform: isE ? "rotate(180deg)" : "none", transition: "transform .2s" }}>&#9662;</span></div>{isE && (<div style={{ marginTop: 14, borderTop: `1px solid ${T.s3}`, paddingTop: 14 }} onClick={e => e.stopPropagation()}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>{g.intro}</div><div style={{ padding: "14px 16px", background: T.s2, borderRadius: 10, marginBottom: 10 }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, fontWeight: 700, color: T.pri, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Comment utiliser</div>{g.steps.map((s, i) => (<div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, lineHeight: 1.6 }}><span style={{ color: T.pri, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span><span>{s}</span></div>))}</div><div style={{ padding: "14px 16px", background: T.green + "06", borderRadius: 10, borderLeft: `3px solid ${T.green}`, marginBottom: 10 }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Conseils</div>{g.tips.map((t, i) => (<div key={i} style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${T.green}22` }}>{t}</div>))}</div><div style={{ padding: "14px 16px", background: T.red + "06", borderRadius: 10, borderLeft: `3px solid ${T.red}` }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, fontWeight: 700, color: T.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Pieges a eviter</div>{g.pitfalls.map((p, i) => (<div key={i} style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${T.red}22` }}>{p}</div>))}</div></div>)}</Card>); };
const GuideBlock = ({ sections, label }) => (<div><Divider label={label} color={label === "Sections juridiques" ? T.dim : T.pri} />{sections.map(g => <GuideCard key={g.id} g={g} />)}</div>);
//  ═══  APP  ═══
export default function JuratonePro() {
  const [pg, setPg] = useState("home");
  const [docSub, setDocSub] = useState("biblio"); const [biblioMat, setBiblioMat] = useState("Tous");
  const [notSub, setNotSub] = useState("immo");
  const [iP, setIP] = useState(""); const [iR, setIR] = useState("bruxelles");
  const [iCondPhysique, setICondPhysique] = useState(true); const [iCondPleineProp, setICondPleineProp] = useState(true);
  const [iCondPasAutre, setICondPasAutre] = useState(true); const [iCondDomicile, setICondDomicile] = useState(true);
  const [iN, setIN] = useState(false); const [iRes, setIRes] = useState(null); const [iSautsPeb, setISautsPeb] = useState(0);
  const [iFlandreNatural, setIFlandreNatural] = useState(true);
  const [iFlandreFullOwnership, setIFlandreFullOwnership] = useState(true);
  const [iFlandreRegister3Y, setIFlandreRegister3Y] = useState(true);
  const [iFlandreStay1Y, setIFlandreStay1Y] = useState(true);
  const [iCharges, setICharges] = useState("0");
  const [iValeurVenale, setIValeurVenale] = useState("");
  const [sHomeVal, setSHomeVal] = useState(""); const [sOtherVal, setSOtherVal] = useState("");
  const [sR, setSR] = useState("bruxelles"); const [sRel, setSRel] = useState("Conjoint / Cohabitant legal");
  const [sFamWallonie5ans, setSFamWallonie5ans] = useState(false); const [sFamBruxellesExclu, setSFamBruxellesExclu] = useState(false);
  const [sBruxCohab1yr, setSBruxCohab1yr] = useState(false); const [sBruxCohab3yr, setSBruxCohab3yr] = useState(false);
  const [sFlandreStraightLine, setSFlandreStraightLine] = useState(false);
  const [sFlandreFacto3ans, setSFlandreFacto3ans] = useState(false);
  const [sRes, setSRes] = useState(null);
  const succRels = ["Conjoint / Cohabitant legal", "Cohabitant de fait (Flandre)", "Cohabitant de fait (Bruxelles)", "Ligne directe (Enfants/Parents)", "Frere/Sœur", "Oncle/Tante/Neveu/Niece", "Autres"];
  const relMap = { "Conjoint / Cohabitant legal": "Conjoint/Ligne directe", "Cohabitant de fait (Flandre)": "Conjoint/Ligne directe", "Cohabitant de fait (Bruxelles)": "Conjoint/Ligne directe", "Ligne directe (Enfants/Parents)": "Conjoint/Ligne directe", "Frere/Sœur": "Frere/Sœur", "Oncle/Tante/Neveu/Niece": "Oncle/Tante/Neveu/Niece", "Autres": "Autres" };
  const [rSpeed, setRSpeed] = useState(""); const [rLimit, setRLimit] = useState("50"); const [rAgglo, setRAgglo] = useState(false); const [rResident, setRResident] = useState(false); const [rRes, setRRes] = useState(null);
  const [pStart, setPStart] = useState(""); const [pNotifDate, setPNotifDate] = useState(""); const [pNotifType, setPNotifType] = useState("recommande");
  const [pSal, setPSal] = useState(""); const [pOuv, setPOuv] = useState(false); const [pDem, setPDem] = useState(false); const [pRes, setPRes] = useState(null);
  useEffect(() => { if (!pDem && pNotifType === "main") { setPNotifType("recommande"); } }, [pDem, pNotifType]);
  const [penR1, setPenR1] = useState(""); const [penR2, setPenR2] = useState(""); const [penN, setPenN] = useState("1"); const [penA, setPenA] = useState("8"); const [penMode, setPenMode] = useState("182"); const [penAlloc, setPenAlloc] = useState(""); const [penAllocP, setPenAllocP] = useState(1); const [penRes, setPenRes] = useState(null); const [penErr, setPenErr] = useState("");
  const [fjA, setFjA] = useState(""); const [fjJ, setFjJ] = useState("premiere"); const [fjAcq, setFjAcq] = useState(false); const [fjNonEvaluable, setFjNonEvaluable] = useState(false); const [fjRes, setFjRes] = useState(null);
  const [actCl, setActCl] = useState(null); const [clOpts, setClOpts] = useState({});
  const [chk, setChk] = useState(() => { if (typeof window !== "undefined") { try { const s = localStorage.getItem("juratone_checklists"); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } } return {}; });
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("juratone_checklists", JSON.stringify(chk)); }, [chk]);
  const [jStep, setJStep] = useState(0); const [jResult, setJResult] = useState(null);
  const [jAnswers, setJAnswers] = useState(() => { if (typeof window !== "undefined") { try { const s = localStorage.getItem("juratone_jAnswers"); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } } return {}; });
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("juratone_jAnswers", JSON.stringify(jAnswers)); }, [jAnswers]);
  const [idxApiState, setIdxApiState] = useState("idle"); const [idxData, setIdxData] = useState([]); const [idxBaseAmount, setIdxBaseAmount] = useState(""); const [idxBaseMonth, setIdxBaseMonth] = useState(""); const [idxNewMonth, setIdxNewMonth] = useState(""); const [idxBail, setIdxBail] = useState(true); const [idxPeb, setIdxPeb] = useState("A"); const [idxReg, setIdxReg] = useState("bruxelles"); 
  const [idxLeaseStart, setIdxLeaseStart] = useState("");
  const [idxResult, setIdxResult] = useState(null);
  //  🔴  PATCH v8.7.0 : Donnees OFFICIELLES Statbel etendues de Mars 2024 a Mars 2026
  // Source : https://bestat.statbel.fgov.be/bestat/api/views/a79922d0-19ce-411a-9902-9a3f95127d4d/result/JSON
  // Base 2013=100. Les valeurs 2026 sont converties depuis base 2025=100 via coef 0,7376
  //   (nouvelle base officielle Statbel depuis janvier 2026).
  // Janvier 2026 base 2025 = 101,33 -> base 2013 = 101,33/0,7376 = 137,38
  // Fevrier 2026 base 2025 = 101,84 -> base 2013 = 101,84/0,7376 = 138,07
  // Mars 2026 base 2025 = 101,63 -> base 2013 = 101,63/0,7376 = 137,78 (confirme par indexsalaire.be)
  const loadDemoData = () => { 
    setIdxApiState("loading"); 
    const realResponse = [
      { month: "Mars 2024", value: 131.62 }, 
      { month: "Avril 2024", value: 132.09 }, 
      { month: "Mai 2024", value: 132.32 }, 
      { month: "Juin 2024", value: 132.55 }, 
      { month: "Juillet 2024", value: 133.00 }, 
      { month: "Aout 2024", value: 133.40 }, 
      { month: "Septembre 2024", value: 133.05 }, 
      { month: "Octobre 2024", value: 133.56 }, 
      { month: "Novembre 2024", value: 133.91 }, 
      { month: "Decembre 2024", value: 133.73 }, 
      { month: "Janvier 2025", value: 135.52 }, 
      { month: "Fevrier 2025", value: 135.79 },
      { month: "Mars 2025", value: 135.91 },
      { month: "Avril 2025", value: 134.77 },
      { month: "Mai 2025", value: 134.54 },
      { month: "Juin 2025", value: 135.04 },
      { month: "Juillet 2025", value: 135.60 },
      { month: "Aout 2025", value: 135.64 },
      { month: "Septembre 2025", value: 135.26 },
      { month: "Octobre 2025", value: 135.76 },
      { month: "Novembre 2025", value: 136.49 },
      { month: "Decembre 2025", value: 136.69 },
      { month: "Janvier 2026", value: 137.38 },
      { month: "Fevrier 2026", value: 138.07 },
      { month: "Mars 2026", value: 137.78 }
    ]; 
    setIdxData(realResponse); 
    setIdxBaseMonth(realResponse[0].month); 
    setIdxNewMonth(realResponse[realResponse.length - 1].month); 
    setIdxApiState("success"); 
  };
  const doIndexation = () => { 
    if (!idxBaseAmount || !idxBaseMonth || !idxNewMonth) return; 
    const baseValue = idxData.find(d => d.month === idxBaseMonth)?.value; 
    const latestValue = idxData.find(d => d.month === idxNewMonth)?.value; 
    if (baseValue && latestValue) { 
      const baseRent = parseFloat(idxBaseAmount); 
      let rawNewAmount = (baseRent * latestValue) / baseValue; 
      let correctedAmount = rawNewAmount; 
      let pebNote = ""; 
      let blocked = false; 
      let needsOfficialCalculator = false;
      if (idxBail) { 
        if (idxReg === "bruxelles") { 
          const leaseStart = idxLeaseStart ? new Date(idxLeaseStart) : null;
          const bruxFactorApplies = leaseStart && leaseStart < new Date("2022-10-14");
          if (idxPeb === "Inconnu / Sans PEB") { 
            correctedAmount = baseRent; 
            pebNote = "Bruxelles : L'indexation requiert un bail enregistre ET un certificat PEB valide. Indexation bloquee."; 
            blocked = true; 
          } 
          else if (/[EFG]/.test(idxPeb) && bruxFactorApplies) { 
            pebNote = "Bruxelles (bail < 14/10/2022 + PEB E/F/G) : Facteur de correction legal possible. Utilisez le calculateur officiel SPF pour le montant exact."; 
            needsOfficialCalculator = true; 
          } 
          else if (/[EFG]/.test(idxPeb)) { 
            pebNote = "Bruxelles (bail >= 14/10/2022) : Indexation standard sous reserve de bail enregistre et PEB communique."; 
          }
          else { 
            pebNote = "Bruxelles : Indexation autorisee a 100% (sous reserve de bail enregistre et PEB communique)."; 
          } 
        } else if (idxReg === "wallonie") { 
          if (idxPeb === "Inconnu / Sans PEB") {
            correctedAmount = baseRent;
            pebNote = "Wallonie : L'indexation requiert un bail enregistre ET un certificat PEB valide. Indexation bloquee.";
            blocked = true;
          }
          else if (/[DEFG]/.test(idxPeb)) { 
            pebNote = "Wallonie (PEB D/E/F/G) : Regime de calcul specifique post-01/11/2023. Le montant exact doit etre verifie via le calculateur officiel SPF/Statbel."; 
            needsOfficialCalculator = true; 
          } 
          else { 
            pebNote = "Wallonie : Indexation autorisee a 100% (sous reserve d'enregistrement et demande ecrite)."; 
          } 
        } else if (idxReg === "flandre") { 
          const leaseStart = idxLeaseStart ? new Date(idxLeaseStart) : null;
          const flandrePost2019 = leaseStart && leaseStart >= new Date("2019-01-01");
          pebNote = flandrePost2019 ? "Flandre (bail >= 01/01/2019) : Indice de base = mois precedant l'entree en vigueur." : "Flandre (bail < 01/01/2019) : Indice de base = mois precedant la signature."; 
          if (/[DEFGI]/.test(idxPeb)) { 
            pebNote += " Un correctiefactor peut s'appliquer. Referez-vous a IndexSearch."; 
            needsOfficialCalculator = true; 
          } 
        } 
      } 
      setIdxResult({ 
        newAmount: (blocked || needsOfficialCalculator) ? null : correctedAmount,
        rawAmount: rawNewAmount,
        baseValue,
        latestValue,
        latestMonth: idxNewMonth,
        pebNote,
        blocked,
        needsOfficialCalculator
      }); 
    } 
  };
  const rl = { flandre: "Flandre", wallonie: "Wallonie", bruxelles: "Bruxelles" };
  const doImmo = () => { const p = parseFloat(iP) || 0; if (!p) return; const conditionsMet = iCondPhysique && iCondPleineProp && iCondPasAutre && iCondDomicile; const flandreCond2026 = iR === "flandre" ? { natural: iFlandreNatural, fullOwnership: iFlandreFullOwnership, register3Y: iFlandreRegister3Y, stay1Y: iFlandreStay1Y } : null; const charges = parseFloat(iCharges) || 0; const valeurVenale = parseFloat(iValeurVenale) || 0; const rr = calcRR(p, iR, conditionsMet, parseInt(iSautsPeb) || 0, flandreCond2026, charges, valeurVenale); const nf = calcNF(p); const nv = nf * .21; const tot = (iN ? 0 : rr) + nf + nv + 1180 + (iN ? p * .21 : 0); setIRes({ rr, nf, nv, tva: iN ? p * .21 : 0, tot, p, iR, conditionsMet, iN, energyJumps: parseInt(iSautsPeb) || 0, flandreCond2026, charges, valeurVenale }); };
  
  const doSucc = () => { 
    const home = parseFloat(sHomeVal) || 0; const other = parseFloat(sOtherVal) || 0;
    if (!home && !other) return;
    if (sRel === "Cohabitant de fait (Flandre)" && sR !== "flandre") { setSRes({ taxHome: 0, taxOther: 0, totalTax: 0, rate: "0.00", home, other, total: home+other, sR, sRel,  advantageMode: "none", advantageNotCalculated: false, warning: "Cette categorie n'est prevue ici que pour la Flandre." }); return; }
    const mappedRel = relMap[sRel]; 
    let taxHome = calcSucc(home, sR, mappedRel); 
    let taxOther = calcSucc(other, sR, mappedRel);
    let advantageMode = "none"; let warning = "";
    let advantageNotCalculated = false;
    const applyExemptionToHome = () => { taxHome = 0; advantageMode = "full_exemption"; };
    if (sR === "flandre") {
      if (sRel === "Conjoint / Cohabitant legal") {
        if (sFlandreStraightLine) { warning = "Flandre : parente en ligne directe = exclusion de l'avantage logement familial."; }
        else { applyExemptionToHome(); }
      } else if (sRel === "Cohabitant de fait (Flandre)") {
        if (!sFlandreFacto3ans) { warning = "Flandre : necessite 3 ans de cohabitation ininterrompue."; }
        else if (sFlandreStraightLine) { warning = "Flandre : cohabitant de fait parent en ligne directe = exclusion de l'avantage logement familial."; }
        else { applyExemptionToHome(); }
      }
    } else if (sR === "wallonie" && sRel === "Conjoint / Cohabitant legal") {
      if (sFamWallonie5ans) { applyExemptionToHome(); } else { warning = "Wallonie : necessite 5 ans de residence principale (condition supprimee pour deces a partir de 2028)."; }
    } 
    else if (sR === "wallonie" && sRel === "Ligne directe (Enfants/Parents)") {
      const reduced = calcReducedHomeTax(home, "wallonie");
      if (reduced !== null) { taxHome = reduced; advantageMode = "reduced_rate"; }
    }
    /* ============================================================
       ✅ CORRECTIF 2 — INTÉGRATION DANS doSucc : BRUXELLES LIGNE DIRECTE
       Utilisation de calcReducedHomeTaxBrussels pour taxer le surplus >250k
       ============================================================ */
    else if (sR === "bruxelles" && sRel === "Ligne directe (Enfants/Parents)") {
      const reduced = calcReducedHomeTaxBrussels(home);
      taxHome = reduced;
      advantageMode = "reduced_rate";
    }
    else if (sR === "bruxelles") {
      if (sRel === "Conjoint / Cohabitant legal" && !sFamBruxellesExclu) { applyExemptionToHome(); }
      else if (sRel === "Cohabitant de fait (Bruxelles)") {
        if (sBruxCohab3yr) {
          warning = "Bruxelles : cohabitation de fait effective + menage commun au moins 3 ans. Un tarif reduit sur le logement familial est possible, mais le montant exact depend du regime legal applicable.";
          advantageMode = "reduced_rate";
          advantageNotCalculated = true;
        } 
        else if (sBruxCohab1yr) {
          warning = "Bruxelles : cohabitation de fait effective + menage commun au moins 1 an. Tarif partenaire applicable (sans exoneration du logement familial).";
          advantageMode = "partner_rate_only";
          advantageNotCalculated = true;
        }
      }
      else { warning = "Bruxelles : conditions d'avantage non remplies."; }
    }
    setSRes({ taxHome, taxOther, totalTax: taxHome + taxOther, rate: ((taxHome+taxOther)/(home+other)*100 || 0).toFixed(2), home, other, total: home+other, sR, sRel, advantageMode, advantageNotCalculated, warning });
  };
  
  const doRoutier = () => { const s = parseInt(rSpeed), l = parseInt(rLimit); if (!s || !l) return; setRRes(calcSpeedFine(s - l, rAgglo, rResident)); };
  const doPreavis = () => { setPRes(calcPreavis(pStart, pNotifDate, pNotifType, parseFloat(pSal), pOuv, pDem)); };
  const doPension = () => { setPenErr(""); setPenRes(null); const r1 = penR1 === "" ? 0 : parseFloat(penR1); const r2 = penR2 === "" ? 0 : parseFloat(penR2); const n = parseInt(penN); const j = parseInt(penMode) || 0; const al = parseFloat(penAlloc) || 0; if (isNaN(r1) || r1 < 0 || isNaN(r2) || r2 < 0) { setPenErr("Les revenus doivent etre des nombres positifs ou 0."); return; } if (!n || n <= 0) { setPenErr("Nombre d'enfants > 0."); return; } if (j < 0 || j > 365) { setPenErr("Jours entre 0 et 365."); return; } const ages = penA.split(",").map(a => parseInt(a.trim())).filter(a => !isNaN(a)); if (ages.length !== n) { setPenErr(`Entrez exactement ${n} age(s).`); return; } setPenRes(calcRenard(r1, r2, n, ages, j, al, penAllocP)); };
  const doFrais = () => { const a = parseFloat(fjA); if (!fjNonEvaluable && !a) return; setFjRes(calcFraisJustice(a, fjJ, fjAcq, fjNonEvaluable)); };
  const calcJuridometre = (ans) => { setJResult(getJuridometreResult(ans)); };
  return (
    <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", background: T.bg, color: T.txt, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Libre+Franklin:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `body{margin:0;background:${T.bgFlat};}@media print{body{background:white!important;}body *{visibility:hidden;}.print-section,.print-section *{visibility:visible;}.print-section{position:absolute;left:0;top:0;width:100%;border:none!important;box-shadow:none!important;}.no-print{display:none!important;}}` }} />
      <header className="no-print" style={{ padding: "16px 24px", borderBottom: "none", background: "linear-gradient(180deg, #FDFAFA 0%, #FDF4F5 100%)", boxShadow: "0 1px 12px rgba(166,93,103,0.06)" }}><div style={{ maxWidth: 920, margin: "0 auto",  display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPg("home")}><div style={{ width: 34, height: 34, borderRadius: 8, background: T.priGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white", fontFamily: "'Libre Franklin',sans-serif", boxShadow: "0 2px 8px rgba(166,93,103,0.3)" }}>JT</div><div><div style={{ fontSize: 17, fontWeight: 700, color: T.txt, letterSpacing: -.3 }}>Juratone Pro</div><div style={{ fontSize: 8, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", letterSpacing: 2.5, textTransform: "uppercase" }}>Plateforme juridique belge</div></div></div>{pg !== "home" && <button onClick={() => setPg("home")} style={{ background: "none", border: "none", color: T.pri, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, fontWeight: 600 }}>Accueil</button>}</div></header>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 24px 60px" }}>
        {pg === "home" && (<div className="no-print">
          <div style={{ textAlign: "center", padding: "48px 0 52px" }}><h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 10px", letterSpacing: -.5, background: "linear-gradient(135deg, #2D1E20 0%, #A65D67 60%, #8F4C55 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Votre droit, simplifie.</h1><p style={{ fontSize: 14, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Jurisprudence, doctrine, legislation et outils d'orientation assistee pour les professionnels du droit belge.</p></div>
          <Divider label="Ressources Juridiques" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>{[{ id: "jurisprudence", title: "Jurisprudence", desc: "Juportal, Lex.be, BelgiqueLex, Reflex et cours europeennes." }, { id: "doctrine", title: "Doctrine & Recherche", desc: "Plateformes, bibliotheque filtrable." }, { id: "legislation", title: "Legislation", desc: "Justel, Moniteur, EUR-Lex, codes consolides, Livre IX 2026." }].map(s => (<Card key={s.id} onClick={() => setPg(s.id)} style={{ borderLeft: `3px solid ${T.dim}` }}><div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{s.title}</div><div style={{ fontSize: 12, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", lineHeight: 1.6 }}>{s.desc}</div></Card>))}</div>
          <Divider label="Outils pratiques" color={T.pri} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>{[{ id: "indexation", title: "Indexation (Loyer / Contrat)", desc: "Donnees officielles Statbel Mars 2024 - Mars 2026 (25 mois)." }, { id: "notariat", sub: "immo", title: "Achat immobilier", desc: "Verification des conditions  d'enregistrement regionales." }, { id: "notariat", sub: "succession", title: "Succession", desc: "Calculs integrant les exonerations regionales." }, { id: "notariat", sub: "checklists", title: "Dossier Notarial", desc: "Checklists dynamiques." }, { id: "routier", title: "Infractions routieres", desc: "Perception immediate (SPF Mobilite)." }, { id: "preavis", title: "Simulateur de preavis", desc: "Bareme SPF Emploi (exact post-2014, indicatif pre-2014)." }, { id: "pension", title: "Frais d'enfant", desc: "Estimation indicative (methode Renard simplifiee)." }, { id: "fraisjustice", title: "Frais de justice", desc: "Indemnite de procedure (bareme mars 2025)." }, { id: "juridometre", title: "Diagnostic de vigilance", desc: "Profil de risque et actions recommandees." }].map(s => (<Card key={s.title} onClick={() => { setPg(s.id); if (s.sub) setNotSub(s.sub); }} style={{ borderLeft: `3px solid ${T.pri}88` }}><div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{s.title}</div><div style={{ fontSize: 12, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", lineHeight: 1.6 }}>{s.desc}</div></Card>))}</div>
          <Divider label="Apprendre" color={T.cyan} /><Card onClick={() => setPg("guide")} style={{ borderLeft: `3px solid ${T.cyan}` }}><div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Guide d'utilisation</div><div style={{ fontSize: 12, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", lineHeight: 1.6 }}>Mode d'emploi, conseils et pieges a eviter.</div></Card>
        </div>)}
        {pg === "indexation" && (<div className="no-print"><SectionHead title="Indexation (Loyer & Contrats)" sub="Calcul d'indexation base sur l'Indice Sante Statbel. Donnees officielles etendues : Mars 2024 a Mars 2026. Base 2013=100." />
          <Card><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 700 }}>Donnees officielles Statbel 2024-2026 (25 mois)</div><div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Indices Sante de reference (Base 2013). v8.7.0 : extension jusqu'a Mars 2026 (valeurs 2026 converties depuis la nouvelle base 2025=100 via coef 0,7376).</div></div><button onClick={loadDemoData} disabled={idxApiState === "loading"} style={{ padding: "10px 18px", background: idxApiState === "loading" ? T.dim : T.priGrad, border: "none", borderRadius: 8, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, fontWeight: 700, cursor: idxApiState === "loading" ? "wait" : "pointer" }}>{idxApiState === "loading" ? "Chargement..." : idxApiState === "success" ? "Donnees chargees" : "Charger les indices officiels"}</button></div>
            {idxApiState === "success" && (<div style={{ marginTop: 24, borderTop: `1px solid ${T.s3}`, paddingTop: 20 }}>
              <div style={{ marginBottom: 16 }}><label onClick={() => setIdxBail(!idxBail)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre  Franklin',sans-serif", fontSize: 13 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: idxBail ? T.green : T.s3, border: `1px solid ${idxBail ? T.green : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{idxBail ? "\u2713" : ""}</div>Il s'agit d'un bail d'habitation (verifications PEB regionales)</label></div>
              {idxBail && (<div style={{ marginBottom: 16, padding: 16, background: T.s2, borderRadius: 8, border: `1px solid ${T.bdr}` }}>
                <label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Region du bien loue</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>{["bruxelles", "flandre", "wallonie"].map(r => (<Pill key={r} active={idxReg === r} onClick={() => { setIdxReg(r); setIdxResult(null); }} color={T.pri}>{rl[r]}</Pill>))}</div>
                {idxReg === "flandre" && (<div style={{ marginBottom: 16 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Date d'entree en vigueur du bail</label><Input type="date" value={idxLeaseStart} onChange={v => { setIdxLeaseStart(v); setIdxResult(null); }} /></div>)}
                {idxReg === "bruxelles" && (<div style={{ marginBottom: 16 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Date d'entree en vigueur du bail (pour facteur PEB)</label><Input type="date" value={idxLeaseStart} onChange={v => { setIdxLeaseStart(v); setIdxResult(null); }} /></div>)}
                <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Certificat PEB</label><select value={idxPeb} onChange={e => { setIdxPeb(e.target.value); setIdxResult(null); }} style={{ width: "100%", padding: "12px 16px", background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}>{["A", "B", "C", "D", "E", "F", "G", "Inconnu / Sans PEB"].map(v => (<option key={v} value={v}>{v}</option>))}</select></div>
              </div>)}
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Loyer de base (EUR)</label><Input value={idxBaseAmount} onChange={v => { setIdxBaseAmount(v); setIdxResult(null); }} type="number" placeholder="1000" /></div></div>
              <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block",  marginBottom: 4 }}>Indice de base</label><select value={idxBaseMonth} onChange={e => { setIdxBaseMonth(e.target.value); setIdxResult(null); }} style={{ width: "100%", padding: "12px 16px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}>{idxData.map(d => (<option key={d.month} value={d.month}>{d.month} ({d.value})</option>))}</select></div><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Nouvel Indice</label><select value={idxNewMonth} onChange={e => { setIdxNewMonth(e.target.value); setIdxResult(null); }} style={{ width: "100%", padding: "12px 16px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}>{idxData.map(d => (<option key={d.month} value={d.month}>{d.month} ({d.value})</option>))}</select></div></div>
              <button onClick={doIndexation} disabled={!idxBaseAmount} style={{ marginTop: 16, padding: 14, background: !idxBaseAmount ? T.dim : `linear-gradient(135deg,${T.priH},${T.pri},#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: !idxBaseAmount ? "not-allowed" : "pointer", width: "100%" }}>Calculer l'indexation</button>
            </div>)}</Card>
          {idxResult && (<Card highlight isPrintable={true}><Divider label="Rapport — Indexation" color={T.pri} /><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}><div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Montant initial</span><span style={{ fontWeight: 600 }}>{fmt(parseFloat(idxBaseAmount))}</span></div><div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Indice de base ({idxBaseMonth})</span><span style={{ fontWeight: 600 }}>{idxResult.baseValue}</span></div><div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Nouvel indice ({idxResult.latestMonth})</span><span style={{ fontWeight: 600 }}>{idxResult.latestValue}</span></div>{idxResult.blocked && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.red }}>Montant brut (avant blocages PEB)</span><span style={{ fontWeight: 600, color: T.red }}><del>{fmt(idxResult.rawAmount)}</del></span></div>}<div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>NOUVEAU MONTANT ESTIME</span>
            {idxResult.newAmount !== null ? (
              <span style={{ fontSize: 22, fontWeight: 700, color: T.pri }}>{fmt(idxResult.newAmount)}</span>
            ) : (
              <span style={{ color: T.orange, fontSize: 14, fontWeight: 600 }}>Montant non calcule (calculateur officiel requis)</span>
            )}
          </div>
          {idxResult.needsOfficialCalculator && (
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
              Montant theorique (sans correctif legal) : {fmt(idxResult.rawAmount)}
            </div>
          )}
          </div>{idxBail && (
            <div style={{ padding: "12px 16px", background: idxResult.blocked ? T.red + "08" : idxResult.needsOfficialCalculator ? T.orange + "08" : T.green + "08", border: `1px solid ${idxResult.blocked ? T.red + "44" : idxResult.needsOfficialCalculator ? T.orange + "44" : T.green + "44"}`, borderRadius: 8, marginTop: 16, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.txt }}>
              <strong style={{ color: idxResult.blocked ? T.red : idxResult.needsOfficialCalculator ? T.orange : T.green }}>
                {idxResult.blocked ? "Indexation bloquee" : idxResult.needsOfficialCalculator ? "Calcul specifique requis" : "Regles d'indexation regionales"} :
              </strong>
              {idxResult.pebNote && <p style={{ margin: "6px 0 8px", color: idxResult.blocked ? T.red : idxResult.needsOfficialCalculator ? T.orange : T.pri, fontWeight: "bold" }}>{idxResult.pebNote}</p>}
              <ul style={{ margin: 0, paddingLeft: 20, color: T.muted, lineHeight: 1.6 }}>
                <li>L'indexation suppose un bail enregistre.</li>
                <li>L'effet retroactif est limite aux 3 mois precedant la demande ecrite.</li>
              </ul>
              {idxResult.blocked && <div style={{marginTop:8,padding:"6px 10px",background:T.red+"11",borderRadius:6,fontSize:10,color:T.red}}>Sans certificat PEB valide, l'indexation est juridiquement impossible dans cette region.</div>}
              {idxResult.needsOfficialCalculator && <div style={{marginTop:8,padding:"6px 10px",background:T.orange+"11",borderRadius:6,fontSize:10,color:T.orange}}>Pour ce cas, privilegiez le calculateur officiel SPF/Statbel pour un montant opposable.</div>}
            </div>
          )}<Disclaimer>Donnees Statbel officielles (API JSON). Pour la Wallonie et Bruxelles (PEB defavorables), privilegiez le calculateur officiel SPF/Statbel. Depuis janvier 2026, la base officielle est 2025=100 ; les valeurs 2026 sont converties ici en base 2013 via le coefficient 0,7376.</Disclaimer><SourceBadge type="Source" source="Statbel API (bestat.statbel.fgov.be)" bareme="Base 2013 - Mars 2024 a Mars 2026" /><PrintBtn /></Card>)}
        </div>)}
        {pg === "jurisprudence" && (<div className="no-print"><SectionHead title="Jurisprudence" sub="Bases de donnees officielles et plateformes gratuites (v8.7.0 : ajout de Lex.be, BelgiqueLex, Reflex)." />{JURIS.map(j => (<Card key={j.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}><div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{j.title}</div><div style={{ fontSize: 13, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", marginBottom: 6 }}>{j.desc}</div><span style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 9, color: T.pri, fontWeight: 700, textTransform: "uppercase" }}>{j.cat}</span></div>{j.url && <LinkBtn href={j.url}>Ouvrir</LinkBtn>}</div></Card>))}</div>)}
        {pg === "doctrine" && (<div className="no-print"><SectionHead title="Doctrine & Recherche" sub="Bibliotheque doctrinale structuree." />
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>{[{ id: "biblio", l: "Bibliotheque" }, { id: "platforms", l: "Plateformes externes" }].map(s => (<Pill key={s.id} active={docSub === s.id} onClick={() => setDocSub(s.id)}>{s.l}</Pill>))}</div>
          {docSub === "platforms" && DOC_PLATFORMS.map(d => (<Card key={d.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}><div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{d.title}</div><div style={{ fontSize: 13, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", marginBottom: 6 }}>{d.desc}</div><span style={{ padding: "3px 8px", background: T.s2,  border: `1px solid ${T.bdr}`, borderRadius: 4, fontSize: 9, color: T.muted }}>{d.acc}</span></div>{d.url && <LinkBtn href={d.url}>Ouvrir</LinkBtn>}</div></Card>))}
          {docSub === "biblio" && (<div><div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>{["Tous", ...DOC_MATIERES].map(m => (<Pill key={m} active={biblioMat === m} onClick={() => setBiblioMat(m)}>{m === "Tous" ? "Toutes matieres" : m}</Pill>))}</div>{DOC_BIBLIO.filter(b => biblioMat === "Tous" || b.mat === biblioMat).map(b => (<Card key={b.id}><div><div style={{ fontSize: 16, fontWeight: 600 }}>{b.title}</div><div style={{ fontSize: 13, color: T.cyan, fontFamily: "'Libre Franklin',sans-serif", marginBottom: 6 }}>{b.author} — {b.ed}</div><div style={{ display: "flex", gap: 6, marginBottom: 8 }}><span style={{ padding: "2px 8px", borderRadius: 12, background: T.priDim, color: T.pri, fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, fontWeight: 700 }}>{b.niv}</span><span style={{ padding: "2px 8px", borderRadius: 12, background: T.s2, border: `1px solid ${T.bdr}`, color: T.muted, fontFamily: "'Libre Franklin',sans-serif", fontSize: 10 }}>{b.type}</span></div><div style={{ fontSize: 13, color: T.muted, fontFamily: "'Libre Franklin',sans-serif" }}>{b.desc}</div></div></Card>))}</div>)}
        </div>)}
        {pg === "legislation" && (<div className="no-print"><SectionHead title="Legislation" sub="Textes legaux belges et europeens (v8.7.0 : ajout de EUR-Lex, DroitBelge codes, Gallilex, Lex.be, Livre IX 2026)." />{LEGIS.map(l => (<Card key={l.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}><div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{l.title}</div><div style={{ fontSize: 13, color: T.muted, fontFamily: "'Libre Franklin',sans-serif" }}>{l.desc}</div><span style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 9, color: T.pri, fontWeight: 700, textTransform: "uppercase" }}>{l.cat}</span></div>{l.url && <LinkBtn href={l.url}>Ouvrir</LinkBtn>}</div></Card>))}</div>)}
        {pg === "notariat" && (<div><SectionHead title="Outils notariaux" sub="Calculateurs et dossiers notaries." />
          <div className="no-print" style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>{[{ id: "immo", l: "Achat" }, { id: "succession", l: "Succession" }, { id: "checklists", l: "Dossier Notarial" }].map(s => (<Pill key={s.id} active={notSub === s.id} onClick={() => setNotSub(s.id)} color={T.pri}>{s.l}</Pill>))}</div>
          {notSub === "immo" && (<div><Card className="no-print"><Divider label="Calculateur de frais d'achat" color={T.pri} /><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Prix d'achat (EUR)</label><Input value={iP} onChange={v => { setIP(v); setIRes(null); }} type="number" placeholder="350000" /></div>
            <div style={{display:"flex",gap:12}}><div style={{flex:1}}><label style={{fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.muted,display:"block",marginBottom:4}}>Charges liees (EUR)</label><Input value={iCharges} onChange={v=>{setICharges(v);setIRes(null);}} type="number" placeholder="0"/></div><div style={{flex:1}}><label style={{fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.muted,display:"block",marginBottom:4}}>Valeur venale estimee (EUR)</label><Input value={iValeurVenale} onChange={v=>{setIValeurVenale(v);setIRes(null);}} type="number" placeholder="Optionnel"/></div></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Region</label><div style={{ display: "flex", gap: 6 }}>{["bruxelles", "flandre", "wallonie"].map(r => (<Pill key={r} active={iR === r} onClick={() => { setIR(r); setIRes(null); }} color={T.pri}>{rl[r]}</Pill>))}</div></div>
            <div style={{ background: T.s2, padding: 14, borderRadius: 8, border: `1px solid ${T.bdr}` }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700, color: T.pri, display: "block", marginBottom: 10 }}>Conditions legales (taux reduit / abattement)</label>
              {[[iCondPhysique, setICondPhysique, "Achat par personne physique en pleine propriete totale"], [iCondPasAutre, setICondPasAutre, "Pas d'autre bien d'habitation (ou engagement de revente)"], [iCondDomicile, setICondDomicile, "Engagement de domiciliation (residence principale)"]].map((o, i) => (<label key={i} onClick={() => { o[1](!o[0]); setIRes(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, color: T.txt, marginBottom: 8 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: o[0] ? T.cyan : T.s3, border: `1px solid ${o[0] ? T.cyan : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{o[0] ? "\u2713" : ""}</div>{o[2]}</label>))}</div>
            {iR === "flandre" && (<div style={{ background: T.priL, padding: 12, borderRadius: 8, border: `1px solid ${T.pri}44`, marginTop: 8 }}><div style={{fontSize:11,  fontWeight:700, color:T.pri, marginBottom:8}}>CONDITIONS FLANDRE 2026 (Taux 2%)</div>
              <label onClick={()=>{setIFlandreNatural(!iFlandreNatural);setIRes(null);}} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:12}}><div style={{width:16,height:16,borderRadius:4,background:iFlandreNatural?T.cyan:T.s3,border:`1px solid ${iFlandreNatural?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>{iFlandreNatural?"\u2713":""}</div>Personnes physiques uniquement</label>
              <label onClick={()=>{setIFlandreFullOwnership(!iFlandreFullOwnership);setIRes(null);}} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:12}}><div style={{width:16,height:16,borderRadius:4,background:iFlandreFullOwnership?T.cyan:T.s3,border:`1px solid ${iFlandreFullOwnership?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>{iFlandreFullOwnership?"\u2713":""}</div>Pleine propriete (pas usufruit/nue-propriete)</label>
              <label onClick={()=>{setIFlandreRegister3Y(!iFlandreRegister3Y);setIRes(null);}} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:12}}><div style={{width:16,height:16,borderRadius:4,background:iFlandreRegister3Y?T.cyan:T.s3,border:`1px solid ${iFlandreRegister3Y?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>{iFlandreRegister3Y?"\u2713":""}</div>Inscription dans les 3 ans</label>
              <label onClick={()=>{setIFlandreStay1Y(!iFlandreStay1Y);setIRes(null);}} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:12}}><div style={{width:16,height:16,borderRadius:4,background:iFlandreStay1Y?T.cyan:T.s3,border:`1px solid ${iFlandreStay1Y?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10}}>{iFlandreStay1Y?"\u2713":""}</div>Maintien de l'inscription au moins 1 an</label>
            </div>)}
            {iR === "bruxelles" && <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Abattement energetique bruxellois (minimum 2 classes d'amelioration PEB)</label><Input value={iSautsPeb} onChange={v => { setISautsPeb(v); setIRes(null); }} type="number" placeholder="Nombre de sauts (min. 2)" /></div>}
            <label onClick={() => { setIN(!iN); setIRes(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: iN ? T.green : T.s3, border: `1px solid ${iN ? T.green : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{iN ? "\u2713" : ""}</div>Regime TVA (immeuble neuf vendu par promoteur)</label>
            <button onClick={doImmo} disabled={!iP} style={{ padding: 14, background: !iP ? T.dim : `linear-gradient(135deg,#B86B76,#A65D67,#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: !iP ? "not-allowed" : "pointer" }}>Calculer</button>
          </div></Card>
          {iRes && (<Card highlight isPrintable={true}><Divider label={"Rapport — Achat " + rl[iRes.iR]} color={T.pri} />
            {[...(iRes.iN ? [] : [{ l: `Droits d'enregistrement (${iRes.conditionsMet && iRes.iR === "flandre" ? "2% (si cond. 2026)" : iRes.conditionsMet && iRes.iR === "wallonie" ? "3%" : iRes.conditionsMet && iRes.iR === "bruxelles" ? "12,5% + abattement" : "taux standard"})`, v: iRes.rr }]), ...(iRes.iN ? [{ l: "TVA 21%", v: iRes.tva }] : []), { l: "Honoraires notaire (indicatif simplifie)", v: iRes.nf }, { l: "TVA honoraires", v: iRes.nv }, { l: "Frais administratifs & debours", v: 1180 }].map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.s3}`, fontFamily: "'Libre Franklin',sans-serif", fontSize: 13 }}><span style={{ color: T.muted }}>{r.l}</span><span style={{ fontWeight: 600 }}>{fmt(r.v)}</span></div>))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>COUT TOTAL ESTIME</span><span style={{ fontSize: 22, fontWeight: 700, color: T.pri }}>{fmt(iRes.tot)}</span></div>
            {iR==="flandre" && !iRes.flandreCond2026?.natural && <div style={{padding:"8px 12px",background:T.orange+"08",border:`1px solid ${T.orange}44`,borderRadius:8,fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.orange,marginTop:12}}>Attention Flandre 2026 : le taux a 2% est strict. Toute condition non remplie fait basculer au 12%.</div>}
            <Disclaimer>Les frais de notaire sont indicatifs simplifies. Le decompte final dependra des recherches et formalites. Base taxable = max(prix + charges, valeur venale).</Disclaimer><SourceBadge type="Source" source="SPF Finances / Regions" bareme="2025-2026" /><PrintBtn /></Card>)}</div>)}
          {notSub === "succession" && (<div><Card className="no-print"><Divider label="Droits de succession" color={T.pri} />
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <div style={{flex:1}}><label style={{fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.muted,display:"block",marginBottom:4}}>Part Logement Familial (EUR)</label><Input value={sHomeVal} onChange={v=>{setSHomeVal(v);setSRes(null);}} type="number" placeholder="200000"/></div>
              <div style={{flex:1}}><label style={{fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.muted,display:"block",marginBottom:4}}>Autres Biens (EUR)</label><Input value={sOtherVal} onChange={v=>{setSOtherVal(v);setSRes(null);}} type="number" placeholder="50000"/></div>
            </div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Region (dernier domicile principal 5 dernieres annees)</label><div style={{ display: "flex", gap: 6 }}>{["bruxelles", "flandre", "wallonie"].map(r => (<Pill key={r} active={sR === r} onClick={() => { setSR(r); setSRes(null); }} color={T.pri}>{rl[r]}</Pill>))}</div></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Lien de parente</label><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{succRels.map(r => (<Pill key={r} active={sRel === r} onClick={() => { setSRel(r); setSRes(null); }} color={T.pri}>{r}</Pill>))}</div></div>
            {sRel === "Cohabitant de fait (Bruxelles)" && sR === "bruxelles" && (<>
              <label onClick={()=>{setSBruxCohab1yr(!sBruxCohab1yr);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sBruxCohab1yr?T.cyan:T.s3,border:`1px solid ${sBruxCohab1yr?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"cente r",color:"white",fontSize:12,fontWeight:700}}>{sBruxCohab1yr?"\u2713":""}</div>Cohabitation de fait effective + menage commun au moins 1 an</label>
              <label onClick={()=>{setSBruxCohab3yr(!sBruxCohab3yr);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sBruxCohab3yr?T.cyan:T.s3,border:`1px solid ${sBruxCohab3yr?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{sBruxCohab3yr?"\u2713":""}</div>Cohabitation de fait effective + menage commun au moins 3 ans</label>
            </>)}
            {sR === "flandre" && (sRel === "Conjoint / Cohabitant legal" || sRel === "Cohabitant de fait (Flandre)") && (<><label onClick={()=>{setSFlandreStraightLine(!sFlandreStraightLine);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sFlandreStraightLine?T.cyan:T.s3,border:`1px solid ${sFlandreStraightLine?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{sFlandreStraightLine?"\u2713":""}</div>Parente en ligne directe (exclusion flamande)</label>{sRel==="Cohabitant de fait (Flandre)"&&(<label onClick={()=>{setSFlandreFacto3ans(!sFlandreFacto3ans);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sFlandreFacto3ans?T.cyan:T.s3,border:`1px solid ${sFlandreFacto3ans?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{sFlandreFacto3ans?"\u2713":""}</div>Cohabitation au moins 3 ans avant deces</label>)}<div style={{fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.muted,lineHeight:1.5,marginTop:6}}>En Flandre, les freres et sœurs cohabitants ne sont pas exclus par cette regle ; l'exclusion vise la ligne directe. NB 2026 : l'exoneration mobiliere partenaire passe de 50k a 75k EUR.</div></>)}
            {sRel==="Conjoint / Cohabitant legal"&&sR==="wallonie"&&(<label onClick={()=>{setSFamWallonie5ans(!sFamWallonie5ans);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sFamWallonie5ans?T.cyan:T.s3, border:`1px solid ${sFamWallonie5ans?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{sFamWallonie5ans?"\u2713":""}</div>Residence principale commune au moins 5 ans (supprimee pour deces a partir de 2028)</label>)}
            {sRel==="Conjoint / Cohabitant legal"&&sR==="bruxelles"&&(<label onClick={()=>{setSFamBruxellesExclu(!sFamBruxellesExclu);setSRes(null);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:sFamBruxellesExclu?T.cyan:T.s3,border:`1px solid ${sFamBruxellesExclu?T.cyan:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{sFamBruxellesExclu?"\u2713":""}</div>Parente proche defunt (exclut exoneration)</label>)}
            <button onClick={doSucc} disabled={!sHomeVal && !sOtherVal} style={{ padding: 14, background: (!sHomeVal && !sOtherVal) ? T.dim : `linear-gradient(135deg,#B86B76,#A65D67,#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: (!sHomeVal && !sOtherVal) ? "not-allowed" : "pointer" }}>Calculer</button>
          </Card>
          {sRes && (<Card highlight isPrintable={true}><Divider label={"Rapport — Succession " + rl[sRes.sR]} color={T.pri} />
            {sRes.warning && <div style={{ padding: "8px 12px", background: T.orange + "08", border: `1px solid ${T.orange}44`, borderRadius: 8, marginBottom: 16, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.orange }}>{sRes.warning}</div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.s3}`,fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><span style={{color:T.muted}}>Droits sur logement familial</span><span style={{fontWeight:600,color:sRes.advantageMode==="full_exemption"?T.green:sRes.advantageMode==="reduced_rate"?T.cyan:T.txt}}>{fmt(sRes.taxHome)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.s3}`,fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><span style={{color:T.muted}}>Droits sur autres biens</span><span style={{fontWeight:600}}>{fmt(sRes.taxOther)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>TOTAL DROITS DE  SUCCESSION</span><span style={{ fontSize: 22, fontWeight: 700, color: T.pri }}>{fmt(sRes.totalTax)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13 }}><span style={{ color: T.muted }}>Taux effectif global</span><span style={{ color: T.cyan, fontWeight: 600 }}>{sRes.rate}%</span></div>
            {sRes.advantageMode !== "none" && (
              <div style={{ padding: "8px 12px", background: sRes.advantageNotCalculated ? T.orange + "11" : T.green + "08", border: `1px solid ${sRes.advantageNotCalculated ? T.orange + "44" : T.green + "44"}`, borderRadius: 8, fontSize: 11, marginTop: 8 }}>
                {sRes.advantageNotCalculated ? (
                  <>Avantage legal potentiel detecte (<b>{sRes.advantageMode}</b>), mais <b>non chiffre</b> par ce simulateur.</>
                ) : (
                  <>Avantage applique : {sRes.advantageMode === "full_exemption" ? "Exoneration totale (logement familial)" : sRes.advantageMode === "reduced_rate" ? "Tarif reduit progressif (logement familial)" : "Tarif partenaire"}</>
                )}
              </div>
            )}
            <Disclaimer>L'avantage s'applique UNIQUEMENT sur la part logement familial declaree. Baremes reduits v8.7.0 conformes aux sources officielles (notaire.be). Verifiez les conditions regionales exactes aupres d'un notaire. Reformes Wallonie 2028 et Flandre 2026 non integrees.</Disclaimer><SourceBadge type="Source" source="notaire.be (Fednot) / SPF Finances" bareme="Officiel 2024-2026" /><PrintBtn /></Card>)}</div>)}
          {notSub === "checklists" && (<div>{actCl ? (() => { const cl = CHECKS.find(c => c.id === actCl); const activeItems = cl.items.filter(item => !item.cond || clOpts[cl.id + "-" + item.cond]); const done = activeItems.filter((_, i) => chk[cl.id + "-" + i]).length; const pct = activeItems.length ? Math.round(done / activeItems.length * 100) : 0; return (<div>
            <button onClick={() => setActCl(null)} className="no-print" style={{ background: "none", border: "none", color: T.pri, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Retour</button>
            <div className="print-section"><Card><div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{cl.title}</div>
              {cl.options && (<div className="no-print" style={{ padding: "12px 14px", background: T.s2, borderRadius: 8, marginBottom: 16, border: `1px solid ${T.bdr}` }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 8 }}>ADAPTER LE DOSSIER :</div>{cl.options.map(o => (<label key={o.id} onClick={() => setClOpts(p => ({ ...p, [cl.id + "-" + o.id]: !p[cl.id + "-" + o.id] }))} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, marginBottom: 6 }}><div style={{ width: 16, height: 16, borderRadius: 4, background: clOpts[cl.id + "-" + o.id] ? T.cyan : T.s3, border: `1px solid ${clOpts[cl.id + "-" + o.id] ? T.cyan : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 700 }}>{clOpts[cl.id + "-" + o.id] ? "\u2713" : ""}</div>{o.l}</label>))}</div>)}
              <div className="no-print" style={{ background: T.s2, borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 6 }}><div style={{ height: "100%", width: pct + "%", background: pct === 100 ? T.green : T.pri, borderRadius: 6, transition: "width .3s" }} /></div><span className="no-print" style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: pct === 100 ? T.green : T.dim }}>{done}/{activeItems.length}</span></Card>
            {activeItems.map((item, i) => { const ic = chk[cl.id + "-" + i]; return (<Card key={i} onClick={() => setChk(p => ({ ...p, [cl.id + "-" + i]: !p[cl.id + "-" + i] }))} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderLeft: ic ? `3px solid ${T.green}` : `1px solid ${T.bdr}` }}><div style={{ width: 22, height: 22, borderRadius: 6, background: ic ? T.green : T.s3, border: `1px solid ${ic ? T.green : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{ic ? "\u2713" : ""}</div><span style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, color: ic ? T.dim : T.txt, textDecoration: ic ? "line-through" : "none" }}>{item.l}</span></Card>); })}<PrintBtn /></div></div>); })() : CHECKS.map(cl => (<Card key={cl.id} onClick={() => setActCl(cl.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 15, fontWeight: 600 }}>{cl.title}</div><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, color: T.muted }}>Dossier adaptable</div></div><span style={{ padding: "4px 12px", borderRadius: 16, background: T.priL, color: T.pri, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700 }}>Ouvrir</span></Card>))}</div>)}
        </div>)}
        {pg === "routier" && (<div><SectionHead title="Infractions routieres" sub="Montants de perception immediate (SPF Mobilite). Une redevance administrative en sus s'applique (montant variable)." />
          <Card className="no-print"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Vitesse constatee (km/h)</label><Input value={rSpeed} onChange={v => { setRSpeed(v); setRRes(null); }} type="number" placeholder="85" /></div><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Limite (km/h)</label><select value={rLimit} onChange={e => { setRLimit(e.target.value); setRRes(null); }} style={{ width: "100%", padding: "12px 16px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}>{["30", "50", "70", "90", "120"].map(v => (<option key={v} value={v}>{v} km/h</option>))}</select></div></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Type de voirie</label><div style={{ display: "flex", gap: 6 }}>{[{ v: true, l: "Agglomeration / Zone 30 / Ecole" }, { v: false, l: "Route ordinaire / Autoroute" }].map(o => (<Pill key={o.l} active={rAgglo === o.v} onClick={() => { setRAgglo(o.v); setRRes(null); }}>{o.l}</Pill>))}</div></div>
            <label onClick={()=>setRResident(!rResident)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"'Libre Franklin',sans-serif",fontSize:13}}><div style={{width:20,height:20,borderRadius:5,background:rResident?T.green:T.s3,border:`1px solid ${rResident?T.green:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>{rResident?"\u2713":""}</div>Resident belge (domicile fixe en Belgique)</label>
            <button onClick={doRoutier} disabled={!rSpeed} style={{ padding: 14, background: !rSpeed ? T.dim : `linear-gradient(135deg,#B86B76,#A65D67,#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: !rSpeed ? "not-allowed" : "pointer" }}>Simuler</button>
          </div></Card>
          {rRes && (<Card highlight isPrintable={true} style={{ borderLeft: `3px solid ${rRes.grave ? T.red : T.pri}` }}><Divider label="Rapport — Infraction" color={rRes.grave ? T.red : T.green} />
            <div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Depassement</span><span style={{ fontWeight: 700, color: rRes.grave ? T.red : T.txt }}>+{parseInt(rSpeed) - parseInt(rLimit)} km/h</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700 }}>PERCEPTION IMMEDIATE THEORIQUE</span><span style={{ fontSize: 22, fontWeight: 700 }}>{fmt(rRes.immFine)}</span></div>
              {rRes.exceedsCap && <div style={{padding:"8px 12px",background:T.red+"08",border:`1px solid ${T.red}44`,borderRadius:8,fontFamily:"'Libre Franklin',sans-serif",fontSize:11,color:T.red}}>Au-dela de 347 EUR, la perception immediate est generalement exclue pour les residents belges. Le dossier suivra une autre voie procedurale.</div>}
              <div style={{ padding: "6px 0", fontSize: 11, color: T.pri, fontWeight: "bold" }}>+ Redevance administrative en sus (montant variable)</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Risque</span><span style={{ fontWeight: 600 }}>{rRes.tribFine}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ color: T.muted }}>Decheance</span><span style={{ fontWeight: 700, color: rRes.grave ? T.red : T.green }}>{rRes.dech}</span></div>
            </div><Disclaimer/><SourceBadge type="Source" source="SPF Mobilite / Police" bareme="Actuel" /><PrintBtn /></Card>)}</div>)}
        {pg === "preavis" && (<div><SectionHead title="Simulateur de preavis" sub="Bareme SPF Emploi. Calcul exact pour les contrats post-2014, estimation indicative pour les contrats pre-2014." />
          <Card className="no-print"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Date debut contrat</label><Input value={pStart} onChange={v => { setPStart(v); setPRes(null); }} type="date" /></div><div style={{ flex: 1 }}><label style={{  fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Date de notification</label><Input value={pNotifDate} onChange={v => { setPNotifDate(v); setPRes(null); }} type="date" /></div></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Mode de notification</label><select value={pNotifType} onChange={e => { setPNotifType(e.target.value); setPRes(null); }} style={{ width: "100%", padding: "12px 16px", background: T.surface, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}><option value="recommande">Lettre recommandee (+3 jours ouvrables)</option>{pDem ? (<><option value="main">Remise en main propre (effet direct)</option><option value="huissier">Exploit d'huissier (effet direct)</option></>) : (<option value="huissier">Exploit d'huissier (effet direct)</option>)}</select></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Salaire brut ANNUEL complet (EUR) — 13e mois, pecule, avantages inclus</label><Input value={pSal} onChange={v => { setPSal(v); setPRes(null); }} type="number" placeholder="45000" /></div>
            {pSal && parseFloat(pSal) < 12000 && <div style={{ padding: "8px 12px", background: T.orange + "08", border: `1px solid ${T.orange}44`, borderRadius: 8, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.orange }}>Attention : ce montant semble etre un salaire mensuel. Entrez le salaire brut ANNUEL complet (ex: 45.000 EUR).</div>}
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Initiative de la rupture</label><div style={{ display: "flex", gap: 6 }}>{[{ v: false, l: "Licenciement (employeur)" }, { v: true, l: "Demission (travailleur)" }].map(o => (<Pill key={o.l} active={pDem === o.v} onClick={() => { setPDem(o.v); setPRes(null); }}>{o.l}</Pill>))}</div></div>
            <label onClick={() => { setPOuv(!pOuv); setPRes(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, opacity: pDem ? 0.4 : 1, pointerEvents: pDem ? "none" : "auto" }}><div style={{ width: 20, height: 20, borderRadius: 5, background: pOuv ? T.green : T.s3, border: `1px solid ${pOuv ? T.green : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{pOuv ? "\u2713" : ""}</div>Statut ouvrier (ancien regime avant 2014) — ignore en cas de demission</label>
            <button onClick={doPreavis} disabled={!pStart || !pNotifDate || !pSal} style={{ padding: 14, background: (!pStart || !pNotifDate || !pSal) ? T.dim : `linear-gradient(135deg,#B86B76,#A65D67,#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: (!pStart || !pNotifDate || !pSal) ? "not-allowed" : "pointer" }}>Calculer</button>
          </div></Card>
          {pRes && (<Card highlight isPrintable={true}><Divider label="Rapport — Rupture de contrat" color={T.pri} />
            <div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.pri, fontWeight: "bold" }}>Date d'effet</span><span style={{ fontWeight: 600 }}>{pRes.effectiveDate.toLocaleDateString("fr-BE")}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.green, fontWeight: "bold" }}>Prise de cours (lundi suivant)</span><span style={{ fontWeight: 600 }}>{pRes.preavisStart.toLocaleDateString("fr-BE")}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Anciennete (jusqu'a la veille du preavis)</span><span style={{ fontWeight: 600 }}>{pRes.totalYears} ans ({pRes.totalMonths} mois)</span></div>
              {pRes.isDemission ? (<div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Regime unique de demission</span><span style={{ fontWeight: 600 }}>{pRes.totalWeeks} semaines</span></div>) : (<>
                {pRes.weeksOld > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Semaines ancien regime (estimation indicative)</span><span style={{ fontWeight: 600 }}>{pRes.weeksOld}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Semaines nouveau regime</span><span style={{ fontWeight: 600 }}>{pRes.weeksNew}</span></div>
              </>)}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Type</span><span style={{ fontWeight: 600, color: pRes.isDemission ? T.cyan : T.pri }}>{pRes.isDemission ? "Demission" : "Licenciement"}</span></div>
              {pRes.weeksOld > 0 && <div style={{ padding: "10px 14px", background: T.orange + "08", border: `1px solid ${T.orange}44`, borderRadius: 8, marginTop: 6, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.orange }}>Partie pre-2014 : estimation  non opposable. L'ancien regime distinguait plusieurs categories. Verification requise aupres d'un secretariat social.</div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>DELAI DE PREAVIS</span><span style={{ fontSize: 22, fontWeight: 700, color: T.pri }}>{pRes.totalWeeks} semaines</span></div>
              {pRes.isDemission && <div style={{ padding: "8px 12px", background: T.priDim, borderRadius: 8, fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted }}>Demission plafonnee a 13 semaines maximum.</div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ color: T.muted }}>Indemnite de rupture</span><span style={{ fontSize: 18, fontWeight: 700, color: T.green }}>{fmt(pRes.indemnity)} brut</span></div>
            </div><Disclaimer/><SourceBadge type="Source" source="SPF Emploi" bareme="Regime de base" /><PrintBtn /></Card>)}</div>)}
        {pg === "pension" && (<div><SectionHead title="Estimation indicative des frais d'enfant" sub="Simulation interne inspiree des methodes usuelles (Renard, baromes indicatifs). Pas de calculateur officiel unique en Belgique." />
          <Card className="no-print"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {penErr && <div style={{ padding: "10px 14px", background: T.red + "08", border: `1px solid ${T.red}44`, borderRadius: 8, fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, color: T.red, fontWeight: 600 }}>{penErr}</div>}
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Revenu net mensuel P1</label><Input value={penR1} onChange={v => { setPenR1(v); setPenRes(null); setPenErr(""); }} type="number" placeholder="2500" /></div><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Revenu net mensuel P2</label><Input value={penR2} onChange={v => { setPenR2(v); setPenRes(null); setPenErr(""); }} type="number" placeholder="2000" /></div></div>
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Nombre d'enfants</label><Input value={penN} onChange={v => { setPenN(v); setPenRes(null); setPenErr(""); }} type="number" placeholder="2" /></div><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif",  fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Ages (virgule)</label><Input value={penA} onChange={v => { setPenA(v); setPenRes(null); setPenErr(""); }} placeholder="8, 12" /></div></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Mode d'hebergement</label><select value={penMode} onChange={e => { setPenMode(e.target.value); setPenRes(null); }} style={{ width: "100%", padding: "12px 16px", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.txt, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, outline: "none" }}><option value="182">Garde alternee (182j)</option><option value="300">Hebergement principal P1 (~300j)</option><option value="65">Hebergement principal P2 (P1 ~65j)</option><option value="100">Hebergement elargi P2 (P1 ~100j)</option></select></div>
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Allocations familiales</label><Input value={penAlloc} onChange={v => { setPenAlloc(v); setPenRes(null); setPenErr(""); }} type="number" placeholder="160" /></div><div style={{ flex: 1 }}><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Percues par</label><div style={{ display: "flex", gap: 6 }}>{[{ v: 1, l: "P1" }, { v: 2, l: "P2" }].map(o => (<Pill key={o.v} active={penAllocP === o.v} onClick={() => { setPenAllocP(o.v); setPenRes(null); }}>{o.l}</Pill>))}</div></div></div>
            <button onClick={doPension} style={{ padding: 14, background: T.priGrad, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Generer</button>
          </div></Card>
          {penRes && (<Card highlight isPrintable={true}><Divider label="Rapport — Frais d'enfant (indicatif)" color={T.pri} />
            <div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Cout brut estimatif</span><span style={{ fontWeight: 600 }}>{fmt(penRes.costChildBrut)}/mois</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Cout net (apres allocations)</span><span style={{ fontWeight: 600 }}>{fmt(penRes.costChild)}/mois</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ color: T.muted }}>Capacite P1 / P2</span><span style={{ fontWeight: 600 }}>{penRes.partP1}% / {penRes.partP2}%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>FOURCHETTE INDICATIVE</span><span style={{ fontSize: 22, fontWeight: 700, color: T.pri }}>{fmt(penRes.monthlyMin)} — {fmt(penRes.monthlyMax)}</span></div>
              <div style={{ padding: "8px 0", fontSize: 12, color: T.muted }}>A titre de simulation, la fourchette suggere qu'un transfert financier pourrait etre discute entre Parent {penRes.fromP1 ? "1" : "2"} et Parent {penRes.fromP1 ? "2" : "1"}.</div>
            </div><Disclaimer>Simulation interne non officielle. En Belgique, aucun bareme legal obligatoire ne fixe la contribution alimentaire. Le juge statue au cas par cas selon les capacites financieres et les besoins reels de l'enfant.</Disclaimer><SourceBadge type="Source" source="Methode Renard (inspiree)" bareme="Indicatif" /><PrintBtn /></Card>)}</div>)}
        {pg === "fraisjustice" && (<div><SectionHead title="Barometre des frais de justice" sub="Indemnite de procedure indexee au 1er mars 2025. Montant de base sans ajustement judiciaire." />
          <Card className="no-print"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label onClick={() => { setFjNonEvaluable(!fjNonEvaluable); setFjRes(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, color: T.pri, fontWeight: "bold" }}><div style={{ width: 20, height: 20, borderRadius: 5, background: fjNonEvaluable ? T.pri : T.s3, border: `1px solid ${fjNonEvaluable ? T.pri : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{fjNonEvaluable ? "\u2713" : ""}</div>Affaire non evaluable en argent</label>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>Montant du litige (EUR)</label><Input disabled={fjNonEvaluable} value={fjA} onChange={v => { setFjA(v); setFjRes(null); }} type="number" placeholder={fjNonEvaluable ? "Non applicable" : "15000"} /></div>
            <div><label style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, color: T.muted, display: "block", marginBottom: 6 }}>Juridiction</label><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{[{ id: "paix", l: "Justice de paix" }, { id: "premiere", l: "Tribunal 1ere instance" }, { id: "entreprise", l: "Tribunal entreprise" }, { id: "appel", l: "Cour  d'appel" }].map(j => (<Pill key={j.id} active={fjJ === j.id} onClick={() => { setFjJ(j.id); setFjRes(null); }} color={T.pri}>{j.l}</Pill>))}</div></div>
            <label onClick={() => { setFjAcq(!fjAcq); setFjRes(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Libre Franklin',sans-serif", fontSize: 13 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: fjAcq ? T.green : T.s3, border: `1px solid ${fjAcq ? T.green : T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{fjAcq ? "\u2713" : ""}</div>Acquiescement post-mise au role (1/4 de la base, max 1.400 EUR)</label>
            <button onClick={doFrais} disabled={!fjNonEvaluable && !fjA} style={{ padding: 14, background: (!fjNonEvaluable && !fjA) ? T.dim : `linear-gradient(135deg,#B86B76,#A65D67,#8F4C55)`, border: "none", borderRadius: 10, color: "white", fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 700, cursor: (!fjNonEvaluable && !fjA) ? "not-allowed" : "pointer" }}>Estimer</button>
          </div></Card>
          {fjRes && (<Card highlight isPrintable={true}><Divider label="Rapport — Risque procedural" color={T.pri} />
            {fjRes.jpWarning && <div style={{ padding: "10px 14px", background: T.red + "08", border: `1px solid ${T.red}22`, borderRadius: 8, marginBottom: 12, fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, color: T.red }}>Competence du Juge de paix generalement limitee a 5.000 EUR (sauf baux, copropriete).</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, background: T.green + "08", borderRadius: 10, border: `1px solid ${T.green}22` }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700, color: T.green, marginBottom: 10 }}>SI VOUS GAGNEZ</div>{[{ l: "Greffe", v: fjRes.miseAuRole }, { l: "Huissier", v: fjRes.huissier }, { l: "Divers", v: fjRes.divers }].map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12 }}><span style={{ color: T.muted }}>{r.l}</span><span style={{ fontWeight: 600 }}>{fmt(r.v)}</span></div>))}<div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", borderTop: `1px solid ${T.s3}`, marginTop: 6 }}><span style={{ fontWeight: 700, color: T.green }}>Total</span><span style={{ fontWeight: 700, color: T.green }}>{fmt(fjRes.totalWin)}</span></div></div>
              <div style={{ padding: 16, background: T.red + "08", borderRadius: 10, border: `1px solid ${T.red}22` }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 11, fontWeight: 700, color: T.red, marginBottom: 10 }}>SI VOUS PERDEZ</div>{[{ l: "Greffe", v: fjRes.miseAuRole }, { l: "Huissier", v: fjRes.huissier }, { l: `IP${fjRes.isAcq ? "  (acq.)" : ""}`, v: fjRes.ip }, { l: "Divers", v: fjRes.divers }].map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12 }}><span style={{ color: T.muted }}>{r.l}</span><span style={{ fontWeight: 600 }}>{fmt(r.v)}</span></div>))}<div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", borderTop: `1px solid ${T.s3}`, marginTop: 6 }}><span style={{ fontWeight: 700, color: T.red }}>Total</span><span style={{ fontWeight: 700, color: T.red }}>{fmt(fjRes.totalLose)}</span></div></div>
            </div>
            <div style={{ padding: "12px 0", fontFamily: "'Libre Franklin',sans-serif", fontSize: 12, color: T.muted, marginTop: 12 }}>IP : {fmt(fjRes.ip)} {fjRes.isAcq ? "(acquiescement)" : fjRes.isNonEvaluable ? "(base non evaluable)" : `| min ${fmt(fjRes.ipMin)} | max ${fmt(fjRes.ipMax)}`}</div>
            <Disclaimer>Honoraires d'avocat non inclus. Le juge peut ajuster l'IP selon la complexite et les capacites financieres. Priviliegiez la resolution amiable.</Disclaimer><SourceBadge type="Source" source="College des cours et tribunaux" bareme="v1.0 (Mars 2025)" /><PrintBtn /></Card>)}</div>)}
        {pg === "juridometre" && (<div><SectionHead title="Diagnostic de vigilance" sub="Profil de risque et actions recommandees." />
          {!jResult ? (<Card><div style={{ fontFamily: "'Libre Franklin',sans-serif" }}>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 12, color: T.dim, marginBottom: 6 }}>Question {jStep + 1}/{J_QUESTIONS.length}</div><div style={{ background: T.s2, borderRadius: 4, height: 4, overflow: "hidden" }}><div style={{ height: "100%", width: ((jStep + 1) / J_QUESTIONS.length * 100) + "%", background: T.pri, borderRadius: 4, transition: "width .3s" }} /></div></div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, fontFamily: "'Libre Baskerville',serif" }}>{J_QUESTIONS[jStep].q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{J_QUESTIONS[jStep].opts.map(o => (<button key={o} onClick={() => { const a = { ...jAnswers, [jStep]: o }; setJAnswers(a); if (jStep < J_QUESTIONS.length - 1) setJStep(jStep + 1); else calcJuridometre(a); }} style={{ padding: "12px 16px", background: jAnswers[jStep] === o ? T.priL : T.s2, border: `1px solid ${jAnswers[jStep] === o ? T.pri + "44" : T.bdr}`, borderRadius: 10, color: T.txt, fontSize: 14, textAlign: "left", cursor: "pointer" }}>{o}</button>))}</div>
            {jStep > 0 && <button onClick={() => setJStep(jStep - 1)} style={{ marginTop: 12, background: "none", border: "none", color: T.pri, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Precedent</button>}
          </div></Card>) : (
            <div className="print-section">
              <Card highlight><Divider label="Rapport — Diagnostic" color={T.pri} /><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13 }}>
                {[{ l: "Travail", v: jResult.travail }, { l: "Famille", v: jResult.famille }, { l: "Immobilier", v: jResult.immo }, { l: "Route", v: jResult.route }, { l: "Fiscal", v: jResult.fiscal }, { l: "Succession", v: jResult.succession }].map(r => (<div key={r.l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.s3}` }}><span style={{ width: 100, color: T.muted }}>{r.l}</span><div style={{ flex: 1, background: T.s2, borderRadius: 4, height: 8, overflow: "hidden" }}><div style={{ height: "100%", width: (r.v * 10) + "%", background: r.v <= 3 ? T.green : r.v <= 6 ? T.orange : T.red, borderRadius: 4 }} /></div><span style={{ fontWeight: 700, color: r.v <= 3 ? T.green : r.v <= 6 ? T.orange : T.red, width: 30, textAlign: "right" }}>{r.v}/10</span></div>))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 4px" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.pri }}>SCORE GLOBAL</span><span style={{ fontSize: 22, fontWeight: 700, color: jResult.total <= 3 ? T.green : jResult.total <= 6 ? T.orange : T.red }}>{jResult.total}/10</span></div>
              </div></Card>
              <Card><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 13, lineHeight: 1.7, color: T.muted }}><div style={{ marginBottom: 16, fontWeight: 600, color: T.txt, textTransform: "uppercase", letterSpacing: 1, fontSize: 11 }}>Actions recommandees :</div>{jResult.recs.map((r, i) => (<div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < jResult.recs.length - 1 ? `1px solid ${T.s3}` : "none" }}><strong style={{ color: T.pri }}>{r.z} :</strong> {r.t}</div>))}</div></Card>
              <PrintBtn /><button className="no-print" onClick={() => { setJResult(null); setJStep(0); setJAnswers({}); }} style={{ marginTop: 10, padding: 14, background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, color: T.pri, fontFamily: "'Libre Franklin',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}>Refaire le diagnostic</button>
            </div>
          )}</div>)}
        {pg === "guide" && (<div className="no-print"><SectionHead title="Guide d'utilisation" sub="Mode d'emploi, conseils et pieges a eviter." /><GuideBlock sections={GUIDE_SECTIONS.filter(g => g.category === "juridique")} label="Sections juridiques" /><GuideBlock sections={GUIDE_SECTIONS.filter(g => g.category === "outils")} label="Outils pratiques" /></div>)}
      </div>
      <footer className="no-print" style={{ borderTop: "none", padding: "24px", background: "linear-gradient(180deg, #FCF6F6 0%, #FDF4F5 100%)", boxShadow: "0 -1px 12px rgba(166,93,103,0.04)" }}><div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}><div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.7)", borderRadius: 10, marginBottom: 12, textAlign: "left", backdropFilter: "blur(4px)" }}><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 9, fontWeight: 700, color: T.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Orientation Assistee</div><p style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 10, color: T.muted, lineHeight: 1.6, margin: 0 }}>Les informations et calculs sont fournis a titre d'orientation assistee. Ils ne constituent pas un avis juridique personnalise. Consultez un professionnel du droit. Sources : Moniteur belge, SPF Justice, Justel, notaire.be (Fednot), SPF Mobilite, Statbel (API JSON), EUR-Lex. v8.7.0 - Avril 2026.</p></div><div style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: 9, color: T.dim, letterSpacing: 1 }}>JURATONE PRO v8.7.0 — PLATEFORME JURIDIQUE BELGE</div></div></footer>
    </div>
  );
}
