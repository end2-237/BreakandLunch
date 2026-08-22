"use client";

import type { Product } from "@/lib/data";
import { useCart } from "./CartProvider";
import Placeholder from "./Placeholder";
import PriceTag from "./PriceTag";
import Stepper from "./Stepper";
import { PlusIcon } from "./icons";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(product.id);

  return (
    <article className="group flex flex-col">
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`Voir ${product.name}`}
        className="text-left"
      >
        <Placeholder
          tone={product.tone}
          rounded="rounded-[14px]"
          className="aspect-square w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(0,0,0,0.09)]"
          iconClassName="h-7 w-7"
        />
        <h3 className="mt-3 text-[14px] font-bold leading-snug tracking-[-0.01em] lg:text-[15px]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted lg:text-[12.5px]">
          {product.description}
        </p>
      </button>

      <div className="mt-2">
        <PriceTag price={product.price} oldPrice={product.oldPrice} />
      </div>

      <div className="mt-3 flex-1" />

      {qty > 0 ? (
        <Stepper value={qty} onChange={(next) => setQty(product.id, next)} />
      ) : (
        <button
          type="button"
          onClick={() => add(product.id)}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] bg-ink text-[13px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.98] lg:h-11 lg:text-[14px]"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter
        </button>
      )}
    </article>
  );
}
