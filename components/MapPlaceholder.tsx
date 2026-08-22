import { PinIcon } from "./icons";

export default function MapPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[12px] bg-[#eef0ec] ${className}`}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <div className="absolute inset-0">
        <span className="absolute left-[8%] top-[22%] h-[6px] w-[52%] rounded-full bg-white/90" />
        <span className="absolute left-[26%] top-0 h-full w-[6px] rounded-full bg-white/90" />
        <span className="absolute left-[12%] top-[64%] h-[6px] w-[74%] rotate-[-8deg] rounded-full bg-white/90" />
        <span className="absolute right-[10%] top-[10%] h-[38%] w-[26%] rounded-[8px] bg-[#dfe6dc]" />
        <span className="absolute bottom-[8%] left-[6%] h-[24%] w-[22%] rounded-[8px] bg-[#dfe6dc]" />
        <span className="absolute bottom-[12%] right-[22%] h-[18%] w-[18%] rounded-[8px] bg-[#e4e7ea]" />
      </div>
      <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-ink text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
        <PinIcon className="h-4 w-4" />
      </span>
    </div>
  );
}
