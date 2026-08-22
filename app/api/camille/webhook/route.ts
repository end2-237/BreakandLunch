// ─────────────────────────────────────────────────────────────────────────────
// POST /api/camille/webhook — Camille prévient le site qu'une commande a changé
// d'état. On rafraîchit alors la page de suivi correspondante, au lieu de la
// faire interroger Camille en boucle.
//
// La signature HMAC est vérifiée : sans elle, n'importe qui connaissant l'URL
// pourrait faire croire qu'une commande est livrée.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const SECRET = process.env.CAMILLE_WEBHOOK_SECRET || "";

function valid(raw: string, signature: string | null) {
  if (!SECRET) return false;
  if (!signature) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const raw = await req.text();

  if (!valid(raw, req.headers.get("x-camille-signature"))) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let payload: { event?: string; data?: { ref?: string } } = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Corps illisible" }, { status: 400 });
  }

  const ref = payload.data?.ref;
  if (ref) revalidatePath(`/commande/${ref}`);

  return NextResponse.json({ ok: true });
}
