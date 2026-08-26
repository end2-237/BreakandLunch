"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Le garde-fou de 9h.
//
// « Commandes à l'avance ou avant 9h » est une promesse : passée l'heure, la
// cuisine ne prend plus rien pour le jour même. Le dire au moment où le client
// choisit son créneau évite la seule chose qu'on ne rattrape pas — quelqu'un
// qui a commandé, payé son attente, et que personne ne livre.
//
// L'heure est lue dans le navigateur, jamais au rendu : la page du menu du jour
// est mise en cache, un compte à rebours figé mentirait au bout d'un quart
// d'heure.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { apresLaLimite, avantLaLimite, prochainJourLivrable } from "@/lib/hours";
import { useI18n } from "./I18nProvider";
import { AlertIcon, ClockIcon } from "./icons";

export type EtatLimite = {
  /** Trop tard pour être livré aujourd'hui. */
  tropTard: boolean;
  /** Ce qu'il reste avant 9h, tant qu'il reste quelque chose. */
  reste: { heures: number; minutes: number } | null;
  /** Le premier jour encore livrable, au format d'un champ date. */
  jourMin: string;
};

/** L'état de la limite, rafraîchi chaque minute. `null` avant l'hydratation. */
export function useCutoff(): EtatLimite | null {
  const [etat, setEtat] = useState<EtatLimite | null>(null);

  useEffect(() => {
    const lire = () =>
      setEtat({ tropTard: apresLaLimite(), reste: avantLaLimite(), jourMin: prochainJourLivrable() });
    lire();
    const timer = window.setInterval(lire, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return etat;
}

/** Le jour, écrit comme on le dit : « jeudi 27 août ». */
export function nommerJour(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export default function CutoffNotice({ className = "" }: { className?: string }) {
  const { t, locale } = useI18n();
  const cutoff = useCutoff();
  if (!cutoff) return null;

  if (cutoff.tropTard) {
    return (
      <p
        role="status"
        className={`flex items-start gap-2 rounded-[10px] bg-[#fdecec] px-3 py-2.5 text-[12.5px] leading-snug text-[#a11a1a] ${className}`}
      >
        <AlertIcon className="mt-[2px] h-4 w-4 shrink-0" />
        <span>
          {t.cutoff.closed} {t.cutoff.next(nommerJour(cutoff.jourMin, locale))}
        </span>
      </p>
    );
  }

  return (
    <p
      role="status"
      className={`flex items-start gap-2 rounded-[10px] bg-tile/70 px-3 py-2.5 text-[12.5px] leading-snug text-ink-soft ${className}`}
    >
      <ClockIcon className="mt-[2px] h-4 w-4 shrink-0 text-brand-deep" />
      <span>{t.cutoff.open(cutoff.reste?.heures ?? 0, cutoff.reste?.minutes ?? 0)}</span>
    </p>
  );
}
