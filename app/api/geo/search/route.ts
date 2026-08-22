// GET /api/geo/search?q=… — recherche d'adresse (Photon, sans clé).
// Le navigateur n'appelle jamais OpenStreetMap directement : nous devons
// présenter un User-Agent identifiable et limiter la cadence.
import { NextResponse } from "next/server";
import { DOUALA, UA, fromPhoton, type Place } from "@/lib/geo";

export const revalidate = 3600;

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 3) return NextResponse.json({ places: [] });

  const url =
    "https://photon.komoot.io/api/?" +
    new URLSearchParams({
      q,
      lang: "fr",
      limit: "6",
      // Biais géographique : « Akwa » doit d'abord proposer Akwa à Douala.
      lat: String(DOUALA.lat),
      lon: String(DOUALA.lng),
    });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`photon ${res.status}`);
    const body = await res.json();
    const places = (Array.isArray(body.features) ? body.features : [])
      .map(fromPhoton)
      .filter(Boolean) as Place[];
    return NextResponse.json({ places });
  } catch (e) {
    console.error("[geo/search]", (e as Error).message);
    // Pas de résultat plutôt qu'une erreur : le client peut toujours saisir son
    // adresse à la main ou poser le point sur la carte.
    return NextResponse.json({ places: [] });
  }
}
