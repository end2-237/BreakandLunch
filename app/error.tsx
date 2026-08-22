"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * Un écran d'erreur qui reste commercial : le client repart avec un moyen de
 * commander, pas avec une trace de pile.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[erreur]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="shell flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-deep">Incident</p>
      <h1 className="mt-3 text-[28px] font-bold tracking-[-0.03em] lg:text-[38px]">
        Quelque chose s’est mal passé
      </h1>
      <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-ink-soft">
        La page n’a pas pu s’afficher. Nos cuisines, elles, sont ouvertes : appelez-nous ou
        écrivez-nous, la commande passe en deux minutes.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-[12px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85"
        >
          Réessayer
        </button>
        <a
          href={SITE.socials.whatsapp.href}
          className="inline-flex h-12 items-center justify-center rounded-[12px] border border-line px-6 text-[14px] font-semibold transition hover:bg-tile"
        >
          Commander sur WhatsApp
        </a>
        <a
          href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
          className="inline-flex h-12 items-center justify-center rounded-[12px] border border-line px-6 text-[14px] font-semibold transition hover:bg-tile"
        >
          {SITE.phones[0]}
        </a>
      </div>

      {error.digest && <p className="mt-6 text-[12px] text-muted">Référence technique : {error.digest}</p>}
    </div>
  );
}
