import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Placeholder from "@/components/Placeholder";
import { getMenu } from "@/lib/data";
import { formatPrice, SITE } from "@/lib/site";
import { ArrowRight, CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Formules entreprise",
  description:
    "Petits-déjeuners et déjeuners livrés chaque jour dans vos bureaux à Douala. Formules solo, packs équipe et abonnements mensuels.",
};

const ARGUMENTS = [
  "Livraison à heure fixe, chaque jour ouvré",
  "Menus renouvelés pour éviter la lassitude",
  "Options végétariennes et sans allergènes",
  "Facturation unique en fin de mois",
  "Commandes à l’avance ou avant 9h",
  "Livraison gratuite partout à Douala",
];

export default function EntreprisesPage() {
  const menu = getMenu("formules-entreprise");

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
          <Placeholder tone="#ffd400" rounded="rounded-[16px]" className="aspect-[4/3] w-full" iconClassName="h-10 w-10" />
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
        <Placeholder rounded="rounded-[16px]" className="aspect-[16/10] w-full" iconClassName="h-9 w-9" />
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">Nos formules</h2>
          <Link
            href="/menus/formules-entreprise"
            className="shrink-0 text-[13px] font-medium text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
          >
            Voir le menu complet
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {menu?.products.slice(0, 4).map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-[16px] border border-line p-5 transition hover:border-ink/20 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-[16px] font-bold leading-snug">{product.name}</h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                {product.description}
              </p>
              <p className="mt-4 text-[20px] font-bold">{formatPrice(product.price)}</p>
              <Link
                href={`/menus/formules-entreprise?plat=${product.id}`}
                className="mt-4 flex h-10 items-center justify-center rounded-[10px] bg-ink text-[13px] font-semibold text-white transition hover:bg-ink/85"
              >
                Choisir
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
