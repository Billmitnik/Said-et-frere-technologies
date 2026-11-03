# Guide de maintenance — SAID & FRÈRES TECHNOLOGIES

Ce guide explique, simplement, comment faire vivre le site au quotidien.
Pour les détails techniques, voir le [README](README.md).

## Les adresses utiles

| Quoi | Adresse |
|---|---|
| Le site public (à partager aux clients) | https://said-freres-technologies.netlify.app |
| L'administration (produits, prix, photos) | https://said-freres-technologies.netlify.app/admin |
| L'hébergement du site (Netlify) | https://app.netlify.com/projects/said-freres-technologies |
| Le code du site (GitHub) | https://github.com/Billmitnik/Said-et-frere-technologies |
| La base de données (Neon) | https://console.neon.tech |

---

## 1. Gérer les produits (sans toucher au code)

Tout se fait depuis **l'administration**, sur ordinateur ou sur téléphone.

1. Ouvrez https://said-freres-technologies.netlify.app/admin
2. Tapez le **mot de passe d'administration**, puis **Se connecter**.

### Ajouter un produit
1. Cliquez sur **Ajouter un produit**.
2. Remplissez :
   - **Nom du produit** — par exemple « HP EliteBook 840 G5 — reconditionné ».
   - **Catégorie du menu** — l'onglet du site où le produit apparaît (Ordinateurs, Écrans…).
   - **Type de produit** — le petit texte au-dessus du nom (« Ordinateur portable »…).
   - **Prix en F CFA** — en chiffres, sans espace obligatoire (`185000`). **Vide = « Sur devis »**.
   - **Étiquette** — le badge sur la photo : NEUF, OCCASION, RECONDITIONNÉ, PROMO…
   - **Description courte** — 2 ou 3 phrases visibles dans le catalogue.
   - **Texte d'accroche** — facultatif, affiché sur la fiche du produit.
   - **Photo** — choisissez une image (sur téléphone, vous pouvez prendre la photo directement).
     Elle est **réduite automatiquement** avant l'envoi : pas besoin de la retoucher.
3. Laissez **« Visible sur le site »** coché, et **« Produit de démonstration »** décoché.
4. Cliquez sur **Enregistrer**. Le produit apparaît **immédiatement** sur le site.

### Modifier un produit (prix, texte, photo)
Dans la liste, cliquez sur le nom du produit ou sur **Modifier**, changez ce qu'il faut, puis **Enregistrer**.
Pour **remplacer une photo provisoire** par la vraie : choisissez la nouvelle photo dans le champ **Photo**, puis **Enregistrer**.

### Retirer un produit du site
Cliquez sur **Masquer**. Le produit disparaît du site mais reste dans l'administration :
cliquez sur **Afficher** pour le remettre. Rien n'est jamais supprimé.

### Retirer les produits de démonstration
Quand vos vrais produits sont saisis, cliquez sur **« Masquer les produits de démonstration »**
en haut de la liste. Les produits fictifs disparaissent du site d'un coup, et le bandeau
« Version de présentation » disparaît automatiquement.

### Changer l'ordre d'affichage
Champ **Ordre d'affichage** : plus le nombre est petit, plus le produit est haut dans la boutique.

### Partager un produit à un client
Chaque produit a sa propre page, par exemple `https://said-freres-technologies.netlify.app/produits/souris`.
Sur la fiche, le bouton **Partager** copie le lien (ou ouvre le partage du téléphone).
Sur WhatsApp, l'aperçu montre la photo et le nom du produit.

---

## 2. Le mot de passe d'administration

- **Le changer, ou en créer un nouveau si vous l'avez oublié** : dans VS Code, ouvrez un terminal
  dans le dossier du projet (voir partie 3) et tapez :

  ```
  npm run admin:mot-de-passe
  ```

  Appuyez sur **Entrée** sans rien taper pour qu'un mot de passe sûr soit créé, **notez-le**,
  puis laissez la commande finir (« Terminé. »). Le nouveau mot de passe est actif en ligne
  **3 minutes** plus tard. Toutes les sessions ouvertes sont déconnectées.
- **« Trop de tentatives »** : après 5 erreurs, l'accès est bloqué **15 minutes**. Patientez.
- Une session dure **8 heures**, puis il faut se reconnecter.
- Ne donnez jamais ce mot de passe par message. Une personne qui l'a peut modifier les prix.

---

## 3. Travailler sur le site depuis Visual Studio Code

À faire pour modifier les **textes fixes** du site (pas les produits, qui se gèrent dans l'administration).

### Démarrer
1. Ouvrez VS Code, puis **Fichier → Ouvrir le dossier** et choisissez le dossier `said-freres-technologies`.
2. Ouvrez un terminal : **Terminal → Nouveau terminal**.
3. La première fois seulement : `npm install`
4. Lancez le site sur votre ordinateur : `npm run dev`
5. Ouvrez http://localhost:3000 dans le navigateur. Chaque modification enregistrée s'affiche aussitôt.
   Pour arrêter : **Ctrl+C** dans le terminal.

> Attention : le site local utilise **la même base de données** que le site en ligne.
> Une modification faite dans l'administration locale (http://localhost:3000/admin) est donc réelle.

### Où se trouvent les textes

| Je veux changer… | Fichier |
|---|---|
| Le grand titre et le texte d'accueil | `components/shop/ShopClient.tsx` (partie « Hero ») |
| Les sections « Maintenance » et « Le bon matériel » de l'accueil | `app/page.tsx` |
| La page de maintenance | `app/maintenance/page.tsx` et `components/maintenance/DiagnosticForm.tsx` |
| Le bandeau noir tout en haut | `components/site/DemoBanner.tsx` |
| Le bas de page | `components/site/SiteFooter.tsx` |
| Les onglets du menu (catégories) | `data/categories.ts` |
| **Le numéro WhatsApp** | `lib/whatsapp.ts` (format international sans « + » : `2250500737519`) |
| L'adresse du site (après achat d'un nom de domaine) | `lib/site.ts` |
| Les couleurs et la mise en page | `app/globals.css` |

### Mettre en ligne une modification
1. Dans VS Code, cliquez sur l'icône **Contrôle de code source** (à gauche, les trois ronds reliés).
2. Écrivez un court message (par exemple « Nouveau texte d'accueil »), puis cliquez sur **Valider** (Commit).
3. Cliquez sur **Synchroniser les modifications** (Push).
4. Netlify met le site à jour tout seul en **2 à 3 minutes**. Suivi :
   https://app.netlify.com/projects/said-freres-technologies/deploys

Avant d'envoyer, vous pouvez vérifier que tout compile avec `npm run build`.

---

## 4. Ce qu'il ne faut jamais faire

- **Ne jamais partager ni publier le fichier `.env`.** Il contient les mots de passe de la base de
  données et de l'administration. Il est volontairement exclu de GitHub.
- Les fichiers `.env.backup-…` sont d'anciennes copies de `.env` : ils contiennent aussi des secrets.
  Gardez-les sur votre ordinateur, ou supprimez-les une fois que tout fonctionne.
- Le dépôt GitHub est **public** : n'écrivez jamais de mot de passe, de clé ou d'adresse de base de
  données dans le code.
- Activez la **double authentification** sur vos comptes GitHub, Netlify et Neon.

---

## 5. Coûts et limites des offres gratuites

| Service | Offre actuelle | Limite | Si la limite est dépassée |
|---|---|---|---|
| Netlify (hébergement) | Gratuite | 300 crédits par mois. Une mise en ligne = 15 crédits ; 1 Go transféré = 20 crédits ; 10 000 requêtes = 2 crédits. Environ 5 000 à 8 000 visites par mois. | Le site est **mis en pause** jusqu'au mois suivant. Passer à l'offre Personal (9 $ par mois, 1 000 crédits). |
| Neon (base de données) | Gratuite | 100 heures de calcul et 0,5 Go par mois. Le catalogue est gardé en cache 1 heure, ce qui laisse la base endormie la plupart du temps. Une photo pèse environ 200 Ko : 0,5 Go ≈ 2 000 photos. | La base est **coupée** jusqu'au mois suivant. Passer à l'offre payante à l'usage. |

Surveillez la consommation de temps en temps :
- Netlify : https://app.netlify.com → votre équipe → **Usage**
- Neon : https://console.neon.tech → votre projet → **Usage**

Regroupez vos modifications de code : chaque mise en ligne coûte 15 crédits.
Les changements faits dans **l'administration** ne coûtent **aucune** mise en ligne.

---

## 6. En cas de problème

| Ce que je vois | Que faire |
|---|---|
| Le site affiche « La page n'a pas pu se charger » | Réessayez après quelques secondes (la base se réveille). Si cela dure, regardez l'état des déploiements sur Netlify et l'état du projet sur Neon. |
| L'administration affiche « non configurée » | Dans VS Code : `npm run admin:installer` |
| J'ai oublié le mot de passe d'administration | Dans VS Code : `npm run admin:mot-de-passe` |
| « Trop de tentatives » à la connexion | Attendre 15 minutes. |
| Un prix changé directement dans Neon n'apparaît pas | Le catalogue est gardé en cache 1 heure. Les changements faits par l'administration, eux, sont immédiats. |
| Une mise en ligne a échoué sur Netlify | Ouvrez le déploiement en rouge sur Netlify et lisez le journal ; la version précédente reste en ligne. |
| Je veux vérifier l'installation sans rien changer | `node scripts/admin.cjs verifier` |
