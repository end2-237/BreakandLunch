-- ─────────────────────────────────────────────────────────────────────────────
-- Break & Lunch by Jojoo — photos des articles
--
-- Colle l'URL de chaque photo entre les guillemets, puis lance le fichier.
-- Les lignes laissées vides ne changent rien (NULLIF les ignore) : tu peux
-- remplir en plusieurs fois.
--
-- Formats : JPEG ou WebP, 1000×1000 px au minimum, cadrage carré — c'est ce
-- que le site et WhatsApp affichent. Héberge-les où tu veux, l'URL doit juste
-- être publique et en HTTPS.
--
-- N'oublie pas de remplacer l'identifiant d'agent ici aussi.
-- ─────────────────────────────────────────────────────────────────────────────

\set agent_id '11111111-2222-4333-8444-555555555555'

BEGIN;


-- ── Petits-déjeuners ────────────────────────────────────────────
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'aa6d3df4-5000-4c51-8518-40dbaa91f40e' AND agent_id = :'agent_id';  -- Beignets Haricot Bouillie
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'cc0a1768-416b-41fd-883a-e482b8cbc446' AND agent_id = :'agent_id';  -- Bouillie de maïs au lait
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'bf115af3-e294-4e69-8b29-cbde6e308434' AND agent_id = :'agent_id';  -- Omelette spéciale Jojoo
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'bf6b6f4a-c5e4-48be-8011-e1e4e840d853' AND agent_id = :'agent_id';  -- Sandwich poulet avocat
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'dbf68df1-7bb1-4b7d-8fd3-be6844b0cf9e' AND agent_id = :'agent_id';  -- Pain perdu caramélisé
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'ce1db76f-b137-4b0a-865c-a9c28c150cbd' AND agent_id = :'agent_id';  -- Salade de fruits frais
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'e032e8c5-3297-487a-8e5f-3ef2cb379e71' AND agent_id = :'agent_id';  -- Yaourt maison granola
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'd1d4d441-145b-4522-8693-8411d5cbabda' AND agent_id = :'agent_id';  -- Café ou thé + croissant

-- ── Déjeuners ───────────────────────────────────────────────────
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '323b34de-0322-4a6a-8ba6-8cebe073afe4' AND agent_id = :'agent_id';  -- Poulet DG
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '658e7e82-f644-47b3-8ae7-16cf67bd7604' AND agent_id = :'agent_id';  -- Ndolè aux crevettes
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '8aa66cbe-b70d-4d6d-884b-c21a301908e1' AND agent_id = :'agent_id';  -- Riz sauté au poulet
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '2f46c68c-832f-49b1-859b-b4160d28f086' AND agent_id = :'agent_id';  -- Poisson braisé plantain
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'a04abc55-ee34-4bdb-8ee7-e3f7a29c7da9' AND agent_id = :'agent_id';  -- Eru & water fufu
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'fff65234-f6a2-4a11-8a38-6d3b50f943db' AND agent_id = :'agent_id';  -- Spaghetti sauce bolognaise
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '6dcbe502-d52a-49b6-8594-b0eb9ba93129' AND agent_id = :'agent_id';  -- Salade César poulet
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'c8e71bf6-df8e-4054-8589-661a6228c7a5' AND agent_id = :'agent_id';  -- Koki de maïs végétarien

-- ── Jus naturels ────────────────────────────────────────────────
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '1adcb05a-0031-41c6-82a6-3ac0c39182e5' AND agent_id = :'agent_id';  -- Jus de gingembre
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '05138771-7de5-432b-85e3-34050be08a31' AND agent_id = :'agent_id';  -- Foléré (bissap) menthe
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'bb366581-5d3a-40b5-8fe7-65a9fcaead47' AND agent_id = :'agent_id';  -- Jus d'ananas frais
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'c9cea01a-e73d-475f-8105-68fe94357d53' AND agent_id = :'agent_id';  -- Jus de mangue
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '9c3c4629-0d9c-4ddb-806c-5904f079bb0a' AND agent_id = :'agent_id';  -- Cocktail tropical
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '9ed661fd-b92c-46dd-8be9-74c8fac435be' AND agent_id = :'agent_id';  -- Citron gingembre sans sucre
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '493dc086-06aa-4331-88a7-47e1f9ea7e51' AND agent_id = :'agent_id';  -- Smoothie banane avocat
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'dddf4e2f-5774-449a-8b15-917da6cd24cc' AND agent_id = :'agent_id';  -- Pack 1 litre au choix

-- ── Formules entreprise ─────────────────────────────────────────
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '97bf0885-db55-4cd8-8a5a-37c0acd9d96e' AND agent_id = :'agent_id';  -- Formule Break Solo
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '9b33ebe0-6990-48e7-8fb8-498679dc5495' AND agent_id = :'agent_id';  -- Formule Lunch Solo
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '0a2c58d0-b4c2-4f6b-8619-41f7c78ba058' AND agent_id = :'agent_id';  -- Formule Duo Journée
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '6551a06d-847b-44cd-8b37-19b845738685' AND agent_id = :'agent_id';  -- Pack Équipe 10 personnes
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '73c24bb5-6c43-4d9c-853b-bc8faa0178d6' AND agent_id = :'agent_id';  -- Pack Réunion
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '4d8333d6-d044-4709-8f73-9a787376a0f2' AND agent_id = :'agent_id';  -- Pause café entreprise
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '654e43e0-8084-45ae-824d-99f6f95d2150' AND agent_id = :'agent_id';  -- Abonnement mensuel 20 jours
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '8fd79ec3-534f-4b06-8ceb-1ec104f2be43' AND agent_id = :'agent_id';  -- Formule végétarienne

-- ── Traiteur & événements ───────────────────────────────────────
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'f78ab446-f05d-42a8-8d6e-62c6f43ee2b1' AND agent_id = :'agent_id';  -- Buffet cocktail 20 personnes
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '821e974e-bef1-4f54-80b0-70b1207af7bd' AND agent_id = :'agent_id';  -- Plateau de canapés (50 pièces)
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '5ff04f54-1641-484a-84b8-2ccb5d4e6a09' AND agent_id = :'agent_id';  -- Brochettes party (50 pièces)
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '842d2dd6-0cc0-4dab-81ce-68b977155ae5' AND agent_id = :'agent_id';  -- Buffet mariage 100 personnes
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '3cc99699-b0b7-46a7-8a0d-2790a9f5423f' AND agent_id = :'agent_id';  -- Coffee break séminaire
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = '56a0e57c-8baf-4124-8d82-edd4155b886b' AND agent_id = :'agent_id';  -- Pack anniversaire enfant
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'e07a4eaf-2ea5-4f88-873d-308494d4f218' AND agent_id = :'agent_id';  -- Fontaine à jus (10 L)
UPDATE camille.products SET image_url = COALESCE(NULLIF('', ''), image_url), updated_at = NOW()
 WHERE id = 'b0fe109d-e7f4-4935-8145-159b47c4830b' AND agent_id = :'agent_id';  -- Buffet dessert 30 personnes

COMMIT;

-- Articles encore sans photo :
--   SELECT name, category FROM camille.products
--    WHERE agent_id = :'agent_id' AND (image_url IS NULL OR image_url = '')
--    ORDER BY sort_order;
