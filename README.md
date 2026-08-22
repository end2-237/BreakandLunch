# Break & Lunch by Jojoo — site de commande

Site Next.js (App Router) branché sur **Camille** : le catalogue, les commandes,
la notification WhatsApp et les bons de commande viennent de l'API Camille.
Le site n'a **aucune base de données** et **aucun produit en dur** — si Camille
ne répond pas, les pages le disent et renvoient vers WhatsApp et le téléphone.

## Démarrer

```bash
cp .env.local.example .env.local   # puis colle tes clés Camille
npm install
npm run dev                        # http://localhost:3000
```

| Variable | Rôle |
| --- | --- |
| `CAMILLE_URL` | Instance Camille (défaut : `https://camille.vps.buyticle.com`) |
| `CAMILLE_PUBLIC_KEY` | `cam_pk_…` — lecture du catalogue |
| `CAMILLE_SECRET_KEY` | `cam_sk_…` — commandes et fiches clients, **serveur uniquement** |
| `CAMILLE_WEBHOOK_SECRET` | Même valeur que `agents.webhook_secret` côté Camille |

Les clés se génèrent dans Camille : tableau de bord de l'agent → **Intégrations**.

## Mise en service côté Camille

1. Créer l'agent « Break & Lunch by Jojoo » dans l'application Camille.
2. Appliquer `migration_site_integration.sql` (dépôt Camille) sur la base.
3. Jouer les fichiers de `seed/camille/` en remplaçant l'identifiant d'agent :
   - `01-profil.sql` — coordonnées, livraison gratuite, bon de commande à l'entête B&L, webhook ;
   - `02-catalogue.sql` — les 40 articles, en 5 rayons ;
   - `03-images.sql` — les photos, à coller au fur et à mesure.
4. Générer les deux clés API, les copier dans `.env.local`.
5. Renseigner `webhook_url` (`https://<le-site>/api/camille/webhook`) et
   `webhook_secret` sur l'agent.

## Ce qui vient de Camille

| Le site affiche | Source |
| --- | --- |
| Rayons, plats, prix, promotions, stock | `GET /api/public/v1/catalog` |
| Poids, calories, ingrédients, allergènes | tags `clé:valeur` de l'article |
| Vignette d'un rayon | média `kind=category`, sinon photo du premier article |
| Envoi d'une commande | `POST /api/public/v1/orders` (clé secrète, côté serveur) |
| Suivi de commande | `GET /api/public/v1/orders/{ref}?phone=…` + webhook |
| « Mes commandes » | `GET /api/public/v1/customers/{phone}` |
| Adresse, position et zones du marchand | `merchant` du catalogue (`agents.latitude/longitude`, `delivery_zones`) |

Les prix ne sont jamais envoyés par le navigateur : Camille les relit dans son
catalogue à partir des identifiants produits.

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil : recherche, rayons, sélection, services |
| `/menus`, `/menus/[slug]` | La carte et chaque rayon (filtres, tri, fiche plat) |
| `/offres`, `/nouveautes` | Articles en promotion, articles mis en avant |
| `/entreprises` | Formules entreprise |
| `/panier` | Coordonnées, adresse, créneau, paiement, envoi de la commande |
| `/commande/[ref]?tel=` | Suivi en 4 étapes, rafraîchi automatiquement |
| `/compte` | « Mes commandes » par numéro WhatsApp |
| `/contact` | Coordonnées et demande de devis |

## Localisation du client

La pastille en tête d'accueil demande son adresse au visiteur, et la retient
(navigateur uniquement). Trois façons de la donner, toutes sans compte ni clé
d'API :

- **rechercher** un quartier ou une rue — [Photon](https://photon.komoot.io) (OpenStreetMap), biaisé vers Douala ;
- **partager sa position** — géolocalisation du navigateur, puis adresse détaillée via [Nominatim](https://nominatim.openstreetmap.org) ;
- **poser le repère** sur une carte Leaflet à tuiles OpenStreetMap.

S'y ajoutent le bloc, l'étage, le bureau et un repère pour le livreur : ce que
la carte ne saura jamais. L'adresse et la position partent avec la commande —
Camille en tire le libellé du lieu et le lien de carte envoyé au livreur.

Les deux services OSM sont appelés **depuis le serveur** (`/api/geo/search`,
`/api/geo/reverse`) : leurs conditions exigent un User-Agent identifiable, et
les réponses sont mises en cache (1 h pour la recherche, 24 h pour l'inverse).

## Paiement

Le paiement en ligne n'est pas branché : le choix du client (Orange Money, MTN
MoMo, carte, espèces) part avec la commande, et B&L envoie les instructions sur
WhatsApp. Le tunnel est prêt à recevoir un encaissement le jour venu.

## Structure

```
app/            routes (pages serveur + /api/commandes, /api/client, /api/camille/webhook)
components/     UI (carte, fiche plat, filtres, panier, suivi)
lib/camille.ts  client de l'API Camille — seule source du catalogue
lib/site.ts     informations de l'entreprise
seed/camille/   profil et catalogue à importer dans Camille
```
