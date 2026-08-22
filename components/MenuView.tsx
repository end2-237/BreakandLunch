"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Menu, Product } from "@/lib/data";
import Breadcrumbs from "./Breadcrumbs";
import FiltersPanel, { type FilterDraft } from "./FiltersPanel";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import {
  ChevronDown,
  ClockIcon,
  CloseIcon,
  FriendsIcon,
  ImageIcon,
  ScooterIcon,
  SearchIcon,
  SlidersIcon,
  StarIcon,
} from "./icons";

type SortKey = "popularite" | "prix-asc" | "prix-desc" | "nom";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "popularite", label: "popularité" },
  { value: "prix-asc", label: "prix croissant" },
  { value: "prix-desc", label: "prix décroissant" },
  { value: "nom", label: "nom (A-Z)" },
];

export default function MenuView({ menu }: { menu: Menu }) {
  const params = useSearchParams();
  const bounds = useMemo(() => {
    const prices = menu.products.map((product) => product.price);
    const min = Math.floor(Math.min(...prices) / 100) * 100;
    const max = Math.ceil(Math.max(...prices) / 100) * 100;
    return { min, max };
  }, [menu]);

  const initial = useMemo<FilterDraft>(
    () => ({ categories: [], min: bounds.min, max: bounds.max, size: "" }),
    [bounds],
  );

  const [draft, setDraft] = useState<FilterDraft>(initial);
  const [applied, setApplied] = useState<FilterDraft>(initial);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popularite");
  const [active, setActive] = useState<Product | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setDraft(initial);
    setApplied(initial);
  }, [initial]);

  useEffect(() => {
    const id = params.get("plat");
    if (!id) return;
    const found = menu.products.find((product) => product.id === id);
    if (found) setActive(found);
  }, [params, menu]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = menu.products.filter((product) => {
      if (applied.categories.length && !applied.categories.includes(product.category)) return false;
      if (product.price < applied.min || product.price > applied.max) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (sort === "prix-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "nom") sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return sorted;
  }, [menu, applied, query, sort]);

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
          { label: "Accueil", href: "/" },
          { label: "Menus", href: "/menus" },
          { label: menu.name },
        ]}
      />

      {/* bannière */}
      <section
        className={`relative mt-4 overflow-hidden rounded-[16px] bg-gradient-to-br ${menu.tone} p-3 sm:p-4 lg:mt-5`}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.6),transparent_58%)]" />
        <span className="absolute right-[16%] top-1/2 hidden -translate-y-1/2 lg:block">
          <ImageIcon className="h-10 w-10 text-ink/20" />
        </span>

        <div className="frosted relative w-full max-w-[440px] rounded-[12px] p-5 sm:p-6">
          <h1 className="text-[34px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[44px] lg:text-[52px]">
            {menu.name}
          </h1>
          <p className="mt-3 text-[13.5px] leading-snug text-ink">{menu.address}</p>
          <p className="text-[13.5px] leading-snug text-ink">{menu.availability}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold">
            <span className="flex items-center gap-1.5">
              <StarIcon className="h-[15px] w-[15px] text-brand-deep" />
              {menu.rating} %
              <span className="rounded-[6px] bg-brand px-1.5 py-[2px] text-[11.5px]">
                {menu.ratingLabel}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              <ClockIcon className="h-[15px] w-[15px]" />
              {menu.time}
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              <ScooterIcon className="h-[16px] w-[16px]" />
              {menu.fee}
            </span>
          </div>

          <button
            type="button"
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-white text-[13.5px] font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.10)] transition hover:bg-white/90 lg:hidden"
          >
            <FriendsIcon className="h-[18px] w-[18px]" />
            Commander à plusieurs
          </button>
        </div>

        <button
          type="button"
          className="absolute bottom-6 right-6 hidden h-11 items-center gap-2 rounded-[10px] bg-white px-5 text-[13.5px] font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.10)] transition hover:bg-white/90 lg:flex"
        >
          <FriendsIcon className="h-[18px] w-[18px]" />
          Commander à plusieurs
        </button>
      </section>

      <p className="mt-4 max-w-[620px] text-[14px] leading-relaxed text-ink-soft">{menu.intro}</p>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[232px_1fr] lg:gap-8">
        {/* filtres desktop */}
        <aside className="hidden self-start rounded-[16px] border border-line p-5 lg:block">
          <FiltersPanel
            categories={menu.categories}
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
                placeholder={`Rechercher dans ${menu.name}`}
                aria-label={`Rechercher dans ${menu.name}`}
                className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label="Ouvrir les filtres"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-line transition hover:bg-tile lg:hidden"
            >
              <SlidersIcon className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted">
              {products.length} plat{products.length > 1 ? "s" : ""}
            </p>
            <label className="relative flex items-center gap-1.5 text-[13px] text-ink-soft">
              <span className="hidden sm:inline">Trier par :</span>
              <span className="font-semibold text-ink">
                {SORTS.find((item) => item.value === sort)?.label}
              </span>
              <ChevronDown className="h-4 w-4" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Trier les plats"
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {SORTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
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
              <p className="text-[15px] font-semibold">Aucun plat ne correspond à ces filtres</p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 text-[13px] font-medium text-ink-soft underline underline-offset-4"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* filtres mobile */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 animate-fade bg-ink/40"
          />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[22px] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[18px] font-bold">Filtres</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Fermer les filtres"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel
              categories={menu.categories}
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
