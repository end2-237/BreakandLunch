import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { CatalogProvider } from "@/components/CatalogProvider";
import { DeliveryLocationProvider } from "@/components/DeliveryLocation";
import { I18nProvider } from "@/components/I18nProvider";
import SiteAnalytics from "@/components/SiteAnalytics";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { SITE, siteUrl } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: t.seo.homeTitle(SITE.name, t.seo.slogan),
      template: `%s · ${SITE.name}`,
    },
    description: t.seo.homeDescription,
    applicationName: SITE.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "en" ? "en_GB" : "fr_FR",
      title: t.seo.homeTitle(SITE.name, t.seo.slogan),
      description: t.seo.homeDescription,
      url: `/${locale}`,
      images: [{ url: "/marque/logo-break-and-lunch.png", width: 2045, height: 432, alt: SITE.name }],
    },
    twitter: { card: "summary_large_image" },
    keywords:
      locale === "en"
        ? ["breakfast delivery Douala", "office lunch Douala", "catering Douala", "fresh juice Douala", SITE.name]
        : ["petit-déjeuner entreprise Douala", "livraison repas Douala", "traiteur Douala", "jus naturels Douala", SITE.name],
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { catalog } = await loadCatalog();

  return (
    <html lang={locale} className={manrope.variable}>
      <body className="min-h-screen antialiased">
        <I18nProvider locale={locale}>
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
                {/* La fréquentation remonte à Camille : le commerçant voit
                    enfin ce qui se passe sur son site, pas seulement ce qui
                    s'y achète. useSearchParams impose la frontière Suspense. */}
                <Suspense fallback={null}>
                  <SiteAnalytics />
                </Suspense>
                <Header />
                <main>{children}</main>
                <Footer />
              </DeliveryLocationProvider>
            </CatalogProvider>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
