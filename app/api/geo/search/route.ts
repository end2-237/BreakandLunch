// ─────────────────────────────────────────────────────────────────────────────
// GET /api/geo/search?q=… — recherche d'adresse (Photon, sans clé).
//
// Photon cherche dans le monde entier. « Nyalla » existe au Liberia, « Akwa »
// à Yaoundé et au Nigeria : ces homonymes arrivaient dans la même liste que le
// vrai quartier de Douala, sans rien pour les distinguer. Un client pressé
// touchait le deuxième résultat, et la commande partait avec des coordonnées
// à des centaines de kilomètres.
//
// D'où trois garde-fous, dans cet ordre : Photon est contraint à une boîte
// autour de la cuisine, ce qui sort quand même est écarté (pays, distance), et
// ce qui reste est classé du plus proche au plus loin, distance affichée.
//
// Le navigateur n'appelle jamais OpenStreetMap directement : nous devons
// présenter un User-Agent identifiable et limiter la cadence.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loadCatalog } from "@/lib/catalog-server";
import { distanceKm, DOUALA, PAYS, UA, ZONE_KM, fromPhoton, type Place } from "@/lib/geo";

export const revalidate = 3600;

/** Le centre de la zone : la cuisine si Camille la connaît, Douala sinon. */
async function centre() {
  try {
    const { catalog } = await loadCatalog();
    const m = catalog?.merchant;
    if (m?.lat != null && m?.lng != null && Math.abs(m.lat) <= 90 && Math.abs(m.lng) <= 180) {
      return { lat: m.lat, lng: m.lng };
    }
  } catch {
    /* le repli suffit : on cherche autour de Douala */
  }
  return DOUALA;
}

export async function GET(req: Request) {
  const limit = rateLimit(`geo-search:${clientIp(req)}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 3) return NextResponse.json({ places: [] });

  const here = await centre();
  // Un degré vaut environ 111 km : la boîte couvre la ville et sa périphérie,
  // et exclut d'emblée Yaoundé comme le Liberia.
  const d = ZONE_KM / 111;

  const url =
    "https://photon.komoot.io/api/?" +
    new URLSearchParams({
      q,
      lang: "fr",
      // On demande large pour pouvoir écarter sans se retrouver les mains vides.
      limit: "15",
      lat: String(here.lat),
      lon: String(here.lng),
      // Biais fort : à nom égal, le quartier d'à côté passe devant.
      location_bias_scale: "0.8",
      bbox: [here.lng - d, here.lat - d, here.lng + d, here.lat + d].map((n) => n.toFixed(4)).join(","),
    });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`photon ${res.status}`);
    const body = await res.json();

    const places: Place[] = (Array.isArray(body.features) ? body.features : [])
      .map(fromPhoton)
      .filter(Boolean)
      .map((p: Place & { country: string }) => ({ ...p, km: distanceKm(here, p) }))
      // La boîte de Photon n'est pas un cercle, et un résultat sans pays
      // renseigné passerait à travers : on revérifie ici.
      .filter((p: Place & { country: string }) => (!p.country || p.country === PAYS) && (p.km ?? 0) <= ZONE_KM)
      .sort((a: Place, b: Place) => (a.km ?? 0) - (b.km ?? 0))
      .slice(0, 6)
      .map(({ label, context, lat, lng, km }: Place) => ({
        label,
        context,
        lat,
        lng,
        km: Math.round((km ?? 0) * 10) / 10,
      }));

    // Zéro résultat est une réponse honnête : mieux vaut inviter à poser le
    // repère sur la carte que proposer une adresse d'un autre pays.
    return NextResponse.json({ places, zone_km: ZONE_KM });
  } catch (e) {
    console.error("[geo/search]", (e as Error).message);
    // Panne du service de recherche : ce n'est pas « rien dans la zone », et
    // le client mérite qu'on le lui dise autrement.
    return NextResponse.json({ places: [], unavailable: true });
  }
}
