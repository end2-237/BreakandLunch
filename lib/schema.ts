// ─────────────────────────────────────────────────────────────────────────────
// Données structurées schema.org.
//
// Ce qui décide qu'une recherche « poulet DG Douala » tombe sur notre page du
// plat, avec son prix et sa disponibilité, plutôt que sur rien du tout.
// ─────────────────────────────────────────────────────────────────────────────
import type { CamilleProduct, Merchant } from "./camille";
import { CURRENCY, SITE, siteUrl } from "./site";

const XAF = "XAF"; // le franc CFA, tel que le lisent les moteurs

export function organizationSchema(merchant: Merchant) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: merchant.name ?? SITE.name,
    slogan: SITE.slogan,
    url: siteUrl(),
    logo: `${siteUrl()}/marque/icone-512.png`,
    image: `${siteUrl()}/marque/partage.png`,
    telephone: SITE.phones.map((p) => `+237${p.replace(/\s/g, "")}`),
    email: SITE.email,
    priceRange: "₣₣",
    servesCuisine: ["Camerounaise", "Petit-déjeuner", "Déjeuner"],
    address: {
      "@type": "PostalAddress",
      streetAddress: merchant.location ?? SITE.defaultAddress,
      addressLocality: SITE.city,
      addressCountry: "CM",
    },
    ...(merchant.lat != null && merchant.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: merchant.lat, longitude: merchant.lng } }
      : {}),
    sameAs: [SITE.socials.facebook.href, SITE.socials.tiktok.href],
    hasDeliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
    areaServed: { "@type": "City", name: SITE.city },
  };
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `${siteUrl()}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl()}/${locale}/menus?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl()}${item.url}`,
    })),
  };
}

export function productSchema(
  product: CamilleProduct,
  opts: { locale: string; sectionName: string; sectionSlug: string; merchant: Merchant },
) {
  const url = `${siteUrl()}/${opts.locale}/menus/${opts.sectionSlug}/${product.id}`;
  const available = product.stock === null || product.stock > 0;

  return {
    "@context": "https://schema.org",
    // MenuItem plutôt que Product : c'est un plat, servi par un restaurant.
    "@type": "MenuItem",
    name: product.name,
    description: product.description || `${product.name} — ${opts.sectionName}`,
    url,
    ...(product.image ? { image: product.image } : {}),
    ...(product.details["allergènes"] && product.details["allergènes"].toLowerCase() !== "aucun"
      ? { suitableForDiet: [], nutrition: { "@type": "NutritionInformation", description: product.details["allergènes"] } }
      : {}),
    ...(product.details.kcal
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${product.details.kcal} kcal`,
            ...(product.details.poids ? { servingSize: product.details.poids } : {}),
          },
        }
      : {}),
    menuAddOn: [],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: XAF,
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
      seller: { "@type": "Restaurant", name: opts.merchant.name ?? SITE.name },
      deliveryLeadTime: { "@type": "QuantitativeValue", minValue: 30, maxValue: 120, unitCode: "MIN" },
      areaServed: { "@type": "City", name: SITE.city },
    },
    ...(product.details.rayon ? { menuSection: product.details.rayon } : {}),
    identifier: product.id,
  };
}

export const priceLabel = (n: number) => `${n.toLocaleString("fr-FR")} ${CURRENCY}`;
