"use client";

import Link from "next/link";
import { useState } from "react";
import { findProduct } from "@/lib/data";
import { formatPrice, SITE } from "@/lib/site";
import Breadcrumbs from "./Breadcrumbs";
import Collapsible from "./Collapsible";
import MapPlaceholder from "./MapPlaceholder";
import OrderSummary from "./OrderSummary";
import Placeholder from "./Placeholder";
import Stepper from "./Stepper";
import { useCart } from "./CartProvider";
import {
  CardIcon,
  CashIcon,
  CheckIcon,
  CloseIcon,
  PhoneIcon,
  PinIcon,
  ScooterIcon,
  TrashIcon,
} from "./icons";

const GUESTS = [
  {
    name: "Alex",
    phone: "+237 690 61 17 73",
    email: "alex.mbappe@entreprise.cm",
    lines: [
      { id: "dj-1", size: "Individuel", qty: 1 },
      { id: "js-2", size: "50 cl", qty: 2 },
    ],
  },
  {
    name: "Paule",
    phone: "+237 671 16 48 75",
    email: "paule.ngo@entreprise.cm",
    lines: [{ id: "dj-7", size: "Individuel", qty: 1 }],
  },
];

const PAYMENTS = [
  { id: "om", label: "Orange Money", icon: PhoneIcon },
  { id: "momo", label: "MTN Mobile Money", icon: PhoneIcon },
  { id: "card", label: "Carte bancaire", icon: CardIcon },
];

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition ${
        checked ? "border-ink" : "border-line-strong"
      }`}
    >
      {checked && <span className="h-[9px] w-[9px] rounded-full bg-ink" />}
    </span>
  );
}

function GuestBlock({ guest }: { guest: (typeof GUESTS)[number] }) {
  const entries = guest.lines
    .map((line) => ({ line, entry: findProduct(line.id) }))
    .filter((item) => item.entry);

  const subtotal = entries.reduce(
    (sum, { line, entry }) => sum + (entry!.product.oldPrice ?? entry!.product.price) * line.qty,
    0,
  );
  const discount = entries.reduce(
    (sum, { line, entry }) =>
      sum +
      ((entry!.product.oldPrice ?? entry!.product.price) - entry!.product.price) * line.qty,
    0,
  );

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold">{guest.name}</h3>
        <span className="text-[12px] text-muted">{guest.phone}</span>
      </div>

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
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[12.5px] font-bold">{formatPrice(entry!.product.price)}</span>
                {entry!.product.oldPrice && (
                  <span className="text-[11px] text-muted line-through">
                    {formatPrice(entry!.product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[12.5px] font-semibold text-ink-soft">× {line.qty}</span>
          </li>
        ))}
      </ul>

      <OrderSummary
        subtotal={subtotal}
        discount={discount}
        total={subtotal - discount}
        cta="Envoyer le lien de paiement"
      />
    </div>
  );
}

export default function CheckoutView() {
  const { lines, subtotal, discount, total, setQty, remove, count } = useCart();
  const [mode, setMode] = useState<"livraison" | "retrait">("livraison");
  const [address, setAddress] = useState<string>(SITE.defaultAddress);
  const [addressDraft, setAddressDraft] = useState<string>(SITE.defaultAddress);
  const [confirmed, setConfirmed] = useState(true);
  const [timing, setTiming] = useState<"planifiee" | "asap">("planifiee");
  const [payment, setPayment] = useState("om");
  const [payLater, setPayLater] = useState(false);

  const entries = lines
    .map((line) => ({ line, entry: findProduct(line.id) }))
    .filter((item) => item.entry);

  return (
    <div className="shell pb-8 pt-4 lg:pt-6">
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Panier", href: "/panier" },
          { label: "Informations de commande" },
        ]}
      />

      <h1 className="mt-4 text-[26px] font-bold tracking-[-0.03em] lg:text-[34px]">
        Informations de commande
      </h1>

      <div className="mt-5 flex border-b border-line">
        {(
          [
            { id: "livraison", label: "Livraison", icon: ScooterIcon },
            { id: "retrait", label: "Retrait sur place", icon: PinIcon },
          ] as const
        ).map((tab) => {
          const active = mode === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 pb-3 text-[14px] transition sm:flex-none sm:px-16 ${
                active
                  ? "border-b-2 border-ink font-semibold text-ink"
                  : "border-b-2 border-transparent text-muted hover:text-ink"
              }`}
            >
              <Icon className="h-[17px] w-[17px]" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_368px] lg:items-start lg:gap-8">
        {/* colonne gauche */}
        <div className="space-y-4">
          {mode === "livraison" ? (
            <Collapsible title="Où livrer ?">
              <div className="relative">
                <MapPlaceholder className="h-[240px] w-full sm:h-[280px]" />

                <div className="mt-3 rounded-[12px] border border-line bg-white p-4 sm:absolute sm:right-4 sm:top-4 sm:mt-0 sm:w-[248px] sm:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                  <p className="text-[13px] font-semibold">Saisir l’adresse de livraison</p>
                  <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-tile px-3 py-2">
                    <input
                      value={addressDraft}
                      onChange={(event) => {
                        setAddressDraft(event.target.value);
                        setConfirmed(false);
                      }}
                      aria-label="Adresse de livraison"
                      className="h-6 w-full bg-transparent text-[12.5px] font-medium outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAddressDraft("");
                        setConfirmed(false);
                      }}
                      aria-label="Effacer l’adresse"
                      className="text-muted transition hover:text-ink"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-soft transition hover:text-ink"
                  >
                    <PinIcon className="h-4 w-4" />
                    Repérer sur la carte
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddress(addressDraft || SITE.defaultAddress);
                      setConfirmed(true);
                    }}
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[9px] bg-ink text-[13px] font-semibold text-white transition hover:bg-ink/85"
                  >
                    {confirmed && <CheckIcon className="h-4 w-4" />}
                    Confirmer
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                {["Bloc", "Étage", "Bureau"].map((label) => (
                  <label key={label} className="block">
                    <span className="text-[12px] text-muted">{label}</span>
                    <input
                      className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                      placeholder="—"
                    />
                  </label>
                ))}
              </div>

              {confirmed && (
                <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-soft">
                  <PinIcon className="h-4 w-4 shrink-0" />
                  {address}
                </p>
              )}
            </Collapsible>
          ) : (
            <Collapsible title="Retrait sur place">
              <p className="text-[14px] leading-relaxed text-ink-soft">
                Retrait à notre cuisine de {SITE.defaultAddress}. Nous vous appelons
                dès que votre commande est prête.
              </p>
              <MapPlaceholder className="mt-4 h-[220px] w-full" />
            </Collapsible>
          )}

          <Collapsible
            title="Vos coordonnées"
            action={
              <button type="button" className="text-[13px] font-medium text-ink-soft underline underline-offset-4">
                Modifier
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-muted">Nom complet</span>
                <input
                  defaultValue="Kate Biya"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">Téléphone</span>
                <input
                  defaultValue="+237 671 16 48 75"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[12px] text-muted">E-mail</span>
                <input
                  defaultValue="kate.biya@entreprise.cm"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
            </div>
          </Collapsible>

          <Collapsible title="Heure de livraison">
            <button
              type="button"
              onClick={() => setTiming("planifiee")}
              className="flex w-full items-start gap-3 text-left"
            >
              <Radio checked={timing === "planifiee"} />
              <span>
                <span className="block text-[14px] font-semibold">Heure planifiée</span>
                <span className="mt-1 block text-[13px] text-ink-soft">
                  Lundi 7 septembre, 12h20
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTiming("asap")}
              className="mt-4 flex w-full items-start gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={timing === "asap"} />
              <span>
                <span className="block text-[14px] font-semibold">Dès que possible</span>
                <span className="mt-1 block text-[13px] text-ink-soft">
                  {SITE.delivery.orderRule}
                </span>
              </span>
            </button>
          </Collapsible>

          <Collapsible title="Paiement">
            <button
              type="button"
              onClick={() => setPayLater(false)}
              className="flex w-full items-center gap-3 text-left"
            >
              <Radio checked={!payLater} />
              <span className="text-[14px] font-semibold">Payer maintenant</span>
            </button>

            {!payLater && (
              <div className="mt-4 space-y-2 pl-[30px]">
                {PAYMENTS.map((option) => {
                  const Icon = option.icon;
                  const active = payment === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPayment(option.id)}
                      className={`flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left text-[13.5px] transition ${
                        active ? "border-ink bg-tile/60" : "border-line hover:border-ink/25"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      <span className="font-medium">{option.label}</span>
                      {active && <CheckIcon className="ml-auto h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setPayLater(true)}
              className="mt-4 flex w-full items-center gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={payLater} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <CashIcon className="h-[18px] w-[18px]" />
                Payer à la livraison (espèces)
              </span>
            </button>
          </Collapsible>
        </div>

        {/* colonne droite */}
        <aside className="rounded-[14px] border border-line p-5 lg:sticky lg:top-[88px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold">Votre commande groupée</h2>
            <Link
              href="/menus"
              className="text-[13px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
            >
              Modifier
            </Link>
          </div>

          <h3 className="mt-4 text-[15px] font-bold">Vous</h3>

          {entries.length === 0 ? (
            <div className="mt-3 rounded-[12px] border border-dashed border-line p-6 text-center">
              <p className="text-[13.5px] text-ink-soft">Votre panier est vide.</p>
              <Link
                href="/menus"
                className="mt-3 inline-flex h-10 items-center rounded-[9px] bg-ink px-5 text-[13px] font-semibold text-white"
              >
                Parcourir les menus
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-3 space-y-3">
                {entries.map(({ line, entry }) => (
                  <li key={line.id} className="flex items-start gap-3">
                    <Placeholder
                      tone={entry!.product.tone}
                      rounded="rounded-[9px]"
                      className="h-11 w-11 shrink-0"
                      iconClassName="h-4 w-4"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold">{entry!.product.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          aria-label={`Retirer ${entry!.product.name}`}
                          className="shrink-0 text-muted transition hover:text-ink"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11.5px] text-muted">Portion : {line.size}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-bold">
                            {formatPrice(entry!.product.price)}
                          </span>
                          {entry!.product.oldPrice && (
                            <span className="text-[11px] text-muted line-through">
                              {formatPrice(entry!.product.oldPrice)}
                            </span>
                          )}
                        </div>
                        <Stepper
                          value={line.qty}
                          onChange={(next) => setQty(line.id, next)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <OrderSummary
                subtotal={subtotal}
                discount={discount}
                total={total}
                cta={`Commander (${count})`}
                ctaHref="/commande"
              />
            </>
          )}

          {GUESTS.map((guest) => (
            <GuestBlock key={guest.name} guest={guest} />
          ))}
        </aside>
      </div>
    </div>
  );
}
