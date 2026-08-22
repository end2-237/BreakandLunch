import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";

// Le catalogue Camille est relu au plus toutes les 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Les articles mis en avant sur la carte Break & Lunch by Jojoo.",
};

export default async function NouveautesPage() {
  const { catalog, error } = await loadCatalog();
  if (!catalog || catalog.products.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Nouveautés" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Nouveautés</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        Les articles mis en avant sur la carte en ce moment, dans l’ordre choisi par la cuisine.
      </p>

      <ProductGrid products={catalog.products.slice(0, 12)} />
    </div>
  );
}
