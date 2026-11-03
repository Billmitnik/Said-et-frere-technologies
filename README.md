# Said-et-frere-technologies

Site de la boutique informatique SAID & FRÈRES TECHNOLOGIES (Centre commercial Capitole, Bouaké) : catalogue, commande et demande de maintenance via WhatsApp, et administration des produits.

- Site public : https://said-freres-technologies.netlify.app
- **Guide de maintenance pour l'équipe (gérer les produits, mot de passe, mises en ligne) : [GUIDE-MAINTENANCE.md](GUIDE-MAINTENANCE.md)**

## Application web

Next.js (App Router), React et TypeScript, hébergé sur Netlify. Le catalogue est lu côté serveur depuis PostgreSQL (Neon) avec Prisma ; les commandes et les demandes de maintenance ouvrent WhatsApp.

## Architecture

- Routes publiques : `/`, `/maintenance`, `/produits/[id]` (fiche partageable), `/photos/[id]` (photos envoyées depuis l'administration), `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.
- Administration : `/admin` (liste, recherche, masquer/afficher), `/admin/produits/nouveau`, `/admin/produits/[id]`, `/admin/connexion`. Les mutations sont des Server Actions (`app/admin/actions.ts`) ; chaque page et chaque action vérifie la session (`lib/server/admin/auth.ts`).
- `lib/server/catalog/` lit le catalogue avec `unstable_cache` (tag `catalog`, revalidation 1 h). Les pages restent rendues dynamiquement pour le nonce de la CSP ; seules les données sont en cache. Toute modification depuis l'administration appelle `updateTag("catalog")` et apparaît immédiatement.
- Deux connexions PostgreSQL, créées uniquement côté serveur dans `lib/server/prisma.ts` :
  - `DATABASE_URL` : rôle `said_freres_site`, **lecture seule** (produits et photos), utilisé par le site public ;
  - `ADMIN_DATABASE_URL` : rôle `said_freres_admin`, insertion et mise à jour des produits, photos et tentatives de connexion, **sans suppression de produit**.
- Authentification admin : mot de passe haché en scrypt (`ADMIN_PASSWORD_HASH`), cookie de session signé HMAC (`ADMIN_SESSION_SECRET`, HttpOnly, SameSite=Strict, 8 h), 5 échecs par IP et par 15 minutes au maximum (table `admin_login_attempts`).
- Photos : réduites dans le navigateur (WebP ou JPEG, 1600 px), vérifiées côté serveur par leurs premiers octets, stockées dans `product_images` et servies avec un cache immuable d'un an. Le champ `image` d'un produit vaut `images/…` (fichier de `public/`) ou `photos/<uuid>`.
- Le panier reste dans le navigateur (`lib/cart.ts`). Les commandes et diagnostics ne sont pas enregistrés ; il n'y a ni paiement en ligne ni e-mail. Le numéro WhatsApp est dans `lib/whatsapp.ts`, l'adresse publique du site dans `lib/site.ts`.
- Les produits marqués `isDemo` portent la mention « Prix de démonstration ». Le bandeau « Version de présentation » et la note du catalogue ne s'affichent que tant que tous les produits visibles sont de démonstration.
- `proxy.ts` applique une CSP avec nonce sur les pages ; `next.config.ts` ajoute les autres en-têtes de sécurité.

## Configuration locale

Node.js 20.19 ou plus récent est requis.

1. Copier `.env.example` vers `.env` et renseigner `DATABASE_URL` (URL poolée) et `DIRECT_URL` (connexion directe du propriétaire, pour les migrations et le seed). Les secrets restent dans `.env`, ignoré par Git.
2. Installer et lancer :

```powershell
npm install
npm run db:migrate:dev   # base locale uniquement
npm run db:seed          # catalogue de démonstration, base de démonstration uniquement
npm run dev
```

Sans `DATABASE_URL` en développement, le site affiche le catalogue de démonstration local (`data/products.ts`). En production, la base est obligatoire.

### Administration et rôles de la base

```powershell
npm run admin:installer      # migrations, rôles said_freres_site et said_freres_admin, mot de passe, .env et Netlify
npm run admin:mot-de-passe   # changer ou réinitialiser le mot de passe admin (.env et Netlify)
node scripts/admin.cjs verifier   # inspecter sans rien modifier
```

`scripts/admin.cjs` lit les secrets dans `.env`, ne les affiche jamais, sauvegarde `.env` avant de le modifier (`.env.backup-…`) et relance un déploiement Netlify pour appliquer les nouveaux réglages. Il nécessite Netlify CLI connecté (`netlify login`) et le projet relié (`.netlify/state.json`).

## Vérifications

```powershell
npx tsc --noEmit
npm exec -- prisma validate
npm run build
```

## Déploiement

Le site Netlify est relié au dépôt GitHub : chaque push sur `main` lance la compilation (`npm run build`, dossier `.next`, configuration dans `netlify.toml`) et la mise en production. Variables d'environnement Netlify (secrètes, contextes production, deploy-preview et branch-deploy) : `DATABASE_URL`, `ADMIN_DATABASE_URL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`.

Les migrations de production s'appliquent avec `npm run db:migrate:deploy` (ou `npm run admin:installer`) depuis un poste disposant de `DIRECT_URL`. Elles ne sont pas lancées pendant la compilation Netlify.

L'hébergement doit prendre en charge le runtime Next.js/Node.js ; un hébergement purement statique ne convient pas.

## Ancienne version

`legacy-static/` conserve l'ancienne version HTML/CSS/JavaScript et ses images. Elle n'est pas utilisée par l'App Router. Les ressources actives se trouvent dans `public/images/`.
