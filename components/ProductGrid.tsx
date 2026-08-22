"use client";

import { useState } from "react";
import type { CamilleProduct } from "@/lib/camille";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

/** Une grille d'articles réels, avec la fiche plat au clic. */
export default function ProductGrid({ products }: { products: CamilleProduct[] }) {
  const [active, setActive] = useState<CamilleProduct | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setActive} />
        ))}
      </div>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </>
  );
}
