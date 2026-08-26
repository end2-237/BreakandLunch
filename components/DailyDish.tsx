"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Un plat du planning.
//
// Quand le catalogue le connaît, il se commande comme n'importe quel article —
// photo, prix, bouton. Sinon il reste annoncé, avec un lien pour le demander :
// mieux vaut un plat qu'on réclame sur WhatsApp qu'un plat qu'on cache parce
// qu'il n'a pas encore de fiche.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import type { CamilleProduct } from "@/lib/camille";
import { slugify } from "@/lib/camille";
import { formatPrice, SITE } from "@/lib/site";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";
import PriceTag from "./PriceTag";
import Stepper from "./Stepper";
import Visual from "./Visual";
import { PlusIcon, WhatsappIcon } from "./icons";

export default function DailyDish({
  name, product, locale,
}: {
  name: string;
  product: CamilleProduct | null;
  locale: string;
}) {
  const { qtyOf, add, setQty } = useCart();
  const { t } = useI18n();
  const qty = product ? qtyOf(product.id) : 0;
  const epuise = product ? product.stock !== null && product.stock <= 0 : false;

  return (
    <article className="flex gap-4 rounded-[16px] border border-line p-4">
      <Visual
        src={product?.image ?? null}
        name={product?.name ?? name}
        rounded="rounded-[12px]"
        className="h-[92px] w-[92px] shrink-0"
        initialClassName="text-[28px]"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[15px] font-bold leading-snug">{name}</h3>
        {product && product.name.toLowerCase() !== name.toLowerCase() && (
          <p className="mt-0.5 truncate text-[12px] text-muted">{product.name}</p>
        )}

        {product ? (
          <>
            <div className="mt-1.5">
              <PriceTag price={product.price} oldPrice={product.oldPrice} />
            </div>
            <div className="mt-auto pt-3">
              {epuise ? (
                <span className="flex h-10 items-center justify-center rounded-[10px] bg-tile text-[13px] font-semibold text-muted">
                  {t.common.unavailableToday}
                </span>
              ) : qty > 0 ? (
                <Stepper value={qty} onChange={(next) => setQty(product.id, next)} />
              ) : (
                <button
                  type="button"
                  onClick={() => add(product.id)}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] bg-ink text-[13px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.98]"
                >
                  <PlusIcon className="h-4 w-4" />
                  {t.daily.order}
                </button>
              )}
            </div>
            <Link
              href={`/${locale}/menus/${slugify(product.category)}/${product.id}`}
              className="mt-2 text-[12px] text-muted underline underline-offset-4 transition hover:text-ink"
            >
              {t.product.ownPage}
            </Link>
          </>
        ) : (
          <>
            <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{t.daily.askText}</p>
            <a
              href={`${SITE.socials.whatsapp.href}?text=${encodeURIComponent(`Bonjour, je voudrais commander : ${name}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-auto flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-line text-[13px] font-semibold transition hover:border-ink/25"
            >
              <WhatsappIcon className="h-4 w-4" />
              {t.daily.ask}
            </a>
          </>
        )}
      </div>
    </article>
  );
}
