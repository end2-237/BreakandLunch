import Link from "next/link";
import { ChevronRight } from "./icons";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[12px] lg:text-[13px]">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href && !last ? (
              <Link href={item.href} className="text-ink-soft transition hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "font-medium text-ink" : "text-ink-soft"}>{item.label}</span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-muted" />}
          </span>
        );
      })}
    </nav>
  );
}
