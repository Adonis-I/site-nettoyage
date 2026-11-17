# Site vitrine – entreprise de nettoyage ([NOM])

Site statique en français construit avec [Astro](https://astro.build) : HTML/CSS générés à la compilation, très peu de JavaScript (menu mobile, animations, formulaires, carte).

## Lancer le site en local

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321 (rechargement automatique)
npm run build      # génère le site final dans /dist
npm run preview    # prévisualise la version compilée
```

> **Note technique :** `package.json` remplace Rollup par sa version WebAssembly (`overrides` → `@rollup/wasm-node`). Sur ce poste, Windows bloquait le binaire natif de Rollup (Application Control). Cette version fonctionne partout, Netlify et Vercel compris. Vous pouvez retirer le bloc `overrides` si votre machine n'a pas cette restriction.

## Modifier le contenu

| Quoi | Où |
|---|---|
| **Nom de l'entreprise**, téléphone, e-mail, WhatsApp, URL du site, endpoint du formulaire | `src/config.ts` (un seul endroit, appliqué partout : titres, SEO, en-tête, pied de page) |
| Zones d'intervention (textes + coordonnées de la carte) | `src/config.ts` → `ZONES` |
| Menu de navigation | `src/config.ts` → `NAV` |
| Liste des prestations | `src/data/services.ts` |
| Textes des pages | `src/pages/*.astro` (un fichier par page) |
| En-tête, pied de page, balises SEO communes | `src/layouts/Base.astro` |
| Couleurs, typographie, styles | `src/styles/global.css` (variables en haut du fichier) |
| Photos | `public/images/` |
| Favicon / logo | `public/favicon.svg` ; le logo texte est dans `Base.astro` (classe `.logo`) |

**Changer le nom :** remplacez `nom: '[NOM]'` dans `src/config.ts`, puis relancez `npm run build`. Pensez aussi à mettre la vraie adresse du site dans `url`, utilisée pour les balises Open Graph, la balise canonical et le sitemap.

**Remplacer une photo :** gardez le même nom de fichier dans `public/images/` (ex. `chambre-draps-propres.jpg`), ou changez le `src` et le texte `alt` dans la page concernée. Format conseillé : JPG, ~1400 px de large, < 300 Ko. L'image de partage réseaux sociaux est `og-image.jpg` (1200×630).

Photos actuelles : Unsplash (licence libre, utilisation commerciale autorisée).

## Configurer le formulaire (Formspree)

Les formulaires (devis et contact) envoient les demandes par e-mail sans serveur, via [Formspree](https://formspree.io).

1. Créez un compte gratuit sur formspree.io avec l'adresse qui doit recevoir les demandes (ex. d.cesare@hotmail.com).
2. Créez un nouveau formulaire : Formspree vous donne une URL du type `https://formspree.io/f/abcdwxyz`.
3. Collez-la dans `src/config.ts` → `formEndpoint` (remplacez `https://formspree.io/f/VOTRE_ID_FORMSPREE`).
4. Recompilez et redéployez. Faites un envoi de test et confirmez l'adresse e-mail si Formspree le demande.

Tant que l'endpoint n'est pas configuré, le formulaire affiche un message invitant à appeler ou à écrire directement.

> **Photos jointes :** l'envoi de fichiers n'est disponible que sur les offres payantes de Formspree. Sur l'offre gratuite, les autres champs arrivent normalement mais les photos ne sont pas transmises. Alternative gratuite : Netlify Forms (voir ci-dessous) qui accepte les fichiers (8 Mo max par envoi).

### Alternative : Netlify Forms

Si le site est hébergé sur Netlify, dans `src/pages/devis.astro` et `src/pages/contact.astro` :
- ajoutez `name="devis"` (ou `contact`) et `data-netlify="true"` sur la balise `<form>` ;
- ajoutez `<input type="hidden" name="form-name" value="devis" />` dans le formulaire ;
- remplacez `action={SITE.formEndpoint}` par `action="/"`.

Activez ensuite les notifications par e-mail dans Netlify → *Site configuration → Forms → Form notifications*.

## Déployer

### GitHub Pages (gratuit) — configuration actuelle

Le site est publié automatiquement par GitHub Actions (`.github/workflows/deploy.yml`) à chaque `git push` sur `main`.

1. Le dépôt doit être **public** (GitHub Pages gratuit ne fonctionne pas avec un dépôt privé).
2. Sur GitHub : *Settings → Pages → Build and deployment → Source* : choisissez **GitHub Actions**.
3. `git push` : après 1 à 2 minutes, le site est en ligne sur **https://adonis-i.github.io/site-nettoyage/** (onglet *Actions* pour suivre la publication).

Le site étant servi dans un sous-dossier, `src/config.ts` contient `base: '/site-nettoyage'`. Dans le code, les liens internes passent par `link('/page/')`. Si vous passez à un nom de domaine personnel ou à Netlify/Vercel, mettez `base: ''` et changez `url`.

### Autres hébergeurs

**Netlify** : poussez le dossier sur GitHub/GitLab puis « Add new site → Import an existing project ». Les réglages sont lus depuis `netlify.toml` (commande `npm run build`, dossier `dist`). Vous pouvez aussi glisser-déposer le dossier `dist` sur app.netlify.com/drop.

**Vercel** : « Add New → Project », importez le dépôt. Astro est détecté automatiquement (build `npm run build`, sortie `dist`).

Pour ces hébergeurs, mettez `base: ''` dans `src/config.ts`. Ajoutez ensuite votre nom de domaine dans les réglages de l'hébergeur et mettez à jour `url`.

## À compléter avant la mise en ligne

- [ ] Nom de l'entreprise et URL dans `src/config.ts`
- [ ] Endpoint Formspree (ou Netlify Forms)
- [ ] Mentions légales (SIRET, adresse, hébergeur…) : `src/pages/mentions-legales.astro`
- [ ] Politique de confidentialité : `src/pages/politique-confidentialite.astro`
- [ ] Vérifier la liste des communes citées dans `ZONES`
