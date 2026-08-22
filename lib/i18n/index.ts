import { fr, type Dictionary } from "./fr";
import { en } from "./en";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

/** Le chemin d'une page dans l'autre langue, à URL équivalente. */
export function switchLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts[0] = next;
  else parts.unshift(next);
  return "/" + parts.join("/");
}

export type { Dictionary };
