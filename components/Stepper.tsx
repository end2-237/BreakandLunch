"use client";

import { MinusIcon, PlusIcon } from "./icons";

export default function Stepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9 lg:h-10 lg:w-10";
  const icon = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Retirer un article"
        className={`${dim} flex items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink/80 active:scale-95`}
      >
        <MinusIcon className={icon} />
      </button>
      <span className={`min-w-[18px] text-center font-semibold ${size === "sm" ? "text-[13px]" : "text-[15px]"}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Ajouter un article"
        className={`${dim} flex items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink/80 active:scale-95`}
      >
        <PlusIcon className={icon} />
      </button>
    </div>
  );
}
