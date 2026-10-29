# SAID & FRÈRES TECHNOLOGIES

Site migré vers Next.js App Router, React et TypeScript. Le catalogue est lu côté serveur depuis PostgreSQL avec Prisma ; les interactions de commande et de maintenance continuent à ouvrir WhatsApp.

## Architecture

- Les routes actives sont `/` et `/maintenance`.
- `lib/server/catalog/` fournit le catalogue au rendu serveur. `lib/server/prisma.ts` crée un client Prisma uniquement côté serveur.
- `prisma/schema.prisma` et `prisma/migrations/` définissent la base PostgreSQL. Le seed charge les produits de démonstration déjà présents dans le projet ; il ne crée pas de vrais prix, stocks ou disponibilités.
- En développement, si `DATABASE_URL` n’est pas défini, le site utilise le catalogue de démonstration local. En production, une base configurée est obligatoire et aucune donnée de démonstration de repli n’est affichée silencieusement.
- Le panier reste dans le navigateur. La finalisation prépare un message WhatsApp ; le visiteur le vérifie et l’envoie lui-même. Le paiement se fait à la livraison.
- Les diagnostics ouvrent aussi WhatsApp. Les commandes et les diagnostics ne sont pas enregistrés dans la base ; il n’y a ni paiement en ligne, ni e-mail, ni backend NestJS.
- Il n’y a pas encore de Route Handler ni de Server Action : aucun client externe ni formulaire d’administration ne les nécessite aujourd’hui. Une action serveur sera ajoutée avec une mutation concrète ; une API HTTP le sera si un client distinct en a besoin.
- Les produits et prix présents restent des données de démonstration. Le numéro WhatsApp public se trouve dans `lib/whatsapp.ts`.

## Configuration locale

Node.js 20.19 ou plus récent est requis.

1. Copier `.env.example` vers `.env` et régler `DATABASE_URL` et `DIRECT_URL` selon la base PostgreSQL locale ou hébergée. Les valeurs d’exemple sont des identifiants locaux fictifs, pas des secrets utilisables en production.
2. Installer les dépendances et initialiser le catalogue de démonstration :

```powershell
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

`DATABASE_URL` sert aux connexions de l’application et peut être une URL poolée. `DIRECT_URL` sert aux migrations et au seed et doit viser directement PostgreSQL. Les secrets restent dans `.env`, ignoré par Git.

Pour appliquer les migrations sur un environnement de production déjà configuré, utiliser `npm run db:migrate:deploy`. Ne lancer le seed de démonstration que sur une base de démonstration.

## Vérifications

```powershell
npm run prisma:generate
npm exec -- prisma validate
npm run build
```

Les pages utilisent le rendu dynamique et `proxy.ts` applique une CSP avec nonce. L’hébergement doit prendre en charge le runtime Next.js/Node.js ; un hébergement purement statique ne convient pas à la configuration actuelle.

## Ancienne version

`legacy-static/` conserve l’ancienne version HTML/CSS/JavaScript et ses images. Elle n’est pas utilisée par l’App Router. Les ressources actives de Next.js se trouvent dans `public/images/`.
