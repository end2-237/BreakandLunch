// GET /api/geo/reverse?lat=&lng= — adresse détaillée d'un point (Nominatim).
// Utilisé quand le client partage sa position ou déplace le repère sur la carte.
import { NextResponse } from "next/server";
import { UA, fromNominatim } from "@/lib/geo";

export const revalidate = 86400;

export async function GET(req: Request) {
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
    return NextResponse.json({ place });
  } catch (e) {
    console.error("[geo/reverse]", (e as Error).message);
    // La position reste utilisable même sans libellé : le livreur a le point.
    return NextResponse.json({
      place: {
        label: `Position GPS ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        context: "",
        lat,
        lng,
      },
    });
  }
}
