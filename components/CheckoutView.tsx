"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, SITE } from "@/lib/site";
import type { CompanyAccount } from "@/lib/camille";
import dynamic from "next/dynamic";
import { useCart } from "./CartProvider";
import { useCartDetails, useCatalog } from "./CatalogProvider";
import { useDeliveryLocation } from "./DeliveryLocation";
import { useI18n } from "./I18nProvider";
import { track } from "@/lib/track";
import { apresLaLimite, prochainJourLivrable } from "@/lib/hours";
import LocationSheet from "./LocationSheet";
import Breadcrumbs from "./Breadcrumbs";
import Collapsible from "./Collapsible";
import CutoffNotice, { useCutoff } from "./CutoffNotice";
import Visual from "./Visual";
import Stepper from "./Stepper";
import {
  AlertIcon,
  CalendarIcon,
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

// Un moyen de paiement qui ne mène à rien ne sert à personne : le mobile money
// affiche le numéro où transférer, la carte dit franchement qu'elle n'est pas
// encore branchée plutôt que de faire semblant.
const PAYMENTS = [
  { id: "Orange Money", number: SITE.momo.orange as string | null, icon: PhoneIcon },
  { id: "MTN Mobile Money", number: SITE.momo.mtn as string | null, icon: PhoneIcon },
  { id: "Carte bancaire / Card", number: null, icon: CardIcon },
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
  const { items, subtotal, discount, total, count, aConfirmer } = useCartDetails();
  const { merchant } = useCatalog();
  const { t, href } = useI18n();
  // L'adresse saisie à l'accueil sert ici : personne ne la redonne deux fois.
  const { spot, isSet, save, fullAddress, details } = useDeliveryLocation();

  // Passé 9h, la cuisine ne prend plus rien pour le jour même : le formulaire
  // ne doit pas laisser choisir un créneau que personne ne servira.
  const cutoff = useCutoff();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<"livraison" | "retrait">("livraison");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyFree, setCompanyFree] = useState("");
  const [timing, setTiming] = useState<"planifiee" | "asap">("planifiee");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState("12:20");
  const [payment, setPayment] = useState(PAYMENTS[0].id);
  const [copied, setCopied] = useState(false);

  // Le compte entreprise. Le code identifie la société de l'employé : on le
  // reconnaît en direct, avant de commander, et on montre la fiche.
  const [companyCode, setCompanyCode] = useState("");
  const [company, setCompany] = useState<CompanyAccount | null>(null);
  const [companyState, setCompanyState] = useState<"idle" | "checking" | "found" | "unknown" | "error">("idle");
  // Trois façons de régler : à la livraison, d'avance, ou — pour une
  // entreprise — sur relevé à la fin du mois.
  const [payMode, setPayMode] = useState<"livraison" | "enligne" | "entreprise">("livraison");
  const [promo, setPromo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Arriver ici avec un panier, c'est vouloir payer : l'écart entre ce
  // compteur et les commandes réelles est exactement ce qui se perd en route.
  // On attend que le panier soit relu du navigateur, sinon on compterait
  // toujours zéro article.
  const counted = useRef(false);
  useEffect(() => {
    if (counted.current || !items.length) return;
    counted.current = true;
    track("checkout_start", { items: items.length, value: total });
  }, [items.length, total]);

  // Le dernier code utilisé revient tout seul : un employé ne le ressaisit pas
  // à chaque commande.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("blj-entreprise");
      if (saved) setCompanyCode(saved);
    } catch {
      /* navigateur sans stockage : on repart d'un champ vide */
    }
  }, []);

  useEffect(() => {
    const code = companyCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length < 4) {
      setCompany(null);
      setCompanyState("idle");
      return;
    }
    setCompanyState("checking");
    // On laisse le doigt finir de taper avant d'interroger.
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/entreprise/${encodeURIComponent(code)}`);
        if (res.status === 404) {
          setCompany(null);
          setCompanyState("unknown");
          return;
        }
        if (!res.ok) throw new Error();
        const body = await res.json();
        setCompany(body.company);
        setCompanyState("found");
        try {
          localStorage.setItem("blj-entreprise", body.company.code);
        } catch {
          /* sans stockage, le code se retape : ce n'est pas bloquant */
        }
      } catch {
        setCompany(null);
        setCompanyState("error");
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [companyCode]);

  // Le jour proposé suit la limite : aujourd'hui avant 9h, demain après. Si le
  // client laisse la page ouverte et que 9h passe, le champ se recale seul.
  useEffect(() => {
    if (!cutoff) return;
    setDate((jour) => (jour < cutoff.jourMin ? cutoff.jourMin : jour));
    if (cutoff.tropTard) setTiming((mode) => (mode === "asap" ? "planifiee" : mode));
  }, [cutoff]);

  const scheduledAt = useMemo(() => {
    if (timing === "asap") return null;
    const iso = new Date(`${date}T${slot}:00`);
    return Number.isNaN(iso.getTime()) ? null : iso.toISOString();
  }, [timing, date, slot]);

  async function submit() {
    setError(null);

    if (!items.length) return setError(t.checkout.errors.empty);
    if (phone.replace(/\D/g, "").length < 9) return setError(t.checkout.errors.phone);
    if (!name.trim()) return setError(t.checkout.errors.name);
    if (payMode === "entreprise" && (!company || companyState !== "found")) {
      return setError(t.checkout.errors.company);
    }
    if (payMode === "entreprise" && company?.status === "suspended") {
      return setError(t.checkout.companySuspended);
    }
    // On relit l'horloge ici plutôt que l'état : une page ouverte depuis une
    // heure a pu franchir la limite entre-temps.
    const jourMin = prochainJourLivrable();
    if (timing === "asap" ? apresLaLimite() : date < jourMin) {
      setDate((jour) => (jour < jourMin ? jourMin : jour));
      if (timing === "asap") setTiming("planifiee");
      return setError(t.cutoff.error);
    }
    if (mode === "livraison" && !isSet) {
      setSheetOpen(true);
      return setError(t.checkout.errors.address);
    }

    setSending(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Un plat du menu du jour n'a pas de fiche : il part avec son nom, et
          // Camille en fait une ligne libre que le commerçant chiffre.
          items: items.map(({ line, product }) =>
            product
              ? { id: product.id, qty: line.qty, variant: line.size }
              : { name: line.label, qty: line.qty },
          ),
          // L'entreprise reconnue prime sur le champ libre : c'est elle qui
        // figurera sur la fiche client.
        customer: { name, phone, email, company: payMode === "entreprise" && company ? company.name : companyFree },
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
          payment:
            payMode === "livraison"
              ? "À la livraison (espèces)"
              : payMode === "entreprise"
              ? `Compte entreprise — ${company?.name ?? ""} (${company?.code ?? ""})`.trim()
              : payment,
          companyCode: payMode === "entreprise" ? company?.code : undefined,
          promo,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || t.checkout.errors.failed);

      clear();
      router.push(href(`/commande/${body.ref}?tel=${encodeURIComponent(phone.replace(/\D/g, ""))}`));
    } catch (e) {
      setError((e as Error).message);
      setSending(false);
    }
  }

  return (
    <div className="shell pb-8 pt-4 lg:pt-6">
      <Breadcrumbs
        items={[
          { label: t.nav.home, href: href("/") },
          { label: t.nav.cart, href: href("/panier") },
          { label: t.checkout.breadcrumb },
        ]}
      />

      <h1 className="mt-4 text-[26px] font-bold tracking-[-0.03em] lg:text-[34px]">
        {t.checkout.title}
      </h1>

      <div className="mt-5 flex border-b border-line">
        {(
          [
            { id: "livraison", label: t.checkout.delivery, icon: ScooterIcon },
            { id: "retrait", label: t.checkout.pickup, icon: PinIcon },
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
            <Collapsible title={t.checkout.where}>
              {isSet ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex items-start gap-2 text-[14px] leading-snug">
                      <PinIcon className="mt-[2px] h-4 w-4 shrink-0 text-brand-deep" />
                      <span>
                        <span className="block font-semibold">{spot.label || t.location.saved}</span>
                        {spot.context && <span className="block text-[13px] text-muted">{spot.context}</span>}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSheetOpen(true)}
                      className="shrink-0 text-[13px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
                    >
                      {t.common.modify}
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
                    height={220}
                    className="mt-4"
                  />

                  {/* Le complément d'adresse reste modifiable ici : c'est au
                      moment de commander qu'on se souvient de l'étage. */}
                  <div className="mt-5 grid grid-cols-3 gap-4">
                    {(
                      [
                        [t.location.block, "block"],
                        [t.location.floor, "floor"],
                        [t.location.office_field, "office"],
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
                    <span className="text-[12px] text-muted">{t.location.landmark}</span>
                    <input
                      value={spot.landmark}
                      onChange={(event) => save({ ...spot, landmark: event.target.value })}
                      placeholder={t.location.landmarkPlaceholder}
                      className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                    />
                  </label>

                  <p className="mt-4 text-[12.5px] text-muted">
                    {merchant.delivery.zones.length > 0
                      ? t.checkout.zones(merchant.delivery.zones.map((z) => z.name).join(", "))
                      : t.checkout.everywhere(SITE.city)}{" "}
                    {SITE.delivery.fee > 0 ? formatPrice(SITE.delivery.fee) : t.common.freeDelivery}.
                  </p>
                </>
              ) : (
                <div className="rounded-[12px] border border-dashed border-line p-6 text-center">
                  <p className="text-[14px] font-semibold">{t.checkout.noAddress}</p>
                  <p className="mt-1.5 text-[13px] text-ink-soft">
                    {t.checkout.noAddressText}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-ink/85"
                  >
                    <PinIcon className="h-[18px] w-[18px]" />
                    {t.checkout.setAddress}
                  </button>
                </div>
              )}
            </Collapsible>
          ) : (
            <Collapsible title={t.checkout.pickup}>
              <p className="text-[14px] leading-relaxed text-ink-soft">
                {t.checkout.pickupText(merchant.location ?? SITE.defaultAddress)}
              </p>
              <DeliveryMap
                point={null}
                merchant={
                  merchant.lat != null && merchant.lng != null
                    ? { lat: merchant.lat, lng: merchant.lng }
                    : null
                }
                interactive={false}
                height={220}
                className="mt-4"
              />
            </Collapsible>
          )}

          <Collapsible title={t.checkout.contact}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] text-muted">{t.checkout.fullName}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.checkout.yourName}
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">{t.checkout.phone}</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  placeholder="6XX XX XX XX"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">{t.checkout.email}</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@entreprise.cm"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-muted">{t.checkout.company}</span>
                <input
                  value={payMode === "entreprise" && company ? company.name : companyFree}
                  onChange={(event) => setCompanyFree(event.target.value)}
                  readOnly={payMode === "entreprise" && !!company}
                  placeholder={t.checkout.companyName}
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-snug text-muted">
              <PhoneIcon className="mt-[2px] h-4 w-4 shrink-0" />
              {t.checkout.contactHint}
            </p>
          </Collapsible>

          <Collapsible title={t.checkout.time}>
            <CutoffNotice className="mb-4" />
            <button
              type="button"
              onClick={() => setTiming("planifiee")}
              className="flex w-full items-start gap-3 text-left"
            >
              <Radio checked={timing === "planifiee"} />
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{t.checkout.planned}</span>
                <span className="mt-1 block text-[13px] text-ink-soft">{t.common.orderRule}</span>
              </span>
            </button>

            {timing === "planifiee" && (
              <div className="mt-4 grid grid-cols-2 gap-4 pl-[30px]">
                <label className="block">
                  <span className="text-[12px] text-muted">{t.checkout.day}</span>
                  <input
                    type="date"
                    value={date}
                    min={cutoff?.jourMin ?? todayISO()}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-muted">{t.checkout.hour}</span>
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
              disabled={cutoff?.tropTard}
              className="mt-4 flex w-full items-start gap-3 border-t border-line pt-4 text-left disabled:cursor-not-allowed"
            >
              <Radio checked={timing === "asap"} />
              <span>
                <span className={`block text-[14px] font-semibold ${cutoff?.tropTard ? "text-muted" : ""}`}>
                  {t.checkout.asap}
                </span>
                <span className="mt-1 block text-[13px] text-ink-soft">
                  {cutoff?.tropTard ? t.cutoff.asapClosed : t.checkout.asapText}
                </span>
              </span>
            </button>
          </Collapsible>

          <Collapsible title={t.checkout.payment}>
            <button
              type="button"
              onClick={() => setPayMode("livraison")}
              className="flex w-full items-center gap-3 text-left"
            >
              <Radio checked={payMode === "livraison"} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <CashIcon className="h-[18px] w-[18px]" />
                {t.checkout.payOnDelivery}
              </span>
            </button>

            {/* Le compte entreprise : les commandes du mois sur un relevé
                unique, réglé à la fin du mois. */}
            <button
              type="button"
              onClick={() => setPayMode("entreprise")}
              className="mt-4 flex w-full items-center gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={payMode === "entreprise"} />
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <CalendarIcon className="h-[18px] w-[18px]" />
                {t.checkout.payMonthly}
              </span>
            </button>

            {payMode === "entreprise" && (
              <div className="ml-[30px] mt-3 rounded-[10px] border border-line bg-tile/50 px-4 py-3">
                <p className="text-[12.5px] leading-snug text-ink-soft">{t.checkout.payMonthlyText}</p>

                <label className="mt-3 block">
                  <span className="text-[12px] text-muted">{t.checkout.companyCode}</span>
                  <input
                    value={companyCode}
                    onChange={(event) => setCompanyCode(event.target.value.toUpperCase())}
                    placeholder={t.checkout.companyCodePlaceholder}
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby="etat-entreprise"
                    className="mt-1 h-10 w-full border-b border-line bg-transparent font-mono text-[16px] font-bold tracking-[0.08em] outline-none transition focus:border-ink"
                  />
                </label>

                {/* La fiche de l'entreprise, dès que le code est reconnu :
                    l'employé voit à quel compte sa commande est rattachée
                    avant de valider, pas après. */}
                <div id="etat-entreprise" aria-live="polite" className="mt-3">
                  {companyState === "checking" && (
                    <p className="text-[12.5px] text-muted">{t.checkout.companyChecking}</p>
                  )}
                  {companyState === "unknown" && (
                    <p className="flex items-start gap-2 text-[12.5px] text-[#a11a1a]">
                      <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
                      {t.checkout.companyUnknown}
                    </p>
                  )}
                  {companyState === "error" && (
                    <p className="text-[12.5px] text-muted">{t.checkout.companyError}</p>
                  )}
                  {companyState === "found" && company && (
                    <div className="rounded-[10px] border border-line bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-[15px] font-bold">
                            <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                            <span className="truncate">{company.name}</span>
                          </p>
                          <p className="mt-1 text-[12px] text-muted">
                            {company.code} ·{" "}
                            {company.billingMode === "prepaid"
                              ? t.checkout.companyPrepaid
                              : t.checkout.companyMonthlyMode}
                          </p>
                        </div>
                        {company.status === "suspended" && (
                          <span className="shrink-0 rounded-full bg-[#fdecec] px-2.5 py-1 text-[11px] font-bold text-[#a11a1a]">
                            {t.checkout.companySuspended}
                          </span>
                        )}
                      </div>

                      <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12.5px]">
                        {company.billingMode === "prepaid" && company.balance != null && (
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted">{t.checkout.companyBalance}</dt>
                            <dd className={`font-bold ${company.balance < total ? "text-[#a11a1a]" : ""}`}>
                              {formatPrice(company.balance)}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted">{t.checkout.companySpent}</dt>
                          <dd className="font-medium">{formatPrice(company.monthToDate)}</dd>
                        </div>
                        {company.monthlyCap != null && (
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted">{t.checkout.companyCap}</dt>
                            <dd className="font-medium">{formatPrice(company.monthlyCap)}</dd>
                          </div>
                        )}
                        {company.address && (
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted">{t.checkout.delivery}</dt>
                            <dd className="max-w-[60%] text-right font-medium">{company.address}</dd>
                          </div>
                        )}
                      </dl>

                      {company.billingMode === "prepaid" &&
                        company.balance != null &&
                        company.balance < total && (
                          <p className="mt-3 flex items-start gap-2 rounded-[8px] bg-[#fdecec] px-3 py-2 text-[12.5px] leading-snug text-[#a11a1a]">
                            <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
                            {t.checkout.companyInsufficient}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setPayMode("enligne")}
              className="mt-4 flex w-full items-center gap-3 border-t border-line pt-4 text-left"
            >
              <Radio checked={payMode === "enligne"} />
              <span className="text-[14px] font-semibold">{t.checkout.payOnline}</span>
            </button>

            {payMode === "enligne" && (
              <>
                <div className="mt-4 space-y-2 pl-[30px]">
                  {PAYMENTS.map((option) => {
                    const Icon = option.icon;
                    const active = payment === option.id;
                    const ready = Boolean(option.number);
                    return (
                      <div key={option.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setPayment(option.id);
                            setCopied(false);
                          }}
                          aria-pressed={active}
                          className={`flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left text-[13.5px] transition ${
                            active ? "border-ink bg-tile/60" : "border-line hover:border-ink/25"
                          } ${ready ? "" : "text-muted"}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                          <span className="font-medium">{option.id}</span>
                          {!ready && (
                            <span className="ml-auto rounded-full bg-tile px-2 py-0.5 text-[11px] font-semibold text-muted">
                              {t.checkout.unavailable}
                            </span>
                          )}
                          {ready && active && <CheckIcon className="ml-auto h-4 w-4" />}
                        </button>

                        {/* Le numéro où transférer, sous le moyen choisi : c'est
                            la seule chose que le client attend de cet écran. */}
                        {active && ready && (
                          <div className="mt-2 rounded-[10px] border border-line bg-tile/50 px-4 py-3">
                            <p className="text-[12px] text-muted">{t.checkout.momoTitle}</p>
                            <div className="mt-1 flex items-center justify-between gap-3">
                              <a
                                href={`tel:+237${option.number!.replace(/\s/g, "")}`}
                                className="text-[16px] font-bold tracking-[0.01em]"
                              >
                                {option.number}
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(option.number!.replace(/\s/g, ""));
                                  setCopied(true);
                                  window.setTimeout(() => setCopied(false), 2000);
                                }}
                                className="shrink-0 rounded-[8px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold transition hover:border-ink/30"
                              >
                                {copied ? t.checkout.copied : t.checkout.copyNumber}
                              </button>
                            </div>
                            <p className="mt-2 text-[12px] leading-snug text-muted">
                              {t.checkout.momoHint(SITE.shortName)}
                            </p>
                          </div>
                        )}

                        {active && !ready && (
                          <p className="mt-2 flex items-start gap-2 rounded-[10px] bg-tile/60 px-4 py-3 text-[12.5px] leading-snug text-ink-soft">
                            <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
                            {t.checkout.cardUnavailable}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Collapsible>
        </div>

        <aside className="rounded-[14px] border border-line p-5 lg:sticky lg:top-[100px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold">{t.checkout.yourOrder}</h2>
            <Link
              href={href("/menus")}
              className="text-[13px] font-medium text-ink-soft underline underline-offset-4 transition hover:text-ink"
            >
              {t.common.modify}
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="mt-4 rounded-[12px] border border-dashed border-line p-6 text-center">
              <p className="text-[13.5px] text-ink-soft">{t.checkout.emptyCart}</p>
              <Link
                href={href("/menus")}
                className="mt-3 inline-flex h-10 items-center rounded-[9px] bg-ink px-5 text-[13px] font-semibold text-white"
              >
                {t.common.browseMenu}
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {items.map(({ line, product }) => {
                  const nom = product?.name ?? line.label ?? "";
                  return (
                    <li key={line.id} className="flex items-start gap-3">
                      <Visual
                        src={product?.image ?? null}
                        name={nom}
                        rounded="rounded-[9px]"
                        className="h-11 w-11 shrink-0"
                        initialClassName="text-[14px]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold">{nom}</p>
                          <button
                            type="button"
                            onClick={() => remove(line.id)}
                            aria-label={t.checkout.remove(nom)}
                            className="shrink-0 text-muted transition hover:text-ink"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {product ? (
                              <>
                                <span className="text-[12.5px] font-bold">{formatPrice(product.price)}</span>
                                {product.oldPrice && (
                                  <span className="text-[11px] text-muted line-through">
                                    {formatPrice(product.oldPrice)}
                                  </span>
                                )}
                              </>
                            ) : (
                              // Un plat du planning sans fiche : le prix est
                              // confirmé par Break & Lunch, on ne l'invente pas.
                              <span className="text-[11.5px] font-semibold text-brand-deep">
                                {t.checkout.toConfirm}
                              </span>
                            )}
                          </div>
                          <Stepper value={line.qty} onChange={(next) => setQty(line.id, next)} size="sm" />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-5 space-y-2 text-[13.5px]">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">{t.checkout.subtotal}</dt>
                  <dd className="font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">{t.checkout.discount}</dt>
                  <dd className="font-medium text-success">- {formatPrice(discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">{t.checkout.deliveryFee}</dt>
                  <dd className="font-medium">{t.common.freeDelivery}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-[15px]">
                  <dt className="font-bold">{t.checkout.total}</dt>
                  <dd className="font-bold">{formatPrice(total)}</dd>
                </div>
                {aConfirmer > 0 && (
                  <p className="pt-1 text-[12px] leading-snug text-muted">
                    {t.checkout.toConfirmNote(aConfirmer)}
                  </p>
                )}
              </dl>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-10 flex-1 items-center gap-2 rounded-[9px] bg-tile px-3">
                  <TicketIcon className="h-4 w-4 shrink-0 text-muted" />
                  <input
                    value={promo}
                    onChange={(event) => setPromo(event.target.value)}
                    placeholder={t.checkout.promo}
                    aria-label={t.checkout.promo}
                    className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-muted"
                  />
                </div>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                {t.checkout.promoHint(SITE.shortName)}
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
                {sending ? t.checkout.sending : t.checkout.order(count)}
              </button>
            </>
          )}
        </aside>
      </div>

      {sheetOpen && <LocationSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}
