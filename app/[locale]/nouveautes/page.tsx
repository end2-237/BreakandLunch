import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.news.title,
    description: t.news.intro,
    alternates: {
      canonical: `/${locale}/nouveautes`,
      languages: { fr: "/fr/nouveautes", en: "/en/nouveautes", "x-default": "/fr/nouveautes" },
    },
  };
}

export default async function NouveautesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();
  if (!catalog || catalog.products.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.nav.new }]} />
      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">{t.news.title}</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">{t.news.intro}</p>
      <ProductGrid products={catalog.products.slice(0, 12)} />
    </div>
  );
}
