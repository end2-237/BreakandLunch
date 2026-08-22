import { getCatalog, CamilleError, type Catalog } from "./camille";

/**
 * Charge le catalogue sans jamais lever : les pages affichent soit le vrai
 * catalogue, soit un message d'indisponibilité. Jamais de contenu inventé.
 */
export async function loadCatalog(): Promise<{ catalog: Catalog | null; error: string | null }> {
  try {
    return { catalog: await getCatalog(), error: null };
  } catch (e) {
    const message =
      e instanceof CamilleError
        ? e.message
        : "Le catalogue est momentanément indisponible.";
    console.error("[camille] catalogue indisponible :", message, (e as Error)?.message);
    return { catalog: null, error: message };
  }
}
