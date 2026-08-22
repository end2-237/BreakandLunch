"use client";

import Link from "next/link";
import { findProduct, ORDER_STEPS } from "@/lib/data";
import { formatPrice, SITE } from "@/lib/site";
import Placeholder from "./Placeholder";
import { useCart } from "./CartProvider";
import { ChatIcon, ClockIcon, PinIcon, UserIcon } from "./icons";

export default function OrderStatusView() {
  const { lines, subtotal, discount, total } = useCart();
  const entries = lines
    .map((line) => ({ line, entry: findProduct(line.id) }))
    .filter((item) => item.entry);

  return (
    <div className="shell pb-10 pt-6 lg:pt-10">
      <h1 className="text-center text-[28px] font-bold tracking-[-0.03em] lg:text-[42px]">
        Merci pour votre commande !
      </h1>

      {/* étapes */}
      <ol className="no-scrollbar mt-7 flex gap-3 overflow-x-auto lg:mt-9 lg:gap-4">
        {ORDER_STEPS.map((step, index) => (
          <li key={step} className="min-w-[132px] flex-1 shrink-0">
            <p
              className={`text-[13px] ${
                index === 0 ? "font-semibold text-ink" : "text-muted"
              }`}
            >
              {step}
            </p>
            <span className="mt-2 block h-[3px] w-full rounded-full bg-line">
              <span
                className={`block h-full rounded-full bg-ink transition-all ${
                  index === 0 ? "w-full" : "w-0"
                }`}
              />
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_368px] lg:items-start lg:gap-8">
        <div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-[14px] border border-line px-6 py-6">
              <p className="text-[19px] font-semibold leading-snug tracking-[-0.01em] lg:text-[22px]">
                Nous attendons la confirmation de {SITE.name}
              </p>
            </div>
            <a
              href={SITE.socials.whatsapp.href}
              className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85"
            >
              <ChatIcon className="h-[18px] w-[18px]" />
              Contacter le support
            </a>
          </div>

          <div className="mt-7 space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-[18px] font-bold lg:text-[20px]">
                <ClockIcon className="h-[18px] w-[18px]" />
                Heure de livraison estimée
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">Lundi 7 septembre, 12h20</p>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-[18px] font-bold lg:text-[20px]">
                <PinIcon className="h-[18px] w-[18px]" />
                Adresse de livraison
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                {SITE.defaultAddress}
                <br />
                Bloc B, 3<sup>e</sup> étage, bureau 43
              </p>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-[18px] font-bold lg:text-[20px]">
                <UserIcon className="h-[18px] w-[18px]" />
                Livrer à
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                Kate Biya
                <br />
                +237 {SITE.phones[0]}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:max-w-[320px]">
            <Link
              href="/panier"
              className="flex h-12 items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
            >
              Modifier ma commande
            </Link>
            <Link
              href="/menus"
              className="flex h-12 items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
            >
              Annuler ma commande
            </Link>
          </div>
        </div>

        <aside className="rounded-[14px] border border-line p-5">
          <h2 className="text-[16px] font-bold">Votre commande groupée</h2>
          <h3 className="mt-4 text-[15px] font-bold">Vous</h3>

          {entries.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-ink-soft">
              Aucun article dans le récapitulatif.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {entries.map(({ line, entry }) => (
                <li key={line.id} className="flex items-center gap-3">
                  <Placeholder
                    tone={entry!.product.tone}
                    rounded="rounded-[9px]"
                    className="h-11 w-11 shrink-0"
                    iconClassName="h-4 w-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{entry!.product.name}</p>
                    <p className="text-[11.5px] text-muted">Portion : {line.size}</p>
                    <span className="text-[12.5px] font-bold">
                      {formatPrice(entry!.product.price)}
                    </span>
                  </div>
                  <span className="text-[12.5px] font-semibold text-ink-soft">× {line.qty}</span>
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Sous-total</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Remise</dt>
              <dd className="font-medium text-success">- {formatPrice(discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Frais de livraison</dt>
              <dd className="font-medium">{SITE.delivery.feeLabel}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-[15px]">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
