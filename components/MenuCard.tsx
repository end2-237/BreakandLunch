import Link from "next/link";
import type { Menu } from "@/lib/data";
import Placeholder from "./Placeholder";
import { ClockIcon, ScooterIcon, StarIcon } from "./icons";

export default function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Link href={`/menus/${menu.slug}`} className="group block">
      <Placeholder
        tone={menu.swatch}
        rounded="rounded-[16px]"
        className="aspect-[16/9] w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
        iconClassName="h-8 w-8"
      />
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-[17px] font-bold tracking-[-0.01em] lg:text-[19px]">{menu.name}</h3>
        <span className="truncate text-[13px] text-muted">{menu.kind}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-ink lg:text-[13px]">
        <span className="flex items-center gap-1.5">
          <StarIcon className="h-[14px] w-[14px] text-brand" />
          {menu.rating} %
          <span className="rounded-[6px] bg-brand px-1.5 py-[2px] text-[11px] font-semibold">
            {menu.ratingLabel}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <ClockIcon className="h-[14px] w-[14px]" />
          {menu.time}
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <ScooterIcon className="h-[15px] w-[15px]" />
          {menu.fee}
        </span>
      </div>
    </Link>
  );
}
