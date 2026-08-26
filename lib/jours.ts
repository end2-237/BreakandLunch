import type { Dictionary } from "@/lib/i18n";

/** « le lundi et le jeudi » — au plus deux jours cités, le reste se devine. */
export function nommerJours(jours: number[], t: Dictionary) {
  const noms = jours.map((j) => t.request.days[j % 7]).filter(Boolean);
  if (noms.length <= 1) return noms[0] ?? "";
  return noms.slice(0, 2).join(t.request.and);
}
