import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MenuCard from "@/components/MenuCard";
import CategoryRow from "@/components/CategoryRow";
import { MENUS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos menus",
  description:
    "Petits-déjeuners, déjeuners, jus naturels, formules entreprise et service traiteur livrés à Douala.",
};

export default function MenusPage() {
  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Menus" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Nos menus</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        Cinq univers, une seule cuisine : tout est préparé le jour même et livré gratuitement
        dans vos bureaux à Douala.
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {MENUS.map((menu) => (
          <MenuCard key={menu.slug} menu={menu} />
        ))}
      </div>

      <CategoryRow />
    </div>
  );
}
