# Juratone Pro — Plateforme Juridique Belge 🇧🇪

Outil gratuit et open-source de traduction juridique FR ↔ NL pour le droit belge.

---

## 🚀 METTRE EN LIGNE CE SOIR (Gratuit — 0€)

### Ce dont tu as besoin :
- Un compte **GitHub** (gratuit) → https://github.com/signup
- Un compte **Vercel** (gratuit) → https://vercel.com/signup (connecte-toi avec GitHub)
- *(Optionnel)* Une clé API Anthropic pour la traduction IA → https://console.anthropic.com

---

### ÉTAPE 1 : Créer le dépôt GitHub

1. Va sur https://github.com/new
2. Nom du dépôt : `juratone-pro`
3. Laisse en **Public** (gratuit)
4. Clique **Create repository**

### ÉTAPE 2 : Envoyer les fichiers sur GitHub

**Option A — Via le site GitHub (le plus simple) :**

1. Sur la page de ton dépôt vide, clique **"uploading an existing file"**
2. Glisse TOUS les fichiers du projet (pas le dossier, les fichiers dedans)
3. Respecte la structure :
   ```
   juratone-pro/
   ├── api/
   │   └── translate.js        ← Route API sécurisée
   ├── src/
   │   ├── App.jsx              ← L'application
   │   └── main.jsx             ← Point d'entrée React
   ├── public/                   ← (dossier vide, ok)
   ├── index.html               ← Page HTML
   ├── package.json             ← Dépendances
   ├── vite.config.js           ← Config Vite
   ├── vercel.json              ← Config déploiement
   └── README.md                ← Ce fichier
   ```

**Option B — Via le terminal (si tu connais Git) :**

```bash
cd juratone-pro
git init
git add .
git commit -m "Juratone Pro v1.0"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/juratone-pro.git
git push -u origin main
```

### ÉTAPE 3 : Déployer sur Vercel

1. Va sur https://vercel.com/new
2. Clique **"Import Git Repository"**
3. Sélectionne ton dépôt `juratone-pro`
4. Vercel détecte automatiquement que c'est du Vite/React
5. Clique **"Deploy"**
6. ⏳ Attends 1-2 minutes...
7. 🎉 Ton site est en ligne ! Tu reçois une URL du type `juratone-pro.vercel.app`

### ÉTAPE 4 : Configurer la traduction IA (optionnel)

La traduction IA nécessite une clé API Anthropic :

1. Va sur https://console.anthropic.com
2. Crée un compte (il y a des crédits gratuits pour commencer)
3. Va dans **API Keys** → **Create Key**
4. Copie la clé

Puis dans Vercel :
1. Va dans ton projet → **Settings** → **Environment Variables**
2. Ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : ta clé API
3. Clique **Save**
4. Va dans **Deployments** → clique les 3 points → **Redeploy**

💡 **Sans clé API**, tout fonctionne sauf la traduction IA (glossaire, jurisprudence, doctrine, législation marchent parfaitement).

---

## 🌐 Nom de domaine personnalisé (gratuit)

Tu veux `juratone.be` ou similaire ?

**Option gratuite :**
1. Dans Vercel → **Settings** → **Domains**
2. Tu as déjà un sous-domaine gratuit : `juratone-pro.vercel.app`

**Option payante (si un jour tu veux) :**
- Achète un `.be` (~8€/an sur OVH, Gandi, ou Cloudflare)
- Ajoute-le dans Vercel → il configure tout automatiquement

---

## 📁 Structure du projet

```
juratone-pro/
├── api/translate.js        → Serverless function (protège la clé API)
├── src/App.jsx             → Application React complète
├── src/main.jsx            → Point d'entrée
├── index.html              → HTML de base
├── package.json            → Dépendances npm
├── vite.config.js          → Configuration Vite
├── vercel.json             → Configuration Vercel
└── README.md               → Documentation
```

## 🛡 Sécurité

- **Anti-XSS** : Toutes les entrées utilisateur sont nettoyées
- **Rate limiting** : Protection contre le spam (client + serveur)
- **URL validation** : Seuls http(s) autorisés
- **Clé API sécurisée** : Jamais exposée côté client
- **Limites** : Taille des entrées, nombre max, etc.

## 📊 Contenu inclus

- **145 termes** juridiques FR ↔ NL (10 domaines du droit belge)
- **7 sources** de jurisprudence (Juridat, Juportal, CJUE, CEDH...)
- **12 sources** de doctrine (Jura, Stradalex, Jurisquare, revues...)
- **17 sources** de législation (Moniteur belge, tous les codes, EUR-Lex...)

---

Fait avec ❤️ pour la communauté juridique belge.
