"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CamilleCategory, CamilleProduct } from "@/lib/camille";
import { useCart } from "./CartProvider";

type CatalogValue = {
  products: CamilleProduct[];
  categories: CamilleCategory[];
  byId: Map<string, CamilleProduct>;
  merchantWhatsapp: string | null;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({
  products,
  categories,
  merchantWhatsapp,
  children,
}: {
  products: CamilleProduct[];
  categories: CamilleCategory[];
  merchantWhatsapp: string | null;
  children: ReactNode;
}) {
  const value = useMemo<CatalogValue>(
    () => ({
      products,
      categories,
      byId: new Map(products.map((p) => [p.id, p])),
      merchantWhatsapp,
    }),
    [products, categories, merchantWhatsapp],
  );
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog doit être utilisé dans CatalogProvider");
  return ctx;
}

/**
 * Le panier ne retient que des identifiants et des quantités. Les prix et les
 * noms viennent du catalogue à chaque rendu : une ligne dont l'article a
 * disparu de Camille disparaît d'elle-même, elle n'est jamais commandée.
 */
export function useCartDetails() {
  const { lines, count } = useCart();
  const { byId } = useCatalog();

  return useMemo(() => {
    const items = lines
      .map((line) => {
        const product = byId.get(line.id);
        return product ? { line, product } : null;
      })
      .filter((x): x is { line: (typeof lines)[number]; product: CamilleProduct } => x !== null);

    let subtotal = 0;
    let discount = 0;
    for (const { line, product } of items) {
      const unit = product.oldPrice ?? product.price;
      subtotal += unit * line.qty;
      discount += (unit - product.price) * line.qty;
    }

    return { items, subtotal, discount, total: subtotal - discount, count };
  }, [lines, byId, count]);
}
