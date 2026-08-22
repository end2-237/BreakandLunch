import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.checkout.title,
    // Un panier n'a rien à faire dans un index : il est propre à un visiteur.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/panier` },
  };
}

export default function PanierPage() {
  return <CheckoutView />;
}
