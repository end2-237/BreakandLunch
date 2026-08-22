import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryRow from "@/components/CategoryRow";
import MenuCard from "@/components/MenuCard";
import Placeholder from "@/components/Placeholder";
import { HERO_TILES, MENUS } from "@/lib/data";
import { SITE } from "@/lib/site";
import {
  ArrowRight,
  ClockIcon,
  FriendsIcon,
  ImageIcon,
  PinIcon,
  ScooterIcon,
  StarIcon,
  WeightIcon,
} from "@/components/icons";

const SERVICES = [
  {
    icon: ClockIcon,
    title: "Petits-déjeuners en entreprise",
    text: "Bouillies, beignets, omelettes et viennoiseries livrés au bureau dès 7h du matin.",
  },
  {
    icon: WeightIcon,
    title: "Repas de midi en entreprise",
    text: "Des plats chauds cuisinés le jour même et livrés à l'heure de votre pause.",
  },
  {
    icon: FriendsIcon,
    title: "Formules adaptées aux entreprises",
    text: "Abonnements journaliers ou mensuels, facturation unique, menus renouvelés.",
  },
  {
    icon: StarIcon,
    title: "Service traiteur pour événements",
    text: "Mariages, séminaires et anniversaires : buffets, cocktails et service sur place.",
  },
  {
    icon: PinIcon,
    title: "Livraison de jus naturels",
    text: "Jus pressés du jour, sans conservateur, en bouteille de 50 cl ou en format litre.",
  },
  {
    icon: ScooterIcon,
    title: "Livraison gratuite",
    text: "Aucun frais de livraison sur Douala, quelle que soit la taille de la commande.",
  },
];

const STEPS = [
  { n: "01", title: "Choisissez vos plats", text: "Parcourez les menus et composez votre commande." },
  { n: "02", title: "Commandez avant 9h", text: "Commandes à l'avance ou avant 9h pour le jour même." },
  { n: "03", title: "On livre gratuitement", text: "Livraison au bureau, à l'heure convenue, sans frais." },
];

export default function HomePage() {
  return (
    <div className="shell pb-4 pt-6 lg:pt-8">
      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:border-ink/20"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
            <PinIcon className="h-4 w-4" />
          </span>
          {SITE.defaultAddress}
        </button>
      </div>

      <div className="mt-5 lg:mt-6">
        <SearchBar placeholder="Rechercher un plat, un menu, une formule" />
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6">
        {HERO_TILES.map((tile) => (
          <Link key={tile.label} href={tile.href} className="group block">
            <div
              className={`relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-gradient-to-br ${tile.tone} transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]`}
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.55),transparent_55%)]" />
              <span className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-9 w-9 text-ink/20" />
              </span>
              <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                {tile.note}
              </span>
            </div>
            <p className="mt-3 text-center text-[22px] font-bold tracking-[-0.02em] lg:text-[28px]">
              {tile.label}
            </p>
          </Link>
        ))}
      </section>

      <CategoryRow />

      <section className="mt-12 lg:mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">
            De bons petits plats près de vous
          </h2>
          <Link
            href="/menus"
            className="shrink-0 text-[13px] font-medium text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
          >
            Voir tout
          </Link>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-6">
          {MENUS.slice(0, 4).map((menu) => (
            <MenuCard key={menu.slug} menu={menu} />
          ))}
        </div>
      </section>

      <section className="mt-14 lg:mt-20">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">Nos services</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="rounded-[16px] border border-line p-5 transition hover:border-ink/20 hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
                <service.icon className="h-[18px] w-[18px] text-ink" />
              </div>
              <h3 className="mt-4 text-[16px] font-bold">{service.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 lg:mt-20">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] lg:text-[30px]">Comment ça marche</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:mt-6">
          {STEPS.map((step) => (
            <article key={step.n} className="rounded-[16px] bg-tile p-5">
              <span className="text-[13px] font-bold text-brand-deep">{step.n}</span>
              <h3 className="mt-2 text-[16px] font-bold">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[20px] bg-ink lg:mt-20">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              Formules entreprise
            </p>
            <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em] text-white lg:text-[36px]">
              Nourrissez vos équipes chaque jour, sans y penser.
            </h2>
            <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-white/70">
              Petits-déjeuners et déjeuners livrés à heure fixe dans vos bureaux à {SITE.city}.
              {" "}{SITE.delivery.orderRule}. {SITE.delivery.feeLabel}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/entreprises"
                className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-brand px-6 text-[15px] font-semibold text-ink transition hover:bg-brand-deep"
              >
                Découvrir les formules
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-[12px] border border-white/25 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                Demander un devis
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/60">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" /> Livraison à heure fixe
              </span>
              <span className="flex items-center gap-1.5">
                <ScooterIcon className="h-4 w-4" /> {SITE.delivery.feeLabel}
              </span>
            </div>
          </div>
          <Placeholder
            tone="#ffd400"
            rounded="rounded-[16px]"
            className="aspect-[4/3] w-full"
            iconClassName="h-10 w-10"
          />
        </div>
      </section>
    </div>
  );
}
