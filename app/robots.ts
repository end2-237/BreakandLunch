import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Suivi, panier et espace client portent des données de personnes.
      disallow: ["/fr/commande/", "/en/commande/", "/fr/compte", "/en/compte", "/fr/panier", "/en/panier", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
