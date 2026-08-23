import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Le logo officiel de la charte, servi tel quel — jamais redessiné, jamais
 * recoloré. Noir sur fond clair, rose sur fond noir : les deux usages que la
 * charte autorise.
 */
export default function Logo({
  className = "",
  variant = "noir",
  href = "/",
  height = 40,
}: {
  className?: string;
  variant?: "noir" | "rose" | "blanc";
  href?: string;
  height?: number;
}) {
  const src = `/marque/logo-break-and-lunch-${variant}.png`;
  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — accueil`}
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src={src}
        alt={SITE.name}
        width={Math.round((height * 550) / 600)}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
