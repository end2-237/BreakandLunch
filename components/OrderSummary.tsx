"use client";

import { useState } from "react";
import { formatPrice, SITE } from "@/lib/site";
import { TicketIcon } from "./icons";

export default function OrderSummary({
  subtotal,
  discount,
  total,
  cta,
  onCta,
  ctaHref,
  compact = false,
}: {
  subtotal: number;
  discount: number;
  total: number;
  cta: string;
  onCta?: () => void;
  ctaHref?: string;
  compact?: boolean;
}) {
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);

  return (
    <div className={compact ? "" : "mt-4"}>
      <h3 className="text-[14px] font-bold">Récapitulatif</h3>
      <dl className="mt-3 space-y-2 text-[13.5px]">
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
            onChange={(event) => {
              setPromo(event.target.value);
              setApplied(false);
            }}
            placeholder="Code promo"
            aria-label="Code promo"
            className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-muted"
          />
        </div>
        <button
          type="button"
          onClick={() => setApplied(promo.trim().length > 0)}
          className="h-10 rounded-[9px] bg-tile px-4 text-[13px] font-semibold text-ink-soft transition hover:bg-tile-deep"
        >
          Appliquer
        </button>
      </div>
      {applied && (
        <p className="mt-2 text-[12px] text-muted">
          Code enregistré — la validation se fera à la confirmation.
        </p>
      )}

      {ctaHref ? (
        <a
          href={ctaHref}
          onClick={onCta}
          className="mt-4 flex h-11 items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
        >
          {cta}
        </a>
      ) : (
        <button
          type="button"
          onClick={onCta}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
        >
          {cta}
        </button>
      )}
    </div>
  );
}
