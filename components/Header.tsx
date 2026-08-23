"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Portal from "./Portal";
import { SITE } from "@/lib/site";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";
import { useCart } from "./CartProvider";
import {
  CartIcon,
  ChevronDown,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  UserIcon,
} from "./icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { t, locale, href } = useI18n();

  const NAV = [
    { label: t.nav.offers, path: "/offres" },
    { label: t.nav.new, path: "/nouveautes" },
    { label: t.nav.menus, path: "/menus" },
    { label: t.nav.business, path: "/entreprises" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** Changer de langue garde la page où l'on est, et se souvient du choix. */
  function switchTo(next: Locale) {
    document.cookie = `blj-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(switchLocalePath(pathname, next));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="shell flex h-[66px] items-center gap-6 lg:h-[84px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.nav.openMenu}
          className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-tile lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-1 justify-center lg:hidden">
          <Logo height={46} />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Logo height={62} />
          <span className="flex items-center gap-1 text-[15px] font-semibold text-ink">
            {SITE.city}
          </span>
          <nav className="flex items-center gap-6">
            {NAV.map((item) => {
              const active = pathname.startsWith(href(item.path));
              return (
                <Link
                  key={item.path}
                  href={href(item.path)}
                  className={`text-[14px] transition hover:text-ink ${
                    active ? "font-semibold text-ink" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          {/* Deux langues, deux adresses : le bouton mène à la même page traduite. */}
          <div className="hidden items-center rounded-full border border-line p-0.5 lg:flex">
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchTo(code)}
                aria-current={locale === code ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-[12px] font-bold uppercase transition ${
                  locale === code ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <Link
            href={href("/compte")}
            aria-label={t.nav.account}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-tile lg:flex"
          >
            <UserIcon className="h-[22px] w-[22px]" />
          </Link>
          <Link
            href={href("/panier")}
            aria-label={t.nav.cart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-tile"
          >
            <CartIcon className="h-[22px] w-[22px]" />
            {count > 0 && (
              <span className="absolute right-0 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[90] lg:hidden">
            <button
              type="button"
              aria-label={t.nav.closeMenu}
              onClick={() => setOpen(false)}
              className="absolute inset-0 animate-fade bg-ink/40"
            />
            <div className="animate-fade-up absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <Logo height={42} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14px] font-semibold">
                <PinIcon className="h-4 w-4 text-brand-deep" />
                {SITE.city}
                <span className="ml-auto flex items-center rounded-full border border-line p-0.5">
                  {locales.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => switchTo(code)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                        locale === code ? "bg-ink text-white" : "text-ink-soft"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </span>
              </div>

              <nav className="mt-6 flex flex-col">
                {NAV.map((item) => (
                  <Link
                    key={item.path}
                    href={href(item.path)}
                    className="border-b border-line py-4 text-[17px] font-semibold text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href={href("/compte")} className="border-b border-line py-4 text-[17px] font-semibold text-ink">
                  {t.nav.myOrders}
                </Link>
                <Link href={href("/contact")} className="border-b border-line py-4 text-[17px] font-semibold text-ink">
                  {t.nav.contact}
                </Link>
              </nav>

              <div className="mt-auto space-y-2 pt-6 text-[13px] text-ink-soft">
                <a href={`tel:${SITE.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  {SITE.phones[0]}
                </a>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </header>
  );
}
