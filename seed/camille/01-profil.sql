-- ─────────────────────────────────────────────────────────────────────────────
-- Break & Lunch by Jojoo — profil de l'agent Camille
--
-- L'agent se crée dans l'application Camille (c'est elle qui compile le prompt
-- et rattache le compte). Ce fichier ne fait que RENSEIGNER son profil avec les
-- informations exactes de l'entreprise, pour ne pas les ressaisir à la main.
--
-- Remplace l'identifiant ci-dessous par celui de l'agent (visible dans l'URL
-- du tableau de bord), puis lance le fichier.
-- ─────────────────────────────────────────────────────────────────────────────

\set agent_id '11111111-2222-4333-8444-555555555555'

BEGIN;

UPDATE camille.agents SET
  business_name   = 'Break & Lunch by Jojoo',
  agent_tagline   = 'Un vrai délice à chaque bouchée',
  sector          = 'Restauration · livraison en entreprise',
  description     = 'Livraison de petits-déjeuners et de repas de midi en entreprise à Douala. '
                    'Formules adaptées aux entreprises, service traiteur pour événements et '
                    'livraison de jus naturels. Livraison gratuite. Commandes à l''avance ou avant 9h.',
  location        = 'Douala – Cameroun',
  owner_email     = 'break.lunchbyjojoo@gmail.com',
  whatsapp_number = '237671164875',
  target_audience = 'Entreprises et bureaux de Douala, organisateurs d''événements',
  primary_language = 'fr',

  -- Livraison gratuite : c'est un argument commercial de B&L, pas un oubli.
  delivery_enabled = true,
  delivery_fee     = 0,

  -- Identité imprimée sur les bons de commande. Complète RCCM et NIU si tu les
  -- veux sur le document ; laissés vides, ils n'apparaissent simplement pas.
  doc_settings = jsonb_build_object(
    'name',    'Break & Lunch by Jojoo',
    'tagline', 'Un vrai délice à chaque bouchée',
    'address', 'Douala – Cameroun',
    'phone',   '671 16 48 75 / 690 61 17 73',
    'email',   'break.lunchbyjojoo@gmail.com',
    'rccm',    '',
    'niu',     '',
    'logo_url', '',
    'color',   '#ffd400'
  ),

  -- Visuels de la vitrine. Laisse une url vide et le site se rabat sur la photo
  -- du premier article du rayon : rien ne casse tant que tu n'as pas les images.
  media = '[
    {"kind":"logo",     "url":"", "caption":"Logo Break & Lunch by Jojoo"},
    {"kind":"banner",   "url":"", "caption":"Bandeau d''accueil"},
    {"kind":"category", "url":"", "caption":"Petits-déjeuners"},
    {"kind":"category", "url":"", "caption":"Déjeuners"},
    {"kind":"category", "url":"", "caption":"Jus naturels"},
    {"kind":"category", "url":"", "caption":"Formules entreprise"},
    {"kind":"category", "url":"", "caption":"Traiteur & événements"}
  ]'::jsonb,

  -- Le site est prévenu à chaque changement de statut (migration_site_integration.sql).
  -- Mets l'URL publique du site et un secret long ; les mêmes valeurs vont dans
  -- CAMILLE_WEBHOOK_SECRET côté site.
  webhook_url    = '',
  webhook_secret = '',

  updated_at = NOW()
WHERE id = :'agent_id';

COMMIT;

-- Vérification :
--   SELECT business_name, whatsapp_number, delivery_fee, doc_settings->>'name'
--     FROM camille.agents WHERE id = :'agent_id';
