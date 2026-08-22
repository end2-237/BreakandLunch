"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneIcon } from "./icons";
import { useI18n } from "./I18nProvider";

/**
 * Une référence de commande tient en six caractères : elle se devine. Le
 * téléphone du client sert de second facteur — c'est aussi ce que Camille
 * exige côté API.
 */
export default function OrderPhonePrompt({ reference }: { reference: string }) {
  const router = useRouter();
  const { t, href } = useI18n();
  const [phone, setPhone] = useState("");

  return (
    <div className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-[420px] text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tile">
          <PhoneIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-[24px] font-bold tracking-[-0.02em]">{t.order.askPhone(reference)}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {t.order.askPhoneText}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const clean = phone.replace(/\D/g, "");
            if (clean.length >= 9) router.push(href(`/commande/${reference}?tel=${clean}`));
          }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            placeholder="6XX XX XX XX"
aria-label={t.checkout.phone}
            className="h-12 flex-1 rounded-[10px] border border-line px-4 text-[15px] outline-none transition focus:border-ink"
          />
          <button
            type="submit"
            className="h-12 rounded-[10px] bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-ink/85"
          >
            {t.order.seeTracking}
          </button>
        </form>
      </div>
    </div>
  );
}
