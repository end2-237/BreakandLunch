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
  /** Pose le logo sur sa pastille noire : la seule façon d'utiliser le logo
      rose sur une surface claire, puisqu'il porte son texte en blanc. */
  pastille = false,
}: {
  className?: string;
  variant?: "noir" | "rose" | "blanc";
  href?: string;
  height?: number;
  pastille?: boolean;
}) {
  const src = `/marque/logo-break-and-lunch-${variant}.png`;
  const image = (
    <Image
      src={src}
      alt={SITE.name}
      width={Math.round((height * 550) / 600)}
      height={height}
      priority
      style={{ height, width: "auto" }}
    />
  );

  if (pastille) {
    // La marge autour du logo vaut le quart de sa hauteur : c'est ce que la
    // charte demande — au moins la hauteur de la toque de libre autour.
    const marge = Math.round(height * 0.24);
    return (
      <Link
        href={href}
        aria-label={`${SITE.name} — accueil`}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-ink ${className}`}
        style={{ padding: marge }}
      >
        {image}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — accueil`}
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      {image}
    </Link>
  );
}
