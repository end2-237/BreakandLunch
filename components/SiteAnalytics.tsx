"use client";

// Compte une page vue à chaque changement d'adresse — y compris les
// navigations sans rechargement, qui sont la règle ici.
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/track";

export default function SiteAnalytics() {
  const pathname = usePathname();
  const params = useSearchParams();
  const last = useRef("");

  useEffect(() => {
    const url = `${pathname}${params.toString() ? `?${params}` : ""}`;
    // React monte deux fois en développement : sans ce garde, chaque page
    // serait comptée en double.
    if (last.current === url) return;
    last.current = url;
    track("page_view", {}, { path: url });
  }, [pathname, params]);

  return null;
}
