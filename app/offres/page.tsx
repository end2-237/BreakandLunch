import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { SITE } from "@/lib/site";

// Le catalogue Camille est relu au plus toutes les 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Offres",
  description: "Les articles à prix réduit du moment chez Break & Lunch by Jojoo.",
};

export default async function OffresPage() {
  const { catalog, error } = await loadCatalog();
  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const deals = catalog.products.filter((p) => p.oldPrice);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Offres" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Offres du moment</h1>

      {deals.length > 0 ? (
        <>
          <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
            {deals.length} article{deals.length > 1 ? "s" : ""} à prix réduit, livré
            {deals.length > 1 ? "s" : ""} gratuitement à {SITE.city}. {SITE.delivery.orderRule}.
          </p>
          <ProductGrid products={deals} />
        </>
      ) : (
        <div className="mt-8 rounded-[16px] border border-dashed border-line p-10 text-center">
          <p className="text-[15px] font-semibold">Aucune offre en cours</p>
          <p className="mt-2 text-[14px] text-ink-soft">
            Revenez bientôt, ou parcourez la carte du jour.
          </p>
          <Link
            href="/menus"
            className="mt-5 inline-flex h-11 items-center rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white"
          >
            Voir la carte
          </Link>
        </div>
      )}
    </div>
  );
}
