import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CustomerLookup from "@/components/CustomerLookup";
import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.account.title,
    description: t.account.intro(SITE.shortName),
    // L'espace client n'a rien à faire dans un index de recherche.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/compte` },
  };
}

export default async function ComptePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.account.title }]} />
      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">{t.account.title}</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        {t.account.intro(SITE.shortName)}
      </p>
      <CustomerLookup />
    </div>
  );
}
