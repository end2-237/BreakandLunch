// ─────────────────────────────────────────────────────────────────────────────
// Montée en charge — parcours de navigation.
//
// Ce que fait vraiment un client : il arrive sur l'accueil, ouvre un rayon,
// regarde un deuxième rayon, cherche un plat. Neuf visiteurs sur dix s'arrêtent
// là ; c'est donc ce parcours qui dimensionne le serveur.
//
//   k6 run k6/parcours.js                        (palier par défaut)
//   k6 run -e BASE=https://… -e VUS=100 k6/parcours.js
// ─────────────────────────────────────────────────────────────────────────────
import http from "k6/http";
import { check, sleep, group } from "k6";
import { Trend } from "k6/metrics";

const BASE = __ENV.BASE || "http://localhost:3111";
const PALIER = Number(__ENV.VUS || 50);

const accueil = new Trend("page_accueil", true);
const rayon = new Trend("page_rayon", true);

export const options = {
  scenarios: {
    navigation: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: Math.ceil(PALIER / 2) },
        { duration: "40s", target: PALIER },
        { duration: "30s", target: PALIER },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "10s",
    },
  },
  thresholds: {
    // Au-delà d'une seconde et demie sur une page de carte, un client de
    // téléphone en 3G abandonne.
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.01"],
  },
};

const RAYONS = ["petits-dejeuners", "dejeuners", "jus-naturels", "formules-entreprise", "traiteur-evenements"];

export default function () {
  group("accueil", () => {
    const r = http.get(`${BASE}/`, { tags: { page: "accueil" } });
    accueil.add(r.timings.duration);
    check(r, { "accueil 200": (x) => x.status === 200 });
  });
  sleep(Math.random() * 3 + 1);

  group("rayon", () => {
    const slug = RAYONS[Math.floor(Math.random() * RAYONS.length)];
    const r = http.get(`${BASE}/menus/${slug}`, { tags: { page: "rayon" } });
    rayon.add(r.timings.duration);
    check(r, { "rayon 200": (x) => x.status === 200 });
  });
  sleep(Math.random() * 4 + 2);

  group("carte", () => {
    const r = http.get(`${BASE}/menus`, { tags: { page: "carte" } });
    check(r, { "carte 200": (x) => x.status === 200 });
  });
  sleep(Math.random() * 3 + 1);
}
