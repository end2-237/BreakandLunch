import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { CatalogProvider } from "@/components/CatalogProvider";
import { DeliveryLocationProvider } from "@/components/DeliveryLocation";
import { loadCatalog } from "@/lib/catalog-server";
import { SITE } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Livraison de petits-déjeuners, de déjeuners et de jus naturels en entreprise à Douala. Formules entreprise et service traiteur pour vos événements. Livraison gratuite.",
  keywords: [
    "petit-déjeuner entreprise Douala",
    "livraison repas Douala",
    "traiteur Douala",
    "jus naturels Douala",
    "Break & Lunch by Jojoo",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Le catalogue est chargé une fois par rendu et partagé : le panier et la
  // fiche plat lisent les prix de Camille, jamais une copie locale.
  const { catalog } = await loadCatalog();

  return (
    <html lang="fr" className={manrope.variable}>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <CatalogProvider
            products={catalog?.products ?? []}
            categories={catalog?.categories ?? []}
            merchant={
              catalog?.merchant ?? {
                name: null,
                whatsapp: null,
                location: null,
                lat: null,
                lng: null,
                delivery: { enabled: true, fee: 0, zones: [] },
              }
            }
          >
            <DeliveryLocationProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </DeliveryLocationProvider>
          </CatalogProvider>
        </CartProvider>
      </body>
    </html>
  );
}
