/**
 * Le visuel d'un article. Avec une photo, on montre la photo. Sans photo, on
 * ne montre PAS un faux plat : une pastille colorée dérivée du nom, stable
 * d'un rendu à l'autre, qui dit clairement qu'il manque une image.
 */
// Des tons dérivés du rose de la charte : une photo manquante ne doit pas
// introduire une couleur que la marque n'a pas.
const TONES = ["#f6dde3", "#f3e3e6", "#efd6dd", "#f7e7ea", "#eee7e9", "#f9e3e9", "#ece4e6", "#f4dfe4"];

function toneFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

export default function Visual({
  src,
  name,
  className = "",
  rounded = "rounded-[14px]",
  initialClassName = "text-[22px]",
}: {
  src?: string | null;
  name: string;
  className?: string;
  rounded?: string;
  initialClassName?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        className={`object-cover ${rounded} ${className}`}
      />
    );
  }

  const tone = toneFor(name);
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  // Le conteneur est positionné par l'appelant quand il le demande (bannière en
  // fond, par exemple) : lui imposer `relative` le ferait retomber dans le flux.
  const position = className.includes("absolute") ? "" : "relative";

  return (
    <div
      role="img"
      aria-label={`${name} — photo à venir`}
      className={`${position} flex items-center justify-center overflow-hidden ${rounded} ${className}`}
      style={{ background: `linear-gradient(140deg, ${tone} 0%, rgba(255,255,255,0.6) 100%)` }}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.7),transparent_60%)]" />
      <span className={`relative font-bold text-ink/30 ${initialClassName}`}>{initial}</span>
    </div>
  );
}
