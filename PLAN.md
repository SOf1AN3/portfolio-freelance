# PLAN — Link preview LinkedIn/Facebook : canonical `www` + image OG localisée

> Ce plan remplace le plan précédent (`PLAN — Hero 2 colonnes + Aperçu de partage
> social (OG) attractif`), **intégralement terminé et validé** (toutes tâches ✅,
> commits `6e12bae` → `6b398ef`, arbre propre).

## Contexte & besoin métier

**Symptôme remonté :** le partage de `https://sofianeasma.me` (sans `www`) sur
**LinkedIn / Facebook** affiche uniquement « sofianeasma.me / sofianeasma.me »
(domaine seul, sans titre ni image).

### Diagnostic (mesures réelles du 15/10/2026)

| Contrôle | Résultat |
|---|---|
| Balisage OG sur `/fr` | ✅ Complet : `og:title`, `og:description`, `og:url`, `og:image` 1200×630, `og:site_name`, `og:locale`, `twitter:card summary_large_image` |
| Lecture par un crawler externe (Microlink) | ✅ `title` = « Sofiane ASMA — Des sites web qui convertissent », `image` = PNG 1200×630 valide |
| `curl https://sofianeasma.me` | ⚠️ **308** → `https://www.sofianeasma.me/` |
| `curl https://www.sofianeasma.me/` | ⚠️ **307** → `https://www.sofianeasma.me/fr` |
| `curl https://sofianeasma.me/api/og?v=2` | ⚠️ **308** (`text/plain`, 15 octets) → `www…/api/og` |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ `https://sofianeasma.me` (**apex**) alors que la page est servie sur **`www`** |

**Cause racine :** `og:url`, `og:image`, `canonical`, `hreflang`, `sitemap` et
`robots` pointent tous vers le domaine **apex**, qui redirige en 308 vers `www`.
La page réellement chargée par le crawler est `https://www.sofianeasma.me/fr`
alors que `og:url` déclare `https://sofianeasma.me/fr`.

- **Facebook exige que `og:url` corresponde à l'URL finalement chargée** ; en cas
  de désalignement, il rejette ou re-scrape autrement → fallback « domaine seul ».
- **`og:image` est servi depuis une origine qui redirige (308)** : Facebook impose
  que l'image soit accessible **sans redirection** sur le même hôte que la page.
- Chaque partage d'une URL apex subit **2 redirections** avant le contenu réel.

**Second défaut (qualitatif) :** l'image OG est **toujours en anglais**
(« Websites that turn visitors into clients ») même partagée depuis `/fr` ou
`/ar`, alors que `og:title`/`og:description` sont bien localisés → aperçu incohérent
avec la langue de la page.

### Décisions prises par l'utilisateur

1. **Plateforme impactée** : LinkedIn / Facebook.
2. **URL partagée** : `sofianeasma.me` (apex, sans `www`).
3. **Domaine canonique** : **`www`** (l'apex 308→www est déjà en place côté hébergeur,
   aucune action DNS n'est requise).
4. **Image OG localisée fr/en/ar** : **oui**.

## Questions / décisions en attente

1. **Variable d'environnement de production** : `NEXT_PUBLIC_SITE_URL` **surcherger
   la valeur par défaut du code**. Il faut la passer à `https://www.sofianeasma.me`
   dans le tableau de bord de l'hébergeur (Vercel ?) — **action utilisateur, hors
   code**. *À confirmer : où le site est-il déployé ?*
2. **Rendu arabe dans Satori** : la police par défaut n'a **aucun glyphe arabe**
   (texte vide/tronqué) → un TTF arabe doit être fourni. La qualité du *shaping*
   arabe (jonction des lettres) par Satori/opentype.js doit être **validée visuellement** ;
   si le rendu est incorrect, on garde la copie **EN** pour `locale=ar` et on le
   signale à l'utilisateur (décision finale à prendre après constat visuel).
3. **Pas de compte X/Twitter** connu (`SOCIAL_LINKS` ne contient que LinkedIn +
   GitHub) → `twitter:site` / `twitter:creator` **non ajoutés**.

---

## 1. Base de données (DB)

**Aucun impact.** Projet statique, pas de schéma, pas de migration.

---

## 2. API Routes / Server Actions

### 2.1 Alignement canonical `www` — `src/lib/seo.ts`
*(Fichier unique — cœur du correctif)*

- **`BASE_URL`** (ligne 5-6) : défaut → `https://www.sofianeasma.me`
  (et documenter que `NEXT_PUBLIC_SITE_URL`, si défini, doit aussi pointer vers `www`).
  `getBaseUrl()` supprime déjà la barre finale → **aucun autre changement de signature**.
- **`buildOgImageUrl(locale?: Locale)`** :
  ```ts
  export function buildOgImageUrl(locale: Locale = routing.defaultLocale) {
    return `${getBaseUrl()}/api/og?locale=${locale}&v=3`;
  }
  ```
  - `v=3` (**cache-bust obligatoire** : les plateformes ne re-téléchargeront pas
    l'image si l'URL ne change pas).
  - Paramètre **optionnel** → la ré-exportation
    `export { buildOgImageUrl } from "@/lib/seo"` dans
    `src/components/SEO/JsonLd.tsx` reste valide (aucun autre appelant dans le repo,
    vérifié par grep).
- **`generateLocaleMetadata()`** (ligne 50) : passer `locale` à `buildOgImageUrl(locale)`.
- **`openGraph.images[0]`** : ajouter `type: "image/png"` et
  `secureUrl: ogImage` (Facebook est plus strict sur l'image que sur les autres champs).
- **Aucune modification** de `metadataBase`, `title`, `description`, `keywords`,
  `alternates.canonical`, `alternates.languages`, `openGraph.url`, `twitter.*` :
  ils suivent automatiquement le nouveau `BASE_URL`.

**Effet en cascade attendu (sans toucher aux fichiers) :**
`src/app/[locale]/layout.tsx`, `src/app/[locale]/creation-site-web/page.tsx` et
`src/app/[locale]/projects/[slug]/page.tsx` produisent automatiquement
`og:url` = `https://www.sofianeasma.me/<locale>…`, `canonical` et `hreflang` en `www`.

**Critère « fait » :** `npx tsc --noEmit` OK ; sur `/fr` le HTML affiche
`og:url` = `https://www.sofianeasma.me/fr`, `og:image` =
`https://www.sofianeasma.me/api/og?locale=fr&v=3`, `canonical` = `https://www.sofianeasma.me/fr`.

### 2.2 Image OG localisée — `src/app/api/og/route.tsx`
*(Fichier unique, + 1 fichier police à créer)*

**a) Lecture et validation du paramètre `locale`**
- `new URL(request.url).searchParams.get("locale")` → valider avec
  **`isLocale()` exporté par `src/i18n/routing.ts`** (liste fermée `fr|en|ar`).
- Valeur absente ou invalide → fallback silencieux sur `routing.defaultLocale`
  (`"fr"`). **Jamais de 500**, jamais de texte injecté depuis l'URL
  (surface de rendu maîtrisée — règle du plan précédent conservée).

**b) Copie localisée** (constantes dans le fichier, alignées sur
`metadata.ogTitle` / `metadata.ogDescription` des 3 messages) :

| Clé | `fr` | `en` (actuel) | `ar` |
|---|---|---|---|
| badge | `DISPONIBLE POUR DE NOUVEAUX PROJETS` | `AVAILABLE FOR NEW PROJECTS` | `متاح لمشاريع جديدة` |
| titre L1/L2/L3 | `Des sites web` / `qui transforment` / `vos visiteurs` | `Websites that` / `turn visitors` / `into clients` | `مواقع ويب` / `تجلب لك` / `عملاء جدد` |
| sous-titre | `Sites rapides et professionnels pour PME, applications web et SaaS sur-mesure.` | *(actuel)* | `مواقع ويب احترافية وسريعة للشركات الصغيرة، وتطبيقات وSaaS حسب الطلب.` |
| rôle | `DÉVELOPPEUR WEB & MOBILE` | `FULL-STACK WEB & MOBILE` | `مطوّر ويب وتطبيقات جوال` |

- **Lignes de titre courtes (≤ ~18 caractères)** : colonne gauche de 728 px
  (1200 − 2×56 padding − 40 gap − 320 colonne droite) à 64 px gras.
- Identité basse (`Sofiane ASMA` · `sofianeasma.me`) : **inchangée, quelle que
  soit la locale** (nom propre et domaine).

**c) Direction RTL**
- Conteneur racine : `dir={locale === "ar" ? "rtl" : "ltr"}` et
  `textAlign: locale === "ar" ? "right" : "left"` sur les blocs de texte ;
  `alignItems: flex-end` sur la colonne gauche en `ar`.
- Le badge, la photo et la colonne droite inversent leur ordre visuel
  (`flexDirection: "row-reverse"` en `ar`) pour rester cohérents.

**d) Police arabe (bloquant pour `ar`)**
- **Créer `src/app/api/og/fonts/Cairo.ttf`** (TTF statique, licence SIL OFL-1.1 —
  le fichier existait avant le plan précédent et avait été supprimé).
  Procédure de récupération : `curl` de
  `https://fonts.googleapis.com/css2?family=Cairo:wght@700` avec un **User-Agent
  HTTP ancien** (ex. `Mozilla/4.0`) qui force Google à renvoyer des **TTF statiques**
  (non variable), puis extraction de l'URL `fonts.gstatic.com` du bloc `@font-face`.
- Chargement : `fs.readFile` + cache mémoire module (pattern `avatarDataUriPromise`
  déjà en place), **une seule fois par cold start**.
- Passage à `ImageResponse(..., { fonts: [...] })` **uniquement pour `locale=ar`**
  (ou les 3 locales si le rendu latin est identique — à vérifier visuellement).
- **Fallback** : si la lecture du fichier échoue → copie **EN** + logo par défaut,
  réponse **200** (règle : la route ne renvoie **jamais** de 500).

**e) Invariants à conserver**
`export const runtime = "nodejs"`, `Cache-Control` 7 jours,
`width: 1200, height: 630`, logique avatar (`TRUSTED_ORIGINS`, détection
PNG/JPEG, fallback monogramme « SA »), `display: flex` explicite sur **chaque**
élément (exigence Satori), `fontWeight: 700` maximum, aucun emoji.

**Critère « fait » :** `GET /api/og?locale=fr|en|ar&v=3` renvoie 200 +
`image/png` ; les 3 PNG sont **visualisés** : photo présente, badge/texte dans la
langue demandée, aucun texte tronqué, `ar` en RTL correct.

### 2.3 Documentation — `README.md`
- Ligne 42 : `NEXT_PUBLIC_SITE_URL=https://sofianeasma.me` →
  `NEXT_PUBLIC_SITE_URL=https://www.sofianeasma.me`.
- Ajouter une note d'une ligne : la variable **doit** correspondre au domaine
  canonique `www`, sans quoi les aperçus de partage retombent sur le domaine seul.

---

## 3. UI Components

**Aucun composant React touché.** Aucune modification de
`src/components/**`, de `layout.tsx` (hors effet en cascade automatique de §2.1)
ni du `HeroSection`.

---

## 4. Tests

### 4.1 Statique
- `npx tsc --noEmit`
- `npx eslint .`
- `npm run build`

### 4.2 Vérifications locales (Lead)
- **HTML** : récupérer `/fr`, `/en`, `/ar` et contrôler la présence de
  `og:url` = `https://www.sofianeasma.me/<locale>`,
  `og:image` = `https://www.sofianeasma.me/api/og?locale=<locale>&v=3`,
  `canonical`/`hreflang` en `www`, `twitter:title`/`twitter:image`.
- **Images OG** : `GET /api/og?locale=fr&v=3`, `…&locale=en…`, `…&locale=ar…`
  → télécharger les 3 PNG et **les visualiser** (le lecteur de fichiers affiche
  les images) : pas de glyphe manquant, pas de texte coupé, RTL correct.
- **Robustesse** : `GET /api/og?locale=zz&v=3` → 200 (fallback `fr`),
  `GET /api/og` sans param → 200.
- **UA Facebook** : requête avec `User-Agent: facebookexternalhit/1.1` sur `/fr`
  → 200 + balises présentes.

### 4.3 Revue manuelle post-déploiement (utilisateur — NON NÉGOCIABLE)
1. Mettre à jour **`NEXT_PUBLIC_SITE_URL=https://www.sofianeasma.me`** dans
   l'environnement de production, puis **redéployer**.
2. **Facebook Sharing Debugger** (`https://developers.facebook.com/tools/debug/`)
   → saisir `https://sofianeasma.me` → bouton **« Scrape Again »** : vérifier que
   `og:url` affiche désormais `https://www.sofianeasma.me/fr` et que l'image
   1200×630 apparaît.
3. **LinkedIn Post Inspector** (`https://www.linkedin.com/post-inspector/`)
   → « Inspect URL » sur `https://sofianeasma.me`.
4. Re-partager le lien dans un **nouveau** message (les aperçus sont cachés
   ~7 jours par Facebook/LinkedIn).

---

## Sécurité & edge cases à couvrir

- **Paramètre `locale`** : validé par `isLocale()` (liste fermée) → aucun texte
  tiers injecté dans le JSX Satori, aucune injection d'URL dans l'image.
- **Route OG résiliente** : 200 systématique (fallback monogramme + fallback copie
  EN) — sinon Facebook/WhatsApp affichent « aucune information ».
- **`TRUSTED_ORIGINS`** de la route OG contient déjà `sofianeasma.me` **et**
  `www.sofianeasma.me` → inchangé, mais **vérifier** que le fetch de l'avatar
  fonctionne désormais depuis l'origine `www` (le hash d'asset émis par le build).
- **Aucune DB / auth / formulaire touché** → surface d'attaque inchangée.
- **Régression SEO** : le seul changement volontaire est le domaine
  (`apex` → `www`) sur `canonical`/`hreflang`/`sitemap`. Cohérent avec la
  redirection 308 déjà en production ; les backlinks apex continuent de fonctionner.
- **Cache plateforme** : `?v=3` obligatoire sur l'image OG.
- **Locales invalides dans `generateMetadata`** : garde-fou `hasLocale` existant
  → **ne pas y toucher**.
- **Police arabe absente/corrompue** → repli EN, jamais d'erreur 500.
- **Variable d'env encore sur `apex`** en production → correctif code inopérant
  (point 1 des questions en attente).

---

## Ordre d'exécution (séquentiel — 1 tâche = 1 prompt isolé)

| # | Agent | Tâche | Fichiers exacts | Commit après APPROUVE |
|---|---|---|---|---|
| 1 | Backend | Canonical `www` + image OG localisée v3 (§2.1) | `src/lib/seo.ts` | `feat(seo): canonical www et image og locale versionnee v3` |
| 2 | — | **Reviewer** sur le diff tâche 1 | — | — |
| 3 | Backend | Police arabe (téléchargement TTF OFL) (§2.2d) | `src/app/api/og/fonts/Cairo.ttf` | `chore(og): police Cairo ttf pour le rendu arabe` |
| 4 | — | **Reviewer** | — | — |
| 5 | Backend | Carte OG localisée fr/en/ar (§2.2 a,b,c,e) | `src/app/api/og/route.tsx` | `feat(og): carte og localisee fr/en/ar avec rtl` |
| 6 | — | **Reviewer** | — | — |
| 7 | Lead | Tests statiques + visuels des 3 PNG (§4.1-4.2) | — | `test(seo): verifications tsc/eslint/build et rendus og` |
| 8 | Lead | **Point de décision arabe** : rendu correct ? sinon repli EN (§2.2d) | `src/app/api/og/route.tsx` si repli | `fix(og): repli anglais si rendu arabe incorrect` |
| 9 | — | **Reviewer** | — | — |
| 10 | Tester | Validation E2E finale (§4) | — | — |
| 11 | Utilisateur | Redéploiement + re-scrape FB/LinkedIn (§4.3) | — | — |

**Règles :** aucune tâche ne démarre avant le feu vert Reviewer de la
précédente ; aucun historique ni code des autres tâches n'est transmis aux
sous-agents ; `git add` limité aux fichiers de la tâche ; **jamais de push**.

---

## Validation finale (Reviewer → Tester)

1. **Reviewer** : revue du `git diff` après **chaque** tâche (typage TypeScript,
   validation du paramètre `locale`, absence de fichiers hors périmètre,
   résilience de la route OG) → `APPROUVE` / `REJETE`.
2. **Tester** (fin de module) : `/fr`, `/en`, `/ar` répondent 200 ; balises
   `og:*`/`twitter:*` présentes et pointant vers `www` + `?locale=…&v=3` ;
   `GET /api/og?locale=fr|en|ar` → PNG 1200×630 valide ; `locale=zz` → 200.
3. **Synthèse utilisateur** : fichiers touchés, statut des revues, captures des
   3 images OG, et **procédure de mise à jour de l'env var + re-scrape**
   Facebook Sharing Debugger / LinkedIn Post Inspector.
