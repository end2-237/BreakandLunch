"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Le menu du jour — uniquement ce que Break & Lunch a coché dans Camille.
//
// Rien n'est deviné ici : pas de plat annoncé sans fiche, pas de prix « à
// confirmer ». Ce qui sort de la cuisine aujourd'hui est ce que la cuisine a
// désigné, avec sa photo et son prix, commandable comme le reste de la carte.
//
// Au-delà de deux plats, la grille devient un défilé : sur un téléphone, six
// cartes empilées repoussent le reste de la page hors de vue.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from "react";
import type { CamilleProduct } from "@/lib/camille";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { ArrowLeft, ArrowRight } from "./icons";
import { useI18n } from "./I18nProvider";

export default function DailyMenu({ products }: { products: CamilleProduct[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState<CamilleProduct | null>(null);
  const defileur = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const defile = products.length > 2;
  const glisser = (sens: 1 | -1) => {
    const pas = defileur.current?.firstElementChild?.clientWidth ?? 260;
    defileur.current?.scrollBy({ left: sens * (pas + 16), behavior: "smooth" });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] lg:text-[26px]">{t.daily.onMenu}</h2>
        {defile && (
          <div className="hidden items-center gap-4 sm:flex">
            <button
              type="button"
              onClick={() => glisser(-1)}
              aria-label={t.daily.prev}
              className="text-ink transition hover:opacity-60"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => glisser(1)}
              aria-label={t.daily.next}
              className="text-ink transition hover:opacity-60"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {defile ? (
        <div
          ref={defileur}
          className="no-scrollbar -mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[62vw] shrink-0 snap-start sm:w-[260px] lg:w-[280px]">
              <ProductCard product={product} onOpen={setActive} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:max-w-[560px] lg:gap-x-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={setActive} />
          ))}
        </div>
      )}

      <ProductModal product={active} onClose={() => setActive(null)} />
    </>
  );
}
