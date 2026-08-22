"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";

type Value = { t: Dictionary; locale: Locale; /** Préfixe une route de la langue courante. */ href: (path: string) => string };

const Ctx = createContext<Value | null>(null);

/**
 * Le dictionnaire contient des fonctions : il ne peut pas traverser la frontière
 * serveur → client. On ne passe donc que la locale et on le reconstruit ici.
 */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Value>(
    () => ({
      t: getDictionary(locale),
      locale,
      href: (path: string) => `/${locale}${path === "/" ? "" : path}`,
    }),
    [locale],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n doit être utilisé dans I18nProvider");
  return ctx;
}
