import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import Visual from "@/components/Visual";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { SITE } from "@/lib/site";
import { ArrowRight, CheckIcon } from "@/components/icons";

// Le catalogue Camille est relu au plus toutes les 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Formules entreprise",
  description:
    "Petits-déjeuners et déjeuners livrés chaque jour dans vos bureaux à Douala, à heure fixe et sans frais de livraison.",
};

const ARGUMENTS = [
  "Livraison à heure fixe, chaque jour ouvré",
  "Menus renouvelés pour éviter la lassitude",
  "Options végétariennes et allergènes indiqués",
  "Un seul interlocuteur, un bon de commande par livraison",
  "Commandes à l’avance ou avant 9h",
  "Livraison gratuite partout à Douala",
];

export default async function EntreprisesPage() {
  const { catalog, error } = await loadCatalog();
  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  // Le rayon des formules s'il existe, sinon les articles les plus adaptés aux
  // équipes. Aucun contenu inventé : ce sont des articles du catalogue.
  const formulas =
    catalog.categories.find((c) => /formule|entreprise/i.test(c.name))?.products ??
    catalog.products.slice(0, 4);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Entreprises" }]} />

      <section className="mt-4 overflow-hidden rounded-[20px] bg-ink">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              Break &amp; Lunch pour les entreprises
            </p>
            <h1 className="mt-3 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-white lg:text-[46px]">
              Le petit-déjeuner et le déjeuner de vos équipes, réglés une bonne fois pour toutes.
            </h1>
            <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-white/70">
              Nous cuisinons chaque matin à {SITE.city} et livrons directement dans vos bureaux.
              Vous choisissez la formule, nous nous occupons du reste.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-brand px-6 text-[15px] font-semibold text-ink transition hover:bg-brand-deep"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.socials.whatsapp.href}
                className="inline-flex h-12 items-center rounded-[12px] border border-white/25 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
          <Visual
            src={catalog.media.find((m) => m.kind === "banner")?.url ?? null}
            name="Formules entreprise"
            rounded="rounded-[16px]"
            className="aspect-[4/3] w-full"
            initialClassName="text-[64px]"
          />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">
            Ce que comprend chaque formule
          </h2>
          <ul className="mt-5 space-y-3">
            {ARGUMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14.5px] text-ink-soft">
                <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                  <CheckIcon className="h-3 w-3 text-ink" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Visual
          src={catalog.categories[0]?.image ?? null}
          name="Livraison en entreprise"
          rounded="rounded-[16px]"
          className="aspect-[16/10] w-full"
          initialClassName="text-[56px]"
        />
      </section>

      <section className="mt-14">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">Nos formules</h2>
        <ProductGrid products={formulas.slice(0, 8)} />
      </section>
    </div>
  );
}
