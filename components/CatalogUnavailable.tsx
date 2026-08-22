"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { useI18n } from "./I18nProvider";
import { AlertIcon, PhoneIcon, WhatsappIcon } from "./icons";

/**
 * La plateforme ne répond pas. On le dit, et on donne les deux moyens de
 * commander qui, eux, fonctionnent : le téléphone et WhatsApp.
 */
export default function CatalogUnavailable({ message }: { message?: string }) {
  const { t, href } = useI18n();

  return (
    <div className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-[520px] text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tile">
          <AlertIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">
          {t.errors.catalogTitle}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {message ? `${message} ` : ""}
          {t.errors.catalogText}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={SITE.socials.whatsapp.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-ink px-6 text-[15px] font-semibold text-white transition hover:bg-ink/85"
          >
            <WhatsappIcon className="h-[18px] w-[18px]" />
            {t.common.orderOnWhatsapp}
          </a>
          <a
            href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-line px-6 text-[15px] font-semibold transition hover:bg-tile"
          >
            <PhoneIcon className="h-[18px] w-[18px]" />
            {SITE.phones[0]}
          </a>
        </div>

        <p className="mt-6 text-[13px] text-muted">
          <Link href={href("/")} className="underline underline-offset-4">
            {t.errors.backHome}
          </Link>{" "}
          · {t.common.orderRule}
        </p>
      </div>
    </div>
  );
}
