import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import Visual from "@/components/Visual";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { ArrowRight, CheckIcon } from "@/components/icons";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.home.ctaEyebrow,
    description: t.business.text(SITE.city),
    alternates: {
      canonical: `/${locale}/entreprises`,
      languages: { fr: "/fr/entreprises", en: "/en/entreprises", "x-default": "/fr/entreprises" },
    },
  };
}

export default async function EntreprisesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();
  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const formulas =
    catalog.categories.find((c) => /formule|entreprise|plan|company/i.test(c.name))?.products ??
    catalog.products.slice(0, 4);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.nav.business }]} />

      <section className="mt-4 overflow-hidden rounded-[20px] bg-ink">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              {t.business.eyebrow}
            </p>
            <h1 className="mt-3 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-white lg:text-[46px]">
              {t.business.title}
            </h1>
            <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-white/70">
              {t.business.text(SITE.city)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-brand px-6 text-[15px] font-semibold text-ink transition hover:bg-brand-deep"
              >
                {t.business.quote}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.socials.whatsapp.href}
                className="inline-flex h-12 items-center rounded-[12px] border border-white/25 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                {t.business.whatsapp}
              </a>
            </div>
          </div>
          <Visual
            src={catalog.media.find((m) => m.kind === "banner")?.url ?? null}
            name={t.home.ctaEyebrow}
            rounded="rounded-[16px]"
            className="aspect-[4/3] w-full"
            initialClassName="text-[64px]"
          />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">{t.business.included}</h2>
          <ul className="mt-5 space-y-3">
            {t.business.points.map((item) => (
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
          name={SITE.name}
          rounded="rounded-[16px]"
          className="aspect-[16/10] w-full"
          initialClassName="text-[56px]"
        />
      </section>

      {/* Le paiement en fin de mois : c'est ce qui décide une entreprise, il a
          donc sa section, pas une ligne perdue dans une liste. */}
      <section className="mt-14 overflow-hidden rounded-[20px] border border-line bg-tile/60 p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-deep">
              {t.business.eyebrow}
            </p>
            <h2 className="mt-3 text-[24px] font-bold tracking-[-0.02em] lg:text-[32px]">
              {t.business.billingTitle}
            </h2>
            <p className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-ink-soft">
              {t.business.billingText}
            </p>
          </div>
          <ul className="space-y-3">
            {t.business.billingPoints.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-[12px] bg-white p-4 text-[14.5px]">
                <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                  <CheckIcon className="h-3 w-3 text-ink" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">{t.business.formulas}</h2>
        <ProductGrid products={formulas.slice(0, 8)} />
      </section>
    </div>
  );
}
