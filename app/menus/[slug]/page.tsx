import { Suspense } from "react";
import type { Metadata } from "next";
import MenuView from "@/components/MenuView";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { catalog } = await loadCatalog();
  const category = catalog?.categories.find((c) => c.slug === slug);
  if (!category) return { title: "Menu" };
  return {
    title: category.name,
    description: `${category.count} articles de la carte ${category.name}, livrés gratuitement à Douala.`,
  };
}

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { catalog, error } = await loadCatalog();

  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const category = catalog.categories.find((c) => c.slug === slug);
  // Un rayon peut disparaître du catalogue Camille entre deux visites : on le
  // dit plutôt que d'afficher une page vide.
  if (!category) {
    return (
      <CatalogUnavailable message="Ce rayon n’est plus à la carte aujourd’hui." />
    );
  }

  return (
    <Suspense fallback={<div className="shell py-20" />}>
      <MenuView category={category} />
    </Suspense>
  );
}
