import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-deep">Erreur 404</p>
      <h1 className="mt-3 text-[30px] font-bold tracking-[-0.03em] lg:text-[42px]">
        Cette page n’est pas au menu
      </h1>
      <p className="mt-3 max-w-[420px] text-[15px] text-ink-soft">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex h-12 items-center rounded-[12px] bg-ink px-7 text-[14px] font-semibold text-white transition hover:bg-ink/85"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
