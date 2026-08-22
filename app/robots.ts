import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://breakandlunch.cm";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Le suivi de commande et l'espace client portent des données de
      // personnes : ils n'ont rien à faire dans un index.
      disallow: ["/commande/", "/compte", "/panier", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
