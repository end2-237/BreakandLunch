import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Placeholder from "@/components/Placeholder";
import PriceTag from "@/components/PriceTag";
import { allProducts } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offres",
  description: "Toutes les promotions en cours sur les menus Break & Lunch by Jojoo.",
};

export default function OffresPage() {
  const deals = allProducts().filter(({ product }) => product.oldPrice);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Offres" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Offres du moment</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        {deals.length} plats à prix réduit, livrés gratuitement à {SITE.city}.
        {" "}{SITE.delivery.orderRule}.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
        {deals.map(({ product, menu }) => (
          <Link key={product.id} href={`/menus/${menu.slug}?plat=${product.id}`} className="group block">
            <div className="relative">
              <Placeholder
                tone={product.tone}
                rounded="rounded-[14px]"
                className="aspect-square w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(0,0,0,0.09)]"
                iconClassName="h-7 w-7"
              />
              <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
                -{Math.round((1 - product.price / product.oldPrice!) * 100)} %
              </span>
            </div>
            <h2 className="mt-3 text-[14px] font-bold leading-snug lg:text-[15px]">{product.name}</h2>
            <p className="mt-0.5 text-[12px] text-muted">{menu.name}</p>
            <div className="mt-2">
              <PriceTag price={product.price} oldPrice={product.oldPrice} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
