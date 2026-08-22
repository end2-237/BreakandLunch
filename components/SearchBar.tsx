"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/site";
import { slugify } from "@/lib/camille";
import { useCatalog } from "./CatalogProvider";
import { SearchIcon } from "./icons";
import { useI18n } from "./I18nProvider";

export default function SearchBar({
  placeholder,
  compact = false,
}: {
  placeholder?: string;
  compact?: boolean;
}) {
  const { products } = useCatalog();
  const { t, href } = useI18n();
  const router = useRouter();
  const label = placeholder ?? t.common.search;
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState(0);
  const listId = useRef(`search-${Math.random().toString(36).slice(2, 8)}`).current;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  useEffect(() => setCursor(0), [query]);

  // La recherche mène toujours au rayon du plat, avec sa fiche déjà ouverte.
  const linkFor = (categoryName: string, id: string) =>
    href(`/menus/${slugify(categoryName)}?plat=${id}`);

  const go = (index: number) => {
    const target = results[index];
    if (!target) return;
    setFocused(false);
    setQuery("");
    router.push(linkFor(target.category, target.id));
  };

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
          onKeyDown={(event) => {
            if (!results.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setCursor((c) => (c + 1) % results.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setCursor((c) => (c - 1 + results.length) % results.length);
            } else if (event.key === "Enter") {
              // Entrée = on ouvre directement la fiche du premier plat trouvé.
              event.preventDefault();
              go(cursor);
            } else if (event.key === "Escape") {
              setFocused(false);
            }
          }}
          placeholder={label}
          aria-label={label}
          role="combobox"
          aria-expanded={focused && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-full w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
      </div>

      {focused && results.length > 0 && (
        <div
          id={listId}
          role="listbox"
          className="animate-fade absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[16px] border border-line bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
        >
          {results.map((product, index) => (
            <Link
              key={product.id}
              href={linkFor(product.category, product.id)}
              role="option"
              aria-selected={index === cursor}
              // Sur mobile, le doigt déclenche d'abord le blur du champ : sans
              // ceci la liste se fermait et le lien disparaissait sous le tap.
              onMouseDown={(event) => event.preventDefault()}
              onTouchStart={(event) => event.preventDefault()}
              onClick={() => {
                setFocused(false);
                setQuery("");
              }}
              onMouseEnter={() => setCursor(index)}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 transition ${
                index === cursor ? "bg-tile" : "hover:bg-tile"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{product.name}</span>
                <span className="block truncate text-[12px] text-muted">{product.category}</span>
              </span>
              <span className="text-[13px] font-bold">{formatPrice(product.price)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
