"use client";

import { useEffect, useMemo, useState } from "react";
import { MENUS, type Product } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { useCart } from "./CartProvider";
import Placeholder from "./Placeholder";
import PriceTag from "./PriceTag";
import Stepper from "./Stepper";
import {
  AlertIcon,
  BoltIcon,
  ChevronUp,
  CloseIcon,
  PlusIcon,
  WeightIcon,
} from "./icons";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add, qtyOf, setQty } = useCart();
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

  const suggestions = useMemo(() => {
    if (!product) return [];
    const drinks = MENUS.find((menu) => menu.slug === "jus-naturels")?.products ?? [];
    return drinks.filter((item) => item.id !== product.id).slice(0, 4);
  }, [product]);

  if (!product) return null;

  const qty = qtyOf(product.id);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 animate-fade bg-ink/45"
      />

      <div className="animate-fade-up relative flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[22px] bg-white sm:rounded-[22px]">
        <div className="sticky top-0 z-10 flex justify-end bg-white px-4 pt-4 sm:px-6 sm:pt-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-tile"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="rounded-[18px] border border-line p-4 sm:p-5">
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:gap-6">
              <Placeholder
                tone={product.tone}
                rounded="rounded-[14px]"
                className="aspect-square w-full"
                iconClassName="h-9 w-9"
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

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <WeightIcon className="h-4 w-4 text-ink-soft" />
                    {product.grams} g
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BoltIcon className="h-4 w-4 text-brand-deep" />
                    {product.kcal} kcal
                  </span>
                </div>

                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
                  {product.ingredients}
                </p>

                <div className="mt-4">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                    <AlertIcon className="h-4 w-4" />
                    Allergènes
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                    {product.allergens}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setSuggestionsOpen((prev) => !prev)}
              className="flex w-full items-center gap-2 text-[15px] font-bold"
            >
              Ça peut vous plaire aussi
              <ChevronUp
                className={`h-4 w-4 transition-transform ${suggestionsOpen ? "" : "rotate-180"}`}
              />
            </button>

            {suggestionsOpen && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {suggestions.map((item) => (
                  <div key={item.id} className="flex h-full flex-col">
                    <Placeholder
                      tone={item.tone}
                      rounded="rounded-[12px]"
                      className="aspect-square w-full"
                      iconClassName="h-6 w-6"
                    />
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
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-4 sm:justify-end sm:px-6">
          {qty > 0 && <Stepper value={qty} onChange={(next) => setQty(product.id, next)} size="sm" />}
          <button
            type="button"
            onClick={() => add(product.id)}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.99] sm:flex-none"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
