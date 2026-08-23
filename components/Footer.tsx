"use client";

import Link from "next/link";
import Logo from "./Logo";

import { useCatalog } from "./CatalogProvider";
import { SITE } from "@/lib/site";
import {
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "./icons";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { categories, merchant } = useCatalog();
  const { t, href, locale } = useI18n();
  const NAV = [
    { label: t.nav.offers, path: "/offres" },
    { label: t.nav.new, path: "/nouveautes" },
    { label: t.nav.menus, path: "/menus" },
    { label: t.nav.business, path: "/entreprises" },
  ];

  return (
    // Noir et rose : l'usage que la charte demande de privilégier.
    <footer className="mt-20 bg-ink text-white">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Logo variant="rose" height={72} />
          <p className="mt-4 max-w-[240px] text-[14px] leading-relaxed text-white/70">
            {locale === "en" ? `“${t.seo.slogan}”` : `« ${t.seo.slogan} »`}
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={SITE.socials.whatsapp.href}
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand hover:bg-brand hover:text-ink"
            >
              <WhatsappIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.socials.tiktok.href}
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand hover:bg-brand hover:text-ink"
            >
              <TiktokIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.socials.facebook.href}
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand hover:bg-brand hover:text-ink"
            >
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">{t.footer.sections}</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-white/70">
            {categories.length === 0 && (
              <li>
                <Link href={href("/menus")} className="transition hover:text-brand">
                  {t.common.seeMenu}
                </Link>
              </li>
            )}
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={href(`/menus/${category.slug}`)} className="transition hover:text-brand">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">{t.footer.navigation}</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-white/70">
            {NAV.map((item) => (
              <li key={item.path}>
                <Link href={href(item.path)} className="transition hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href("/contact")} className="transition hover:text-brand">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">{t.footer.contact}</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-white/70">
            <li className="flex items-start gap-2">
              <PinIcon className="mt-[2px] h-4 w-4 shrink-0" />
              {merchant.location ?? SITE.location}
            </li>
            {SITE.phones.map((phone) => (
              <li key={phone} className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition hover:text-brand">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="break-all transition hover:text-brand">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-[13px] text-white/55 sm:flex-row">
          <p>{t.footer.rights(new Date().getFullYear(), SITE.name)}</p>
          <p>
            {t.common.orderRule} · {t.common.freeDelivery}
          </p>
        </div>
      </div>
    </footer>
  );
}
