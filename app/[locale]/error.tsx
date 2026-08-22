"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/components/I18nProvider";

/**
 * Un écran d'erreur qui reste commercial : le client repart avec un moyen de
 * commander, pas avec une trace de pile.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[erreur]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="shell flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-deep">{t.errors.incident}</p>
      <h1 className="mt-3 text-[28px] font-bold tracking-[-0.03em] lg:text-[38px]">
        {t.errors.errorTitle}
      </h1>
      <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-ink-soft">
        {t.errors.errorText}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-[12px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85"
        >
          {t.common.retry}
        </button>
        <a
          href={SITE.socials.whatsapp.href}
          className="inline-flex h-12 items-center justify-center rounded-[12px] border border-line px-6 text-[14px] font-semibold transition hover:bg-tile"
        >
          {t.common.orderOnWhatsapp}
        </a>
        <a
          href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
          className="inline-flex h-12 items-center justify-center rounded-[12px] border border-line px-6 text-[14px] font-semibold transition hover:bg-tile"
        >
          {SITE.phones[0]}
        </a>
      </div>

      {error.digest && <p className="mt-6 text-[12px] text-muted">{t.errors.technical(error.digest)}</p>}
    </div>
  );
}
