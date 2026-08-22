"use client";

import { SIZES } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { CheckIcon, ChevronUp, SlidersIcon } from "./icons";

export type FilterDraft = {
  categories: string[];
  min: number;
  max: number;
  size: string;
};

type Props = {
  categories: string[];
  bounds: { min: number; max: number };
  draft: FilterDraft;
  setDraft: (next: FilterDraft) => void;
  onApply: () => void;
  onReset: () => void;
  showHeader?: boolean;
};

export default function FiltersPanel({
  categories,
  bounds,
  draft,
  setDraft,
  onApply,
  onReset,
  showHeader = true,
}: Props) {
  const toggleCategory = (category: string) => {
    setDraft({
      ...draft,
      categories: draft.categories.includes(category)
        ? draft.categories.filter((item) => item !== category)
        : [...draft.categories, category],
    });
  };

  const span = Math.max(bounds.max - bounds.min, 1);
  const leftPct = ((draft.min - bounds.min) / span) * 100;
  const rightPct = ((draft.max - bounds.min) / span) * 100;

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Filtres</h2>
          <SlidersIcon className="h-[18px] w-[18px] text-ink" />
        </div>
      )}

      <div className={showHeader ? "mt-4 border-t border-line pt-4" : ""}>
        <ul className="space-y-3">
          {categories.map((category) => {
            const checked = draft.categories.includes(category);
            return (
              <li key={category}>
                <label className="flex cursor-pointer items-center gap-3 text-[14px]">
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition ${
                      checked ? "border-brand bg-brand" : "border-line-strong bg-white"
                    }`}
                  >
                    {checked && <CheckIcon className="h-3 w-3 text-ink" />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold">Prix</h3>
          <ChevronUp className="h-4 w-4 text-ink" />
        </div>

        <div className="relative mt-6 h-4">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
          />
          <input
            type="range"
            aria-label="Prix minimum"
            min={bounds.min}
            max={bounds.max}
            step={100}
            value={draft.min}
            onChange={(event) =>
              setDraft({ ...draft, min: Math.min(Number(event.target.value), draft.max - 100) })
            }
            className="absolute inset-x-0 top-1/2 h-4 w-full -translate-y-1/2"
          />
          <input
            type="range"
            aria-label="Prix maximum"
            min={bounds.min}
            max={bounds.max}
            step={100}
            value={draft.max}
            onChange={(event) =>
              setDraft({ ...draft, max: Math.max(Number(event.target.value), draft.min + 100) })
            }
            className="absolute inset-x-0 top-1/2 h-4 w-full -translate-y-1/2"
          />
        </div>

        <div className="mt-3 flex justify-between text-[12px] font-medium text-ink-soft">
          <span>{formatPrice(draft.min)}</span>
          <span>{formatPrice(draft.max)}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold">Portion</h3>
          <ChevronUp className="h-4 w-4 text-ink" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = draft.size === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setDraft({ ...draft, size: active ? "" : size })}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                  active
                    ? "bg-ink text-white"
                    : "bg-tile text-ink-soft hover:bg-tile-deep"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2">
        <button
          type="button"
          onClick={onApply}
          className="h-11 rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.99]"
        >
          Appliquer les filtres
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-[10px] text-[13px] font-medium text-ink-soft transition hover:bg-tile"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
