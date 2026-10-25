# PLAN — Open Graph card « Obsidian Atelier » (pro 100 %)

> Remplace le `PLAN.md` précédent (refonte globale du site — **intégralement exécutée,
> commitée et poussée** : `7542b7c` → `c112877`, `origin/main` à jour).

## Contexte & besoin métier

L'image **Open Graph** (`/api/og`) est la première chose que LinkedIn, WhatsApp, X et
Facebook affichent d'un partage. Celle en production est **restée sur l'ancien thème bleu**
alors que le site affiche désormais l'identité **Obsidian Atelier** : l'image et le site ne
racontent plus la même histoire. Objectif : une carte **100 % alignée**, localisée fr/en/ar,
et reprenant le nouveau positionnement.

### Constat (cartes réelles fr/ar analysées, `og-avant-*.png`)
| Écart | Détail |
|---|---|
| Palette bleue | `linear-gradient(#020617 → #101c3d)`, accents `#3b82f6 / #60a5fa / #93c5fd` |
| Pastille arrondie | badge `borderRadius: 9999` → **interdit** par le design system (rayons 2-6 px) |
| Typo par défaut | aucun **Syne** (display) ni **JetBrains Mono** (technique) |
| Avatar circulaire | halo bleu `boxShadow`, alors que le site cadre la photo en **rectangle + liseré émeraude** |
| Copie périmée | `DÉVELOPPEUR WEB & MOBILE` → doit devenir **`INGÉNIEUR FULL-STACK`** ; titre ≠ hero actuel |
| Zéro détail ledger | pas de micro-index mono, pas de filet, pas de strate de surface |
| Cache | `?v=3` dans `seo.ts` → **`v=4`** obligatoire, sinon les plateformes ne re-téléchargent pas |

### Décisions validées par l'utilisateur
1. **Accroche = hero actuel** (« Sites web d'exception & ingénierie logicielle »…), rôle
   « Ingénieur Full-Stack » présent dans les 3 langues.
2. **Portrait en cadre rectangulaire** (style carte profil du hero : `rounded-md`, liseré émeraude).
3. **Carte unique** (une seule image pour tout le site, localisée fr/en/ar) — pas de variante
   projet ni variante page SEO.

## Questions / décisions en attente
*Aucune.*

---

## 1. Base de données (DB)
**Aucun impact.**

## 2. Polices (piste Frontend/Lead)
Téléchargement de TTF statiques (licence SIL OFL 1.1, comme `Cairo` déjà présent) dans
`src/app/api/og/fonts/` — procédure : requête Google Fonts CSS2 avec **User-Agent ancien**
(ex. `Mozilla/4.0`) pour obtenir des TTF **statiques**, extraction de l'URL `fonts.gstatic.com`.

| Fichier à créer | Usage | Poids |
|---|---|---|
| `Syne-Bold.ttf` | titres display (identité du site) | 700 |
| `PlusJakartaSans-Regular.ttf` | sous-titre / corps | 400 |
| `PlusJakartaSans-SemiBold.ttf` | nom, éléments d'identité | 600 |
| `JetBrainsMono-Medium.ttf` | micro-index, labels mono, rôle, domaine | 500 |

- `Cairo-Regular.ttf` / `Cairo-Bold.ttf` : **déjà présents**, conservés pour `locale=ar`.
- **Repli** : si la lecture d'un TTF échoue → on rend sans cette police (police par défaut
  de Satori), **jamais de 500**. Chargement en cache mémoire module (pattern
  `loadCairoFonts()` existant → généralisé `loadFonts()`).
- Ajouter la mention OFL pour les nouvelles polices dans `src/app/api/og/fonts/` (note
  `LICENSE-FONTS.md`, Cairo étant déjà couvert par `OFL.txt`).

## 3. Route OG — `src/app/api/og/route.tsx` (fichier unique, cœur du chantier)

### 3.1 Invariants à préserver (NON NÉGOCIABLES)
`export const runtime = "nodejs"` · `Cache-Control` 7 jours · `1200×630` · validation
`isLocale()` + repli `routing.defaultLocale` · logique avatar (`TRUSTED_ORIGINS`,
`candidateOrigins`, détection PNG/JPEG par signature, fallback **monogramme**, promesse
cache) · `display: flex` **explicite sur chaque élément** (exigence Satori) ·
`fontWeight ≤ 700` · aucun emoji · la route renvoie **toujours 200** (repli EN +
monogramme ; le `500` actuel n'est conservé que pour les erreurs Satori imprévues).

### 3.2 Nouvelle copie (3 langues, champ `COPY` — remplace l'existant)
| Clé | fr | en | ar |
|---|---|---|---|
| `eyebrow` | `INGÉNIERIE & ARCHITECTURES NUMÉRIQUES` | `SOFTWARE ENGINEERING & DIGITAL ARCHITECTURE` | `هندسة البرمجيات والعمارة الرقمية` |
| `title1` | `Sites web d'exception` | `Exceptional websites` | `مواقع استثنائية` |
| `title2` | `& ingénierie logicielle` | `& software engineering` | `وهندسة برمجيات` |
| `subtitle` | `Pour entreprises exigeantes : applications web, SaaS et plateformes sur-mesure, ultra-rapides et simples à piloter.` | `For demanding businesses: web apps, SaaS and custom platforms — fast and effortless to run.` | `للشركات المطالبة: تطبيقات ويب وأنظمة SaaS ومنصات حسب الطلب، سريعة وسهلة التسيير.` |
| `badge` | `DISPONIBLE POUR DE NOUVEAUX PROJETS` | `AVAILABLE FOR NEW PROJECTS` | `متاح لمشاريع جديدة` |
| `role` | `INGÉNIEUR FULL-STACK` | `FULL-STACK SOFTWARE ENGINEER` | `مهندس Full-Stack` |

Identité fixe (toutes langues) : `Sofiane ASMA` · `sofianeasma.me`.
Contrainte : **≤ 22 caractères par ligne de titre** (colonne utile ≈ 740 px à 60 px de corps),
sinon troncature visuelle.

### 3.3 Mise en page (1200×630, padding 56)
```
┌─ fond #090A0F + halo radial émeraude discret (haut-droite) + hairline interne ─┐
│  [colonne gauche — flex:1]                       │ [colonne droite — 320 px]     │
│  ▪ micro-index mono émeraude 22px + filet ─────  │                                │
│  TITRE Syne 700 / 60px / lh 1.05 / ls -1.5       │   ┌────────────────────┐       │
│  #F1F5F9 — 2 lignes                              │   │  photo 300×380     │       │
│  sous-titre Jakarta 26px #94A3B8 (2 lignes max)  │   │  radius 6, bordure │       │
│                                                  │   │  émeraude 1px      │       │
│  [badge RECTANGULAIRE : radius 4, bordure        │   │  + dégradé bas     │       │
│   émeraude, fond émeraude/10, carré 8px,         │   └────────────────────┘       │
│   mono 20px uppercase]                           │   RÔLE mono émeraude 20px     │
│  ─────────────── filet hairline ───────────────  │   (uppercase, tracking 2)      │
│  Sofiane ASMA (Jakarta 600 28px) · sofianeasma   │                                │
│  .me (mono 22px #64748B)                         │                                │
└──────────────────────────────────────────────────────────────────────────────────┘
```
- **Plus aucune pastille** : `borderRadius` max `6` sur la carte, `4` sur le badge, `2` sur le carré.
- Palette : fond `#090A0F`, texte `#F1F5F9`, secondaire `#94A3B8`, tertiaire `#64748B`,
  accent `#10B981` / `#34D399`, filets `rgba(255,255,255,0.08)`.
- **RTL (`ar`)** : `flexDirection: row-reverse` + `textAlign: right` (le miroitage actuel est
  correct, on le conserve), `Cairo` pour le texte arabe, le latin (« Full-Stack »,
  `sofianeasma.me`) reste lisible grâce aux glyphes latins de Cairo.
- Monogramme de repli : fond `#151822`, bordure `#272C3D`, initiales `SA` en Syne, **accent
  émeraude** (l'actuel est en dégradé bleu → à corriger).

### 3.4 Services d'images inchangés
`<img>` avec data-URI uniquement (exigence Satori), recadrage portrait conservé
(`AVATAR_BOX` / `avatarScale` / `avatarOffsetY`), `maxWidth: "none"`.

## 4. Cache — `src/lib/seo.ts`
- `buildOgImageUrl()` : `?v=3` → **`?v=4`** (cache-bust obligatoire : sans ce bump,
  Facebook/LinkedIn serviront l'ancienne image).
- Rien d'autre dans ce fichier (canonical/hreflang intacts).

## 5. Tests
### 5.1 Statique
`npx tsc --noEmit` · `npx eslint .` · `npm run build`.

### 5.2 Visuel (obligatoire — je regarde les 3 PNG)
- `GET /api/og?locale=fr|en|ar` → **200 + `image/png`**, poids < 1 Mo.
- **Les 3 images sont ouvertes et inspectées** : titre non tronqué, pas de `&amp;` littéral,
  badge rectangulaire, palette obsidian/émeraude, photo en cadre, rôle « Ingénieur Full-Stack »,
  `ar` en RTL correct avec glyphe arabe complet (pas de ▯).
- `GET /api/og?locale=zz` → 200 (repli `fr`), `GET /api/og` sans param → 200.
- HTML `/fr` : `og:image` contient bien `?v=4`.
- Ratio de lisibilité : la carte doit rester lisible **en vignette 300×157** (je la réduis
  numériquement pour contrôler).

### 5.3 Revue manuelle (utilisateur, après déploiement)
Facebook Sharing Debugger + LinkedIn Post Inspector → « Scrape Again » (l'aperçu est caché
~7 j).

---

## Partition des fichiers (aucun fichier sur 2 pistes)
| Fichier | Piste |
|---|---|
| `src/app/api/og/fonts/{Syne-Bold,PlusJakartaSans-Regular,PlusJakartaSans-SemiBold,JetBrainsMono-Medium}.ttf` + `LICENSE-FONTS.md` | Lead (téléchargement) |
| `src/app/api/og/route.tsx` | Lead (refonte visuelle) |
| `src/lib/seo.ts` (bump `v=4`) | Lead |
| Intouchés : `JsonLd.tsx`, `sitemap.ts`, `robots.ts`, `layout.tsx`, messages, composants | — |

## Ordre d'exécution
1. Téléchargement + vérification des 4 TTF (licence OFL) → commit `chore(og)`.
2. Refonte de `route.tsx` (copie + layout + polices + monogramme) → build.
3. Bump `?v=4` dans `seo.ts` → commit `feat(seo)`.
4. Rendu des 3 cartes, **inspection visuelle**, itération si texte tronqué/érreur Satori.
5. `tsc` / `eslint` / `build` verts → commit final + arrêt du serveur de test (port 3001).

## Validation finale
Auto-revue (typage strict, invariants §3.1 respectés, aucun fichier hors périmètre, zéro
`any`, route jamais en 500) → captures des 3 locales + variante réduite → synthèse utilisateur
avec procédure de re-scrape LinkedIn/Facebook.
