"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Le suivi se met à jour tout seul. Camille pousse déjà un webhook, mais le
 * client peut avoir ouvert la page avant, ou l'avoir laissée ouverte : une
 * relecture régulière évite un suivi figé.
 */
export default function AutoRefresh({ seconds = 45 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);

  return null;
}
