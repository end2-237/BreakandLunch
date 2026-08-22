// ─────────────────────────────────────────────────────────────────────────────
// POST /api/commandes — le navigateur envoie ici, jamais à Camille directement.
//
// La clé secrète Camille reste sur le serveur : c'est elle qui autorise la
// création de commandes, et elle ne doit jamais partir dans un bundle.
// Les prix ne sont pas envoyés non plus — Camille les relit dans son catalogue
// à partir des identifiants produits.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { CamilleError, createOrder, saveCustomer } from "@/lib/camille";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type Body = {
  items?: { id?: string; qty?: number; variant?: string }[];
  customer?: { name?: string; phone?: string; email?: string; company?: string };
  delivery?: { address?: string; details?: string; label?: string; lat?: number | null; lng?: number | null };
  scheduledAt?: string | null;
  mode?: string;
  payment?: string;
  promo?: string;
};

export async function POST(req: Request) {
  // Sans ce garde-fou, un script pourrait remplir la boîte WhatsApp du
  // commerçant de fausses commandes en quelques secondes.
  const limit = rateLimit(`commande:${clientIp(req)}`, 6, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de commandes coup sur coup. Patientez une minute ou appelez-nous." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  const items = (body.items ?? [])
    .filter((i) => i?.id)
    .map((i) => ({
      id: String(i.id),
      qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
      variant: i.variant || undefined,
    }));
  if (!items.length) {
    return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
  }

  const phone = String(body.customer?.phone ?? "").replace(/\D/g, "");
  if (phone.length < 9) {
    return NextResponse.json({ error: "Indiquez un numéro de téléphone joignable." }, { status: 400 });
  }
  const name = String(body.customer?.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Indiquez le nom de la personne à livrer." }, { status: 400 });
  }

  const address = String(body.delivery?.address ?? "").trim();
  if (!address) {
    return NextResponse.json({ error: "Indiquez l’adresse de livraison." }, { status: 400 });
  }

  // La note est courte côté Camille : on y met ce que le commerçant doit lire en
  // premier — le service, le mode de paiement, l'étage. Le reste vit ailleurs.
  const note = [
    body.mode === "retrait" ? "Retrait sur place" : "Livraison",
    body.payment && `Paiement : ${body.payment}`,
    body.delivery?.details,
    body.promo && `Code : ${body.promo}`,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 120);

  try {
    const order = await createOrder({
      items,
      customer: {
        name,
        phone,
        email: body.customer?.email?.trim() || undefined,
        company: body.customer?.company?.trim() || undefined,
      },
      delivery: {
        address,
        details: body.delivery?.details || undefined,
        label: body.delivery?.label || undefined,
        // Coordonnées seulement si elles sont plausibles : une valeur aberrante
        // enverrait le livreur à l'autre bout du monde.
        lat: Number.isFinite(Number(body.delivery?.lat)) ? Number(body.delivery?.lat) : null,
        lng: Number.isFinite(Number(body.delivery?.lng)) ? Number(body.delivery?.lng) : null,
      },
      scheduledAt: body.scheduledAt ?? null,
      note,
    });

    // La fiche client garde ce que le formulaire vient d'apprendre : la
    // prochaine commande partira d'un formulaire déjà rempli. Un échec ici ne
    // remet pas la commande en cause — elle est déjà enregistrée.
    saveCustomer(phone, {
      name,
      email: body.customer?.email?.trim() || undefined,
      company: body.customer?.company?.trim() || undefined,
      addresses: [
        {
          label: body.delivery?.label || "Livraison",
          address,
          details: body.delivery?.details || "",
          lat: Number.isFinite(Number(body.delivery?.lat)) ? Number(body.delivery?.lat) : null,
          lng: Number.isFinite(Number(body.delivery?.lng)) ? Number(body.delivery?.lng) : null,
        },
      ],
    }).catch(() => {});

    return NextResponse.json({
      ref: order.ref,
      total: order.total,
      scheduled_at: order.scheduledAt,
      whatsapp_notified: order.whatsappNotified,
    });
  } catch (e) {
    const message =
      e instanceof CamilleError
        ? e.message
        : "La commande n’a pas pu être envoyée. Réessayez ou appelez-nous.";
    console.error("[commande]", message, (e as Error)?.message);
    // 409 : Camille refuse pour une raison que le client peut corriger
    // (article épuisé). Les autres cas sont de notre côté.
    const status = e instanceof CamilleError && e.status === 409 ? 409 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
