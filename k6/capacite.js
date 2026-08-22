// ─────────────────────────────────────────────────────────────────────────────
// Où casse le serveur ?
//
// On ne compte pas des visiteurs mais des requêtes par seconde : c'est la
// grandeur qui dimensionne un conteneur. Les paliers montent jusqu'à ce que le
// p95 dépasse la seconde et demie — le point où un client en 3G abandonne.
//
//   k6 run -e BASE=… k6/capacite.js
// ─────────────────────────────────────────────────────────────────────────────
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE || "http://localhost:3111";
const RAYONS = ["petits-dejeuners", "dejeuners", "jus-naturels", "formules-entreprise", "traiteur-evenements"];

export const options = {
  scenarios: {
    paliers: {
      executor: "ramping-arrival-rate",
      startRate: 20,
      timeUnit: "1s",
      preAllocatedVUs: 80,
      maxVUs: 400,
      stages: [
        { duration: "20s", target: 40 },
        { duration: "20s", target: 80 },
        { duration: "20s", target: 140 },
        { duration: "20s", target: 220 },
        { duration: "20s", target: 320 },
      ],
    },
  },
};

export default function () {
  // Deux tiers de pages de rayon, un tiers d'accueil : le mélange observé sur
  // un site de carte, où l'on arrive et où l'on clique aussitôt sur un menu.
  const url =
    Math.random() < 0.66
      ? `${BASE}/menus/${RAYONS[Math.floor(Math.random() * RAYONS.length)]}`
      : `${BASE}/`;
  const r = http.get(url);
  check(r, { "200": (x) => x.status === 200 });
}
