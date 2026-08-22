import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Visual from "@/components/Visual";
import ProductActions from "@/components/ProductActions";
import ProductGrid from "@/components/ProductGrid";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import JsonLd from "@/components/JsonLd";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary, locales } from "@/lib/i18n";
import { formatPrice, SITE, siteUrl } from "@/lib/site";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { AlertIcon, ArrowLeft, BoltIcon, ScooterIcon, WeightIcon } from "@/components/icons";

export const revalidate = 300;

/** Chaque plat a sa page : c'est elle que Google indexe et propose en résultat. */
export async function generateStaticParams() {
  const { catalog } = await loadCatalog();
  if (!catalog) return [];
  return locales.flatMap((locale) =>
    catalog.categories.flatMap((category) =>
      category.products.map((product) => ({ locale, slug: category.slug, produit: product.id })),
    ),
  );
}

async function find(slug: string, produit: string) {
  const { catalog, error } = await loadCatalog();
  const category = catalog?.categories.find((c) => c.slug === slug);
  const product = category?.products.find((p) => p.id === produit);
  return { catalog, category, product, error };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; produit: string }>;
}): Promise<Metadata> {
  const { locale, slug, produit } = await params;
  const t = getDictionary(locale);
  const { category, product } = await find(slug, produit);
  if (!category || !product) return { title: t.menus.title };

  const path = `/menus/${slug}/${produit}`;
  const description =
    product.description ||
    t.seo.productDescription(product.name, category.name, formatPrice(product.price));

  return {
    title: `${product.name} — ${formatPrice(product.price)}`,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { fr: `/fr${path}`, en: `/en${path}`, "x-default": `/fr${path}` },
    },
    openGraph: {
      type: "article",
      title: `${product.name} · ${SITE.name}`,
      description,
      url: `${siteUrl()}/${locale}${path}`,
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; produit: string }>;
}) {
  const { locale, slug, produit } = await params;
  const t = getDictionary(locale);
  const { catalog, category, product, error } = await find(slug, produit);

  if (!catalog) return <CatalogUnavailable message={error ?? undefined} />;
  if (!category || !product) return <CatalogUnavailable message={t.menus.gone} />;

  const l = (path: string) => `/${locale}${path}`;
  const grams = product.details.poids ?? product.details.grammes;
  const kcal = product.details.kcal ?? product.details.calories;
  const ingredients = product.details["ingrédients"] ?? product.details.ingredients;
  const allergens = product.details["allergènes"] ?? product.details.allergenes;
  const soldOut = product.stock !== null && product.stock <= 0;
  const others = category.products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="shell pb-10 pt-4 lg:pt-6">
      <JsonLd
        data={[
          productSchema(product, {
            locale,
            sectionName: category.name,
            sectionSlug: category.slug,
            merchant: catalog.merchant,
          }),
          breadcrumbSchema([
            { name: t.nav.home, url: `/${locale}` },
            { name: t.nav.menus, url: `/${locale}/menus` },
            { name: category.name, url: `/${locale}/menus/${slug}` },
            { name: product.name, url: `/${locale}/menus/${slug}/${produit}` },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: t.nav.home, href: l("/") },
          { label: t.nav.menus, href: l("/menus") },
          { label: category.name, href: l(`/menus/${slug}`) },
          { label: product.name },
        ]}
      />

      <article className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
        <Visual
          src={product.image}
          name={product.name}
          rounded="rounded-[18px]"
          className="aspect-square w-full"
          initialClassName="text-[64px]"
        />

        <div>
          <p className="text-[13px] font-medium text-muted">
            {t.product.inSection} · {category.name}
          </p>
          <h1 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] lg:text-[42px]">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-[26px] font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[15px] text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
            {soldOut && (
              <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-bold text-white">
                {t.common.soldOut}
              </span>
            )}
          </div>

          {(grams || kcal) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-semibold">
              {grams && (
                <span className="flex items-center gap-1.5">
                  <WeightIcon className="h-4 w-4 text-ink-soft" />
                  {grams}
                </span>
              )}
              {kcal && (
                <span className="flex items-center gap-1.5">
                  <BoltIcon className="h-4 w-4 text-brand-deep" />
                  {kcal} kcal
                </span>
              )}
            </div>
          )}

          {product.description && (
            <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          {ingredients && (
            <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-soft">{ingredients}</p>
          )}

          {allergens && (
            <div className="mt-5 rounded-[12px] border border-line p-4">
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <AlertIcon className="h-4 w-4" />
                {t.product.allergens}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{allergens}</p>
            </div>
          )}

          <div className="mt-7">
            <ProductActions id={product.id} soldOut={soldOut} name={product.name} />
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
            <ScooterIcon className="h-4 w-4" />
            {t.common.freeDelivery} · {t.common.orderRule}
          </p>

          <Link
            href={l(`/menus/${slug}`)}
            className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.product.backToSection(category.name)}
          </Link>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] lg:text-[26px]">{t.product.mayLike}</h2>
          <ProductGrid products={others} />
        </section>
      )}
    </div>
  );
}
