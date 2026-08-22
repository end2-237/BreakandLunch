"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatPrice, SITE } from "@/lib/site";
import dynamic from "next/dynamic";
import { useCart } from "./CartProvider";
import { useCartDetails, useCatalog } from "./CatalogProvider";
import { useDeliveryLocation } from "./DeliveryLocation";
import LocationSheet from "./LocationSheet";
import Breadcrumbs from "./Breadcrumbs";
import Collapsible from "./Collapsible";
import Visual from "./Visual";
import Stepper from "./Stepper";
import {
  AlertIcon,
  CardIcon,
  CashIcon,
  CheckIcon,
  PhoneIcon,
  PinIcon,
  ScooterIcon,
  TicketIcon,
  TrashIcon,
} from "./icons";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse rounded-[12px] bg-tile sm:h-[280px]" />,
});

const PAYMENTS = [
  { id: "Orange Money", icon: PhoneIcon },
  { id: "MTN Mobile Money", icon: PhoneIcon },
  { id: "Carte bancaire", icon: CardIcon },
];

/** Créneaux de livraison : la journée de service de B&L. */
const SLOTS = ["07:00", "07:30", "08:00", "08:30", "09:00", "11:30", "12:00", "12:20", "12:45", "13:15", "14:00"];

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

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CheckoutView() {
  const router = useRouter();
  const { setQty, remove, clear } = useCart();
  const { items, subtotal, discount, total, count } = useCartDetails();
  const { merchant } = useCatalog();
  // L'adresse saisie à l'accueil sert ici : personne ne la redonne deux fois.
  const { spot, isSet, save, fullAddress, details } = useDeliveryLocation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"livraison" | "retrait">("livraison");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [timing, setTiming] = useState<"planifiee" | "asap">("planifiee");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState("12:20");
  const [payment, setPayment] = useState(PAYMENTS[0].id);
  const [payLater, setPayLater] = useState(true);
  const [promo, setPromo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduledAt = useMemo(() => {
    if (timing === "asap") return null;
    const iso = new Date(`${date}T${slot}:00`);
    return Number.isNaN(iso.getTime()) ? null : iso.toISOString();
  }, [timing, date, slot]);

  async function submit() {
    setError(null);

    if (!items.length) return setError("Votre panier est vide.");
    if (phone.replace(/\D/g, "").length < 9) return setError("Indiquez un numéro de téléphone joignable.");
    if (!name.trim()) return setError("Indiquez le nom de la personne à livrer.");
    if (mode === "livraison" && !isSet) {
      setSheetOpen(true);
      return setError("Indiquez l’adresse de livraison.");
    }

    setSending(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ line, product }) => ({ id: product.id, qty: line.qty, variant: line.size })),
          customer: { name, phone, email, company },
          delivery: {
            address:
              mode === "livraison"
                ? fullAddress || spot.label
                : `Retrait sur place — ${merchant.location ?? SITE.defaultAddress}`,
            details,
            label: mode === "livraison" ? "Livraison" : "Retrait",
            // La position exacte, quand le client l'a partagée : c'est elle qui
            // guide le livreur, l'adresse écrite ne fait que la nommer.
            lat: mode === "livraison" ? spot.lat : null,
            lng: mode === "livraison" ? spot.lng : null,
          },
          scheduledAt,
          mode,
          payment: payLater ? "À la livraison (espèces)" : payment,
          promo,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "La commande n’a pas pu être envoyée.");

      clear();
      router.push(`/commande/${body.ref}?tel=${encodeURIComponent(phone.replace(/\D/g, ""))}`);
    } catch (e) {
      setError((e as Error).message);
      setSending(false);
    }
  }

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
        <div className="space-y-4">
          {mode === "livraison" ? (
            <Collapsible title="Où livrer ?">
              {isSet ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex items-start gap-2 text-[14px] leading-snug">
                      <PinIcon className="mt-[2px] h-4 w-4 shrink-0 text-brand-deep" />
                      <span>
                        <span className="block font-semibold">{spot.label || "Position enregistrée"}</span>
                        {spot.context && <span className="block text-[13px] text-muted">{spot.context}</span>}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSheetOpen(true)}
                      className="shrink-0 text-[13px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
                    >
                      Modifier
                    </button>
                  </div>

                  <DeliveryMap
                    point={spot.lat != null && spot.lng != null ? { lat: spot.lat, lng: spot.lng } : null}
                    merchant={
                      merchant.lat != null && merchant.lng != null
                        ? { lat: merchant.lat, lng: merchant.lng }
                        : null
                    }
                    interactive={false}
                    className="mt-4 h-[220px] w-full"
                  />

                  {/* Le complément d'adresse reste modifiable ici : c'est au
                      moment de commander qu'on se souvient de l'étage. */}
                  <div className="mt-5 grid grid-cols-3 gap-4">
                    {(
                      [
                        ["Bloc", "block"],
                        ["Étage", "floor"],
                        ["Bureau", "office"],
                      ] as const
                    ).map(([label, key]) => (
                      <label key={key} className="block">
                        <span className="text-[12px] text-muted">{label}</span>
                        <input
                          value={spot[key]}
                          onChange={(event) => save({ ...spot, [key]: event.target.value })}
                          placeholder="—"
                          className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                        />
                      </label>
                    ))}
                  </div>

                  <label className="mt-4 block">
                    <span className="text-[12px] text-muted">Repère pour le livreur</span>
                    <input
                      value={spot.landmark}
                      onChange={(event) => save({ ...spot, landmark: event.target.value })}
                      placeholder="En face de la pharmacie, portail bleu…"
                      className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                    />
                  </label>

                  <p className="mt-4 text-[12.5px] text-muted">
                    {merchant.delivery.zones.length > 0
                      ? `Zones desservies : ${merchant.delivery.zones.map((z) => z.name).join(", ")}.`
                      : `Nous livrons partout à ${SITE.city}.`}{" "}
                    {merchant.delivery.fee > 0 ? formatPrice(merchant.delivery.fee) : SITE.delivery.feeLabel}.
                  </p>
                </>
              ) : (
                <div className="rounded-[12px] border border-dashed border-line p-6 text-center">
                  <p className="text-[14px] font-semibold">Aucune adresse enregistrée</p>
                  <p className="mt-1.5 text-[13px] text-ink-soft">
                    Cherchez votre quartier, partagez votre position ou posez le repère sur la carte.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-ink/85"
                  >
                    <PinIcon className="h-[18px] w-[18px]" />
                    Indiquer mon adresse
                  </button>
                </div>
              )}
            </Collapsible>
          ) : (
            <Collapsible title="Retrait sur place">
              <p className="text-[14px] leading-relaxed text-ink-soft">
                Retrait à notre cuisine de {merchant.location ?? SITE.defaultAddress}. Nous vous
                appelons dès que votre commande est prête.
              </p>
              <DeliveryMap
                point={null}
                merchant={
                  merchant.lat != null && merchant.lng != null
                    ? { lat: merchant.lat, lng: merchant.lng }
                    : null
                }
                interactive={false}
                className="mt-4 h-[220px] w-full"
              />
            </Collapsible>
          )}

          <Collapsible title="Vos coordonnées">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-muted">Nom complet *</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Votre nom"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">Téléphone (WhatsApp) *</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  placeholder="6XX XX XX XX"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">E-mail</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@entreprise.cm"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">Entreprise</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Nom de la société"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-snug text-muted">
              <PhoneIcon className="mt-[2px] h-4 w-4 shrink-0" />
              Le suivi de commande et la confirmation arrivent sur ce numéro, par WhatsApp.
            </p>
          </Collapsible>

          <Collapsible title="Heure de livraison">
            <button
              type="button"
              onClick={() => setTiming("planifiee")}
              className="flex w-full items-start gap-3 text-left"
            >
              <Radio checked={timing === "planifiee"} />
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">Heure planifiée</span>
                <span className="mt-1 block text-[13px] text-ink-soft">{SITE.delivery.orderRule}</span>
              </span>
            </button>

            {timing === "planifiee" && (
              <div className="mt-4 grid grid-cols-2 gap-4 pl-[30px]">
                <label className="block">
                  <span className="text-[12px] text-muted">Jour</span>
                  <input
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-muted">Heure</span>
                  <select
                    value={slot}
                    onChange={(event) => setSlot(event.target.value)}
                    className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                  >
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={() => setTiming("asap")}
              className="mt-4 flex w-full items-start gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={timing === "asap"} />
              <span>
                <span className="block text-[14px] font-semibold">Dès que possible</span>
                <span className="mt-1 block text-[13px] text-ink-soft">
                  Nous vous confirmons l’heure par WhatsApp.
                </span>
              </span>
            </button>
          </Collapsible>

          <Collapsible title="Paiement">
            <button
              type="button"
              onClick={() => setPayLater(true)}
              className="flex w-full items-center gap-3 text-left"
            >
              <Radio checked={payLater} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <CashIcon className="h-[18px] w-[18px]" />
                Payer à la livraison (espèces)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPayLater(false)}
              className="mt-4 flex w-full items-center gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={!payLater} />
              <span className="text-[14px] font-semibold">Payer par mobile money ou carte</span>
            </button>

            {!payLater && (
              <>
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
                        <span className="font-medium">{option.id}</span>
                        {active && <CheckIcon className="ml-auto h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 flex items-start gap-2 pl-[30px] text-[12.5px] leading-snug text-muted">
                  <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
                  Le paiement en ligne n’est pas encore branché : votre choix est transmis avec la
                  commande, et {SITE.shortName} vous envoie les instructions sur WhatsApp.
                </p>
              </>
            )}
          </Collapsible>
        </div>

        <aside className="rounded-[14px] border border-line p-5 lg:sticky lg:top-[88px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold">Votre commande</h2>
            <Link
              href="/menus"
              className="text-[13px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
            >
              Modifier
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="mt-4 rounded-[12px] border border-dashed border-line p-6 text-center">
              <p className="text-[13.5px] text-ink-soft">Votre panier est vide.</p>
              <Link
                href="/menus"
                className="mt-3 inline-flex h-10 items-center rounded-[9px] bg-ink px-5 text-[13px] font-semibold text-white"
              >
                Parcourir la carte
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {items.map(({ line, product }) => (
                  <li key={line.id} className="flex items-start gap-3">
                    <Visual
                      src={product.image}
                      name={product.name}
                      rounded="rounded-[9px]"
                      className="h-11 w-11 shrink-0"
                      initialClassName="text-[14px]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold">{product.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          aria-label={`Retirer ${product.name}`}
                          className="shrink-0 text-muted transition hover:text-ink"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-bold">{formatPrice(product.price)}</span>
                          {product.oldPrice && (
                            <span className="text-[11px] text-muted line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                        <Stepper value={line.qty} onChange={(next) => setQty(line.id, next)} size="sm" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2 text-[13.5px]">
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

              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-10 flex-1 items-center gap-2 rounded-[9px] bg-tile px-3">
                  <TicketIcon className="h-4 w-4 shrink-0 text-muted" />
                  <input
                    value={promo}
                    onChange={(event) => setPromo(event.target.value)}
                    placeholder="Code promo"
                    aria-label="Code promo"
                    className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-muted"
                  />
                </div>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                Le code est transmis avec la commande et vérifié par {SITE.shortName}.
              </p>

              {error && (
                <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#fdecec] px-3 py-2.5 text-[13px] text-[#a11a1a]">
                  <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85 disabled:opacity-60"
              >
                {sending ? "Envoi en cours…" : `Commander (${count})`}
              </button>
            </>
          )}
        </aside>
      </div>

      {sheetOpen && <LocationSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}
