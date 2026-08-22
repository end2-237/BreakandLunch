import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MenuCard from "@/components/MenuCard";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import JsonLd from "@/components/JsonLd";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog } = await loadCatalog();
  return {
    title: t.menus.title,
    description: t.menus.intro(catalog?.products.length ?? 0, SITE.city),
    alternates: {
      canonical: `/${locale}/menus`,
      languages: { fr: "/fr/menus", en: "/en/menus", "x-default": "/fr/menus" },
    },
  };
}

export default async function MenusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();

  if (!catalog || catalog.categories.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `/${locale}` },
          { name: t.nav.menus, url: `/${locale}/menus` },
        ])}
      />
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.nav.menus }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">{t.menus.title}</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        {t.menus.intro(catalog.products.length, SITE.city)}
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.categories.map((category) => (
          <MenuCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
