import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog } = await loadCatalog();
  const n = catalog?.products.filter((p) => p.oldPrice).length ?? 0;
  return {
    title: t.offers.title,
    description: t.offers.intro(n, SITE.city),
    alternates: {
      canonical: `/${locale}/offres`,
      languages: { fr: "/fr/offres", en: "/en/offres", "x-default": "/fr/offres" },
    },
  };
}

export default async function OffresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();
  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const deals = catalog.products.filter((p) => p.oldPrice);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.nav.offers }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">{t.offers.title}</h1>

      {deals.length > 0 ? (
        <>
          <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
            {t.offers.intro(deals.length, SITE.city)}
          </p>
          <ProductGrid products={deals} />
        </>
      ) : (
        <div className="mt-8 rounded-[16px] border border-dashed border-line p-10 text-center">
          <p className="text-[15px] font-semibold">{t.offers.empty}</p>
          <p className="mt-2 text-[14px] text-ink-soft">{t.offers.emptyText}</p>
          <Link
            href={`/${locale}/menus`}
            className="mt-5 inline-flex h-11 items-center rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white"
          >
            {t.common.seeMenu}
          </Link>
        </div>
      )}
    </div>
  );
}
