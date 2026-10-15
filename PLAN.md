# PLAN — Hero 2 colonnes + Aperçu de partage social (OG) attractif

> Ce plan remplace le plan précédent (`PLAN — Conversion, honnêteté & offre PME`),
> intégralement terminé et validé (toutes tâches ✅).

## Contexte & besoin métier

**1. Hero trop centré.**
Mesures effectuées sur `https://sofianeasma.me/fr` à 1440px de large :

| Élément | Largeur | Position X |
|---|---|---|
| `Container` du hero | 1280 px | 73 |
| `Container` des autres sections | 1280 px | 73 |
| Grille des autres sections (contenu) | 1216 px | 105 |
| Sous-titre du hero (`max-w-2xl`) | **672 px** | **377** |
| Stats du hero (`max-w-2xl`) | **672 px** | **377** |

Le conteneur est donc **déjà à la bonne largeur** ; le défaut vient du contenu
interne du hero, bridé à 672px et centré, alors que les autres sections occupent
les 1216px de contenu. → Passage à une mise en page **2 colonnes** (texte à
gauche / avatar + stats à droite) pour occuper toute la largeur.

**2. Aperçu de lien sur les réseaux (WhatsApp / Facebook / Instagram).**
Diagnostic production : le balisage est **correct** (24 balises `og:`,
réponse `200` avec User-Agent `facebookexternalhit`, `/api/og` renvoie bien un
PNG 1200×630, `robots.txt` OK). Le problème n'est donc pas technique mais
**qualitatif** : l'image OG actuelle est un simple dégradé avec un bloc de texte
centralisé (photo absente, identité faible, `og:title` = titre SEO de 95
caractères affiché en 48px = mur de texte). → Refonte en **carte d'identité
vendeuse, en anglais**, + **texte `og:title`/`og:description` court et dédié**.

## Questions / décisions en attente

1. **Langue** : la **carte image OG sera toujours en anglais** (décision
   utilisateur). En revanche `og:title` / `og:description` (le texte affiché à
   côté de l'image) restent **localisés fr/en/ar** pour rester cohérents avec la
   langue de la page. *À confirmer : veut-on plutôt tout en anglais ?*
2. **Instagram** : les DM affichent bien l'aperçu, mais les **Stories n'affichent
   jamais d'aperçu** (uniquement le sticker « Lien »). Aucun code ne peut changer
   ça — à communiquer à la fin.
3. **Cache des plateformes** : Facebook/WhatsApp mettent en cache l'aperçu.
   L'URL image passe en `?v=2` pour casser le cache ; un **re-scrape manuel** via
   le Facebook Sharing Debugger reste nécessaire après mise en production.

---

## 1. Base de données (DB)

**Aucun impact.** Projet statique, pas de schéma, pas de migration.

---

## 2. API Routes / Server Actions

### 2.1 Refonte de la carte OG — `src/app/api/og/route.tsx`
*(Fichier unique, aucune dépendance externe)*

**Contenu (toujours en anglais), format 1200×630 :**

```
┌─────────────────────────────────────┬──────────────┐
│ ● AVAILABLE FOR NEW PROJECTS        │              │
│   (badge vert, point pulsant)       │              │
│                                     │   [Photo     │
│ Websites that turn                  │   profil     │
│ visitors into clients               │   ronde      │
│   (700, ~72px, blanc)               │   300×300,   │
│                                     │   anneau     │
│ Fast, modern sites for small        │   bleu]      │
│ businesses — plus custom web        │              │
│ apps & SaaS on demand.              │  SOFIANE ASMA│
│   (~30px, bleu clair)               │  sofianeasma │
│                                     │     .me      │
│ Sofiane ASMA  ·  sofianeasma.me      │              │
└─────────────────────────────────────┴──────────────┘
```

**Implémentation :**
- `import sofiane from "@/assets/sofiane.png"` (même asset que le hero) →
  résolu en URL absolue via `new URL(sofiane, request.url)` → `fetch()` →
  **data URI base64** (Satori n'accepte pas les chemins relatifs ; le data URI
  évite aussi tout accès réseau sortant depuis la fonction serverless).
  Mémoire cache module (`let avatarPromise`) pour ne fetcher qu'une fois.
- **Fallback** : si le fetch de l'image échoue, rendre la carte **sans photo**
  (colonne droite remplacée par un monogramme « SA » sur fond dégradé).
  La route **ne doit jamais renvoyer une 500**.
- Fond : `linear-gradient(135deg, #020617 0%, #0b1226 55%, #101c3d 100%)` +
  halo radial bleu, cohérent avec le fond de la page (`layout.tsx`).
- Typo : `fontWeight: 700` maximum (prouvé fonctionnel sur l'image actuelle ;
  pas de 800 pour éviter un repli de rendu), **aucun emoji** (police par défaut
  sans emoji), `display: flex` explicite sur **chaque** élément (exigence Satori).
- **Suppression du paramètre `title`** : le texte n'est plus injecté depuis
  l'URL → surface de rendu maîtrisée, pas de titre tronqué/chargé.
- Suppression du chargement de la police `Cairo.ttf` (carte 100% anglaise).
  Avant de supprimer le fichier `src/app/api/og/fonts/Cairo.ttf`, vérifier par
  grep qu'aucun autre fichier ne l'importe.
- Conserver : `export const runtime = "nodejs"`, `Cache-Control` 7 jours
  (`public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000`),
  `width: 1200, height: 630`.

**Critère « fait » :** `GET /api/og?v=2` renvoie 200 + `image/png` ; l'image
affiche photo, badge de disponibilité, phrase d'accroche et le domaine ;
`GET /api/og?v=2&locale=ar` renvoie la même carte anglaise (200).

### 2.2 Métadonnées sociales — `src/lib/seo.ts`
- `buildOgImageUrl()` : **sans arguments**, renvoie
  `` `${getBaseUrl()}/api/og?v=2` `` (URL unique → meilleur cache CDN).
  Seul appelant interne : `generateLocaleMetadata` (ligne 47). La ré-exportation
  `export { buildOgImageUrl } from "@/lib/seo"` dans
  `src/components/SEO/JsonLd.tsx` reste valide.
- `generateLocaleMetadata()` : ajouter 2 params **optionnels**
  `ogTitle?: string` et `ogDescription?: string`.
  - `openGraph.title` = `ogTitle ?? title`
  - `openGraph.description` = `ogDescription ?? description`
  - `twitter.title` / `twitter.description` = idem
  - `og.images[0].alt` = `ogTitle ?? title`
  - `title` / `description` (SEO), `metadataBase`, `canonical`,
    `alternates.languages`, `keywords` : **inchangés**.
- Les 2 autres appelants (`creation-site-web/page.tsx`,
  `projects/[slug]/page.tsx`) continuent de compiler sans changer (params
  optionnels).

**Critère « fait » :** `tsc --noEmit` OK ; sans `ogTitle`, le rendu est
strictement identique à aujourd'hui (régression zéro).

### 2.3 Texte social court — messages + layout
- **`src/messages/fr.json`**, **`src/messages/en.json`**, **`src/messages/ar.json`**
  → dans le bloc `metadata`, ajouter `ogTitle` et `ogDescription` :

  | Langue | `ogTitle` (≤ 60 car.) | `ogDescription` (≤ 160 car.) |
  |---|---|---|
  | fr | `Sofiane ASMA — Des sites web qui convertissent` | `Sites web rapides et professionnels pour PME, applications web et SaaS sur-mesure. Devis clair, mise en ligne rapide.` |
  | en | `Sofiane ASMA — Websites that win clients` | `Fast, professional websites for small businesses, plus custom web apps and SaaS. Clear scope, quick launch.` |
  | ar | `سفيان عاصمة — مواقع ويب تجلب لك عملاء` | `مواقع ويب احترافية وسريعة للشركات الصغيرة، وتطبيقات ويب وSaaS حسب الطلب. عرض سعر واضح وانطلاق سريع.` |

- **`src/app/[locale]/layout.tsx`** (fonction `generateMetadata`, lignes 41-59)
  → lire `t("ogTitle")` et `t("ogDescription")` et les transmettre à
  `generateLocaleMetadata`.

**Critère « fait » :** sur `/fr` et `/ar`, `og:title` contient le texte court
et `title` (balise SEO) reste le titre long d'origine.

### 2.4 (Optionnel) Page offre — `src/app/[locale]/creation-site-web/page.tsx`
- Passer `ogTitle` / `ogDescription` à `generateLocaleMetadata` (clés
  `websiteOffer.ogTitle` / `websiteOffer.ogDescription` à ajouter dans les 3
  messages) car `websiteOffer.title` est long.
- Les pages **projets** n'ont **aucun changement** : `title`/`description` y sont
  déjà courts (`"<Projet> | Sofiane ASMA"`).
- *Tâche coupable : peut être retirée du périmètre sans impacter les objectifs.*

---

## 3. UI Components

### 3.1 Hero en 2 colonnes — `src/components/sections/HeroSection.tsx`
*(Fichier unique — seul fichier touché de la tâche UI)*

**Structure cible** (remplace le `motion.div` en `flex-col items-center`) :

```tsx
<Container>
  <motion.div variants={container} initial="hidden" animate="show"
    className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">

    {/* Colonne 1 — texte (ordre DOM 1 = au-dessus sur mobile) */}
    <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
      <Badge …/>                 {/* déplacé depuis le haut du hero */}
      <motion.h1 …>              {/* inchangé */}
      <motion.p …highlight />
      <motion.p …subtitle className="… max-w-2xl … lg:max-w-none" />
      <motion.div …CTAs />       {/* inchangé */}
    </div>

    {/* Colonne 2 — visuel (ordre DOM 2 = en dessous sur mobile) */}
    <div className="flex flex-col items-center gap-8">
      <motion.div variants={item} className="relative">  {/* avatar, agrandi */}
        … size-32 sm:size-40 lg:size-48 …
      </motion.div>
      <motion.dl variants={item}
        className="grid w-full grid-cols-3 gap-4 rounded-2xl border
                   border-white/10 bg-white/5 p-6 backdrop-blur
                   sm:gap-6">
        {stats.map(…)}           {/* plus de max-w-2xl */}
      </motion.dl>
    </div>
  </motion.div>
</Container>
```

**Points techniques critiques :**
- **Stagger préservé** : les 2 wrappers sont des `<div>` **non-`motion`**. Framer
  Motion lie les `motion` enfants à l'ancêtre `motion` le plus proche via le
  contexte React — un `<div>` intermédiaire ne casse **pas** la liaison. Les 7
  éléments animés restent donc des enfants directs du `container` et le
  `staggerChildren: 0.1` continue de s'appliquer dans l'ordre du DOM.
- **RTL obligatoire** : utiliser des propriétés **logiques** — `text-start`,
  `items-start` — et jamais `text-left` / `items-left`. (Le projet a déjà subi un
  rejet Reviewer pour non-respect RTL sur la FAQ.)
- `text-balance` conservé sur le `h1`, `h1` unique conservé, `alt` de la photo
  conservé.
- **Mobile** : ordre DOM = texte → avatar → stats (le badge/titre arrivent
  immédiatement, meilleure conversion). Pas de classes `order-*` (inutiles et
  source de bugs RTL).
- `Image` : passer `width={192} height={192}` pour un ratio cohérent avec la
  nouvelle taille CSS (`h-full w-full object-cover object-top` inchangé).
- Le halo d'arrière-plan `-inset-1.5` de l'avatar peut passer à `-inset-2`.
- `section` : `min-h-[88dvh]`, `pt-28`/`lg:pt-32` et `overflow-hidden`
  **inchangés** (le contenu empilé en mobile dépasse simplement le `min-height`,
  ce qui est attendu).
- **Aucun autre composant** n'est touché (`Container` est déjà correct).

**Critère « fait » :** à 1440px, le contenu du hero occupe ~1216px (mesure
`getBoundingClientRect`) au lieu de 672px pour le sous-titre ; le titre est
aligné à gauche, l'avatar et les stats à droite ; aucun débordement horizontal ;
`/ar` s'affiche correctement en RTL.

---

## 4. Tests

### 4.1 Statique
- `npx tsc --noEmit`
- `npx eslint .` (ou script `lint` du `package.json`)
- `npm run build`

### 4.2 Visuel — Playwright (site local ou preview de build)
- **Hero** : viewport **1440 / 1024 / 768 / 390** — vérifier
  `document.documentElement.scrollWidth <= clientWidth` (pas de scroll
  horizontal) + largeur réelle du sous-titre et des stats.
- **RTL** : ouvrir `/ar` à 1440px — titre aligné à droite, flèche du CTA
  secondaire retournée (`rtl:rotate-180`).
- **OG** : `GET /api/og?v=2` → sauvegarder le PNG et **le visualiser**
  (photo présente, pas de texte tronqué, badge lisible).
- **HTML** : sur `/fr`, contrôler la présence de `og:title`, `og:description`,
  `og:image` (URL `?v=2`) et `twitter:card`.

### 4.3 Revue manuelle post-déploiement (utilisateur)
- Facebook Sharing Debugger → *Scrape Again* sur `https://sofianeasma.me`
  (rafraîchit le cache Facebook **et** Messenger).
- WhatsApp : renvoyer le lien depuis un **nouveau** message (le cache WhatsApp
  se réinitialise avec la nouvelle URL d'image `?v=2`).

---

## Sécurité & edge cases à couvrir

- **Aucune DB, aucune auth, aucun formulaire touché** → surface d'attaque
  inchangée.
- **OG route** : suppression du paramètre `title` injecté dans l'image
  (réduction de la surface ; le JSX échappait déjà le texte, mais le rendu
  devenait contrôlable par un tiers).
- **Résilience** : la route OG doit renvoyer 200 même si l'avatar ne se charge
  pas (fallback monogramme) — sinon WhatsApp affiche « aucune info ».
- **Régression SEO zéro** : `title`, `description`, `canonical`,
  `hreflang` et `keywords` ne doivent pas bouger (params OG optionnels).
- **RTL** : uniquement des propriétés logiques (`text-start`, `items-start`).
- **Locales invalides** : `generateMetadata` retourne déjà `{}` si
  `hasLocale` échoue → ne pas modifier ce garde-fou.
- **Cache** : `?v=2` obligatoire sur l'image OG, sinon les plateformes
  continuent d'afficher l'ancien visuel.
- **Instagram Stories** : pas d'aperçu possible (limitation plateforme) →
  à annoncer, ne pas traiter comme un bug.

---

## Ordre d'exécution (séquentiel — 1 tâche = 1 prompt isolé)

| # | Agent | Tâche | Fichiers exacts | Commit après APPROUVE |
|---|---|---|---|---|
| 1 | Frontend | Hero 2 colonnes (§3.1) | `src/components/sections/HeroSection.tsx` | `feat(ui): hero en deux colonnes pleine largeur` |
| 2 | — | **Reviewer** sur le diff tâche 1 | — | — |
| 3 | Backend | Params OG dans le générateur (§2.2) | `src/lib/seo.ts` | `feat(seo): titres og:title/og:description dédiés + url image v2` |
| 4 | — | **Reviewer** | — | — |
| 5 | Backend | Texte social localisé (§2.3) | `src/messages/fr.json`, `src/messages/en.json`, `src/messages/ar.json`, `src/app/[locale]/layout.tsx` | `feat(seo): copy sociale courte fr/en/ar` |
| 6 | — | **Reviewer** | — | — |
| 7 | Backend | Refonte carte OG (§2.1) | `src/app/api/og/route.tsx` (+ `src/app/api/og/fonts/Cairo.ttf` si non importé ailleurs) | `feat(seo): carte OG d'identité 1200x630 en anglais` |
| 8 | — | **Reviewer** | — | — |
| 9 | Backend | *(Optionnel)* OG page offre (§2.4) | `src/app/[locale]/creation-site-web/page.tsx` + 3 messages | `feat(seo): og copy de la page offre` |
| 10 | — | **Reviewer** | — | — |
| 11 | Lead | Tests statiques + visuels (§4) | — | `test(seo): vérifications tsc/eslint/build/Playwright` |
| 12 | Tester | Validation E2E finale | — | — |

**Règles :** aucune tâche ne démarre avant le feu vert Reviewer de la
précédente ; aucun historique ni code des autres tâches n'est transmis aux
sous-agents ; `git add` limité aux fichiers de la tâche ; **jamais de push**.

---

## Validation finale (Reviewer → Tester)

1. **Reviewer** : revue du `git diff` après **chaque** tâche
   (typage TypeScript, sécurité, RTL, conventions, absence de fichiers hors
   périmètre) → `APPROUVE` / `REJETE`.
2. **Tester** (en fin de module) : parcours E2E —
   `/fr`, `/en`, `/ar` s'affichent sans erreur console ni débordement horizontal ;
   `/api/og?v=2` renvoie un PNG valide ; les balises `og:*` et `twitter:*` sont
   présentes et pointent vers l'image v2.
3. **Synthèse utilisateur** : fichiers touchés, statut des revues, captures des
   vérifications, et **procédure de re-scrape** (Facebook Sharing Debugger) +
   rappel de la limite Instagram Stories.
