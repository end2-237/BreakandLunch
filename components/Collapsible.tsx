"use client";

import { useState, type ReactNode } from "react";
import { ChevronUp } from "./icons";

export default function Collapsible({
  title,
  children,
  defaultOpen = true,
  action,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-[14px] border border-line">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-1 items-center justify-between gap-3 text-left"
        >
          <h2 className="text-[16px] font-bold tracking-[-0.01em]">{title}</h2>
          {!action && (
            <ChevronUp className={`h-4 w-4 shrink-0 transition-transform ${open ? "" : "rotate-180"}`} />
          )}
        </button>
        {action}
      </div>
      {open && <div className="border-t border-line px-5 py-5">{children}</div>}
    </section>
  );
}
