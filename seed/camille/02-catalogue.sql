-- ─────────────────────────────────────────────────────────────────────────────
-- Break & Lunch by Jojoo — catalogue à importer dans Camille
--
-- 40 articles répartis en 5 rayons, tels qu'ils figurent sur le site.
--
-- L'identifiant d'agent ci-dessous est celui de Break & Lunch by Jojoo.
--
-- Les identifiants produits sont FIXES : relancer ce fichier met à jour les
-- articles au lieu d'en créer des doublons. C'est aussi ce qui permet au
-- fichier des images (03-images.sql) de viser le bon article.
--
-- image_url reste vide : les photos se posent avec 03-images.sql.
--
-- Convention retenue pour tags, faute de champs dédiés dans camille.products :
--   rayon:… · poids:… · kcal:… · ingrédients:… · allergènes:…
-- Le site de B&L lit ces préfixes pour la fiche plat. Un champ `details jsonb`
-- sur les produits serait plus propre — c'est le prochain ajout à faire côté
-- Camille si la formule vous convient.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('aa6d3df4-5000-4c51-8518-40dbaa91f40e', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Beignets Haricot Bouillie',
   'Le trio camerounais complet : beignets moelleux, haricot mijoté et bouillie de maïs.',
   2500, 2800, 'XAF', 'Petits-déjeuners', '["rayon:Beignets", "poids:520 g", "kcal:780", "ingrédients:Farine de blé, haricot rouge, maïs, lait, huile végétale, sucre", "allergènes:Gluten, lait"]'::jsonb,
   NULL, 1, '', true, 1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('cc0a1768-416b-41fd-883a-e482b8cbc446', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Bouillie de maïs au lait',
   'Bouillie onctueuse de maïs blanc, lait concentré et une pointe de vanille.',
   1200, NULL, 'XAF', 'Petits-déjeuners', '["rayon:Bouillies", "poids:400 g", "kcal:320", "ingrédients:Maïs blanc, lait concentré, vanille, sucre de canne", "allergènes:Lait"]'::jsonb,
   NULL, 1, '', true, 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('bf115af3-e294-4e69-8b29-cbde6e308434', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Omelette spéciale Jojoo',
   'Trois œufs, légumes frais, fromage et pain frais de la boulangerie du quartier.',
   2800, 3000, 'XAF', 'Petits-déjeuners', '["rayon:Œufs", "poids:380 g", "kcal:610", "ingrédients:Œufs, tomate, oignon, poivron, fromage, pain", "allergènes:Œufs, lait, gluten"]'::jsonb,
   NULL, 1, '', true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('bf6b6f4a-c5e4-48be-8011-e1e4e840d853', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Sandwich poulet avocat',
   'Pain complet, émincé de poulet mariné, avocat, crudités et sauce maison.',
   3000, NULL, 'XAF', 'Petits-déjeuners', '["rayon:Sandwichs", "poids:320 g", "kcal:540", "ingrédients:Pain complet, poulet, avocat, salade, tomate, sauce maison", "allergènes:Gluten, œufs, moutarde"]'::jsonb,
   NULL, 1, '', true, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('dbf68df1-7bb1-4b7d-8fd3-be6844b0cf9e', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pain perdu caramélisé',
   'Tranches dorées de brioche, caramel léger et éclats de cacahuètes.',
   2000, 2300, 'XAF', 'Petits-déjeuners', '["rayon:Viennoiseries", "poids:260 g", "kcal:480", "ingrédients:Brioche, œufs, lait, sucre, cacahuètes", "allergènes:Gluten, œufs, lait, arachides"]'::jsonb,
   NULL, 1, '', true, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('ce1db76f-b137-4b0a-865c-a9c28c150cbd', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Salade de fruits frais',
   'Ananas, mangue, papaye et pastèque coupés le matin même.',
   1800, NULL, 'XAF', 'Petits-déjeuners', '["rayon:Fruits", "poids:350 g", "kcal:210", "ingrédients:Ananas, mangue, papaye, pastèque, citron vert", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('e032e8c5-3297-487a-8e5f-3ef2cb379e71', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Yaourt maison granola',
   'Yaourt nature préparé maison, granola croustillant et miel d''Adamaoua.',
   2200, NULL, 'XAF', 'Petits-déjeuners', '["rayon:Fruits", "poids:300 g", "kcal:390", "ingrédients:Yaourt, avoine, miel, amandes, raisins secs", "allergènes:Lait, fruits à coque, gluten"]'::jsonb,
   NULL, 1, '', true, 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('d1d4d441-145b-4522-8693-8411d5cbabda', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Café ou thé + croissant',
   'Café filtre ou thé au choix, accompagné d''un croissant pur beurre.',
   1500, 1700, 'XAF', 'Petits-déjeuners', '["rayon:Boissons chaudes", "poids:280 g", "kcal:350", "ingrédients:Café arabica ou thé, lait, sucre, croissant", "allergènes:Gluten, lait"]'::jsonb,
   NULL, 1, '', true, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('323b34de-0322-4a6a-8ba6-8cebe073afe4', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Poulet DG',
   'Poulet mijoté, plantains mûrs sautés et légumes croquants, la signature de la maison.',
   5000, 5500, 'XAF', 'Déjeuners', '["rayon:Plats locaux", "poids:650 g", "kcal:890", "ingrédients:Poulet, plantain, carotte, haricot vert, poivron, épices", "allergènes:Céleri"]'::jsonb,
   NULL, 1, '', true, 9)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('658e7e82-f644-47b3-8ae7-16cf67bd7604', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Ndolè aux crevettes',
   'Ndolè traditionnel aux arachides et crevettes fraîches, servi avec plantains.',
   4500, NULL, 'XAF', 'Déjeuners', '["rayon:Plats locaux", "poids:600 g", "kcal:820", "ingrédients:Feuilles de ndolè, arachides, crevettes, plantain, épices", "allergènes:Arachides, crustacés"]'::jsonb,
   NULL, 1, '', true, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('8aa66cbe-b70d-4d6d-884b-c21a301908e1', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Riz sauté au poulet',
   'Riz parfumé sauté au wok, dés de poulet, légumes et sauce soja légère.',
   3500, 3800, 'XAF', 'Déjeuners', '["rayon:Riz & pâtes", "poids:550 g", "kcal:720", "ingrédients:Riz, poulet, carotte, petits pois, sauce soja, ail", "allergènes:Soja, gluten"]'::jsonb,
   NULL, 1, '', true, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('2f46c68c-832f-49b1-859b-b4160d28f086', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Poisson braisé plantain',
   'Maquereau braisé aux épices, plantains frits et sauce piment maison.',
   5500, NULL, 'XAF', 'Déjeuners', '["rayon:Grillades", "poids:620 g", "kcal:760", "ingrédients:Maquereau, plantain, oignon, piment, épices, citron", "allergènes:Poisson"]'::jsonb,
   NULL, 1, '', true, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('a04abc55-ee34-4bdb-8ee7-e3f7a29c7da9', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Eru & water fufu',
   'Eru finement coupé, huile de palme rouge et water fufu moelleux.',
   4000, NULL, 'XAF', 'Déjeuners', '["rayon:Plats locaux", "poids:580 g", "kcal:700", "ingrédients:Feuilles d''eru, waterleaf, huile de palme, viande, poisson fumé", "allergènes:Poisson, crustacés"]'::jsonb,
   NULL, 1, '', true, 13)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('fff65234-f6a2-4a11-8a38-6d3b50f943db', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Spaghetti sauce bolognaise',
   'Pâtes al dente, sauce tomate mijotée longuement et viande hachée.',
   3200, 3500, 'XAF', 'Déjeuners', '["rayon:Riz & pâtes", "poids:500 g", "kcal:680", "ingrédients:Spaghetti, tomate, bœuf haché, oignon, ail, basilic", "allergènes:Gluten, céleri"]'::jsonb,
   NULL, 1, '', true, 14)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('6dcbe502-d52a-49b6-8594-b0eb9ba93129', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Salade César poulet',
   'Salade croquante, poulet grillé, croûtons dorés et sauce césar maison.',
   3800, NULL, 'XAF', 'Déjeuners', '["rayon:Salades", "poids:420 g", "kcal:460", "ingrédients:Laitue, poulet, parmesan, croûtons, œuf, sauce césar", "allergènes:Gluten, œufs, lait, poisson"]'::jsonb,
   NULL, 1, '', true, 15)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('c8e71bf6-df8e-4054-8589-661a6228c7a5', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Koki de maïs végétarien',
   'Koki de maïs cuit à la feuille, 100 % végétarien, servi avec plantain mûr.',
   3000, NULL, 'XAF', 'Déjeuners', '["rayon:Végétarien", "poids:480 g", "kcal:540", "ingrédients:Maïs frais, huile de palme, plantain, épices", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 16)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('1adcb05a-0031-41c6-82a6-3ac0c39182e5', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Jus de gingembre',
   'Gingembre frais pressé, citron et une pointe de miel, servi bien frais.',
   1500, 1800, 'XAF', 'Jus naturels', '["rayon:Détox", "poids:500 g", "kcal:180", "ingrédients:Gingembre, citron, miel, eau filtrée", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 17)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('05138771-7de5-432b-85e3-34050be08a31', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Foléré (bissap) menthe',
   'Infusion d''hibiscus glacée, menthe fraîche et zeste d''ananas.',
   1200, NULL, 'XAF', 'Jus naturels', '["rayon:Infusions", "poids:500 g", "kcal:150", "ingrédients:Hibiscus, menthe, ananas, sucre de canne", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 18)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('bb366581-5d3a-40b5-8fe7-65a9fcaead47', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Jus d''ananas frais',
   'Ananas pressé à froid, aucune eau ajoutée, sucré naturellement.',
   1500, NULL, 'XAF', 'Jus naturels', '["rayon:Tropicaux", "poids:500 g", "kcal:210", "ingrédients:Ananas frais", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 19)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('c9cea01a-e73d-475f-8105-68fe94357d53', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Jus de mangue',
   'Mangues mûres du pays mixées, texture veloutée et parfum intense.',
   1800, 2000, 'XAF', 'Jus naturels', '["rayon:Tropicaux", "poids:500 g", "kcal:240", "ingrédients:Mangue, citron vert, eau filtrée", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 20)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('9c3c4629-0d9c-4ddb-806c-5904f079bb0a', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Cocktail tropical',
   'Ananas, mangue, orange et fruit de la passion dans une seule bouteille.',
   2000, NULL, 'XAF', 'Jus naturels', '["rayon:Tropicaux", "poids:500 g", "kcal:260", "ingrédients:Ananas, mangue, orange, fruit de la passion", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 21)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('9ed661fd-b92c-46dd-8be9-74c8fac435be', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Citron gingembre sans sucre',
   'Version sans sucre ajouté, idéale pour accompagner un déjeuner léger.',
   1500, NULL, 'XAF', 'Jus naturels', '["rayon:Sans sucre", "poids:500 g", "kcal:90", "ingrédients:Citron, gingembre, eau filtrée", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 22)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('493dc086-06aa-4331-88a7-47e1f9ea7e51', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Smoothie banane avocat',
   'Banane, avocat et lait, un smoothie crémeux et rassasiant.',
   2200, NULL, 'XAF', 'Jus naturels', '["rayon:Smoothies", "poids:450 g", "kcal:380", "ingrédients:Banane, avocat, lait, miel", "allergènes:Lait"]'::jsonb,
   NULL, 1, '', true, 23)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('dddf4e2f-5774-449a-8b15-917da6cd24cc', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pack 1 litre au choix',
   'Un litre du parfum de votre choix, parfait pour partager au bureau.',
   3000, 3500, 'XAF', 'Jus naturels', '["rayon:Format litre", "poids:1000 g", "kcal:420", "ingrédients:Selon le parfum choisi", "allergènes:Selon le parfum choisi"]'::jsonb,
   NULL, 1, '', true, 24)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('97bf0885-db55-4cd8-8a5a-37c0acd9d96e', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Formule Break Solo',
   'Un petit-déjeuner complet + une boisson chaude, livré chaque matin avant 8h.',
   3000, 3500, 'XAF', 'Formules entreprise', '["rayon:Formules solo", "poids:500 g", "kcal:620", "ingrédients:Plat du jour, boisson chaude, fruit de saison", "allergènes:Variable selon le menu du jour"]'::jsonb,
   NULL, 1, '', true, 25)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('9b33ebe0-6990-48e7-8fb8-498679dc5495', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Formule Lunch Solo',
   'Un plat chaud du jour, un jus naturel 50 cl et un dessert.',
   5000, NULL, 'XAF', 'Formules entreprise', '["rayon:Formules solo", "poids:750 g", "kcal:950", "ingrédients:Plat du jour, jus naturel, dessert", "allergènes:Variable selon le menu du jour"]'::jsonb,
   NULL, 1, '', true, 26)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('0a2c58d0-b4c2-4f6b-8619-41f7c78ba058', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Formule Duo Journée',
   'Petit-déjeuner + déjeuner pour une personne, deux livraisons dans la journée.',
   7500, 8000, 'XAF', 'Formules entreprise', '["rayon:Formules solo", "poids:1200 g", "kcal:1560", "ingrédients:Petit-déjeuner complet, plat chaud, jus naturel", "allergènes:Variable selon le menu du jour"]'::jsonb,
   NULL, 1, '', true, 27)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('6551a06d-847b-44cd-8b37-19b845738685', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pack Équipe 10 personnes',
   'Dix déjeuners au choix, livrés ensemble, avec couverts et serviettes.',
   45000, 50000, 'XAF', 'Formules entreprise', '["rayon:Formules équipe", "poids:6500 g", "kcal:8900", "ingrédients:10 plats au choix, 10 jus naturels", "allergènes:Variable selon les plats choisis"]'::jsonb,
   NULL, 1, '', true, 28)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('73c24bb5-6c43-4d9c-853b-bc8faa0178d6', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pack Réunion',
   'Plateau de canapés, mini-viennoiseries et jus, pour vos réunions clients.',
   30000, NULL, 'XAF', 'Formules entreprise', '["rayon:Réunions", "poids:4000 g", "kcal:5200", "ingrédients:Canapés variés, viennoiseries, jus naturels", "allergènes:Gluten, œufs, lait, poisson"]'::jsonb,
   NULL, 1, '', true, 29)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('4d8333d6-d044-4709-8f73-9a787376a0f2', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pause café entreprise',
   'Café, thé, jus et snacks sucrés-salés installés dans votre salle de pause.',
   25000, NULL, 'XAF', 'Formules entreprise', '["rayon:Pauses café", "poids:3500 g", "kcal:4100", "ingrédients:Café, thé, jus, snacks sucrés et salés", "allergènes:Gluten, lait, arachides"]'::jsonb,
   NULL, 1, '', true, 30)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('654e43e0-8084-45ae-824d-99f6f95d2150', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Abonnement mensuel 20 jours',
   'Un déjeuner par jour ouvré pendant un mois, menu différent chaque jour.',
   90000, 100000, 'XAF', 'Formules entreprise', '["rayon:Abonnements", "poids:11000 g", "kcal:17000", "ingrédients:20 déjeuners complets au choix", "allergènes:Variable selon le menu du jour"]'::jsonb,
   NULL, 1, '', true, 31)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('8fd79ec3-534f-4b06-8ceb-1ec104f2be43', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Formule végétarienne',
   'Menu 100 % végétarien, décliné chaque jour selon le marché.',
   4500, NULL, 'XAF', 'Formules entreprise', '["rayon:Végétarien", "poids:600 g", "kcal:640", "ingrédients:Légumes de saison, féculents, jus naturel", "allergènes:Variable selon le menu du jour"]'::jsonb,
   NULL, 1, '', true, 32)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('f78ab446-f05d-42a8-8d6e-62c6f43ee2b1', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Buffet cocktail 20 personnes',
   'Assortiment de canapés, brochettes et mini-plats chauds pour vingt invités.',
   120000, 135000, 'XAF', 'Traiteur & événements', '["rayon:Cocktails", "poids:9000 g", "kcal:14000", "ingrédients:Canapés, brochettes, mini-plats chauds, sauces maison", "allergènes:Gluten, œufs, lait, poisson, arachides"]'::jsonb,
   NULL, 1, '', true, 33)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('821e974e-bef1-4f54-80b0-70b1207af7bd', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Plateau de canapés (50 pièces)',
   'Cinquante bouchées froides variées, dressées sur plateau prêt à servir.',
   35000, NULL, 'XAF', 'Traiteur & événements', '["rayon:Cocktails", "poids:2500 g", "kcal:4200", "ingrédients:Pain de mie, saumon, poulet, fromage, légumes", "allergènes:Gluten, poisson, lait"]'::jsonb,
   NULL, 1, '', true, 34)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('5ff04f54-1641-484a-84b8-2ccb5d4e6a09', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Brochettes party (50 pièces)',
   'Brochettes de bœuf et de poulet marinées, grillées sur place si vous le souhaitez.',
   50000, 55000, 'XAF', 'Traiteur & événements', '["rayon:Brochettes", "poids:4000 g", "kcal:6800", "ingrédients:Bœuf, poulet, poivron, oignon, épices maison", "allergènes:Moutarde, soja"]'::jsonb,
   NULL, 1, '', true, 35)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('842d2dd6-0cc0-4dab-81ce-68b977155ae5', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Buffet mariage 100 personnes',
   'Buffet complet, entrées, plats locaux et internationaux, desserts et service.',
   750000, NULL, 'XAF', 'Traiteur & événements', '["rayon:Mariages", "poids:45000 g", "kcal:68000", "ingrédients:Menu personnalisé avec les mariés", "allergènes:Variable selon le menu retenu"]'::jsonb,
   NULL, 1, '', true, 36)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('3cc99699-b0b7-46a7-8a0d-2790a9f5423f', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Coffee break séminaire',
   'Deux pauses café dans la journée, viennoiseries, fruits et jus naturels.',
   60000, 68000, 'XAF', 'Traiteur & événements', '["rayon:Séminaires", "poids:8000 g", "kcal:9600", "ingrédients:Café, thé, viennoiseries, fruits, jus naturels", "allergènes:Gluten, lait, œufs"]'::jsonb,
   NULL, 1, '', true, 37)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('56a0e57c-8baf-4124-8d82-edd4155b886b', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Pack anniversaire enfant',
   'Mini-sandwichs, jus, gâteau personnalisé et petites douceurs.',
   85000, NULL, 'XAF', 'Traiteur & événements', '["rayon:Desserts", "poids:7000 g", "kcal:11000", "ingrédients:Sandwichs, gâteau, jus, bonbons", "allergènes:Gluten, œufs, lait, arachides"]'::jsonb,
   NULL, 1, '', true, 38)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('e07a4eaf-2ea5-4f88-873d-308494d4f218', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Fontaine à jus (10 L)',
   'Dix litres de jus naturel au parfum de votre choix, fontaine incluse.',
   45000, NULL, 'XAF', 'Traiteur & événements', '["rayon:Boissons", "poids:10000 g", "kcal:4200", "ingrédients:Jus naturels au choix", "allergènes:Aucun"]'::jsonb,
   NULL, 1, '', true, 39)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();

INSERT INTO camille.products
  (id, agent_id, name, description, price, price_max, currency, category, tags,
   stock, min_order, image_url, active, sort_order)
VALUES
  ('b0fe109d-e7f4-4935-8145-159b47c4830b', 'e021c86b-a682-4205-afd1-862e4904dafc', 'Buffet dessert 30 personnes',
   'Verrines, salade de fruits, mini-gâteaux et beignets sucrés.',
   90000, 98000, 'XAF', 'Traiteur & événements', '["rayon:Desserts", "poids:6000 g", "kcal:9800", "ingrédients:Fruits, crème, farine, œufs, chocolat", "allergènes:Gluten, œufs, lait, fruits à coque"]'::jsonb,
   NULL, 1, '', true, 40)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  price_max = EXCLUDED.price_max, category = EXCLUDED.category, tags = EXCLUDED.tags,
  min_order = EXCLUDED.min_order, sort_order = EXCLUDED.sort_order,
  active = true, updated_at = NOW();


-- Réindexation sémantique : sans ça, l'agent WhatsApp ne « voit » pas les
-- nouveaux articles tant que le prochain passage d'indexation n'a pas eu lieu.
UPDATE camille.products SET needs_reindex = true WHERE agent_id = 'e021c86b-a682-4205-afd1-862e4904dafc';

COMMIT;

-- Vérification :
--   SELECT category, COUNT(*) FROM camille.products
--    WHERE agent_id = 'e021c86b-a682-4205-afd1-862e4904dafc' GROUP BY category ORDER BY category;
