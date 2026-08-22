import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Break & Lunch by Jojoo — accueil"
      className={`group inline-flex shrink-0 items-end gap-[6px] ${className}`}
    >
      <span className="text-[17px] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[19px]">
        break&nbsp;<span className="text-brand-deep">&amp;</span>&nbsp;lunch
      </span>
      <span className="relative -mb-[1px] inline-flex h-[19px] w-[30px] items-center justify-center rounded-bl-[3px] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[3px] bg-brand transition-transform duration-300 group-hover:-rotate-6">
        <span className="text-[7px] font-bold lowercase leading-none tracking-tight text-ink/80">
          jojoo
        </span>
      </span>
    </Link>
  );
}
