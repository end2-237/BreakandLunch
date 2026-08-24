"use client";

import { useEffect, useMemo, useState } from "react";
import { slugify, type CamilleProduct } from "@/lib/camille";
import { formatPrice } from "@/lib/site";
import { useCart } from "./CartProvider";
import { useCatalog } from "./CatalogProvider";
import PriceTag from "./PriceTag";
import Stepper from "./Stepper";
import Visual from "./Visual";
import Portal from "./Portal";
import {
  AlertIcon,
  BoltIcon,
  ChevronUp,
  CloseIcon,
  PlusIcon,
  WeightIcon,
} from "./icons";
import { useI18n } from "./I18nProvider";
import { track } from "@/lib/track";

/** Les détails posés à l'import du catalogue (tags « clé:valeur »). */
function detail(product: CamilleProduct, ...keys: string[]) {
  for (const k of keys) {
    const v = product.details[k];
    if (v) return v;
  }
  return "";
}

export default function ProductModal({
  product,
  onClose,
}: {
  product: CamilleProduct | null;
  onClose: () => void;
}) {
  const { add, qtyOf, setQty } = useCart();
  const { products } = useCatalog();
  const { t, href } = useI18n();
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  // Le plat consulté : c'est ce qui dit au commerçant ce qui attire, même
  // quand la commande ne suit pas.
  useEffect(() => {
    if (!product) return;
    track("product_view", { product_id: product.id, name: product.name, category: product.category });
  }, [product]);

  // « Ça peut vous plaire aussi » : d'abord les boissons, sinon le même rayon.
  // Ce sont de vrais articles du catalogue, jamais une sélection inventée.
  const suggestions = useMemo(() => {
    if (!product) return [];
    const drinks = products.filter(
      (p) => p.id !== product.id && /jus|boisson|drink/i.test(p.category),
    );
    const pool = drinks.length
      ? drinks
      : products.filter((p) => p.id !== product.id && p.category === product.category);
    return pool.slice(0, 4);
  }, [product, products]);

  if (!product) return null;

  const qty = qtyOf(product.id);
  const grams = detail(product, "poids", "grammes");
  const kcal = detail(product, "kcal", "calories");
  const ingredients = detail(product, "ingrédients", "ingredients");
  const allergens = detail(product, "allergènes", "allergenes");
  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <Portal>
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t.common.close}
        onClick={onClose}
        className="absolute inset-0 animate-fade bg-ink/45"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="feuille animate-fade-up relative flex w-full max-w-[720px] flex-col overflow-hidden rounded-t-[22px] bg-white sm:rounded-[22px]"
      >
        <div className="sticky top-0 z-10 flex justify-end bg-white px-4 pt-4 sm:px-6 sm:pt-5">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-tile"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="rounded-[18px] border border-line p-4 sm:p-5">
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:gap-6">
              <Visual
                src={product.image}
                name={product.name}
                className="aspect-square w-full"
                initialClassName="text-[44px]"
              />
              <div>
                <h2 className="text-[26px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[34px]">
                  {product.name}
                </h2>
                <p className="mt-3 text-[20px] font-bold sm:text-[22px]">
                  {formatPrice(product.price)}
                </p>
                {product.oldPrice && (
                  <p className="mt-1 text-[13px] text-muted line-through">
                    {formatPrice(product.oldPrice)}
                  </p>
                )}

                {(grams || kcal) && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold">
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
                  <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
                    {product.description}
                  </p>
                )}

                {ingredients && (
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{ingredients}</p>
                )}

                <a
                  href={href(`/menus/${slugify(product.category)}/${product.id}`)}
                  className="mt-4 inline-flex text-[12.5px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
                >
                  {t.product.ownPage}
                </a>

                {allergens && (
                  <div className="mt-4">
                    <p className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                      <AlertIcon className="h-4 w-4" />
                      {t.product.allergens}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{allergens}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setSuggestionsOpen((prev) => !prev)}
                className="flex w-full items-center gap-2 text-[15px] font-bold"
              >
                {t.product.mayLike}
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${suggestionsOpen ? "" : "rotate-180"}`}
                />
              </button>

              {suggestionsOpen && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {suggestions.map((item) => (
                    <div key={item.id} className="flex h-full flex-col">
                      <Visual src={item.image} name={item.name} rounded="rounded-[12px]" className="aspect-square w-full" />
                      <p className="mt-2 line-clamp-2 min-h-[32px] text-center text-[12.5px] font-medium leading-tight">
                        {item.name}
                      </p>
                      <div className="mt-1.5 flex justify-center">
                        <PriceTag price={item.price} oldPrice={item.oldPrice} size="sm" />
                      </div>
                      <button
                        type="button"
                        onClick={() => add(item.id)}
                        className="mt-2 flex h-9 shrink-0 items-center justify-center rounded-[9px] bg-ink text-[12px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.98]"
                      >
                        {t.common.add}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-4 sm:justify-end sm:px-6">
          {qty > 0 && <Stepper value={qty} onChange={(next) => setQty(product.id, next)} size="sm" />}
          {soldOut ? (
            <span className="flex h-11 flex-1 items-center justify-center rounded-[10px] bg-tile text-[14px] font-semibold text-muted sm:flex-none sm:px-6">
              {t.common.unavailableToday}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => add(product.id)}
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.99] sm:flex-none"
            >
              <PlusIcon className="h-4 w-4" />
              {t.common.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
