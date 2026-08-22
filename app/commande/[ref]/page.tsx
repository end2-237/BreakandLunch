import type { Metadata } from "next";
import Link from "next/link";
import { getOrder, CamilleError } from "@/lib/camille";
import { formatPrice, SITE } from "@/lib/site";
import AutoRefresh from "@/components/AutoRefresh";
import OrderPhonePrompt from "@/components/OrderPhonePrompt";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { AlertIcon, ChatIcon, ClockIcon, PinIcon, UserIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez la préparation et la livraison de votre commande.",
};

const dateLong = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

export default async function SuiviPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ tel?: string }>;
}) {
  const { ref } = await params;
  const { tel } = await searchParams;
  const reference = ref.toUpperCase();
  const phone = (tel ?? "").replace(/\D/g, "");

  if (phone.length < 9) return <OrderPhonePrompt reference={reference} />;

  let order;
  try {
    order = await getOrder(reference, phone);
  } catch (e) {
    const message = e instanceof CamilleError ? e.message : undefined;
    return <CatalogUnavailable message={message} />;
  }

  if (!order) {
    return (
      <div className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-[460px] text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tile">
            <AlertIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-[24px] font-bold tracking-[-0.02em]">Commande introuvable</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Aucune commande {reference} ne correspond à ce numéro. Vérifiez la référence, ou
            écrivez-nous sur WhatsApp.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={SITE.socials.whatsapp.href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-ink px-6 text-[14px] font-semibold text-white"
            >
              <ChatIcon className="h-[18px] w-[18px]" />
              Nous écrire
            </a>
            <Link
              href="/menus"
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-line px-6 text-[14px] font-semibold"
            >
              Voir la carte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cancelled = order.step < 0;
  const scheduled = dateLong(order.scheduledAt);

  return (
    <div className="shell pb-10 pt-6 lg:pt-10">
      <AutoRefresh />

      <p className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-deep">
        Commande {order.ref}
      </p>
      <h1 className="mt-3 text-center text-[28px] font-bold tracking-[-0.03em] lg:text-[42px]">
        {cancelled ? "Commande annulée" : "Merci pour votre commande !"}
      </h1>

      {!cancelled && (
        <ol className="no-scrollbar mt-7 flex gap-3 overflow-x-auto lg:mt-9 lg:gap-4">
          {order.steps.map((step, index) => {
            const done = index <= order.step;
            return (
              <li key={step.status} className="min-w-[132px] flex-1 shrink-0">
                <p className={`text-[13px] ${done ? "font-semibold text-ink" : "text-muted"}`}>
                  {step.label}
                </p>
                <span className="mt-2 block h-[3px] w-full rounded-full bg-line">
                  <span
                    className={`block h-full rounded-full bg-ink transition-all ${done ? "w-full" : "w-0"}`}
                  />
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_368px] lg:items-start lg:gap-8">
        <div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-[14px] border border-line px-6 py-6">
              <p className="text-[19px] font-semibold leading-snug tracking-[-0.01em] lg:text-[22px]">
                {order.statusLabel}
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                {cancelled
                  ? "Cette commande a été annulée. Écrivez-nous si c’est une erreur."
                  : `${SITE.name} vous tient au courant sur WhatsApp à chaque étape.`}
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
                {scheduled ? "Livraison prévue" : "Livraison"}
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                {scheduled ?? "Dès que possible — nous confirmons l’heure par WhatsApp."}
              </p>
            </div>

            {order.address && (
              <div>
                <h2 className="flex items-center gap-2 text-[18px] font-bold lg:text-[20px]">
                  <PinIcon className="h-[18px] w-[18px]" />
                  Adresse de livraison
                </h2>
                <p className="mt-1.5 text-[15px] text-ink-soft">{order.address}</p>
                {order.note && <p className="text-[14px] text-muted">{order.note}</p>}
              </div>
            )}

            <div>
              <h2 className="flex items-center gap-2 text-[18px] font-bold lg:text-[20px]">
                <UserIcon className="h-[18px] w-[18px]" />
                Livrer à
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                {order.customerName ?? "—"}
                <br />
                {phone}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:max-w-[320px]">
            {order.documentUrl && (
              <a
                href={order.documentUrl}
                target="_blank"
                rel="noopener"
                className="flex h-12 items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
              >
                Voir le bon de commande
              </a>
            )}
            <Link
              href="/menus"
              className="flex h-12 items-center justify-center rounded-[10px] border border-line text-[14px] font-semibold transition hover:bg-tile"
            >
              Commander autre chose
            </Link>
          </div>

          <p className="mt-6 text-[12.5px] text-muted">
            Pour modifier ou annuler cette commande, écrivez-nous sur WhatsApp au{" "}
            {SITE.phones[0]} — c’est immédiat.
          </p>
        </div>

        <aside className="rounded-[14px] border border-line p-5">
          <h2 className="text-[16px] font-bold">Récapitulatif</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{item.name}</p>
                  {item.variant && <p className="text-[11.5px] text-muted">{item.variant}</p>}
                  <span className="text-[12.5px] font-bold">{formatPrice(Number(item.price) || 0)}</span>
                </div>
                <span className="shrink-0 text-[12.5px] font-semibold text-ink-soft">× {item.qty}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Sous-total</dt>
              <dd className="font-medium">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Frais de livraison</dt>
              <dd className="font-medium">
                {order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : SITE.delivery.feeLabel}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-[15px]">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
