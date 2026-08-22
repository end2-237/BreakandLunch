"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";
import Stepper from "./Stepper";
import { PlusIcon } from "./icons";

/** Le seul morceau interactif de la page d'un plat : le reste est du texte, donc indexable. */
export default function ProductActions({ id, soldOut, name }: { id: string; soldOut: boolean; name?: string }) {
  const { qtyOf, add, setQty } = useCart();
  const { t } = useI18n();
  const qty = qtyOf(id);

  // Une visite sur la page d'un plat vaut une consultation : c'est souvent
  // par là qu'on arrive depuis Google.
  useEffect(() => {
    track("product_view", { product_id: id, ...(name ? { name } : {}) });
  }, [id, name]);

  if (soldOut) {
    return (
      <span className="flex h-12 w-full items-center justify-center rounded-[10px] bg-tile text-[14px] font-semibold text-muted sm:w-auto sm:px-8">
        {t.common.unavailableToday}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {qty > 0 && <Stepper value={qty} onChange={(next) => setQty(id, next)} />}
      <button
        type="button"
        onClick={() => add(id)}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink px-8 text-[14px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.99] sm:flex-none"
      >
        <PlusIcon className="h-4 w-4" />
        {t.common.addToCart}
      </button>
    </div>
  );
}
