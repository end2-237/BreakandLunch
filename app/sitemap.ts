import type { MetadataRoute } from "next";
import { loadCatalog } from "@/lib/catalog-server";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Chaque URL est déclarée dans les deux langues : Google indexe les deux. */
function alternates(path: string) {
  return {
    languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl()}/${l}${path}`])),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base = siteUrl();
  const pages = ["", "/menu-du-jour", "/menus", "/offres", "/nouveautes", "/entreprises", "/contact"];

  const entries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      // Le menu du jour change tous les jours : Google doit repasser souvent.
      changeFrequency: path === "" || path === "/menu-du-jour" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/menu-du-jour" ? 0.9 : 0.7,
      alternates: alternates(path),
    })),
  );

  const { catalog } = await loadCatalog();
  if (catalog) {
    for (const locale of locales) {
      for (const category of catalog.categories) {
        entries.push({
          url: `${base}/${locale}/menus/${category.slug}`,
          lastModified: now,
          changeFrequency: "daily",
          priority: 0.8,
          alternates: alternates(`/menus/${category.slug}`),
        });
        // Une entrée par plat : c'est la page qu'un moteur peut proposer en
        // réponse à « poulet DG Douala », et depuis laquelle on commande.
        for (const product of category.products) {
          entries.push({
            url: `${base}/${locale}/menus/${category.slug}/${product.id}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
            alternates: alternates(`/menus/${category.slug}/${product.id}`),
          });
        }
      }
    }
  }

  return entries;
}
