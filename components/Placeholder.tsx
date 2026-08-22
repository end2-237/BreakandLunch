import { ImageIcon } from "./icons";

type Props = {
  tone?: string;
  className?: string;
  label?: string;
  iconClassName?: string;
  rounded?: string;
};

export default function Placeholder({
  tone,
  className = "",
  label,
  iconClassName = "h-7 w-7",
  rounded = "rounded-[14px]",
}: Props) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rounded} ${className}`}
      style={{
        background: tone
          ? `linear-gradient(140deg, ${tone} 0%, rgba(255,255,255,0.55) 100%)`
          : undefined,
      }}
      aria-hidden={label ? undefined : true}
      role="img"
      aria-label={label}
    >
      {!tone && <span className="absolute inset-0 tile-placeholder" />}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.75),transparent_60%)]" />
      <ImageIcon className={`relative text-ink/25 ${iconClassName}`} />
    </div>
  );
}
