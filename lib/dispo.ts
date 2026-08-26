// ─────────────────────────────────────────────────────────────────────────────
// Ce qui se commande aujourd'hui, et ce qui se commande autrement.
//
// Le menu du jour ne veut rien dire si le reste de la carte s'achète
// exactement pareil. Mais un plat absent du jour n'est pas en rupture : il est
// servi le jeudi, ou il se prépare sur demande. Trois cas, et c'est tout ce que
// ce fichier décide.
//
// Rien ici ne lit l'horloge : le jour de service vient de Camille, et « servi
// le jeudi » se dit sans savoir quel jour on est. Une page mise en cache le
// matin raconte donc la même chose que le navigateur qui la relit le soir.
// ─────────────────────────────────────────────────────────────────────────────

import type { CamilleProduct } from "./camille";

export type Regime =
  | { sorte: "aujourdhui" }                  // au menu du jour : commande normale
  | { sorte: "jours"; jours: number[] }      // servi certains jours, annoncés
  | { sorte: "demande" };                    // sur demande, date à confirmer

/** Comment ce plat se commande. `auMenu` : les fiches cochées dans Camille. */
export function regime(product: CamilleProduct, auMenu: Set<string>): Regime {
  // Aucune fiche cochée : la cuisine n'a pas publié son menu du jour. On ne
  // transforme pas toute la carte en formulaire de demande pour un oubli.
  if (auMenu.size === 0 || auMenu.has(product.id)) return { sorte: "aujourdhui" };
  const jours = [...product.availableDays].sort();
  return jours.length ? { sorte: "jours", jours } : { sorte: "demande" };
}

/** Vrai si ce plat demande une confirmation avant d'être préparé. */
export const surDemande = (r: Regime) => r.sorte !== "aujourdhui";
