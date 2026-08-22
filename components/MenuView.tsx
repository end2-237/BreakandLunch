"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CamilleCategory, CamilleProduct } from "@/lib/camille";
import { SITE } from "@/lib/site";
import Breadcrumbs from "./Breadcrumbs";
import FiltersPanel, { type FilterDraft } from "./FiltersPanel";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import Visual from "./Visual";
import {
  ChevronDown,
  ClockIcon,
  CloseIcon,
  FriendsIcon,
  ScooterIcon,
  SearchIcon,
  SlidersIcon,
} from "./icons";
import { useI18n } from "./I18nProvider";

type SortKey = "defaut" | "prix-asc" | "prix-desc" | "nom";

const SORT_KEYS: SortKey[] = ["defaut", "prix-asc", "prix-desc", "nom"];

export default function MenuView({ category }: { category: CamilleCategory }) {
  const params = useSearchParams();
  const { t, href } = useI18n();

  const bounds = useMemo(() => {
    const prices = category.products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices) / 100) * 100;
    const max = Math.ceil(Math.max(...prices) / 100) * 100;
    return { min, max: Math.max(max, min + 100) };
  }, [category]);

  // Facettes déduites du catalogue : le sous-rayon posé à l'import et les
  // variantes déclarées sur les articles. Rien n'est inventé ici.
  const rayons = useMemo(
    () => [...new Set(category.products.map((p) => p.details.rayon).filter(Boolean))] as string[],
    [category],
  );
  const variants = useMemo(
    () => [...new Set(category.products.flatMap((p) => p.variants.flatMap((v) => v.options)))],
    [category],
  );

  const initial = useMemo<FilterDraft>(
    () => ({ rayons: [], min: bounds.min, max: bounds.max, variant: "" }),
    [bounds],
  );

  const [draft, setDraft] = useState<FilterDraft>(initial);
  const [applied, setApplied] = useState<FilterDraft>(initial);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("defaut");
  const [active, setActive] = useState<CamilleProduct | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setDraft(initial);
    setApplied(initial);
  }, [initial]);

  useEffect(() => {
    const id = params.get("plat");
    if (!id) return;
    const found = category.products.find((product) => product.id === id);
    if (found) setActive(found);
  }, [params, category]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = category.products.filter((product) => {
      if (applied.rayons.length && !applied.rayons.includes(product.details.rayon || "")) return false;
      if (product.price < applied.min || product.price > applied.max) return false;
      if (applied.variant && !product.variants.some((v) => v.options.includes(applied.variant))) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.details.rayon || "").toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (sort === "prix-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "nom") sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return sorted;
  }, [category, applied, query, sort]);

  const apply = () => {
    setApplied(draft);
    setSheetOpen(false);
  };

  const reset = () => {
    setDraft(initial);
    setApplied(initial);
  };

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs
        items={[
          { label: t.nav.home, href: href("/") },
          { label: t.nav.menus, href: href("/menus") },
          { label: category.name },
        ]}
      />

      <section className="relative mt-4 overflow-hidden rounded-[16px] lg:mt-5">
        <Visual
          src={category.image}
          name={category.name}
          rounded="rounded-[16px]"
          className="absolute inset-0 h-full w-full"
          initialClassName="text-[80px]"
        />
        <div className="relative p-3 sm:p-4">
          <div className="frosted w-full max-w-[440px] rounded-[12px] p-5 sm:p-6">
            <h1 className="text-[34px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[44px] lg:text-[52px]">
              {category.name}
            </h1>
            <p className="mt-3 text-[13.5px] leading-snug text-ink">
              {t.common.articles(category.count)} · {SITE.location}
            </p>
            <p className="text-[13.5px] leading-snug text-ink">{t.common.orderRule}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold">
              <span className="flex items-center gap-1.5 text-ink-soft">
                <ClockIcon className="h-[15px] w-[15px]" />
                {t.menus.fixedTime}
              </span>
              <span className="flex items-center gap-1.5 text-ink-soft">
                <ScooterIcon className="h-[16px] w-[16px]" />
                {t.common.freeDelivery}
              </span>
            </div>

            <a
              href={SITE.socials.whatsapp.href}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-white text-[13.5px] font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.10)] transition hover:bg-white/90 lg:hidden"
            >
              <FriendsIcon className="h-[18px] w-[18px]" />
              {t.menus.groupOrder}
            </a>
          </div>

          <a
            href={SITE.socials.whatsapp.href}
            className="absolute bottom-6 right-6 hidden h-11 items-center gap-2 rounded-[10px] bg-white px-5 text-[13.5px] font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.10)] transition hover:bg-white/90 lg:flex"
          >
            <FriendsIcon className="h-[18px] w-[18px]" />
            {t.menus.groupOrder}
          </a>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[232px_1fr] lg:gap-8">
        <aside className="hidden self-start rounded-[16px] border border-line p-5 lg:block">
          <FiltersPanel
            rayons={rayons}
            variants={variants}
            bounds={bounds}
            draft={draft}
            setDraft={setDraft}
            onApply={apply}
            onReset={reset}
          />
        </aside>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-[46px] flex-1 items-center gap-3 rounded-[12px] border border-line bg-white px-4 focus-within:border-ink/30 lg:h-[48px]">
              <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.menus.searchIn(category.name)}
                aria-label={t.menus.searchIn(category.name)}
                className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={t.menus.openFilters}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-line transition hover:bg-tile lg:hidden"
            >
              <SlidersIcon className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted">{t.common.dishes(products.length)}</p>
            <label className="relative flex items-center gap-1.5 text-[13px] text-ink-soft">
              <span className="hidden sm:inline">{t.menus.sortBy}</span>
              <span className="font-semibold text-ink">{t.menus.sorts[sort]}</span>
              <ChevronDown className="h-4 w-4" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label={t.menus.sortBy}
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {SORT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.menus.sorts[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {products.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-x-5 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={setActive} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[16px] border border-dashed border-line p-10 text-center">
              <p className="text-[15px] font-semibold">{t.menus.noMatch}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 text-[13px] font-medium text-ink-soft underline underline-offset-4"
              >
                {t.menus.resetFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label={t.menus.closeFilters}
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 animate-fade bg-ink/40"
          />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[22px] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[18px] font-bold">{t.menus.filters}</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label={t.menus.closeFilters}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel
              rayons={rayons}
              variants={variants}
              bounds={bounds}
              draft={draft}
              setDraft={setDraft}
              onApply={apply}
              onReset={reset}
              showHeader={false}
            />
          </div>
        </div>
      )}

      <ProductModal product={active} onClose={() => setActive(null)} />
    </div>
  );
}
