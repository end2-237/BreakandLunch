// GET /api/client?tel=… — fiche client et dernières commandes.
// La lecture passe par le serveur : la clé secrète Camille n'est jamais exposée.
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CamilleError } from "@/lib/camille";

export const dynamic = "force-dynamic";

const BASE = (process.env.CAMILLE_URL || "https://camille.vps.buyticle.com").replace(/\/$/, "");

export async function GET(req: Request) {
  const limit = rateLimit(`client:${clientIp(req)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const phone = (new URL(req.url).searchParams.get("tel") || "").replace(/\D/g, "");
  if (phone.length < 9) {
    return NextResponse.json({ error: "Numéro incomplet." }, { status: 400 });
  }

  const key = process.env.CAMILLE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Service momentanément indisponible." }, { status: 503 });
  }

  try {
    const res = await fetch(`${BASE}/api/public/v1/customers/${encodeURIComponent(phone)}`, {
      headers: { "X-Camille-Key": key },
      cache: "no-store",
    });
    const body = await res.json();
    if (!res.ok) throw new CamilleError(body?.error || "Recherche impossible.", res.status);
    return NextResponse.json({ customer: body.customer ?? null, orders: body.orders ?? [] });
  } catch (e) {
    console.error("[client]", (e as Error).message);
    return NextResponse.json(
      { error: "Impossible de retrouver vos commandes pour le moment." },
      { status: 502 },
    );
  }
}
