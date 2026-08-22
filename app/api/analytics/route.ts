// ─────────────────────────────────────────────────────────────────────────────
// POST /api/analytics — le site raconte sa fréquentation à Camille.
//
// Le navigateur écrit ici, jamais chez Camille : la clé reste sur le serveur,
// et le commerçant retrouve son trafic dans le tableau de bord Camille au lieu
// de deviner. Rien de nominatif ne part — un identifiant aléatoire posé par le
// navigateur, un chemin, un type d'appareil. Ni nom, ni adresse, ni panier.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { sendEvents, type SiteEvent } from "@/lib/camille";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const KINDS = ["page_view", "product_view", "add_to_cart", "checkout_start", "search"];

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n) || undefined;

export async function POST(req: Request) {
  // Une mesure n'a aucune raison d'arriver en rafale : ce plafond arrête un
  // script qui gonflerait les chiffres, sans gêner un visiteur réel.
  const limit = rateLimit(`analytics:${clientIp(req)}`, 60, 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as { events?: unknown };
  const raw = Array.isArray(body.events) ? body.events : [];

  const events: SiteEvent[] = raw
    .slice(0, 10)
    .map((e) => e as Record<string, unknown>)
    .filter((e) => e && KINDS.includes(String(e.kind)))
    .map((e) => ({
      kind: String(e.kind) as SiteEvent["kind"],
      path: clip(e.path, 200),
      title: clip(e.title, 160),
      referrer: clip(e.referrer, 200),
      visitor: clip(e.visitor, 64),
      session: clip(e.session, 64),
      device: clip(e.device, 12),
      locale: clip(e.locale, 12),
      meta: e.meta && typeof e.meta === "object" ? (e.meta as Record<string, unknown>) : undefined,
    }));

  if (!events.length) return NextResponse.json({ ok: false }, { status: 400 });

  // Réponse immédiate : le visiteur n'attend jamais après une statistique.
  const ok = await sendEvents(events);
  return NextResponse.json({ ok }, { status: 202 });
}
