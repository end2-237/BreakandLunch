export const SITE = {
  name: "Break & Lunch by Jojoo",
  shortName: "Break & Lunch",
  slogan: "Un vrai délice à chaque bouchée",
  email: "break.lunchbyjojoo@gmail.com",
  phones: ["671 16 48 75", "690 61 17 73"],
  city: "Douala",
  country: "Cameroun",
  location: "Douala – Cameroun",
  defaultAddress: "Bonapriso, Douala",
  socials: {
    tiktok: { label: "@break&lunchbyjojoo", href: "https://www.tiktok.com/@breaklunchbyjojoo" },
    facebook: { label: "Break & Lunch by Jojoo", href: "https://www.facebook.com/" },
    whatsapp: { label: "WhatsApp", href: "https://wa.me/237671164875" },
  },
  delivery: {
    fee: 0,
    feeLabel: "Livraison gratuite",
    orderRule: "Commandes à l’avance ou avant 9h",
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
