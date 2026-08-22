"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/site";
import { AlertIcon, PhoneIcon, PinIcon } from "./icons";

type Order = {
  ref: string;
  status_label: string;
  total: number;
  placed_at: string | null;
};

type Result = {
  customer: { name: string | null; company: string | null; addresses: { label?: string; address: string }[]; orders_count: number } | null;
  orders: Order[];
};

export default function CustomerLookup() {
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9) return setError("Entrez un numéro complet.");

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/client?tel=${encodeURIComponent(clean)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Recherche impossible.");
      setData(body);
    } catch (e) {
      setError((e as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 max-w-[720px]">
      <form onSubmit={lookup} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-[10px] border border-line px-4 focus-within:border-ink/30">
          <PhoneIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            placeholder="6XX XX XX XX"
            aria-label="Votre numéro WhatsApp"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85 disabled:opacity-60"
        >
          {loading ? "Recherche…" : "Retrouver mes commandes"}
        </button>
      </form>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#fdecec] px-3 py-2.5 text-[13px] text-[#a11a1a]">
          <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {data && (
        <div className="mt-8">
          {data.customer ? (
            <div className="rounded-[14px] border border-line p-5">
              <p className="text-[15px] font-bold">{data.customer.name ?? "Client"}</p>
              {data.customer.company && (
                <p className="text-[13px] text-muted">{data.customer.company}</p>
              )}
              <p className="mt-2 text-[13px] text-ink-soft">
                {data.customer.orders_count} commande{data.customer.orders_count > 1 ? "s" : ""} chez nous
              </p>
              {data.customer.addresses.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-line pt-3 text-[13.5px] text-ink-soft">
                  {data.customer.addresses.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <PinIcon className="mt-[2px] h-4 w-4 shrink-0" />
                      {a.label ? `${a.label} — ` : ""}
                      {a.address}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-[14px] text-ink-soft">
              Aucun compte à ce numéro pour l’instant. Il se crée à votre première commande.
            </p>
          )}

          {data.orders.length > 0 && (
            <div className="mt-6 overflow-x-auto rounded-[14px] border border-line">
              <table className="w-full min-w-[520px] text-left text-[13.5px]">
                <thead className="bg-tile text-[12px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Référence</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Statut</th>
                    <th className="px-5 py-3 font-semibold">Suivi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => (
                    <tr key={order.ref} className="border-t border-line">
                      <td className="px-5 py-4 font-semibold">{order.ref}</td>
                      <td className="px-5 py-4 text-ink-soft">
                        {order.placed_at
                          ? new Date(order.placed_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-brand px-2.5 py-1 text-[11.5px] font-semibold">
                          {order.status_label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/commande/${order.ref}?tel=${phone.replace(/\D/g, "")}`}
                          className="text-[13px] font-medium underline underline-offset-4"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
