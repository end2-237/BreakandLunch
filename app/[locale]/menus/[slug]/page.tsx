import { Suspense } from "react";
import type { Metadata } from "next";
import MenuView from "@/components/MenuView";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import JsonLd from "@/components/JsonLd";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const { catalog } = await loadCatalog();
  const category = catalog?.categories.find((c) => c.slug === slug);
  if (!category) return { title: t.menus.title };

  const path = `/menus/${slug}`;
  return {
    title: category.name,
    description: t.seo.sectionDescription(category.count, category.name),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { fr: `/fr${path}`, en: `/en${path}`, "x-default": `/fr${path}` },
    },
    openGraph: {
      title: `${category.name} · ${t.menus.title}`,
      description: t.seo.sectionDescription(category.count, category.name),
      url: `${siteUrl()}/${locale}${path}`,
      images: category.image ? [{ url: category.image }] : undefined,
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();

  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const category = catalog.categories.find((c) => c.slug === slug);
  if (!category) return <CatalogUnavailable message={t.menus.gone} />;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t.nav.home, url: `/${locale}` },
            { name: t.nav.menus, url: `/${locale}/menus` },
            { name: category.name, url: `/${locale}/menus/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: category.name,
            numberOfItems: category.products.length,
            itemListElement: category.products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: product.name,
              url: `${siteUrl()}/${locale}/menus/${slug}/${product.id}`,
            })),
          },
        ]}
      />
      <Suspense fallback={<div className="shell py-20" />}>
        <MenuView category={category} />
      </Suspense>
    </>
  );
}
