// ─────────────────────────────────────────────────────────────────────────────
// Limitation de débit, en mémoire.
//
// Le site n'a pas de base : un compteur par instance suffit à arrêter ce qui
// nous menace vraiment — un script qui envoie mille commandes ou martèle le
// géocodage, et qui ferait révoquer nos accès chez OpenStreetMap ou saturer
// Camille. Ce n'est pas une protection contre une attaque distribuée ; c'est
// le garde-fou qui manquait.
// ─────────────────────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Purge paresseuse : sans elle, la table grandit tant que le process vit. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - current.count, retryAfter: 0 };
}

/** L'adresse du visiteur derrière le proxy de Coolify. */
export function clientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "inconnu"
  );
}
