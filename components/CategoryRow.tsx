"use client";

import Link from "next/link";
import { useRef } from "react";
import { POPULAR_CATEGORIES } from "@/lib/data";
import Placeholder from "./Placeholder";
import { ArrowLeft, ArrowRight } from "./icons";

export default function CategoryRow() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section className="mt-12 lg:mt-16">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">
          Catégories populaires
        </h2>
        <div className="hidden items-center gap-4 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Précédent"
            className="text-ink transition hover:opacity-60"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Suivant"
            className="text-ink transition hover:opacity-60"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar -mx-6 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 lg:mt-6 lg:gap-4"
      >
        {POPULAR_CATEGORIES.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="group w-[104px] shrink-0 snap-start sm:w-[124px] lg:w-[168px]"
          >
            <Placeholder
              tone={category.tone}
              rounded="rounded-[14px]"
              className="aspect-square w-full transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
            />
            <p className="mt-2 text-center text-[13px] font-medium leading-tight lg:text-[14px]">
              {category.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
