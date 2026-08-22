import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import LocationPill from "@/components/LocationPill";
import CategoryRow from "@/components/CategoryRow";
import MenuCard from "@/components/MenuCard";
import Visual from "@/components/Visual";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import JsonLd from "@/components/JsonLd";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { SITE, siteUrl } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import {
  ArrowRight,
  ClockIcon,
  FriendsIcon,
  PinIcon,
  ScooterIcon,
  StarIcon,
  WeightIcon,
} from "@/components/icons";

export const revalidate = 300;

const SERVICE_ICONS = [ClockIcon, WeightIcon, FriendsIcon, StarIcon, PinIcon, ScooterIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.seo.homeTitle(SITE.name, t.seo.slogan),
    description: t.seo.homeDescription,
    alternates: { canonical: `/${locale}`, languages: { fr: "/fr", en: "/en", "x-default": "/fr" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();

  if (!catalog || catalog.categories.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  const l = (path: string) => `/${locale}${path}`;
  const [first, second] = catalog.categories;
  const heroes = [first, second].filter(Boolean);

  return (
    <div className="shell pb-4 pt-6 lg:pt-8">
      <JsonLd data={[organizationSchema(catalog.merchant), websiteSchema(locale)]} />

      <div className="flex justify-center">
        <LocationPill />
      </div>

      <div className="mt-5 lg:mt-6">
        <SearchBar placeholder={t.home.searchPlaceholder} />
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6">
        {heroes.map((category) => (
          <Link key={category.slug} href={l(`/menus/${category.slug}`)} className="group block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
              <Visual
                src={category.image}
                name={category.name}
                rounded="rounded-[16px]"
                className="h-full w-full"
                initialClassName="text-[64px]"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                {t.common.articles(category.count)}
              </span>
            </div>
            <p className="mt-3 text-center text-[22px] font-bold tracking-[-0.02em] lg:text-[28px]">
              {category.name}
            </p>
          </Link>
        ))}
      </section>

      <CategoryRow />

      <section className="mt-12 lg:mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">{t.home.nearby}</h2>
          <Link
            href={l("/menus")}
            className="shrink-0 text-[13px] font-medium text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
          >
            {t.common.seeAll}
          </Link>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-6">
          {catalog.categories.slice(0, 4).map((category) => (
            <MenuCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="mt-14 lg:mt-20">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">{t.home.servicesTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3">
          {t.home.services.map((service, index) => {
            const Icon = SERVICE_ICONS[index] ?? ScooterIcon;
            return (
              <article
                key={service.title}
                className="rounded-[16px] border border-line p-5 transition hover:border-ink/20 hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
                  <Icon className="h-[18px] w-[18px] text-ink" />
                </div>
                <h3 className="mt-4 text-[16px] font-bold">{service.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{service.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14 lg:mt-20">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">{t.home.how}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:mt-6">
          {t.home.steps.map((step) => (
            <article key={step.n} className="rounded-[16px] bg-tile p-5">
              <span className="text-[13px] font-bold text-brand-deep">{step.n}</span>
              <h3 className="mt-2 text-[16px] font-bold">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[20px] bg-ink lg:mt-20">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              {t.home.ctaEyebrow}
            </p>
            <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em] text-white lg:text-[36px]">
              {t.home.ctaTitle}
            </h2>
            <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-white/70">
              {t.home.ctaText(SITE.city)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={l("/entreprises")}
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-brand px-6 text-[15px] font-semibold text-ink transition hover:bg-brand-deep"
              >
                {t.home.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={l("/contact")}
                className="inline-flex h-12 items-center rounded-[12px] border border-white/25 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
          <Visual
            src={catalog.media.find((m) => m.kind === "banner")?.url ?? null}
            name={SITE.name}
            rounded="rounded-[16px]"
            className="aspect-[4/3] w-full"
            initialClassName="text-[64px]"
          />
        </div>
      </section>
    </div>
  );
}
