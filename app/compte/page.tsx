import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CustomerLookup from "@/components/CustomerLookup";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mes commandes",
  description: "Retrouvez vos commandes et vos informations de livraison.",
};

export default function ComptePage() {
  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Mes commandes" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Mes commandes</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        Pas de mot de passe à retenir : votre numéro WhatsApp suffit. Il donne accès à vos commandes
        chez {SITE.shortName} et à l’adresse que nous avons enregistrée.
      </p>

      <CustomerLookup />
    </div>
  );
}
