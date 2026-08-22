import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";
import { ClockIcon, PinIcon, ScooterIcon, UserIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Espace client de démonstration.",
};

const ORDERS = [
  { id: "BLJ-1042", date: "Lundi 18 août", items: "Poulet DG, Jus de gingembre", total: "6 500 F", status: "Livrée" },
  { id: "BLJ-1039", date: "Vendredi 15 août", items: "Formule Break Solo × 4", total: "12 000 F", status: "Livrée" },
  { id: "BLJ-1031", date: "Mercredi 13 août", items: "Pack Équipe 10 personnes", total: "45 000 F", status: "Livrée" },
];

export default function ComptePage() {
  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Mon compte" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Mon compte</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
        <aside className="rounded-[14px] border border-line p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tile">
              <UserIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[15px] font-bold">Kate Biya</p>
              <p className="text-[12.5px] text-muted">kate.biya@entreprise.cm</p>
            </div>
          </div>

          <ul className="mt-5 space-y-3 border-t border-line pt-4 text-[13.5px] text-ink-soft">
            <li className="flex items-start gap-2">
              <PinIcon className="mt-[2px] h-4 w-4 shrink-0" />
              {SITE.defaultAddress}
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0" />
              Livraison habituelle : 12h20
            </li>
            <li className="flex items-center gap-2">
              <ScooterIcon className="h-4 w-4 shrink-0" />
              {SITE.delivery.feeLabel}
            </li>
          </ul>

          <Link
            href="/menus"
            className="mt-5 flex h-11 items-center justify-center rounded-[10px] bg-ink text-[13.5px] font-semibold text-white transition hover:bg-ink/85"
          >
            Commander à nouveau
          </Link>
        </aside>

        <section>
          <h2 className="text-[18px] font-bold">Mes commandes</h2>
          <div className="mt-4 overflow-x-auto rounded-[14px] border border-line">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead className="bg-tile text-[12px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Référence</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Articles</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order) => (
                  <tr key={order.id} className="border-t border-line">
                    <td className="px-5 py-4 font-semibold">{order.id}</td>
                    <td className="px-5 py-4 text-ink-soft">{order.date}</td>
                    <td className="px-5 py-4 text-ink-soft">{order.items}</td>
                    <td className="px-5 py-4 font-semibold">{order.total}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand px-2.5 py-1 text-[11.5px] font-semibold">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12.5px] text-muted">
            Données de démonstration — aucun backend n’est connecté.
          </p>
        </section>
      </div>
    </div>
  );
}
