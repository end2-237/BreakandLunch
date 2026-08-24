// ─────────────────────────────────────────────────────────────────────────────
// Géocodage — OpenStreetMap, sans clé d'API.
//
//   Photon (Komoot)  recherche au fil de la frappe, tolérante aux fautes.
//   Nominatim        géocodage inverse détaillé (rue, quartier, ville).
//
// Les deux sont interrogés depuis le serveur, jamais depuis le navigateur :
// leurs conditions d'usage exigent un User-Agent identifiable, et les réponses
// sont mises en cache pour ne pas les marteler.
// ─────────────────────────────────────────────────────────────────────────────

/** Douala : le centre de repli quand Camille n'a pas la position de la boutique. */
export const DOUALA = { lat: 4.0511, lng: 9.7679 };

/**
 * Rayon de la zone servie, en kilomètres.
 *
 * Il ne décrit pas une ambition commerciale : il sert à écarter les
 * homonymes. « Nyalla » existe au Liberia, « Akwa » à Yaoundé et au Nigeria,
 * et Photon les propose dans la même liste que le vrai quartier de Douala.
 * Un client presse, il tape, il touche le deuxième résultat — et le livreur
 * part pour Yaoundé. Tout ce qui est au-delà n'est pas une adresse de
 * livraison, c'est un piège.
 */
export const ZONE_KM = 80;

/** Le pays servi. Un résultat hors de là ne peut pas être une livraison. */
export const PAYS = "CM";

export const UA = "BreakAndLunchByJojoo/1.0 (+break.lunchbyjojoo@gmail.com)";

export type Place = {
  /** Ce qu'on montre au client : « Rue Njo-Njo, Bonapriso ». */
  label: string;
  /** Complément : ville, région. */
  context: string;
  lat: number;
  lng: number;
  /** Distance à la cuisine, quand elle est connue. Affichée telle quelle. */
  km?: number;
};

const clean = (parts: (string | undefined | null)[]) =>
  parts.map((p) => (p ?? "").trim()).filter(Boolean);

/** Un résultat Photon : {name, street, housenumber, district, city, state…}. */
export function fromPhoton(feature: {
  properties?: Record<string, unknown>;
  geometry?: { coordinates?: number[] };
}): (Place & { country: string }) | null {
  const p = feature.properties ?? {};
  const [lng, lat] = feature.geometry?.coordinates ?? [];
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const street = clean([p.housenumber as string, p.street as string]).join(" ");
  const label = clean([p.name as string, street]).join(", ") || street;
  const context = clean([
    p.district as string,
    p.city as string,
    p.county as string,
    p.state as string,
  ])
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3)
    .join(", ");

  if (!label && !context) return null;
  return {
    label: label || context,
    context: label ? context : "",
    lat,
    lng,
    country: String(p.countrycode ?? "").toUpperCase(),
  };
}

/** Une réponse Nominatim /reverse : address détaillée. */
export function fromNominatim(body: {
  address?: Record<string, string>;
  display_name?: string;
  lat?: string;
  lon?: string;
}): Place | null {
  const a = body.address ?? {};
  const lat = Number(body.lat);
  const lng = Number(body.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const street = clean([a.house_number, a.road || a.pedestrian || a.footway]).join(" ");
  const area = a.neighbourhood || a.suburb || a.quarter || a.village || a.hamlet;
  const label = clean([street, area]).join(", ") || (body.display_name ?? "").split(",")[0];
  const context = clean([a.city || a.town || a.municipality, a.state, a.country])
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 3)
    .join(", ");

  return { label: label || context, context: label ? context : "", lat, lng };
}

/** Distance à vol d'oiseau, en kilomètres. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Adresse complète telle qu'elle part chez Camille et chez le livreur. */
export function fullAddress(place: { label: string; context: string }) {
  return clean([place.label, place.context]).join(" — ");
}
