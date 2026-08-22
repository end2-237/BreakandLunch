import { formatPrice } from "@/lib/site";

export default function PriceTag({
  price,
  oldPrice,
  size = "md",
}: {
  price: number;
  oldPrice?: number;
  size?: "sm" | "md";
}) {
  const text = size === "sm" ? "text-[12px]" : "text-[14px] lg:text-[15px]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`font-bold ${text} ${
          oldPrice ? "rounded-[6px] bg-brand-soft px-1.5 py-[2px]" : ""
        }`}
      >
        {formatPrice(price)}
      </span>
      {oldPrice && (
        <span className={`text-muted line-through ${size === "sm" ? "text-[11px]" : "text-[13px]"}`}>
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}
