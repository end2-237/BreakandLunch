"use client";

import { useState } from "react";
import LocationSheet from "./LocationSheet";
import { useDeliveryLocation } from "./DeliveryLocation";
import { ChevronDown, PinIcon } from "./icons";
import { useI18n } from "./I18nProvider";

/**
 * La pastille d'adresse en tête de page. Tant que le client n'a rien indiqué,
 * elle le demande — c'est la première chose à savoir pour lui dire ce qu'on
 * peut lui livrer, et ça lui évite de tout ressaisir au moment de payer.
 */
export default function LocationPill() {
  const { spot, isSet, details } = useDeliveryLocation();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex max-w-full items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:border-ink/20"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
          <PinIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate">
            {isSet ? spot.label || t.location.saved : t.location.ask}
          </span>
          {isSet && (spot.context || details || spot.kind) && (
            <span className="block truncate text-[11.5px] font-normal text-muted">
              {[spot.kind === "bureau" ? t.location.office : "", details, spot.context]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {open && <LocationSheet onClose={() => setOpen(false)} />}
    </>
  );
}
