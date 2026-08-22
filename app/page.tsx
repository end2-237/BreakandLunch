import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryRow from "@/components/CategoryRow";
import MenuCard from "@/components/MenuCard";
import Visual from "@/components/Visual";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { loadCatalog } from "@/lib/catalog-server";
import { SITE } from "@/lib/site";
import {
  ArrowRight,
  ClockIcon,
  FriendsIcon,
  PinIcon,
  ScooterIcon,
  StarIcon,
  WeightIcon,
} from "@/components/icons";

// Le catalogue Camille est relu au plus toutes les 5 minutes.
export const revalidate = 300;

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
    text: "Commandes récurrentes, facturation unique, menus renouvelés.",
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
  { n: "01", title: "Choisissez vos plats", text: "Parcourez la carte du jour et composez votre commande." },
  { n: "02", title: "Commandez avant 9h", text: "Commandes à l'avance ou avant 9h pour le jour même." },
  { n: "03", title: "On livre gratuitement", text: "Livraison au bureau, à l'heure convenue, sans frais." },
];

export default async function HomePage() {
  const { catalog, error } = await loadCatalog();
  if (!catalog || catalog.categories.length === 0) {
    return <CatalogUnavailable message={error ?? undefined} />;
  }

  const [first, second] = catalog.categories;
  const heroes = [first, second].filter(Boolean);

  return (
    <div className="shell pb-4 pt-6 lg:pt-8">
      <div className="flex justify-center">
        <span className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
            <PinIcon className="h-4 w-4" />
          </span>
          {SITE.defaultAddress}
        </span>
      </div>

      <div className="mt-5 lg:mt-6">
        <SearchBar placeholder="Rechercher un plat, un jus, une formule" />
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6">
        {heroes.map((category) => (
          <Link key={category.slug} href={`/menus/${category.slug}`} className="group block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
              <Visual
                src={category.image}
                name={category.name}
                rounded="rounded-[16px]"
                className="h-full w-full"
                initialClassName="text-[64px]"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                {category.count} article{category.count > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mt-3 text-center text-[22px] font-bold tracking-[-0.02em] lg:text-[28px]">
              {category.name}
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
          {catalog.categories.slice(0, 4).map((category) => (
            <MenuCard key={category.slug} category={category} />
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
              Petits-déjeuners et déjeuners livrés à heure fixe dans vos bureaux à {SITE.city}.{" "}
              {SITE.delivery.orderRule}. {SITE.delivery.feeLabel}.
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
          </div>
          <Visual
            src={catalog.media.find((m) => m.kind === "banner")?.url ?? null}
            name={SITE.name}
            rounded="rounded-[16px]"
            className="aspect-[4/3] w-full"
            initialClassName="text-[64px]"
          />
        </div>
      </section>
    </div>
  );
}
