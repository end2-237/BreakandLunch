import Link from "next/link";
import Logo from "./Logo";
import { MENUS, NAV } from "@/lib/data";
import { SITE } from "@/lib/site";
import {
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "./icons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Logo />
          <p className="mt-4 max-w-[240px] text-[14px] leading-relaxed text-ink-soft">
            « {SITE.slogan} »
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={SITE.socials.whatsapp.href}
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-brand hover:border-brand"
            >
              <WhatsappIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.socials.tiktok.href}
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-brand hover:border-brand"
            >
              <TiktokIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.socials.facebook.href}
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-brand hover:border-brand"
            >
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">Nos menus</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
            {MENUS.map((menu) => (
              <li key={menu.slug}>
                <Link href={`/menus/${menu.slug}`} className="transition hover:text-ink">
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">Navigation</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="transition hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">Contact</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
            <li className="flex items-start gap-2">
              <PinIcon className="mt-[2px] h-4 w-4 shrink-0" />
              {SITE.location}
            </li>
            {SITE.phones.map((phone) => (
              <li key={phone} className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition hover:text-ink">
                  {phone}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="break-all transition hover:text-ink">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-[13px] text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
          </p>
          <p>{SITE.delivery.orderRule} · {SITE.delivery.feeLabel}</p>
        </div>
      </div>
    </footer>
  );
}
