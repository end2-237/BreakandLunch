import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MenuCard from "@/components/MenuCard";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { SITE } from "@/lib/site";

// Le catalogue Camille est relu au plus toutes les 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Notre carte",
  description:
    "Petits-déjeuners, déjeuners, jus naturels, formules entreprise et service traiteur livrés à Douala.",
};

export default async function MenusPage() {
  const { catalog, error } = await loadCatalog();
  if (!catalog || catalog.categories.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Menus" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Notre carte</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        {catalog.products.length} articles préparés le jour même et livrés gratuitement dans vos
        bureaux à {SITE.city}.
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.categories.map((category) => (
          <MenuCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
