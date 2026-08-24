export const SITE = {
  name: "Break & Lunch by Jojoo",
  shortName: "Break & Lunch",
  slogan: "Un vrai délice à chaque bouchée",
  email: "break.lunchbyjojoo@gmail.com",
  phones: ["655 16 48 55", "690 61 17 73"],
  city: "Douala",
  country: "Cameroun",
  location: "Douala – Cameroun",
  defaultAddress: "Bonapriso, Douala",
  socials: {
    // Le compte réel : « breakandlunchbyjojoo », avec le « and ». L'ancien lien
    // pointait vers un pseudo qui n'existe pas. Les paramètres _r et _t du lien
    // partagé depuis l'application sont laissés de côté : ce sont des jetons de
    // partage liés à une session, ils périment et n'ajoutent rien ici.
    tiktok: { label: "@breakandlunchbyjojoo", href: "https://www.tiktok.com/@breakandlunchbyjojoo" },
    facebook: { label: "Break & Lunch by Jojoo", href: "https://www.facebook.com/" },
    whatsapp: { label: "WhatsApp", href: "https://wa.me/237655164855" },
  },
  delivery: {
    // Break & Lunch offre la livraison : c'est la promesse tenue sur toutes
    // les pages. Ce zéro fait foi partout — affichage ET commande envoyée à
    // Camille — pour qu'un barème resté dans Camille ne fasse jamais
    // apparaître 1 000 F sur le récapitulatif du commerçant.
    fee: 0,
    feeLabel: "Livraison gratuite",
    orderRule: "Commandes à l’avance ou avant 9h",
  },
  /** Comptes mobile money où le client transfère, quand il paie d'avance.
      Les deux lignes de l'entreprise sont Orange (655…, 690…) : tant qu'aucun
      compte MTN n'est ouvert, l'option MTN s'annonce indisponible plutôt que
      d'envoyer un client vers un numéro qui ne recevra rien. */
  momo: {
    orange: "690 61 17 73",
    mtn: null as string | null,
  },
} as const;

export const CURRENCY = "F";

/** L'adresse publique du site : indispensable aux liens canoniques et au plan du site. */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://breakandlunch.cm").replace(/\/$/, "");
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("fr-FR").replace(/ | /g, " ")} ${CURRENCY}`;
}
