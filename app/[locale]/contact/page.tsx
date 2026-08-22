import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MerchantMap from "@/components/MerchantMap";
import JsonLd from "@/components/JsonLd";
import { loadCatalog } from "@/lib/catalog-server";
import { getDictionary } from "@/lib/i18n";
import { organizationSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import {
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/icons";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.contact.title,
    description: t.contact.intro(t.seo.slogan),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact", "x-default": "/fr/contact" },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { catalog } = await loadCatalog();
  const location = catalog?.merchant.location ?? SITE.location;

  return (
    <div className="shell pb-6 pt-4 lg:pt-6">
      {catalog && <JsonLd data={organizationSchema(catalog.merchant)} />}
      <Breadcrumbs items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.contact.title }]} />

      <h1 className="mt-4 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">{t.contact.title}</h1>
      <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-ink-soft">
        {t.contact.intro(t.seo.slogan)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-4">
          <div className="rounded-[14px] border border-line p-5">
            <h2 className="text-[16px] font-bold">{t.contact.details}</h2>
            <ul className="mt-4 space-y-3 text-[14.5px] text-ink-soft">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-[2px] h-[18px] w-[18px] shrink-0" />
                {location}
              </li>
              {SITE.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition hover:text-ink">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <MailIcon className="h-[18px] w-[18px] shrink-0" />
                <a href={`mailto:${SITE.email}`} className="break-all transition hover:text-ink">
                  {SITE.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={SITE.socials.whatsapp.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink px-5 text-[13.5px] font-semibold text-white transition hover:bg-ink/85"
              >
                <WhatsappIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>
              <a
                href={SITE.socials.tiktok.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-5 text-[13.5px] font-semibold transition hover:bg-tile"
              >
                <TiktokIcon className="h-[18px] w-[18px]" />
                TikTok
              </a>
              <a
                href={SITE.socials.facebook.href}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-5 text-[13.5px] font-semibold transition hover:bg-tile"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
                Facebook
              </a>
            </div>

            <p className="mt-5 rounded-[10px] bg-tile px-4 py-3 text-[13px] text-ink-soft">
              {t.contact.hours(t.common.orderRule, t.common.freeDelivery, SITE.city)}
            </p>
          </div>

          <MerchantMap />
        </div>

        <form className="rounded-[14px] border border-line p-5">
          <h2 className="text-[16px] font-bold">{t.contact.quote}</h2>
          <p className="mt-1 text-[13px] text-muted">{t.contact.quoteDemo}</p>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-[12px] text-muted">{t.contact.nameCompany}</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder={t.checkout.yourName}
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-muted">{t.checkout.phone}</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder="6XX XX XX XX"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-muted">{t.checkout.email}</span>
              <input
                className="mt-1 h-10 w-full border-b border-line bg-transparent text-[14px] outline-none transition focus:border-ink"
                placeholder="vous@entreprise.cm"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-muted">{t.contact.need}</span>
              <textarea
                rows={5}
                className="mt-1 w-full resize-none rounded-[10px] border border-line bg-transparent p-3 text-[14px] outline-none transition focus:border-ink"
                placeholder={t.contact.needPlaceholder}
              />
            </label>
          </div>

          <a
            href={SITE.socials.whatsapp.href}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85"
          >
            <WhatsappIcon className="h-[18px] w-[18px]" />
            {t.contact.send}
          </a>
        </form>
      </div>
    </div>
  );
}
