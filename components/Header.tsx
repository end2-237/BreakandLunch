"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { NAV } from "@/lib/data";
import { SITE } from "@/lib/site";
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
  const { count } = useCart();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="shell flex h-[62px] items-center gap-6 lg:h-[72px]">
        {/* mobile : burger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-tile lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* mobile : logo centré */}
        <div className="flex flex-1 justify-center lg:hidden">
          <Logo />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Logo />
          <button
            type="button"
            className="flex items-center gap-1 text-[15px] font-semibold text-ink transition hover:opacity-70"
          >
            {SITE.city}
            <ChevronDown className="h-4 w-4" />
          </button>
          <nav className="flex items-center gap-6">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
          <button
            type="button"
            className="hidden items-center gap-1 text-[14px] font-medium text-ink transition hover:opacity-70 lg:flex"
          >
            FR
            <ChevronDown className="h-4 w-4" />
          </button>
          <Link
            href="/compte"
            aria-label="Mon compte"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-tile lg:flex"
          >
            <UserIcon className="h-[22px] w-[22px]" />
          </Link>
          <Link
            href="/panier"
            aria-label="Mon panier"
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

      {/* tiroir mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 animate-fade bg-ink/40"
          />
          <div className="animate-fade-up absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14px] font-semibold">
              <PinIcon className="h-4 w-4 text-brand-deep" />
              {SITE.city}
              <ChevronDown className="ml-auto h-4 w-4" />
            </div>

            <nav className="mt-6 flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-line py-4 text-[17px] font-semibold text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/compte"
                className="border-b border-line py-4 text-[17px] font-semibold text-ink"
              >
                Mon compte
              </Link>
              <Link
                href="/contact"
                className="border-b border-line py-4 text-[17px] font-semibold text-ink"
              >
                Contact
              </Link>
            </nav>

            <div className="mt-auto space-y-2 pt-6 text-[13px] text-ink-soft">
              <a
                href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2"
              >
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
      )}
    </header>
  );
}
