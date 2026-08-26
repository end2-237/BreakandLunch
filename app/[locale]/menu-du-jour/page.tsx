import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import CutoffNotice from "@/components/CutoffNotice";
import DailyMenu from "@/components/DailyMenu";
import JsonLd from "@/components/JsonLd";
import Visual from "@/components/Visual";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { menuDuJour, semaineCourante } from "@/lib/planning";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site";
import { ArrowRight, ClockIcon, ScooterIcon } from "@/components/icons";

// Le menu change chaque jour : une page figée pour la journée suffit, et se
// renouvelle d'elle-même à la première visite du lendemain.
export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const jour = menuDuJour();
  const nomDuJour = jour ? t.daily.days[jour.jour] : "";
  // Ce que Google doit lire, c'est ce qui est réellement au menu : les fiches
  // cochées dans Camille. Le planning ne sert que tant que rien n'est coché.
  const { catalog } = await loadCatalog();
  const marques = (catalog?.products ?? []).filter((p) => p.dailyMenu).map((p) => p.name);
  const plats = marques.length ? marques.join(" · ") : jour ? jour.plats.join(" · ") : "";

  return {
    title: t.daily.title,
    description: plats ? `${t.daily.seo(nomDuJour)} ${plats}` : t.daily.intro,
    alternates: {
      canonical: `/${locale}/menu-du-jour`,
      languages: {
        fr: "/fr/menu-du-jour",
        en: "/en/menu-du-jour",
        "x-default": "/fr/menu-du-jour",
      },
    },
    openGraph: {
      title: `${t.daily.title} · ${SITE.name}`,
      description: plats || t.daily.intro,
      url: `${siteUrl()}/${locale}/menu-du-jour`,
    },
  };
}

export default async function MenuDuJourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog, error } = await loadCatalog();
  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;

  const jour = menuDuJour();
  const semaine = semaineCourante();

  // Le menu du jour, et rien d'autre : les fiches que Break & Lunch a cochées
  // dans Camille. Un plat sans fiche n'est pas annoncé — mieux vaut une page
  // courte qu'un plat qu'on ne peut ni montrer ni chiffrer.
  const auMenu = catalog.products.filter((p) => p.dailyMenu);
  const l = (path: string) => `/${locale}${path}`;

  return (
    <div className="shell pb-8 pt-4 lg:pt-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `/${locale}` },
          { name: t.daily.breadcrumb, url: `/${locale}/menu-du-jour` },
        ])}
      />
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.daily.breadcrumb }]} />

      {/* Ce qui sort de la cuisine aujourd'hui : la seule question du midi. */}
      <section className="mt-4 overflow-hidden rounded-[20px] bg-ink px-6 py-8 text-white sm:px-10 sm:py-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">
          {t.daily.eyebrow(jour?.semaine ?? 1)}
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
          {jour ? `${t.daily.today} · ${t.daily.days[jour.jour]}` : t.daily.closed}
        </h1>
        <p className="mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-white/70">
          {jour ? t.daily.intro : t.daily.closedText}
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/60">
          <li className="flex items-center gap-2">
            <ScooterIcon className="h-4 w-4 text-brand" /> {t.common.freeDelivery}
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-brand" /> {t.common.orderRule}
          </li>
        </ul>
      </section>

      {/* Les plats du jour : photo, prix, panier — au-delà de deux, ça défile. */}
      <section className="mt-8">
        {auMenu.length > 0 ? (
          <>
            <DailyMenu products={auMenu} />
            <CutoffNotice className="mt-5" />
          </>
        ) : (
          // Rien n'est coché aujourd'hui : on le dit, et on renvoie à la carte.
          // Annoncer un plat qu'on ne peut pas servir coûte plus cher que se
          // taire.
          <div className="rounded-[16px] border border-dashed border-line p-8 text-center">
            <p className="text-[15px] font-bold">{t.daily.empty}</p>
            <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-relaxed text-ink-soft">
              {t.daily.emptyText}
            </p>
            <Link
              href={l("/menus")}
              className="mt-5 inline-flex h-11 items-center rounded-[10px] bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-ink/85"
            >
              {t.common.browseMenu}
            </Link>
          </div>
        )}
      </section>

      {/* La semaine entière : on commande souvent la veille. */}
      <section className="mt-12">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] lg:text-[26px]">{t.daily.week}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-soft">{t.daily.weekIntro(jour?.semaine ?? 1)}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {semaine.map((j) => {
            const aujourdhui = jour?.jour === j.jour;
            return (
              <article
                key={j.jour}
                className={`rounded-[14px] border p-4 ${
                  aujourdhui ? "border-ink bg-tile/60" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[14.5px] font-bold">{t.daily.days[j.jour]}</h3>
                  {aujourdhui && (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10.5px] font-bold text-ink">
                      {t.daily.today.toUpperCase()}
                    </span>
                  )}
                </div>
                <ul className="mt-2 space-y-1.5">
                  {j.plats.map((plat) => (
                    <li key={plat} className="flex gap-2 text-[13px] leading-snug text-ink-soft">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {plat}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* Le reste de la carte, en présentation : petits-déjeuners, jus,
          formules. On commande le menu du jour ; le reste se découvre. */}
      <section className="mt-12">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] lg:text-[26px]">{t.home.sections}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.categories.map((c) => (
            <Link key={c.slug} href={l(`/menus/${c.slug}`)} className="group flex items-center gap-3 rounded-[14px] border border-line p-3 transition hover:border-ink/25">
              <Visual src={c.image} name={c.name} rounded="rounded-[10px]" className="h-14 w-14 shrink-0" initialClassName="text-[20px]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold">{c.name}</span>
                <span className="block text-[12px] text-muted">{t.common.articles(c.count)}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
