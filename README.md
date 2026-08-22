# Break & Lunch by Jojoo — site vitrine & commande

Site Next.js (App Router) reproduisant la maquette de référence, décliné aux couleurs et aux
contenus de **Break & Lunch by Jojoo** — « Un vrai délice à chaque bouchée ».

> ⚠️ **Aucun backend.** Toutes les données (menus, plats, prix, commandes, comptes) sont des
> placeholders statiques dans `lib/data.ts`. Les visuels sont des blocs placeholder, aucune image
> n'est chargée. Le panier est conservé uniquement dans le `localStorage` du navigateur.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil : adresse, recherche, tuiles Petits-déjeuners / Déjeuners, catégories, menus, services, CTA entreprise |
| `/menus` | Liste des menus |
| `/menus/[slug]` | Page menu : bannière, filtres (catégories, prix, portion), recherche, tri, grille de plats, modale produit |
| `/offres` | Plats en promotion |
| `/nouveautes` | Derniers plats ajoutés |
| `/entreprises` | Formules entreprise |
| `/panier` | Informations de commande : livraison/retrait, carte, coordonnées, heure, paiement, commande groupée |
| `/commande` | Confirmation et suivi de commande |
| `/contact` | Coordonnées, réseaux sociaux, formulaire de devis (non connecté) |
| `/compte` | Espace client de démonstration |

## Structure

```
app/          routes App Router (server components) + globals.css
components/   UI (header, footer, cartes, filtres, modale, panier…)
lib/site.ts   informations de l'entreprise (contacts, réseaux, livraison)
lib/data.ts   catalogue placeholder (menus, plats, catégories, portions)
```

## Design

- Typo : Manrope (next/font)
- Couleurs : noir `#131313`, jaune `#ffd400`, gris de ligne `#e8e8e8`
- Responsive mobile-first : menu burger + logo centré, grille 2 colonnes, filtres en panneau,
  modale produit en feuille basse.

## Brancher un vrai backend plus tard

Remplacer les lectures de `lib/data.ts` (`MENUS`, `getMenu`, `allProducts`, `findProduct`) par des
appels API, et `components/CartProvider.tsx` par un panier serveur.
