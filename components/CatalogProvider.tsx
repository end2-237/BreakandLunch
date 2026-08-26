"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CamilleCategory, CamilleProduct, Merchant } from "@/lib/camille";
import { useCart } from "./CartProvider";

type CatalogValue = {
  products: CamilleProduct[];
  categories: CamilleCategory[];
  byId: Map<string, CamilleProduct>;
  /** Le marchand tel que Camille le décrit : adresse, position, livraison. */
  merchant: Merchant;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({
  products,
  categories,
  merchant,
  children,
}: {
  products: CamilleProduct[];
  categories: CamilleCategory[];
  merchant: Merchant;
  children: ReactNode;
}) {
  const value = useMemo<CatalogValue>(
    () => ({
      products,
      categories,
      byId: new Map(products.map((p) => [p.id, p])),
      merchant,
    }),
    [products, categories, merchant],
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
/**
 * Les articles que Break & Lunch a cochés « au menu du jour » dans Camille.
 *
 * Une seule source : la cuisine. On a essayé de deviner en rapprochant les noms
 * du planning et ceux du catalogue — un plat sur huit se retrouvait, et un
 * rapprochement trop généreux affichait le mauvais prix. La coche arrive avec
 * le catalogue, donc le badge est juste dès le rendu serveur.
 */
export function useAuMenuDuJour(): Set<string> {
  const { products } = useCatalog();
  return useMemo(
    () => new Set(products.filter((p) => p.dailyMenu).map((p) => p.id)),
    [products],
  );
}

export function useCartDetails() {
  const { lines, count } = useCart();
  const { byId } = useCatalog();

  return useMemo(() => {
    // Deux sortes de lignes : celles qui pointent une fiche du catalogue, et
    // les plats du menu du jour qui n'en ont pas encore. Les secondes n'ont
    // pas de prix — Break & Lunch le confirme —, elles ne pèsent donc pas sur
    // le sous-total, mais elles comptent bien dans la commande.
    const items = lines
      .map((line) => {
        const product = byId.get(line.id);
        if (product) return { line, product };
        return line.label ? { line, product: null } : null;
      })
      .filter((x): x is { line: (typeof lines)[number]; product: CamilleProduct | null } => x !== null);

    let subtotal = 0;
    let discount = 0;
    let aConfirmer = 0;
    for (const { line, product } of items) {
      if (!product) { aConfirmer += line.qty; continue; }
      const unit = product.oldPrice ?? product.price;
      subtotal += unit * line.qty;
      discount += (unit - product.price) * line.qty;
    }

    return { items, subtotal, discount, total: subtotal - discount, count, aConfirmer };
  }, [lines, byId, count]);
}
