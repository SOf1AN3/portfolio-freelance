# PLAN — Redesign global « Obsidian Atelier » + nouveau contenu + animations & scroll smooth

> Remplace l'ancien `PLAN.md` (plan « canonical www + image OG », **intégralement terminé
> et validé**, arbre propre à la date de cette réécriture).

## Contexte & besoin métier

L'utilisateur a réalisé un **redesign complet avec Stitch** et l'a déposé dans `redesign/` :

| Fichier | Rôle |
|---|---|
| `redesign/DESIGN.md` | Design system « Obsidian Atelier » (tokens, typo, grilles, composants) |
| `redesign/code.html` | Maquette HTML complète (746 lignes, Tailwind CDN) — **référence visuelle** |
| `redesign/screen.png` | Capture pleine page de la maquette |

**Demandes explicites :**
1. **Refaire le design entier** du site en suivant ce redesign (thème « Obsidian Atelier » :
   canvas `#090A0F`, surfaces ardoise, hairlines 1px, accent émeraude `#10B981`, Syne /
   Plus Jakarta Sans / JetBrains Mono, grille éditoriale asymétrique, micro-indices mono).
2. **Changer le contenu** (copy) de tout le site.
3. ⛔ **Ne jamais écrire « artisan »** → **« ingénieur fullstack »** (fr), « Full-Stack
   Software Engineer » (en), « مهندس Full-Stack » (ar). Porte sur *toutes* les occurrences
   nouvelles (la maquette Stitch contient `Artisan Full-Stack & Web`,
   `ARTISANAT DU CODE…`, `rigueur d'un atelier d'artisan` → toutes reformulées).
4. **Encore plus d'animations** que l'existant.
5. **Scroll super smooth** (inertiel).

### Décisions validées par l'utilisateur
1. **Périmètre : tout le site** — home, `/projects/[slug]`, `/creation-site-web`, 404.
2. **Contenu réécrit dans les 3 locales** (fr + en + ar).
3. **Scroll smooth : Lenis** (nouvelle dépendance, synchronisée framer-motion).
4. **AboutSection conservée**, redesignée (la maquette n'en a pas ; la bio reste utile au SEO).
5. **Visuels : assets locaux existants** (photo `images.sofiane` traitée N&B + cadrage émeraude,
   visuels `/projects/*.svg`) — **aucune URL Google éphémère de la maquette n'est retenue**.

### Ce que la maquette Stitch N'EST PAS
- Pas du code à copier-coller : elle utilise Tailwind CDN (JIT arbitrary values), des classes
  non structurées, `material-symbols` (Google Fonts) et des `<details>` pour la FAQ.
  → On **porte le design** dans les conventions du projet : Tailwind v4 local, **lucide-react**
  pour les icônes (déjà en dépendance), composants React/i18n existants.
- `redesign/**` est en **lecture seule** : aucun fichier de ce dossier n'est modifié.

### État actuel du projet (analyse faite)
- Next **16.3.8** + React 19 + **Tailwind v4** (`@import "tailwindcss"`, `@theme inline`) +
  **framer-motion 13** + **next-intl 4** (fr/en/ar) + shadcn-style `src/components/ui/*`.
- Thème actuel : bleu/slate (`--background: #020617`, accents bleus), `scroll-behavior: smooth` CSS.
- Polices : `Plus_Jakarta_Sans`, `Cairo` (RTL), `JetBrains_Mono` — **Syne absente → à ajouter**.
- Home = 8 sections dans `src/app/[locale]/page.tsx` (Hero, Services, Projects, TechStack,
  Process, Faq, About, Contact) ; chaque section = composant client + `useTranslations`.
- Copy i18n uniquement dans `src/messages/{fr,en,ar}.json` ; structure data dans
  `src/content/projectsData.ts` (5 projets, clés `*Key`) et `src/content/techStackData.ts`
  (6 groupes) — **ces deux fichiers data sont stables** (pas de changement de schéma).
- Aucune base de données, aucune auth : **piste DB = sans objet**.

---

## Questions / décisions en attente

*Aucune.* Toutes les questions ont été tranchées (voir « Décisions validées » ci-dessus).

---

## CONTRATS INTER-PISTES (figés — exécutables en parallèle)

> Tout sous-agent part de CE contrat. Il n'a pas le droit de le renegotier ; s'il a besoin
> d'autre chose → il remonte `AUTO-KO` au Lead.

### C1 — Tokens CSS (`src/app/globals.css`, Tailwind v4)

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

:root {
  /* Canvas & surfaces (Obsidian Atelier) */
  --canvas: #090A0F; --deep: #0E1017; --card: #151822; --elevated: #1C202E;
  --hairline: #272C3D; --hairline-glass: rgba(255,255,255,0.07);
  /* Texte (jamais blanc pur) */
  --platinum: #F1F5F9; --mist: #94A3B8; --fog: #64748B;
  /* Accent unique, usage parcimonieux */
  --emerald: #10B981; --emerald-bright: #34D399; --on-emerald: #003824;
  --danger: #FFB4AB;
  /* Rayons « precision-machined » (pas de pilules) */
  --radius: 0.25rem;
  --radius-sm: 0.125rem; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.75rem;
}
```

Mapping `@theme inline` (classes générées, **noms figés**) :

| Token | Classe Tailwind |
|---|---|
| `--color-canvas` | `bg-canvas`, `text-canvas`, `border-canvas` |
| `--color-deep` | `bg-deep` (sections alternées, champs de saisie enfoncés) |
| `--color-card` | `bg-card` (cartes) |
| `--color-elevated` | `bg-elevated` (hover, overlays) |
| `--color-hairline` | `border-hairline` |
| `--color-platinum` | `text-platinum` (titres) |
| `--color-mist` | `text-mist` (texte courant) |
| `--color-fog` | `text-fog` (méta, micro-index) |
| `--color-emerald` | `text-emerald`, `bg-emerald`, `border-emerald` (accent) |
| `--color-emerald-bright` | `text-emerald-bright` |
| `--color-on-emerald` | `text-on-emerald` |
| `--color-danger` | `text-danger` (erreurs formulaire) |

Polices (variables next/font) :
```css
--font-display: var(--font-syne), var(--font-cairo), system-ui, sans-serif; /* → font-display */
--font-sans:    var(--font-plus-jakarta), var(--font-cairo), system-ui, sans-serif;
--font-mono:    var(--font-jetbrains), ui-monospace, monospace;
```
*(Cairo en fallback du stack : Syne n'a pas de glyphes arabes → `locale=ar` reste lisible.)*

**Grille : pas de custom spacing scale.** On utilise l'échelle standard Tailwind avec les
valeurs du design : marges `px-6 md:px-12 lg:px-20` (1.5 / 3 / 5 rem), contenu
`max-w-7xl mx-auto`, sections `py-24 lg:py-32`, gaps `gap-6 lg:gap-8`. Zéro classe arbitraire
exotique hors `w-[…]` ponctuelles.

**Base conservée :** `scrollbar-gutter: stable` (commentaire existant à préserver),
`::selection`, `[dir="rtl"] .rtl:rotate-180`.
**Base retirée :** `html { scroll-behavior: smooth }` → **conflictuel avec Lenis** (Lenis
documente l'interdire) ; remplacé par le provider (C2).

**`prefers-reduced-motion` (obligatoire) :**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
}
```
+ désactivation du lissage Lenis (C2).

**Utilitaires/keydowns à créer :** `.text-balance`, `.text-pretty` (existants, conservés),
hairline `@utility hairline { border-color: var(--hairline-glass) }` si besoin, keyframes :
`marquee`, `pulse-dot`, `grid-drift`, `shimmer`, `border-sweep`.

### C2 — Scroll smooth : `src/components/providers/SmoothScrollProvider.tsx` (nouveau)

```tsx
"use client";
export function SmoothScrollProvider({ children }: { children: React.ReactNode }): JSX.Element;
```
- Installe **Lenis** (`lenis` v1, import par défaut `Lenis`) : `duration: 1.1`,
  `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (easeOutExpo),
  `smoothWheel: true`, `touchMultiplier: 1.5`, `wheelMultiplier: 1`.
- Boucle `requestAnimationFrame` dédiée, cleanup complet au démontage (StrictMode-safe).
- **Désactivé** si `matchMedia("(prefers-reduced-motion: reduce)").matches` → scroll natif.
- Intercepte les clics sur `a[href^="#"]` (même origine, hash non vide) →
  `lenis.scrollTo(hash, { offset: -96 })` (offset = navbar sticky). Fallthrough si la cible
  n'existe pas.
- Exporte aussi `export function scrollToId(id: string, offset?: number): void` (utilisable
  par le composant si l'instance existe, sinon `scrollIntoView` fallback).
- Monté **une seule fois** dans `src/app/[locale]/layout.tsx` autour des children (layout =
  server component ; le provider est client → children passent en client boundary, acceptable
  car toutes les sections sont déjà `"use client"` ; **vérifier** que `metadata`/`generateStaticParams`
  ne sont pas impactés — aucun rendu server spécifique en dehors du layout).

### C3 — Polices : `src/app/[locale]/layout.tsx`

Ajouter `Syne` (`next/font/google`, weights `["600","700","800"]`, variable `--font-syne`,
`display: "swap"`), conserver `Plus_Jakarta_Sans`, `Cairo`, `JetBrains_Mono` et leurs variables.
`<html>`/`<body>` : garder `dark` (le `@custom-variant dark` et le `<html class="dark">`
existent) + conserver `suppressHydrationWarning` s'il existe.

### C4 — Primitives UI : `src/components/ui/*` (refonte interne, **API publique INCHANGÉE**)

Chaque composant garde **exactement** ses props, variantes et exports actuels (les sections les
consomment déjà) : `Button` (`variant`: `default | whatsapp | outline | …`, `size`),
`Badge` (`variant: success | …`), `Card`, `Container`, `Input`, `Textarea`, `Label`, `Select`,
`Separator`, `Skeleton`, `Dialog`, `Sheet`, `DropdownMenu`.
Changement **visuel uniquement** :
- Bouton primary = fond `bg-platinum` / texte `bg-canvas` / `rounded-md` (4px) / hover `#E2E8F0` ;
  variante `whatsapp` = accent émeraude `bg-emerald text-on-emerald` (identité WhatsApp conservée
  fonctionnellement, teinte alignée sur le design) ; `outline` = `bg-card border-hairline` →
  hover `border-white/20 bg-emerald/5`.
- `Badge` = token rectangulaire `rounded-sm border border-hairline bg-white/3px mono uppercase`,
  **pas de pilule** (le variant `success` garde son point 6px émeraude clignotant).
- Champs de saisie : `bg-deep border-hairline rounded-md font-mono text-platinum placeholder:text-fog`,
  **focus : bordure `border-emerald` pure (0 blur)**.
- Surfaces flottantes (Dialog/Sheet/Dropdown) : `bg-card/85 backdrop-blur-xl border border-white/8`.
- **Nouveau** `src/components/ui/section-header.tsx` :
  ```tsx
  export function SectionHeader({ index, title, lead, align }: {
    index: string;   // ex. "01 / ARCHITECTURE & OFFRE DE SERVICES"
    title: string; lead?: string; align?: "start" | "between";
  }): JSX.Element;
  ```
  Micro-index mono `text-[11px] tracking-[0.2em] uppercase text-emerald` + filet `h-px w-12`,
  titre `font-display text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight text-platinum`,
  lead `text-mist`. Animé via `Reveal` (C5).

### C5 — Animations partagées : `src/components/animations/*` (nouveaux fichiers)

Tous : `"use client"`, framer-motion, et **`useReducedMotion()` de framer-motion** → si `true`,
pas de transform/blur (fade seul ou rendu statique).

| Fichier | Export | API |
|---|---|---|
| `Reveal.tsx` | `Reveal` | `{ delay?, y?, blur?, once?, children, className? }` → `whileInView` fade + montée + micro-flou, `viewport: { once, margin: "-10% 0px -10% 0px" }`, `ease: [0.16,1,0.3,1]`, `duration: .7` |
| `Stagger.tsx` | `Stagger` / `StaggerItem` | container `staggerChildren: .08` + items `opacity/y` |
| `Counter.tsx` | `Counter` | `{ to: number, prefix?, suffix?, duration?, decimals? }` — count-up au `whileInView` (gère `to > 1000` et suffixes `+`, `<`) |
| `Marquee.tsx` | `Marquee` | `{ speed?, reverse?, pauseOnHover?, children }` — rail infini en CSS `animation: marquee`, contenu dupliqué `aria-hidden` |
| `Parallax.tsx` | `Parallax` | `{ amount?: number (px, défaut 40), children }` — `useScroll({target, offset:["start end","end start"]})` + `useTransform` |
| `Magnetic.tsx` | `Magnetic` | `{ strength?: .25, children }` — translation vers le curseur (`onPointerMove`), retour élastique au leave, **désactivé sur `pointer: coarse`** |
| `ScrollProgress.tsx` | `ScrollProgress` | barre fixée `top-0 left-0 h-[2px] bg-emerald origin-start` pilotée par `useScroll().scrollYProgress` |

**Contrat d'usage section :** chaque section utilise `SectionHeader` + `Reveal`/`Stagger`,
au moins **4 familles d'animations distinctes** par page d'accueil (reveal, stagger, parallax,
counter, marquee, magnetic, scroll-progress, hover-sweep), sans jamais sacrifier la lisibilité.

### C6 — Contrat i18n : `src/messages/{fr,en,ar}.json` (**règle additive**)

> Le sous-agent Contenu **réécrit les valeurs** et **ajoute des clés**, mais **ne supprime ni
> ne renomme aucune clé existante** (les pages secondaires et `projectsData.ts` référencent
> `projects.items.N.*`, `tech.*`, `websiteOffer.*`, etc.).

**Ajouts obligatoires (structure exacte) :**
```jsonc
"hero": {
  "eyebrow": "…",                       // ex. fr: "INGÉNIERIE & ARCHITECTURES NUMÉRIQUES"
  "profile": {
    "label": "…",                       // fr: "PROFIL INGÉNIEUR"
    "role": "…",                        // fr: "Ingénieur Full-Stack & Web" ⚠️ JAMAIS « artisan »
    "description": "…",
    "specs": [{ "label": "…", "value": "…" }, { "label": "…", "value": "…" }, { "label": "…", "value": "…" }]
  },
  "metrics": [{ "label": "…", "tag": "…", "value": "05", "unit": "…", "description": "…" }] // ×3
  // hero.stats existant : conservé tel quel (non utilisé par le nouveau hero)
},
"services":     { "index": "01 / …", "items": [ { …, "index": "01 // …", "duration": "2 À 4 SEMAINES" } ] },
"projects":     { "index": "02 / …", "items": [ { …, "challenge": "…" } ] },   // ×5 projets
"tech":         { "index": "03 / …" },
"process":      { "index": "04 / …", "steps": [ { …, "phase": "…", "deliverable": "…" } ] }, // ×4
"faq":          { "index": "05 / …" },
"about":        { "index": "…" },
"contact":      { "index": "06 / ENTRER EN LIAISON", "form": { …clés existantes conservées… },
                  "whatsappCard": { "title": "…", "description": "…", "cta": "…" },
                  "coordinates": { "label": "…", "email": "…", "phone": "…", "reach": "…" } }
```

**Réécritures de fond (3 langues) :** hero (titre « Sites web d'exception & ingénierie
logicielle pour entreprises exigeantes. »), services, projets (descriptions + `challenge`),
tech, process (4 phases), FAQ (5-6 questions), à-propos, contact, footer, `metadata.*`
(title/description/ogTitle/ogDescription/keywords : **on garde les mots-clés SEO**
`création de site web`, `application web`, `SaaS`…).

**Interdiction absolue :** « artisan / artisanat / craft / atelier d'artisan / حرفي ».
Remplacements : `Ingénieur Full-Stack` (fr) · `Full-Stack Software Engineer` (en) ·
`مهندس Full-Stack` (ar). Le reste de la maquette Stitch (ton, structure) sert de base de copy,
**traduite** pour en/ar (pas de français résiduel dans `en.json`/`ar.json`).

**RTL (ar) :** pas de texte latent en LTR, pas de dates en dur ; utiliser des libellés
courts ; vérifier que `index` mono ne casse pas (ordre `flex` logique).

---

## 1. Base de données (DB)

**Aucun impact.** Projet statique, sans schéma ni migration. *(Pas de sous-agent Database.)*

---

## 2. Fondations (Vague 0 — parallèle, bloquante)

### 2.1 F-1 · Tokens, polices & scroll — `Frontend`
- `src/app/globals.css` → **contrat C1** (tokens, fonts, radius, keyframes, reduced-motion,
  retrait de `scroll-behavior: smooth`, conservation de `scrollbar-gutter: stable`).
- `src/app/[locale]/layout.tsx` → **C3** (Syne) + montage de `<SmoothScrollProvider>`.
- `src/components/providers/SmoothScrollProvider.tsx` → **nouveau, C2**.
- `src/lib/motion.ts` → **nouveau** : `export const EASE = [0.16, 1, 0.3, 1] as const;`,
  `fadeUp`, `staggerParent`, `staggerChild`, `viewportOnce` (partagé par les sections).
- **Fait si :** `npx tsc --noEmit` OK, le site compile, Lenis tourne (scroll inertiel) et
  `prefers-reduced-motion` désactive tout.

### 2.2 F-2 · Primitives UI — `Frontend`
- Refonte visuelle des **13 fichiers** `src/components/ui/*.tsx` + création
  `src/components/ui/section-header.tsx` → **contrat C4** (API strictement inchangée).
- **Fait si :** aucun appelant casse (`tsc --noEmit`), boutons/champs/dialogues en thème Obsidian.

### 2.3 F-3 · Bibliothèque d'animations — `Frontend`
- Création des 7 fichiers `src/components/animations/*.tsx` → **contrat C5**.
- **Fait si :** `tsc --noEmit` OK, chaque brique utilisable seule, reduced-motion respecté.

### 2.4 C-1 · Contenu i18n (3 langues) — `Backend` (piste contenu)
- `src/messages/fr.json`, `src/messages/en.json`, `src/messages/ar.json` → **contrat C6**
  (réécriture complète du copy + ajouts de clés, règle additive, interdiction « artisan »).
- **Fait si :** les 3 fichiers sont JSON valides (`node -e "require('./src/messages/xx.json')"`),
  aucune clé supprimée (`git diff` = additions + valeurs), zéro occurrence « artisan »
  (grep insensible à la casse sur les 3 fichiers), contenu en/ar **sans reste français**.

### 2.5 B-1 · Formules d'identité — `Backend`
- `src/lib/seo.ts` : `jobTitle: "Full-Stack Software Engineer"` (+ la libellé FR/AR si présent).
- `src/app/manifest.ts` : « Développeur Web & Mobile Full-Stack » → « Ingénieur Full-Stack —
  sites & applications web ».
- **Fait si :** `tsc --noEmit` OK, JSON-LD/manifest cohérents.

---

## 3. Sections & pages (Vague 1 — 8 pistes parallèles)

> Chaque piste reçoit : le contrat (C1–C6), **ses fichiers uniquement**, et le fait que le
> contenu i18n est déjà réécrit (elle lit `messages/*.json` pour les clés).

### 3.1 H-1 · Hero — `src/components/sections/HeroSection.tsx`
Grille 12 col. asymétrique : gauche 7 col. (micro-index `eyebrow`, H1 `font-display`
« Sites web d'exception **&** ingénierie logicielle… », sous-titre `text-mist`, 2 CTA :
primary plat `bg-platinum` + secondaire `bg-card border-hairline` avec compteur `[ 05 ]`),
droite 5 col. = carte « PROFIL INGÉNIEUR » (photo locale traitée `grayscale contrast-125`
+ liseré émeraude + dégradé bas, rôle **« Ingénieur Full-Stack & Web »**, 3 specs mono).
Fond : dot-grid 40px + halo émeraude flou (`blur-[140px] bg-emerald/5`) + `Parallax`.
Sous la grille : **3 cartes métriques** (`Counter` : `05`, `+3`, `<24h`).
Animations : reveal échelonné, H1 mot-à-mot (`Stagger`), léger parallax du halo,
hover `Magnetic` sur le primary.
### 3.2 H-2 · Services + Process
- `ServicesSection.tsx` : bandeau `bg-deep border-y border-hairline`, `SectionHeader index="01 / …"`,
  grille 2×2 de cartes (en-tête `01 // VITRINES CRITIQUES` + durée, titre Syne, description,
  liste `features` en lignes séparées hairline), hover = balayage `border-sweep` + titre → émeraude.
- `ProcessSection.tsx` : `index="04 / …"`, 4 étapes en ligne (`01`…`04`) reliées par un filet
  animé (`scaleX` au scroll), bloc `phase` mono émeraude, `deliverable` en bas de carte,
  entrée en `Stagger` + compteurs d'index.
### 3.3 H-3 · Projects + TechStack
- `ProjectsSection.tsx` : `index="02 / …"`, cartes ledger 2 colonnes : ligne technique
  (`2026 // LOGISTIQUE` vs statut `● EN LIGNE` avec point `animate-ping`), visuel local
  (`getProjectImage`) en cadre `bg-deep` avec `Parallax` interne, titre Syne, description,
  encart **« DÉFI INGÉNIERIE »** (`projects.items.N.challenge`), tags `/ NEXT.JS`
  (mono, `rounded-sm`, **pas de pilules**), lien sortant `arrow-outward`.
  Données via `projectsData.ts` (**non modifié**) + `challenge` depuis messages.
- `TechStackSection.tsx` : `index="03 / …"`, 6 piliers (`techStackData.ts`, non modifié) en
  grille 3 col. (compteur `05 BRIQUES`, description `tech.categoryDescriptions.*`, tokens mono),
  + **bandeau `Marquee`** infini des technologies sous la grille (bonus animation),
  + bandeau conseil final avec lien `#contact`.
### 3.4 H-4 · FAQ + About
- `FaqSection.tsx` : `index="05 / …"`, accordéon **animé** (framer `AnimatePresence` +
  hauteur auto, **pas de `<details>` natif**), bordure active émeraude, icône chevron `rotate-180`,
  une seule ouverte à la fois (state), `role="button"`/`aria-expanded` corrects.
- `AboutSection.tsx` : redesign « ledger éditorial » (photo N&B, bio réécrite,
  `highlights` en lignes hairline, rôle « Ingénieur Full-Stack », CTA), `Reveal` + `Parallax`.
### 3.5 H-5 · Contact + bouton flottant
- `src/components/sections/ContactSection.tsx` (+ `src/components/WhatsAppButton.tsx`) :
  `index="06 / ENTRER EN LIAISON"`, split 7/5 : formulaire React Hook Form + Zod **inchangé
  logiquement** (validation, `contact.form.*`, route `/api/contact` non touchée) mais en
  champs `font-mono bg-deep border-hairline focus:border-emerald` + labels mono uppercase +
  états d'erreur `text-danger` animés ; colonne 5 : carte WhatsApp (bordure émeraude,
  bouton plein) + bloc « COORDONNÉES DIRECTES » en lignes ledger.
  **Ne pas toucher** : `src/app/api/contact/route.ts`, `src/lib/contact.ts`, schéma Zod.
### 3.6 H-6 · Navbar + Footer + i18n
- `src/components/layout/Navbar.tsx` : sticky, `bg-canvas/75 backdrop-blur-xl border-b border-hairline`,
  logo mono `SOFIANE ASMA`, liens `text-mist hover:text-platinum` + soulignement animé,
  CTA `Discuter de mon projet`, `ScrollProgress` monté ici, état scroll (hauteur/bordure
  apparaissent au scroll), menu mobile Sheet existant restylé, **RTL-safe**.
- `src/components/layout/Footer.tsx` : `bg-deep border-t border-hairline`, bloc identité +
  colonnes Navigation / Réseaux (`src/lib/socials.ts` inchangé) + `rights`, micro-index mono.
- `src/components/layout/LanguageSwitcher.tsx` : restyle (menu `bg-card/85 backdrop-blur`),
  logique de langue **inchangée**.
### 3.7 P-1 · Pages projets & 404
- `src/app/[locale]/projects/[slug]/page.tsx` : héro projet type ledger (index
  `ARCH.04 // 2024`, statut, titre Syne, meta `role/context/focus/stack`), sections `Reveal`,
  image locale en cadre hairline, CTA + lien retour, `generateMetadata` **conservé** (SEO).
- `src/app/[locale]/not-found.tsx` + `src/components/SEO/NotFoundClient.tsx` : 404 Obsidian
  (grand code mono `404`, copy réécrite, CTA accueil/WhatsApp).
### 3.8 P-2 · Accueil & page SEO
- `src/app/[locale]/page.tsx` : ordre conservé
  (Hero, Services, Projects, TechStack, Process, Faq, About, Contact) + montage global
  `<ScrollProgress />` (si non monté en Navbar) ; zéro logique métier ajoutée.
- `src/app/[locale]/creation-site-web/page.tsx` : **contenu SEO conservé** (mots-clés,
  `websiteOffer.*`, `generateMetadata` intacts) mais habillé Obsidian (SectionHeader, cartes,
  listes hairline, CTA), animations `Reveal`/`Stagger`.

---

## 4. Tests

### 4.1 Statique (Lead, après chaque vague)
`npx tsc --noEmit` · `npx eslint .` · `npm run build`.

### 4.2 Vérifications fonctionnelles (Lead)
- `/fr`, `/en`, `/ar` → 200 ; RTL correct (micro-index, marges, flèches) sur `/ar`.
- Scroll inertiel actif ; ancres `#services #projets #contact` = décalage navbar respecté ;
  **`prefers-reduced-motion`** → plus aucune animation ni inertie.
- Formulaire : validation OK (champ vide, email invalide, succès) — comportement identique
  à avant (API `/api/contact` non modifiée).
- `grep -ri "artisan" src/` → **0 occurrence** (hors « artisanat » métier *client* déjà existant
  dans `services.items` — celui-ci désigne la **clientèle** et n'est pas une auto-désignation ;
  il reste autorisé, à confirmer visuellement).
- Aucune URL `googleusercontent` dans `src/` (assets Stitch interdits).

### 4.3 Validation E2E (`Tester`, fin de module)
Playwright : parcours accueil 3 locales, menu mobile, accordéon FAQ, switch de langue,
formulaire de contact (jusqu'à l'API mockée), lien WhatsApp (`href` correct),
pages projet + 404 + `/creation-site-web`, absence d'erreurs console, capture desktop + mobile.

---

## Partition des fichiers (obligatoire — aucun fichier sur 2 pistes)

| Fichier | Piste (vague) |
|---|---|
| `package.json` / lock (`npm i lenis`) | **Lead** (v. 0, avant tout lancement) |
| `src/app/globals.css` | F-1 |
| `src/app/[locale]/layout.tsx` | F-1 |
| `src/components/providers/SmoothScrollProvider.tsx` *(nouveau)* | F-1 |
| `src/lib/motion.ts` *(nouveau)* | F-1 |
| `src/components/ui/*.tsx` (13) + `section-header.tsx` *(nouveau)* | F-2 |
| `src/components/animations/*.tsx` (7, nouveaux) | F-3 |
| `src/messages/fr.json`, `en.json`, `ar.json` | C-1 |
| `src/lib/seo.ts`, `src/app/manifest.ts` | B-1 |
| `src/components/sections/HeroSection.tsx` | H-1 |
| `src/components/sections/ServicesSection.tsx`, `ProcessSection.tsx` | H-2 |
| `src/components/sections/ProjectsSection.tsx`, `TechStackSection.tsx` | H-3 |
| `src/components/sections/FaqSection.tsx`, `AboutSection.tsx` | H-4 |
| `src/components/sections/ContactSection.tsx`, `src/components/WhatsAppButton.tsx` | H-5 |
| `src/components/layout/Navbar.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx` | H-6 |
| `src/app/[locale]/projects/[slug]/page.tsx`, `not-found.tsx`, `src/components/SEO/NotFoundClient.tsx` | P-1 |
| `src/app/[locale]/page.tsx`, `src/app/[locale]/creation-site-web/page.tsx` | P-2 |
| `redesign/**` | **lecture seule, aucun agent** |
| Intouchés : `src/app/api/**`, `src/lib/contact.ts`, `rate-limit.ts`, `i18n/*`, `content/*`, `seo.ts` (hormis `jobTitle`), `JsonLd.tsx`, `sitemap/robots` | — |

---

## Sécurité & edge cases à couvrir

- **i18n** : 3 locales alignées (mêmes clés, mêmes `index` numérotés) ; `en`/`ar` sans texte
  français résiduel ; RTL sans `ltr`-only (`me-`/`ms-`, `text-start`).
- **Reduced motion** : Lenis off + transitions quasi nulles (C1/C2) — testé en DevTools.
- **Accessibilité** : `h1` unique / `h2` par section, focus visibles (`focus-visible:ring`
  émeraude), accordéon ARIA, contrastes (platinum/fog sur `#090A0F` ≥ 4.5:1 ; émeraude réservée
  aux accents ≥ 3:1 sur grand texte), `alt` sur toutes les images.
- **Perf** : pas d'images distantes (assets locaux), `next/image` conservé, `priority` hero
  uniquement, Lenis ≈ 4 Ko, animations GPU (`transform`/`opacity`), aucun `layout`/`paint` animé.
- **SEO** : `generateMetadata` des pages projet/SEO intacts, copy conservée ses mots-clés,
  JSON-LD inchangé hors `jobTitle`.
- **Formulaires** : validation Zod + rate-limit **non touchés** ; le redesign ne change que
  le habillage → pas de régression de sécurité.
- **Hydration** : `useReducedMotion`/`matchMedia` uniquement côté client (`useEffect`), pas de
  random dans le render initial (SSR/hydration mismatch).
- **Instagram/scroll lock** : garder `scrollbar-gutter: stable` pour ne pas recréer le
  décalage latéral des overlays Radix.

---

## Ordre d'exécution

**Vague 0 — parallèle (5 agents en arrière-plan)**
0. Lead : `npm install lenis` → `chore(deps): ajout de lenis pour le scroll inertiel`
1. F-1 Fondations (tokens/polices/scroll) ∥ F-2 UI ∥ F-3 Animations ∥ C-1 Contenu 3 langues ∥ B-1 Identité SEO
2. Lead : `tsc --noEmit` + `eslint` → commit par tâche AUTO-OK (sérialisés)

**Vague 1 — parallèle (8 agents en arrière-plan)**, uniquement si Vague 0 est verte :
3. H-1 Hero ∥ H-2 Services+Process ∥ H-3 Projects+Tech ∥ H-4 FAQ+About ∥ H-5 Contact ∥
   H-6 Navbar+Footer ∥ P-1 Projets+404 ∥ P-2 Accueil+page SEO
4. Lead : `tsc` / `eslint` / `build` + correctifs, commits sérialisés par tâche

**Vague 2 — validation**
5. `Tester` (E2E Playwright, 3 locales, desktop + mobile) → rapport
6. Synthèse utilisateur (fichiers touchés, statuts AUTO-OK, captures, points de vigilance)

**Règles d'orchestration :** prompts isolés (2-4 fichiers max par agent, aucun historique),
`git add` limité aux fichiers de la tâche, commits Conventional Commits sérialisés,
**jamais de push**, `redesign/` jamais modifié.

---

## Validation finale (auto-revues → Tester)

1. Chaque tâche `AUTO-OK` (revue auto : TypeScript strict, contrats C1–C6 respectés, périmètre
   respecté, zéro « artisan » auto-désigné, zéro URL Stitch) **avant** commit.
2. `tsc --noEmit` + `eslint` + `build` verts en fin de chaque vague.
3. `Tester` E2E (§4.3) en fin de module → rapport complet.
4. Synthèse utilisateur : design appliqué partout, contenu réécrit 3 langues, inventaire des
   animations, constat du scroll inertiel, fichiers touchés, statut des tests.
