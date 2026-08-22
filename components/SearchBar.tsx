"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allProducts } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { SearchIcon } from "./icons";

export default function SearchBar({
  placeholder = "Rechercher",
  compact = false,
}: {
  placeholder?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allProducts()
      .filter(
        ({ product, menu }) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          menu.name.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 transition focus-within:border-ink/30 ${
          compact ? "h-[46px]" : "h-[48px] lg:h-[52px]"
        }`}
      >
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-full w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
      </div>

      {focused && results.length > 0 && (
        <div className="animate-fade absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[16px] border border-line bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          {results.map(({ product, menu }) => (
            <Link
              key={product.id}
              href={`/menus/${menu.slug}?plat=${product.id}`}
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 transition hover:bg-tile"
            >
              <span
                className="h-9 w-9 shrink-0 rounded-[10px]"
                style={{ background: product.tone }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{product.name}</span>
                <span className="block truncate text-[12px] text-muted">{menu.name}</span>
              </span>
              <span className="text-[13px] font-bold">{formatPrice(product.price)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
