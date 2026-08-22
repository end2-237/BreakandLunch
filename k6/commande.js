// ─────────────────────────────────────────────────────────────────────────────
// Montée en charge — passage de commande.
//
// Le chemin coûteux : il écrit dans Camille, déclenche un message WhatsApp et
// un bon de commande. Il est volontairement testé à faible cadence — c'est le
// rythme réel d'un service de restauration, et la limite de débit du site
// refuse de toute façon plus de six commandes par minute et par adresse.
//
//   k6 run -e BASE=… -e RPS=2 k6/commande.js
// ─────────────────────────────────────────────────────────────────────────────
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE || "http://localhost:3111";
const RPS = Number(__ENV.RPS || 2);
const PRODUIT = __ENV.PRODUIT || "dj-1";

export const options = {
  scenarios: {
    commandes: {
      executor: "constant-arrival-rate",
      rate: RPS,
      timeUnit: "1s",
      duration: "60s",
      preAllocatedVUs: Math.max(10, RPS * 5),
      maxVUs: Math.max(20, RPS * 10),
    },
  },
  thresholds: {
    // Une commande qui dépasse trois secondes, le client la repasse et on la
    // reçoit deux fois.
    http_req_duration: ["p(95)<3000"],
  },
};

export default function () {
  const suffixe = String(Math.floor(Math.random() * 900000) + 100000);
  const r = http.post(
    `${BASE}/api/commandes`,
    JSON.stringify({
      items: [{ id: PRODUIT, qty: 1 + Math.floor(Math.random() * 3) }],
      customer: { name: "Client test", phone: `67${suffixe}0`, company: "Charge" },
      delivery: { address: "Akwa, Douala", details: "Bloc B, Étage 2", label: "Livraison", lat: 4.05, lng: 9.7 },
      scheduledAt: null,
      mode: "livraison",
      payment: "À la livraison (espèces)",
    }),
    { headers: { "Content-Type": "application/json" }, tags: { page: "commande" } },
  );

  // 429 attendu : c'est la limite de débit qui fait son travail, pas une panne.
  check(r, {
    "commande acceptée ou throttlée": (x) => x.status === 200 || x.status === 429,
  });
}
