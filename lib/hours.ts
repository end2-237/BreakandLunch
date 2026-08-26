// ─────────────────────────────────────────────────────────────────────────────
// L'heure de Douala, et la limite de 9h.
//
// « Commandes à l'avance ou avant 9h » est écrit partout sur le site. Sans
// garde-fou, un client commande à 11h, personne ne le livre, et il en garde
// le souvenir. Mieux vaut le lui dire au moment où il choisit son créneau.
//
// Le fuseau du Cameroun est UTC+1, toute l'année : pas d'heure d'été, donc pas
// de bascule à gérer. On lit l'heure en UTC et on ajoute une heure — la montre
// du visiteur peut être réglée sur un autre fuseau, la cuisine non.
// ─────────────────────────────────────────────────────────────────────────────

/** Décalage du Cameroun, en heures. */
export const UTC_OFFSET = 1;

/** L'heure après laquelle la cuisine ne prend plus de commande pour le jour même. */
export const CUTOFF_HOUR = 9;

/** L'instant présent, vu de Douala. */
export function maintenantDouala(d = new Date()) {
  return new Date(d.getTime() + UTC_OFFSET * 3600_000);
}

/** Le jour, à Douala, au format « YYYY-MM-DD » — celui qu'attend un champ date. */
export function jourISO(d = maintenantDouala()) {
  return d.toISOString().slice(0, 10);
}

/** Est-il trop tard pour être livré aujourd'hui ? */
export function apresLaLimite(d = new Date()) {
  return maintenantDouala(d).getUTCHours() >= CUTOFF_HOUR;
}

/**
 * La cuisine sert du lundi au vendredi. Le samedi et le dimanche, personne ne
 * cuisine : proposer ces jours-là, c'est promettre une livraison qui n'aura
 * pas lieu.
 */
export function estJourDeService(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const jour = d.getUTCDay();
  return jour >= 1 && jour <= 5;
}

/**
 * Le premier jour encore livrable : aujourd'hui avant 9h, demain après — et le
 * lundi si l'on tombe sur le week-end.
 */
export function prochainJourLivrable(d = new Date()) {
  const douala = maintenantDouala(d);
  if (apresLaLimite(d)) douala.setUTCDate(douala.getUTCDate() + 1);
  while (douala.getUTCDay() === 0 || douala.getUTCDay() === 6) {
    douala.setUTCDate(douala.getUTCDate() + 1);
  }
  return jourISO(douala);
}

/** Combien de temps reste-t-il avant la limite ? `null` une fois passée. */
export function avantLaLimite(d = new Date()): { heures: number; minutes: number } | null {
  const douala = maintenantDouala(d);
  const restant = CUTOFF_HOUR * 60 - (douala.getUTCHours() * 60 + douala.getUTCMinutes());
  if (restant <= 0) return null;
  return { heures: Math.floor(restant / 60), minutes: restant % 60 };
}
