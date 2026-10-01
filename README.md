# Sofiane ASMA — Portfolio Freelance

Site portfolio / landing page de conversion pour les services de développement web & mobile de **Sofiane ASMA**.

## Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript** strict
- **Tailwind CSS 4** + composants **Shadcn/UI**
- **Framer Motion** (animations)
- **next-intl** (FR, EN, AR avec RTL)
- **React Hook Form + Zod** (formulaire de contact)
- **Lucide React** (icônes)
- **SEO** : Metadata API, JSON-LD, sitemap, robots, Open Graph dynamique

## Démarrage

```bash
npm install
npm run dev
```

Site : [http://localhost:3000/fr](http://localhost:3000/fr)

## Routes

| Route | Description |
|-------|-------------|
| `/fr` | Accueil français |
| `/en` | Accueil anglais |
| `/ar` | Accueil arabe (RTL) |
| `/[locale]/projects/[slug]` | Pages projets |
| `/sitemap.xml` | Sitemap multi-langues |
| `/robots.txt` | Robots.txt |
| `/api/og` | Images Open Graph dynamiques |

## Configuration

Définir l'URL publique dans les variables d'environnement :

```env
NEXT_PUBLIC_SITE_URL=https://sofianeasma.me
```

## WhatsApp

Numéro intégré : `+213 551 797 313`  
Lien direct : `https://wa.me/213551797313`

## Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Layout racine i18n (RTL, fonts, SEO)
│   │   ├── page.tsx            # Landing page
│   │   └── projects/[slug]/    # Pages projets
│   ├── api/og/                 # OG images dynamiques
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/                 # Navbar, Footer, LanguageSwitcher
│   ├── sections/               # Hero, Services, Projects, ...
│   ├── ui/                     # Composants Shadcn
│   └── SEO/                    # JSON-LD
├── content/                    # Données projets & tech stack
├── i18n/                       # Routing, request, navigation
└── messages/                   # fr.json, en.json, ar.json
```
