import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MapPlaceholder from "@/components/MapPlaceholder";
import { SITE } from "@/lib/site";
import {
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Break & Lunch by Jojoo à Douala : téléphone, WhatsApp, e-mail et réseaux sociaux.",
};

export default function ContactPage() {
  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">Contact</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        « {SITE.slogan} » — écrivez-nous pour une commande, une formule entreprise ou un devis
        traiteur.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="space-y-4">
          <div className="rounded-[14px] border border-line p-5">
            <h2 className="text-[16px] font-bold">Coordonnées</h2>
            <ul className="mt-4 space-y-3 text-[14.5px] text-ink-soft">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-[2px] h-[18px] w-[18px] shrink-0" />
                {SITE.location}
              </li>
              {SITE.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition hover:text-ink">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <MailIcon className="h-[18px] w-[18px] shrink-0" />
                <a href={`mailto:${SITE.email}`} className="break-all transition hover:text-ink">
                  {SITE.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={SITE.socials.whatsapp.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink px-5 text-[13.5px] font-semibold text-white transition hover:bg-ink/85"
              >
                <WhatsappIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>
              <a
                href={SITE.socials.tiktok.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-5 text-[13.5px] font-semibold transition hover:bg-tile"
              >
                <TiktokIcon className="h-[18px] w-[18px]" />
                {SITE.socials.tiktok.label}
              </a>
              <a
                href={SITE.socials.facebook.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-5 text-[13.5px] font-semibold transition hover:bg-tile"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
                Facebook
              </a>
            </div>

            <p className="mt-5 rounded-[10px] bg-tile px-4 py-3 text-[13px] text-ink-soft">
              {SITE.delivery.orderRule}. {SITE.delivery.feeLabel} sur tout {SITE.city}.
            </p>
          </div>

          <MapPlaceholder className="h-[260px] w-full" />
        </div>

        <form className="rounded-[14px] border border-line p-5">
          <h2 className="text-[16px] font-bold">Demander un devis</h2>
          <p className="mt-1 text-[13px] text-muted">
            Formulaire de démonstration : aucune donnée n’est envoyée.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] text-muted">Nom / Entreprise</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder="Votre nom"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-muted">Téléphone</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder="6XX XX XX XX"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[12px] text-muted">E-mail</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder="vous@entreprise.cm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[12px] text-muted">Votre besoin</span>
              <textarea
                rows={5}
                className="mt-1 w-full resize-none rounded-[10px] border border-line bg-transparent p-3 text-[14px] outline-none transition focus:border-ink"
                placeholder="Nombre de personnes, fréquence, date de l’événement…"
              />
            </label>
          </div>

          <button
            type="button"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
          >
            Envoyer la demande
          </button>
        </form>
      </div>
    </div>
  );
}
