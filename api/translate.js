// /api/translate.js — Vercel Serverless Function
// La clé API est stockée dans les variables d'environnement Vercel (jamais côté client)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  // Rate limiting simple (par IP)
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!global._rateLimitMap) global._rateLimitMap = new Map();
  const lastReq = global._rateLimitMap.get(ip) || 0;
  if (now - lastReq < 5000) {
    return res.status(429).json({ error: 'Trop de requêtes. Attendez quelques secondes.' });
  }
  global._rateLimitMap.set(ip, now);

  // Nettoyage périodique du rate limit map
  if (global._rateLimitMap.size > 10000) {
    global._rateLimitMap.clear();
  }

  try {
    const { text, direction } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texte manquant.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Texte trop long (max 5000 caractères).' });
    }
    if (!['fr-nl', 'nl-fr'].includes(direction)) {
      return res.status(400).json({ error: 'Direction invalide.' });
    }

    const src = direction === 'fr-nl' ? 'français' : 'néerlandais';
    const tgt = direction === 'fr-nl' ? 'néerlandais' : 'français';

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Clé API non configurée.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu es Juratone Pro, traducteur juridique expert en droit belge. Traduis du ${src} vers le ${tgt} avec la terminologie juridique belge officielle.\n\nRÈGLES :\n1. Terminologie belge uniquement (pas FR/France ni NL/Pays-Bas)\n2. Conserver les références légales telles quelles\n3. Registre formel\n4. Mentionner les alternatives terminologiques si pertinent\n5. Signaler les faux-amis juridiques\n\nFORMAT :\n— TRADUCTION —\n[Texte traduit]\n\n— NOTES TERMINOLOGIQUES —\n[Choix de traduction expliqués]\n\n— ATTENTION —\n[Faux-amis éventuels]`,
        messages: [{ role: 'user', content: `Traduis ce texte juridique du ${src} vers le ${tgt} :\n\n${text}` }],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Erreur API.' });
    }

    const result = data.content?.map(c => c.text || '').join('\n') || 'Erreur de traduction.';
    return res.status(200).json({ translation: result });

  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}
