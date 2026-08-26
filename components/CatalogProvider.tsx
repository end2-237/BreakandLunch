"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CamilleCategory, CamilleProduct, Merchant } from "@/lib/camille";
import { menuDuJour, rapprocher } from "@/lib/planning";
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
 * Les articles du catalogue qui sont au menu aujourd'hui.
 *
 * Deux sources, dans cet ordre. Break & Lunch coche « au menu du jour » sur la
 * fiche du plat dans Camille : c'est la cuisine qui parle, rien ne vaut mieux,
 * et la marque arrive avec le catalogue — donc dès le rendu serveur.
 *
 * Sans aucune fiche cochée, on retombe sur le planning des quatre semaines, en
 * rapprochant les noms. Ce calcul-là se fait APRÈS le montage : la date du
 * serveur et celle du visiteur peuvent différer, et un badge qui change entre
 * le rendu et l'hydratation ferait crier React.
 */
export function useAuMenuDuJour(): Set<string> {
  const { products } = useCatalog();
  const marques = useMemo(
    () => new Set(products.filter((p) => p.dailyMenu).map((p) => p.id)),
    [products],
  );
  const [ids, setIds] = useState<Set<string>>(marques);

  useEffect(() => {
    if (marques.size) { setIds(marques); return; }
    const jour = menuDuJour();
    if (!jour) { setIds(new Set()); return; }
    const trouves = new Set<string>();
    for (const plat of jour.plats) {
      const article = rapprocher(plat, products);
      if (article) trouves.add(article.id);
    }
    setIds(trouves);
  }, [products, marques]);

  return ids;
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
