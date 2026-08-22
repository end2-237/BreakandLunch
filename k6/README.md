# Tests de charge et gabarit du conteneur

## Ce qui a été mesuré

Sur **un cœur, 512 Mo** — le gabarit visé en production, avec Camille simulé
hors du cœur testé pour ne pas fausser la mesure.

| Charge | p95 | Erreurs | Débit |
| --- | --- | --- | --- |
| 50 visiteurs simultanés | 23 ms | 0 % | 11 req/s |
| 100 visiteurs simultanés | 45 ms | 0 % | 23 req/s |
| 300 visiteurs simultanés | 90 ms | 0 % | 67 req/s |
| Saturation (paliers montants) | — | 0 % | **65 req/s** |

Empreinte mémoire observée en charge : **226 Mo**.

Lecture : le site tient **300 visiteurs en même temps** sans dégradation
perceptible, et sature vers 65 requêtes par seconde. À raison de trois à
quatre pages par visite, cela couvre largement **30 000 visites par jour**.
Le site ne sera pas le facteur limitant — la cuisine le sera avant lui.

## Gabarit Coolify

| Réglage | Valeur | Pourquoi |
| --- | --- | --- |
| CPU limit | `1` | Palier mesuré ; au-delà on double, on ne devine pas. |
| CPU reservation | `0.25` | Garde le site réactif quand Camille travaille sur la même machine. |
| Memory limit | `512M` | 226 Mo observés, marge x2 pour les pics de rendu. |
| Memory reservation | `256M` | Évite l'éviction par un voisin bruyant. |
| Health check | `GET /` | Le catalogue vient de Camille : cette page prouve les deux. |

Variables à cocher **« disponible au build »** : `CAMILLE_URL`,
`CAMILLE_PUBLIC_KEY`. Sans elles au build, les pages prérendues partent sur
l'écran « catalogue indisponible ».

## Rejouer les tests

```bash
k6 run -e BASE=https://le-site k6/parcours.js     # navigation, 50 visiteurs
k6 run -e BASE=https://le-site -e VUS=300 k6/parcours.js
k6 run -e BASE=https://le-site k6/capacite.js     # cherche le point de rupture
k6 run -e BASE=https://le-site -e RPS=2 k6/commande.js
```

`commande.js` écrit de vraies commandes dans Camille : à réserver à un agent
de test, jamais sur le compte du client.
