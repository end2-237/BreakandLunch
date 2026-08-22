import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Placeholder from "@/components/Placeholder";
import PriceTag from "@/components/PriceTag";
import { allProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Les derniers plats et jus ajoutés à la carte Break & Lunch by Jojoo.",
};

export default function NouveautesPage() {
  const items = allProducts().slice(0, 12);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Nouveautés" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Nouveautés</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        Les dernières recettes arrivées en cuisine, à découvrir dès votre prochaine commande.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {items.map(({ product, menu }) => (
          <Link key={product.id} href={`/menus/${menu.slug}?plat=${product.id}`} className="group block">
            <Placeholder
              tone={product.tone}
              rounded="rounded-[14px]"
              className="aspect-square w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(0,0,0,0.09)]"
              iconClassName="h-7 w-7"
            />
            <h2 className="mt-3 text-[14px] font-bold leading-snug lg:text-[15px]">{product.name}</h2>
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">{product.description}</p>
            <div className="mt-2">
              <PriceTag price={product.price} oldPrice={product.oldPrice} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
