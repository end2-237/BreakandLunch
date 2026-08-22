"use client";

import Link from "next/link";
import type { CamilleCategory } from "@/lib/camille";
import { useI18n } from "./I18nProvider";
import Visual from "./Visual";
import { ClockIcon, ScooterIcon } from "./icons";

export default function MenuCard({ category }: { category: CamilleCategory }) {
  const { t, href } = useI18n();

  return (
    <Link href={href(`/menus/${category.slug}`)} className="group block">
      <Visual
        src={category.image}
        name={category.name}
        rounded="rounded-[16px]"
        className="aspect-[16/9] w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
        initialClassName="text-[34px]"
      />
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-[17px] font-bold tracking-[-0.01em] lg:text-[19px]">{category.name}</h3>
        <span className="truncate text-[13px] text-muted">{t.common.articles(category.count)}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium lg:text-[13px]">
        <span className="flex items-center gap-1.5 text-ink-soft">
          <ScooterIcon className="h-[15px] w-[15px]" />
          {t.common.freeDelivery}
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <ClockIcon className="h-[14px] w-[14px]" />
          {t.common.orderRule}
        </span>
      </div>
    </Link>
  );
}
