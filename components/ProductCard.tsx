"use client";

import Link from "next/link";
import { slugify, type CamilleProduct } from "@/lib/camille";
import { regime } from "@/lib/dispo";
import { nommerJours } from "@/lib/jours";
import { useCart } from "./CartProvider";
import { useAuMenuDuJour } from "./CatalogProvider";
import PriceTag from "./PriceTag";
import Stepper from "./Stepper";
import Visual from "./Visual";
import { PlusIcon } from "./icons";
import { useI18n } from "./I18nProvider";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: CamilleProduct;
  onOpen: (product: CamilleProduct) => void;
}) {
  const { qtyOf, add, setQty } = useCart();
  const { t, href } = useI18n();
  // Un seul appel au contexte : le second, derrière un « && », n'aurait pas
  // toujours été exécuté — et un hook conditionnel casse le rendu.
  const menuDuJour = useAuMenuDuJour();
  const dispo = regime(product, menuDuJour);
  const auMenu = menuDuJour.has(product.id) && menuDuJour.size > 0;
  const qty = qtyOf(product.id);
  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <article className="group flex flex-col">
      {/* Vrai lien vers la fiche du plat : Google l'indexe, le clic ouvre la
          modale comme avant (⌘/ctrl-clic ouvre la page dans un onglet). */}
      <Link
        href={href(`/menus/${slugify(product.category)}/${product.id}`)}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          event.preventDefault();
          onOpen(product);
        }}
        aria-label={t.product.see(product.name)}
        className="text-left"
      >
        <div className="relative">
          <Visual
            src={product.image}
            name={product.name}
            className="aspect-square w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(0,0,0,0.09)]"
          />
          {soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
              {t.common.soldOut}
            </span>
          )}
          {/* Ce plat est au planning d'aujourd'hui : c'est ce qui sort de la
              cuisine, et ça se voit avant le prix. */}
          {!soldOut && auMenu && (
            <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-ink">
              {t.daily.badge}
            </span>
          )}
          {/* Pas au menu du jour : ni caché, ni annoncé comme prêt. */}
          {!soldOut && dispo.sorte !== "aujourdhui" && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink-soft shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
              {dispo.sorte === "jours" ? t.request.servedOn(nommerJours(dispo.jours, t)) : t.request.badge}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-[14px] font-bold leading-snug tracking-[-0.01em] lg:text-[15px]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted lg:text-[12.5px]">
            {product.description}
          </p>
        )}
      </Link>

      <div className="mt-2">
        <PriceTag price={product.price} oldPrice={product.oldPrice} />
      </div>

      <div className="mt-3 flex-1" />

      {soldOut ? (
        <span className="flex h-10 w-full items-center justify-center rounded-[10px] bg-tile text-[13px] font-semibold text-muted lg:h-11">
          {t.common.unavailableToday}
        </span>
      ) : qty > 0 ? (
        <Stepper value={qty} onChange={(next) => setQty(product.id, next)} />
      ) : (
        <button
          type="button"
          onClick={() => add(product.id)}
          className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-semibold transition active:scale-[0.98] lg:h-11 lg:text-[14px] ${
            dispo.sorte === "aujourdhui"
              ? "bg-ink text-white hover:bg-ink/85"
              : "border border-ink/25 bg-white text-ink hover:border-ink/50"
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          {dispo.sorte === "aujourdhui" ? t.common.add : t.request.cta}
        </button>
      )}
    </article>
  );
}
