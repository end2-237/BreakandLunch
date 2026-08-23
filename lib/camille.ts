// ─────────────────────────────────────────────────────────────────────────────
// Client Camille — la seule source de vérité du catalogue et des commandes.
//
// Rien n'est stocké ici : le site lit le catalogue de l'agent Break & Lunch et
// lui renvoie les commandes. Si Camille ne répond pas, le site le DIT. Il n'y a
// aucun catalogue de secours : afficher un plat qui n'existe plus, à un prix
// qui n'est plus le bon, coûte plus cher qu'une page d'indisponibilité.
//
// La clé secrète ne quitte jamais le serveur : seules les routes serveur et les
// composants serveur appellent createOrder / saveCustomer.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = (process.env.CAMILLE_URL || "https://camille.vps.buyticle.com").replace(/\/$/, "");
const PUBLIC_KEY = process.env.CAMILLE_PUBLIC_KEY || "";
const SECRET_KEY = process.env.CAMILLE_SECRET_KEY || "";

/** Durée de fraîcheur du catalogue. Un prix modifié dans Camille arrive ici en 5 min. */
const CATALOG_TTL = 300;

export class CamilleError extends Error {
  constructor(message: string, readonly status = 0, readonly detail?: string) {
    super(message);
    this.name = "CamilleError";
  }
}

export type CamilleProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Prix barré : dans Camille, price_max sert de borne haute ou de prix d'origine. */
  oldPrice?: number;
  currency: string;
  category: string;
  image: string | null;
  stock: number | null;
  minOrder: number;
  variants: { name: string; options: string[] }[];
  /** Extraits des tags « clé:valeur » posés à l'import (poids, kcal, allergènes…). */
  details: Record<string, string>;
};

export type CamilleCategory = {
  slug: string;
  name: string;
  count: number;
  image: string | null;
  products: CamilleProduct[];
};

export type Merchant = {
  name: string | null;
  whatsapp: string | null;
  /** Adresse en clair, telle que le marchand l'a saisie dans Camille. */
  location: string | null;
  /** Position de la boutique — sert à situer le client et mesurer la distance. */
  lat: number | null;
  lng: number | null;
  delivery: { enabled: boolean; fee: number; zones: { name: string; fee: number }[] };
};

export type Catalog = {
  products: CamilleProduct[];
  categories: CamilleCategory[];
  merchant: Merchant;
  media: { kind: string; url: string; caption: string | null }[];
};

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* eslint-disable @typescript-eslint/no-explicit-any */

function toNumber(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Les tags de la forme « poids:520 g » deviennent { poids: "520 g" }. */
function parseDetails(tags: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(tags)) return out;
  for (const t of tags) {
    const s = String(t);
    const i = s.indexOf(":");
    if (i > 0) out[s.slice(0, i).trim().toLowerCase()] = s.slice(i + 1).trim();
  }
  return out;
}

function normalizeProduct(raw: any): CamilleProduct {
  const price = Number(raw.price) || 0;
  const priceMax = toNumber(raw.price_max);
  const images: string[] = Array.isArray(raw.images) ? raw.images.map(String) : [];
  return {
    id: String(raw.id),
    name: String(raw.name || "Sans nom"),
    description: String(raw.description || ""),
    price,
    // price_max n'est un prix barré que s'il est SUPÉRIEUR au prix courant.
    oldPrice: priceMax && priceMax > price ? priceMax : undefined,
    currency: String(raw.currency || "XAF"),
    category: String(raw.category || "Autres"),
    image: String(raw.image_url || images[0] || "") || null,
    stock: raw.stock == null ? null : Number(raw.stock),
    minOrder: Math.max(1, Number(raw.min_order) || 1),
    variants: Array.isArray(raw.variants)
      ? raw.variants
          .map((v: any) => ({
            name: String(v?.name || ""),
            options: Array.isArray(v?.options) ? v.options.map(String) : [],
          }))
          .filter((v: { name: string; options: string[] }) => v.name && v.options.length)
      : [],
    details: parseDetails(raw.tags),
  };
}

async function call(path: string, init: RequestInit & { key: "public" | "secret"; ttl?: number }) {
  const key = init.key === "secret" ? SECRET_KEY : PUBLIC_KEY;
  if (!key) {
    throw new CamilleError(
      init.key === "secret"
        ? "CAMILLE_SECRET_KEY manquante : la prise de commande est désactivée."
        : "CAMILLE_PUBLIC_KEY manquante : le catalogue ne peut pas être chargé."
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", "X-Camille-Key": key, ...(init.headers || {}) },
      ...(init.ttl != null ? { next: { revalidate: init.ttl, tags: ["camille"] } } : { cache: "no-store" }),
    });
  } catch (e) {
    throw new CamilleError("Camille est injoignable.", 0, (e as Error).message);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new CamilleError(String(body?.error || "Camille a refusé la requête."), res.status, body?.detail);
  }
  return body;
}

export async function getCatalog(): Promise<Catalog> {
  const body = await call("/api/public/v1/catalog?limit=100", { key: "public", ttl: CATALOG_TTL });
  const products: CamilleProduct[] = (Array.isArray(body.products) ? body.products : [])
    .map(normalizeProduct)
    // Un article épuisé reste visible (il informe), un article sans prix, non :
    // on ne met pas au panier ce qu'on ne sait pas facturer.
    .filter((p: CamilleProduct) => p.price > 0);

  // Les rayons viennent de Camille quand il les fournit ; sinon on les déduit
  // des produits, pour qu'une base pas encore à jour reste exploitable.
  const fromApi: any[] = Array.isArray(body.categories) ? body.categories : [];
  const names = fromApi.length
    ? fromApi.map((c) => ({ name: String(c.name), count: Number(c.count) || 0, image: c.image || null }))
    : [...new Set(products.map((p) => p.category))].map((name) => ({
        name,
        count: products.filter((p) => p.category === name).length,
        image: products.find((p) => p.category === name && p.image)?.image || null,
      }));

  const categories: CamilleCategory[] = names
    .map((c) => ({
      slug: slugify(c.name),
      name: c.name,
      count: c.count,
      // Pas de visuel déclaré ? La photo du premier article du rayon fait office
      // de vignette : aucune image à héberger côté site.
      image: c.image || products.find((p) => p.category === c.name && p.image)?.image || null,
      products: products.filter((p) => p.category === c.name),
    }))
    .filter((c) => c.products.length > 0);

  return {
    products,
    categories,
    merchant: {
      name: body.merchant?.name ?? null,
      whatsapp: body.merchant?.whatsapp ?? null,
      location: body.merchant?.location ?? null,
      lat: Number.isFinite(Number(body.merchant?.lat)) ? Number(body.merchant.lat) : null,
      lng: Number.isFinite(Number(body.merchant?.lng)) ? Number(body.merchant.lng) : null,
      delivery: {
        enabled: body.merchant?.delivery?.enabled !== false,
        fee: Number(body.merchant?.delivery?.fee) || 0,
        zones: Array.isArray(body.merchant?.delivery?.zones)
          ? body.merchant.delivery.zones
              .map((z: any) => ({ name: String(z?.name || ""), fee: Number(z?.fee) || 0 }))
              .filter((z: { name: string }) => z.name)
          : [],
      },
    },
    media: Array.isArray(body.media) ? body.media.filter((m: any) => m?.url) : [],
  };
}

export type NewOrderPayload = {
  items: { id: string; qty: number; variant?: string }[];
  customer: { name: string; phone: string; email?: string; company?: string };
  delivery: { address: string; details?: string; label?: string; lat?: number | null; lng?: number | null };
  scheduledAt?: string | null;
  note?: string;
  /** Moyen de paiement annoncé par le client. Rien n'est encaissé ici. */
  payment?: string;
  /** "livraison" | "retrait". */
  mode?: string;
  /** Code promo saisi, vérifié par le commerçant. */
  promo?: string;
  /** Frais de livraison décidés par le site (0 : la livraison est offerte). */
  deliveryFee?: number;
  /** Code du compte entreprise de l'employé, quand il commande pour sa société. */
  companyCode?: string;
};

export type PlacedOrder = {
  ref: string;
  total: number;
  currency: string;
  scheduledAt: string | null;
  whatsappNotified: boolean;
};

export async function createOrder(p: NewOrderPayload): Promise<PlacedOrder> {
  const body = await call("/api/public/v1/orders", {
    key: "secret",
    method: "POST",
    body: JSON.stringify({
      items: p.items,
      customer: p.customer,
      delivery: {
        ...p.delivery,
        // Une position exacte vaut mieux qu'une adresse écrite : Camille en
        // déduit le libellé du lieu et le lien de carte envoyé au livreur.
        lat: p.delivery.lat ?? undefined,
        lng: p.delivery.lng ?? undefined,
      },
      scheduled_at: p.scheduledAt || undefined,
      note: p.note || undefined,
      // Camille affiche ce contexte au commerçant au lieu de le deviner : le
      // paiement annoncé, la livraison ou le retrait, le code promo.
      payment: p.payment || undefined,
      mode: p.mode || undefined,
      promo: p.promo || undefined,
      // Explicites : sans cela Camille applique son propre barème, et le
      // commerçant voit des frais que le client n'a jamais vus.
      delivery_fee: p.deliveryFee,
      // Le compte entreprise : Camille vérifie la provision et rattache la
      // commande à la société.
      company_code: p.companyCode || undefined,
    }),
  });
  return {
    ref: String(body.order?.ref || ""),
    total: Number(body.order?.total) || 0,
    currency: String(body.order?.currency || "XAF"),
    scheduledAt: body.order?.scheduled_at ?? null,
    whatsappNotified: Boolean(body.whatsapp_notified),
  };
}

export type TrackedOrder = {
  ref: string;
  status: string;
  statusLabel: string;
  step: number;
  steps: { status: string; label: string }[];
  items: { name: string; qty: number; price: number; variant?: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  customerName: string | null;
  address: string | null;
  note: string | null;
  scheduledAt: string | null;
  placedAt: string | null;
  documentUrl: string | null;
};

export async function getOrder(ref: string, phone: string): Promise<TrackedOrder | null> {
  try {
    const body = await call(
      `/api/public/v1/orders/${encodeURIComponent(ref)}?phone=${encodeURIComponent(phone)}`,
      { key: "secret" }
    );
    const o = body.order;
    if (!o) return null;
    return {
      ref: String(o.ref),
      status: String(o.status),
      statusLabel: String(o.status_label),
      step: Number(o.step),
      steps: Array.isArray(o.steps) ? o.steps : [],
      items: Array.isArray(o.items) ? o.items : [],
      subtotal: Number(o.subtotal) || 0,
      deliveryFee: Number(o.delivery_fee) || 0,
      total: Number(o.total) || 0,
      currency: String(o.currency || "XAF"),
      customerName: o.customer_name ?? null,
      address: o.address ?? null,
      note: o.note ?? null,
      scheduledAt: o.scheduled_at ?? null,
      placedAt: o.placed_at ?? null,
      documentUrl: o.document_url ?? null,
    };
  } catch (e) {
    if (e instanceof CamilleError && e.status === 404) return null;
    throw e;
  }
}

export type CustomerProfile = {
  name: string | null;
  email: string | null;
  company: string | null;
  addresses: { label?: string; address: string; details?: string }[];
  ordersCount: number;
};

export async function getCustomer(phone: string): Promise<CustomerProfile | null> {
  const body = await call(`/api/public/v1/customers/${encodeURIComponent(phone)}`, { key: "secret" });
  const c = body.customer;
  if (!c) return null;
  return {
    name: c.name ?? null,
    email: c.email ?? null,
    company: c.company ?? null,
    addresses: Array.isArray(c.addresses) ? c.addresses : [],
    ordersCount: Number(c.orders_count) || 0,
  };
}

export async function saveCustomer(
  phone: string,
  profile: { name?: string; email?: string; company?: string; addresses?: unknown[] }
) {
  await call(`/api/public/v1/customers/${encodeURIComponent(phone)}`, {
    key: "secret",
    method: "POST",
    body: JSON.stringify(profile),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mesure d'audience — ce que le site raconte de lui-même à Camille.
//
// Le commerçant voyait ses commandes sans jamais savoir combien de personnes
// étaient passées : impossible de dire si le site est ignoré ou si tout le
// monde repart du panier. Les événements partent du serveur, jamais du
// navigateur : la clé reste chez nous et aucun bloqueur ne s'y oppose.
// Rien de nominatif ne circule — un identifiant aléatoire, une page, un
// appareil.
// ─────────────────────────────────────────────────────────────────────────────
export type SiteEvent = {
  kind: "page_view" | "product_view" | "add_to_cart" | "checkout_start" | "search";
  path?: string;
  title?: string;
  referrer?: string;
  visitor?: string;
  session?: string;
  device?: string;
  locale?: string;
  meta?: Record<string, unknown>;
};

/** N'échoue jamais : une mesure ratée ne doit rien coûter au visiteur. */
export async function sendEvents(events: SiteEvent[]): Promise<boolean> {
  if (!events.length || !PUBLIC_KEY) return false;
  try {
    const res = await fetch(`${BASE}/api/public/v1/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Camille-Key": PUBLIC_KEY },
      body: JSON.stringify({ events: events.slice(0, 20) }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Comptes entreprise — un code partagé entre les employés d'une société.
//
// L'employé commande avec son téléphone ; le code dit à quelle entreprise
// rattacher la commande, et donc qui paie. On l'interroge depuis le serveur :
// un code est court, donc devinable, et l'exposer au navigateur laisserait
// n'importe qui balayer l'alphabet pour lire le nom et la provision des
// entreprises clientes.
// ─────────────────────────────────────────────────────────────────────────────
export type CompanyAccount = {
  code: string;
  name: string;
  status: "active" | "suspended";
  billingMode: "prepaid" | "monthly";
  /** Provision restante, seulement pour un compte prépayé. */
  balance: number | null;
  monthlyCap: number | null;
  monthToDate: number;
  ordersThisMonth: number;
  contactName: string | null;
  address: string | null;
  details: string | null;
  lat: number | null;
  lng: number | null;
};

/** `null` quand le code n'existe pas : ce n'est pas une panne, c'est une faute de frappe. */
export async function findCompany(code: string): Promise<CompanyAccount | null> {
  const clean = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  if (!clean) return null;

  let body: any;
  try {
    body = await call(`/api/public/v1/companies/${encodeURIComponent(clean)}`, { key: "secret" });
  } catch (e) {
    if (e instanceof CamilleError && e.status === 404) return null;
    throw e;
  }

  const c = body?.company;
  if (!c) return null;
  return {
    code: String(c.code || clean),
    name: String(c.name || ""),
    status: c.status === "suspended" ? "suspended" : "active",
    billingMode: c.billing_mode === "monthly" ? "monthly" : "prepaid",
    balance: c.balance == null ? null : Number(c.balance) || 0,
    monthlyCap: c.monthly_cap == null ? null : Number(c.monthly_cap) || 0,
    monthToDate: Number(c.month_to_date) || 0,
    ordersThisMonth: Number(c.orders_this_month) || 0,
    contactName: c.contact_name ?? null,
    address: c.address ?? null,
    details: c.details ?? null,
    lat: c.lat == null ? null : Number(c.lat),
    lng: c.lng == null ? null : Number(c.lng),
  };
}
