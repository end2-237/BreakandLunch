// ─────────────────────────────────────────────────────────────────────────────
// Le planning des repas — quatre semaines qui tournent.
//
// Break & Lunch ne sert pas une carte figée : chaque jour a ses plats, et le
// cycle recommence toutes les quatre semaines. C'est ce planning qui décide de
// ce qu'on mange aujourd'hui ; le catalogue, lui, dit ce que ça coûte.
//
// Saisi tel quel depuis « PLANNING DES REPAS HEBDOMADAIRES » : les noms ne sont
// ni corrigés ni traduits — c'est ainsi que la cuisine les appelle, et ainsi
// que le client les reconnaît.
// ─────────────────────────────────────────────────────────────────────────────

/** Lundi = 1 … Samedi = 6. Dimanche ne figure pas au planning. */
export type Jour = 1 | 2 | 3 | 4 | 5 | 6;

export type JourAuMenu = {
  jour: Jour;
  /** Les plats du jour, tels qu'écrits par la cuisine. */
  plats: string[];
  /** Le vendredi, tout passe au braisé : ce n'est pas un plat mais une journée. */
  grillades?: boolean;
};

const GRILLADES =
  "Journée grillades : poulet braisé, côtelettes de porc braisées, poissons braisés au choix — frites de plantain, frites de pomme, miondo.";

/**
 * Les quatre semaines, dans l'ordre du cycle.
 * L'index 0 est la semaine 1.
 */
export const SEMAINES: JourAuMenu[][] = [
  // ── Semaine 1 ─────────────────────────────────────────────────────────────
  [
    { jour: 1, plats: ["Okok + manioc | bâton", "Fried rice au poulet"] },
    { jour: 2, plats: ["Eru + fufu | tapioca", "Beefsteak aux pommes | plantain"] },
    { jour: 3, plats: ["Sangha", "Rôti de porc | plantain"] },
    { jour: 4, plats: ["Couscous gombo crabe", "Gésiers sautés à l’ail | frites de plantain"] },
    { jour: 5, plats: [GRILLADES], grillades: true },
    { jour: 6, plats: ["Ndolé crevettes | viandes + plantain | miondo", "Macabo râpé + sauce d’arachide poisson"] },
  ],
  // ── Semaine 2 ─────────────────────────────────────────────────────────────
  [
    { jour: 1, plats: ["Escargots sautés + riz | frites de plantain", "Légumes sautés + frites de plantain"] },
    { jour: 2, plats: ["Mbongo de machoiron | porc + plantain | riz | manioc", "Poulet DG"] },
    { jour: 3, plats: ["Koki + plantain | patate", "Ragoût de pommes sautées viande poisson"] },
    { jour: 4, plats: ["Bouillon de pattes de bœuf", "Fried rice"] },
    { jour: 5, plats: [GRILLADES], grillades: true },
    { jour: 6, plats: ["Okok + manioc | bâton", "Steak + frites de plantain | pommes"] },
  ],
  // ── Semaine 3 ─────────────────────────────────────────────────────────────
  [
    { jour: 1, plats: ["Poulet basquaise + riz plantain vapeur", "Fried rice au poulet"] },
    { jour: 2, plats: ["PewPew soupe de poisson + plantain vapeur", "Ndolé crevettes | viandes + plantain | miondo"] },
    { jour: 3, plats: ["Haricots sautés + riz plantain", "Couscous gombo crabes"] },
    { jour: 4, plats: ["Sautés de choux + plantain | patate", "Eru + fufu | tapioca"] },
    { jour: 5, plats: [GRILLADES], grillades: true },
    { jour: 6, plats: ["Nouilles aux boulettes de viande", "Banane malaxée"] },
  ],
  // ── Semaine 4 ─────────────────────────────────────────────────────────────
  [
    { jour: 1, plats: ["Rôti de porc au beurre + riz | plantain", "Fried rice au poulet"] },
    { jour: 2, plats: ["Koki + plantain | patate", "Crèmes fraîches + riz"] },
    { jour: 3, plats: ["Pilé pommes | plantain", "Okok + manioc | bâton"] },
    { jour: 4, plats: ["Escargots sautés + frites de plantain", "Cor tchap"] },
    { jour: 5, plats: [GRILLADES], grillades: true },
    { jour: 6, plats: ["Sautés de saucisses + fritures", "Riz bougard"] },
  ],
];

/**
 * Le numéro de semaine ISO — celui qui compte les semaines de l'année en
 * commençant le lundi. Sans lui, le cycle glisserait d'un jour chaque année.
 */
function semaineIso(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const jour = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - jour);
  const debut = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - debut.getTime()) / 86400000 + 1) / 7);
}

/** Quelle semaine du cycle (1 à 4) sommes-nous ? */
export const semaineDuCycle = (d = new Date()) => ((semaineIso(d) - 1) % 4) + 1;

/** Le planning d'une semaine du cycle, 1 à 4. */
export const semaine = (n: number) => SEMAINES[((n - 1) % 4 + 4) % 4];

/**
 * Le menu d'un jour donné. `null` le dimanche : la cuisine ne sert pas, et
 * annoncer un plat qu'on ne prépare pas vaut moins que ne rien annoncer.
 */
export function menuDuJour(d = new Date()): (JourAuMenu & { semaine: number }) | null {
  const jour = d.getDay(); // 0 = dimanche
  if (jour === 0) return null;
  const n = semaineDuCycle(d);
  const trouve = semaine(n).find((j) => j.jour === jour);
  return trouve ? { ...trouve, semaine: n } : null;
}

/** Les six jours de la semaine en cours, pour la vue d'ensemble. */
export function semaineCourante(d = new Date()) {
  return semaine(semaineDuCycle(d)).map((j) => ({ ...j, semaine: semaineDuCycle(d) }));
}

/**
 * Rapproche un plat du planning d'un article du catalogue.
 *
 * Les noms de la cuisine ne sont pas ceux du catalogue : « Eru + fufu |
 * tapioca » d'un côté, « Eru & water fufu » de l'autre. On compare donc sur
 * les mots pleins, sans accents ni ponctuation.
 *
 * Le rapprochement ne se décide pas sur un mot partagé — « plantain » se
 * retrouve dans la moitié de la carte — mais sur le recouvrement des deux
 * noms : plus de la moitié des mots doit se répondre. En dessous, on ne rapproche
 * rien : mettre le mauvais prix sur un plat est pire que ne pas en afficher.
 */
const MOTS_VIDES = new Set([
  "au", "aux", "de", "des", "du", "en", "et", "la", "le", "les", "sur", "avec",
  "ou", "un", "une", "choix", "journee", "divers", "special", "speciale",
]);

export function motsCles(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 2 && !MOTS_VIDES.has(m));
}

export function rapprocher<T extends { name: string }>(plat: string, articles: T[]): T | null {
  const cles = motsCles(plat);
  if (!cles.length || !articles.length) return null;

  // Un seul mot commun ne prouve rien : « Rôti de porc | plantain » et
  // « Poisson braisé plantain » partagent la garniture, pas le plat. On mesure
  // donc le recouvrement des DEUX noms — la moitié des mots doit se répondre.
  let meilleur: T | null = null;
  let meilleurScore = 0;

  for (const a of articles) {
    const mots = motsCles(a.name);
    if (!mots.length) continue;
    const ensemble = new Set(mots);
    const communs = cles.filter((c) => ensemble.has(c)).length;
    const score = (2 * communs) / (cles.length + mots.length);
    if (score > meilleurScore) { meilleurScore = score; meilleur = a; }
  }

  // 0,55 : « Eru + fufu » retrouve « Eru & water fufu », mais « Poulet
  // basquaise + riz » ne se confond plus avec « Riz sauté au poulet ».
  return meilleurScore >= 0.55 ? meilleur : null;
}
