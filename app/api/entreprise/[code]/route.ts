// ─────────────────────────────────────────────────────────────────────────────
// GET /api/entreprise/{code} — « ce code, c'est quelle entreprise ? »
//
// L'employé saisit le code de sa société au moment de commander ; le site
// reconnaît l'entreprise en direct et la lui montre AVANT qu'il valide, pas
// après. La clé Camille reste ici, sur le serveur.
//
// Un code est court, donc devinable : le plafond de débit empêche qu'on balaie
// l'alphabet pour découvrir les entreprises clientes et leur provision.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { CamilleError, findCompany } from "@/lib/camille";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const limit = rateLimit(`entreprise:${clientIp(req)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop d’essais. Patientez une minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const { code } = await params;

  try {
    const company = await findCompany(code);
    if (!company) return NextResponse.json({ found: false }, { status: 404 });
    return NextResponse.json({ found: true, company });
  } catch (e) {
    const message =
      e instanceof CamilleError
        ? "Impossible de vérifier le code pour le moment."
        : "Impossible de vérifier le code pour le moment.";
    console.error("[entreprise]", (e as Error)?.message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
