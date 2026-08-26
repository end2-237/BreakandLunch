"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/track";

export type CartLine = {
  id: string;
  size: string;
  qty: number;
  /**
   * Le nom porté par la ligne quand elle ne pointe aucune fiche du catalogue.
   * Plus rien n'en crée — le menu du jour ne montre que des fiches Camille —,
   * mais un panier enregistré avant ce changement doit encore pouvoir être
   * validé, alors la ligne reste lisible.
   */
  label?: string;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  qtyOf: (id: string) => number;
  add: (id: string, size?: string) => void;
  /** Ajoute un plat du menu du jour, que le catalogue ne connaît pas encore. */
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "blj-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* placeholder : aucun backend */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* placeholder : aucun backend */
    }
  }, [lines]);

  const add = useCallback((id: string, size = "") => {
    // Un ajout au panier dit ce qui plaît, même quand la commande ne suit pas.
    track("add_to_cart", { product_id: id, ...(size ? { variant: size } : {}) });
    setLines((prev) => {
      const found = prev.find((line) => line.id === id);
      if (found) {
        return prev.map((line) =>
          line.id === id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { id, size, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.id !== id)
        : prev.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  // Les montants ne sont pas calculés ici : ils dépendent du catalogue Camille,
  // qui est la seule source des prix. Voir useCartDetails().
  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      qtyOf: (id: string) => lines.find((line) => line.id === id)?.qty ?? 0,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}
