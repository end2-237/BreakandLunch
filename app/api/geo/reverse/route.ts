// ─────────────────────────────────────────────────────────────────────────────
// GET /api/geo/reverse?lat=&lng= — adresse détaillée d'un point (Nominatim).
//
// Appelé quand le client partage sa position ou déplace le repère. On répond
// aussi à quelle distance de la cuisine se trouve ce point : une position
// donnée par le réseau plutôt que par le GPS tombe volontiers dans une autre
// ville, et c'est au moment de la lire qu'il faut s'en apercevoir — pas quand
// le livreur est en route.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loadCatalog } from "@/lib/catalog-server";
import { distanceKm, DOUALA, UA, ZONE_KM, fromNominatim } from "@/lib/geo";

export const revalidate = 86400;

/** Le centre de la zone : la cuisine si Camille la connaît, Douala sinon. */
async function centre() {
  try {
    const { catalog } = await loadCatalog();
    const m = catalog?.merchant;
    if (m?.lat != null && m?.lng != null) return { lat: m.lat, lng: m.lng };
  } catch {
    /* le repli suffit */
  }
  return DOUALA;
}

export async function GET(req: Request) {
  const limit = rateLimit(`geo-reverse:${clientIp(req)}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const params = new URL(req.url).searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Coordonnées invalides" }, { status: 400 });
  }

  const url =
    "https://nominatim.openstreetmap.org/reverse?" +
    new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: "jsonv2",
      zoom: "18", // niveau « bâtiment / rue »
      addressdetails: "1",
      "accept-language": "fr",
    });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`nominatim ${res.status}`);
    const place = fromNominatim(await res.json());
    if (!place) throw new Error("réponse inexploitable");
    const km = distanceKm(await centre(), place);
    return NextResponse.json({
      place: { ...place, km: Math.round(km * 10) / 10 },
      out_of_zone: km > ZONE_KM,
      zone_km: ZONE_KM,
    });
  } catch (e) {
    console.error("[geo/reverse]", (e as Error).message);
    // La position reste utilisable même sans libellé : le livreur a le point.
    const km = distanceKm(await centre(), { lat, lng });
    return NextResponse.json({
      place: {
        label: `Position GPS ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        context: "",
        lat,
        lng,
        km: Math.round(km * 10) / 10,
      },
      out_of_zone: km > ZONE_KM,
      zone_km: ZONE_KM,
    });
  }
}
