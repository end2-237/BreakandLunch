// ─────────────────────────────────────────────────────────────────────────────
// Mesure d'audience, côté navigateur.
//
// Une page vue, un plat consulté, un ajout au panier, un paiement entamé :
// c'est ce qui manquait au commerçant pour savoir si son site travaille. Tout
// part vers notre propre serveur, qui le relaie à Camille.
//
// Aucun cookie, aucune donnée personnelle : deux identifiants aléatoires dans
// le stockage local du navigateur, et rien d'autre. Un navigateur qui refuse
// le stockage est simplement compté comme un nouveau visiteur.
// ─────────────────────────────────────────────────────────────────────────────

type Kind = "page_view" | "product_view" | "add_to_cart" | "checkout_start" | "search";

const VISITOR_TTL = 30 * 24 * 60 * 60 * 1000; // 30 jours
const SESSION_TTL = 30 * 60 * 1000; //           30 minutes d'inactivité

function id(key: string, ttl: number): string {
  const fresh = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const saved = JSON.parse(raw) as { v: string; t: number };
      if (saved?.v && Date.now() - saved.t < ttl) {
        localStorage.setItem(key, JSON.stringify({ v: saved.v, t: Date.now() }));
        return saved.v;
      }
    }
    const v = fresh();
    localStorage.setItem(key, JSON.stringify({ v, t: Date.now() }));
    return v;
  } catch {
    return fresh();
  }
}

const device = () => {
  const ua = navigator.userAgent;
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";
};

export function track(kind: Kind, meta?: Record<string, unknown>, extra?: { path?: string; title?: string }) {
  if (typeof window === "undefined") return;
  const event = {
    kind,
    path: extra?.path ?? location.pathname + location.search,
    title: extra?.title ?? document.title,
    // Le référent n'a de sens qu'à l'arrivée sur le site.
    referrer: document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : "",
    visitor: id("blj-v", VISITOR_TTL),
    session: id("blj-s", SESSION_TTL),
    device: device(),
    locale: document.documentElement.lang || "",
    meta: meta ?? {},
  };
  const body = JSON.stringify({ events: [event] });

  // keepalive : la mesure part même si le visiteur ferme l'onglet dans la
  // foulée. Un échec ne se voit nulle part — c'est voulu.
  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
      if (sent) return;
    }
  } catch {
    /* on retombe sur fetch */
  }
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
