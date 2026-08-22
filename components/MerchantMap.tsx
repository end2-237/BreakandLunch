"use client";

import dynamic from "next/dynamic";
import { useCatalog } from "./CatalogProvider";
import { SITE } from "@/lib/site";
import { PinIcon } from "./icons";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full animate-pulse rounded-[12px] bg-tile" />,
});

/** Où nous sommes — la position vient de la fiche Camille, pas du code. */
export default function MerchantMap({ className = "" }: { className?: string }) {
  const { merchant } = useCatalog();
  const point =
    merchant.lat != null && merchant.lng != null ? { lat: merchant.lat, lng: merchant.lng } : null;

  if (!point) {
    return (
      <div className={`flex h-[260px] items-center justify-center rounded-[12px] bg-tile ${className}`}>
        <p className="flex items-center gap-2 px-6 text-center text-[13px] text-ink-soft">
          <PinIcon className="h-4 w-4 shrink-0" />
          {merchant.location ?? SITE.location}
        </p>
      </div>
    );
  }

  return <DeliveryMap point={null} merchant={point} interactive={false} height={260} className={className} />;
}
