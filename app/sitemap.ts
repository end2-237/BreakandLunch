import type { MetadataRoute } from "next";
import { loadCatalog } from "@/lib/catalog-server";

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://breakandlunch.cm").replace(/\/$/, "");

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/menus", "/offres", "/nouveautes", "/entreprises", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  // Les rayons viennent du catalogue : un rayon retiré de Camille disparaît
  // du plan du site à la revalidation suivante.
  const { catalog } = await loadCatalog();
  const categories = (catalog?.categories ?? []).map((c) => ({
    url: `${base}/menus/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...pages, ...categories];
}
