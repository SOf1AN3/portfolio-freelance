# PLAN — Conversion, honnêteté & offre PME du portfolio

## Contexte & besoin métier
Transformer le portfolio en outil d'acquisition pour des clients PME (sites web pro),
avec une offre secondaire apps web / SaaS / dashboards. Toute affirmation doit être
vérifiable : aucun témoignage, chiffre, client ou résultat inventé.

## Questions / décisions en attente (validation utilisateur finale)
- **Statut réel de chaque projet** (livré à un client / personnel / prototype) → utilisé
  prudemment : « Publié en ligne (démo publique) » + `TODO` identifiable dans le code.
- **Promesse « réponse/devis sous 24h »** → conservée mais à confirmer.
- **Mobile** : rétrogradé en capacité optionnelle (positionnement secondaire = web/SaaS).

## 1. Base de données
Aucune (projet statique, aucun schéma DB).

## 2. Contenu / traductions (FR, EN, AR)
### 2.1 Supprimer les affirmations invérifiables
- Fichiers : `src/messages/fr.json`, `en.json`, `ar.json`
  - Supprimer le bloc `testimonials` (3 faux témoignages).
  - Remplacer `hero.stats.items` : projets publiés en ligne, langues, disponibilité.
  - Assouplir `metadata.description` (retirer « Devis gratuit sous 24h »).
- Critère fait : plus aucune référence à des clients/témoignages/ancienneté invérifiables.

### 2.2 Repositionner les services (offre PME en tête)
- Fichiers : les 3 `messages/*.json`
  - Service 1 : « Création de sites web professionnels » (PME), lien vers la page offre.
  - Service 2 : applications web & SaaS sur-mesure (mobile mentionné en option).
  - Service 3 : refonte, performance & SEO. Service 4 : maintenance & accompagnement.
  - Retirer « sécurité au niveau entreprise » et « publication stores » (claims excessifs).
- Critère fait : 4 services, ordre PME → sur-mesure → refonte → maintenance.

### 2.3 Contenu de la nouvelle page offre + FAQ
- Fichiers : les 3 `messages/*.json` (nouvelles clés `websiteOffer`, `faq`, `projects.statuses`)
  - Audience, problèmes, livrables, options, étapes, CTA devis (sans prix inventés ;
    structure tarifaire « à définir » extensible).
  - FAQ : délais, fonctionnement, devis, maintenance, hébergement.
- Critère fait : clés présentes dans les 3 langues, pas de montant inventé.

## 3. Composants UI
### 3.1 Hero — hiérarchie & CTA
- Fichiers : `src/components/sections/HeroSection.tsx`, `src/components/layout/Navbar.tsx`
  - H1 orienté client : sites web pour petites entreprises ; identité « développeur
    full-stack » en sous-titre.
  - CTA primaire « Discuter de mon projet » → WhatsApp (canal réel existant).
  - CTA secondaire « Voir mes réalisations » → `#projects`.
  - Stats remplacées par des faits vérifiables.
- Critère fait : les 3 questions (qui / quels problèmes / comment contacter) sont
  répondues dans le premier écran.

### 3.2 Projets — statut, rôle, contexte
- Fichiers : `src/content/projectsData.ts`, `src/components/sections/ProjectsSection.tsx`,
  `src/app/[locale]/projects/[slug]/page.tsx`, messages ×3
  - Champs `status` (statut réel prudent + `TODO` de validation), `role`, `context`
    (problème à résoudre), `type`.
  - Affichage du statut et du rôle sur la carte et la page détail.
- Critère fait : chaque projet affiche son statut réel et le rôle exact ; lien live
  conservé uniquement quand il existe.

### 3.3 Suppression de la section Témoignages
- Fichiers : `src/app/[locale]/page.tsx` (+ suppression `TestimonialsSection.tsx`)
- Critère fait : plus aucune section invérifiable sur l'accueil.

### 3.4 Nouvelle page offre sites web PME
- Fichiers : `src/app/[locale]/creation-site-web/page.tsx` (nouveau),
  `src/components/sections/FaqSection.tsx` (nouveau, réutilisable),
  `src/components/layout/Footer.tsx` (lien), `src/components/sections/ServicesSection.tsx` (lien)
  - Sections : pour qui, problèmes résolus, livrables, options, étapes, FAQ, CTA devis
    (vers `#contact` + WhatsApp), métadonnées SEO dédiées.
- Critère fait : page pré-générée pour les 3 locales, accessible depuis services & footer.

### 3.5 FAQ sur l'accueil
- Fichiers : `src/app/[locale]/page.tsx` (insérer `FaqSection` avant `ContactSection`)
- Critère fait : FAQ visible sur l'accueil et sur la page offre.

## 4. SEO
### 4.1 Sitemap & métadonnées
- Fichiers : `src/app/sitemap.ts`, `src/lib/seo.ts` (si besoin), page offre
  - Ajouter `/creation-site-web` pour les 3 locales avec `alternates.languages`.
- Critère fait : sitemap contient la nouvelle URL avec hreflang.

## 5. Tests & vérifications finales
- `npm run lint`, `npm run build` (typecheck inclus).
- Vérification des 3 locales : accueil, offre, détail projet.
- Contrôle : aucun contenu invérifiable introduit.

## Sécurité & edge cases
- Formulaire existant déjà protégé (honeypot, rate-limit, validation Zod serveur) → inchangé.
- RTL arabe : nouvelle page composée en classes Tailwind neutres (pas de `left/right`).
- Statuts projets : formulation prudente, jamais « livré à un client » sans preuve.

## Ordre d'exécution
1. Traductions : suppression des affirmations invérifiables (§2.1). ✅
2. Traductions : repositionnement des services (§2.2). ✅
3. Hero + Navbar : CTA et accroche (§3.1). ✅
4. Projets : statut/rôle/contexte (§3.2). ✅
5. Suppression section Témoignages (§3.3) + FAQ accueil (§3.5). ✅
6. Page offre + sitemap (§3.4, §4.1). ✅
7. Lint / build / vérifications locales (§5). ✅

## Validation finale
- Reviewer : APPROUVE après chaque tâche (1 rejet RTL corrigé sur la FAQ). ✅
- Vérifications : `tsc --noEmit` OK, `eslint` OK, `next build` OK (28 pages statiques).
- Test API réel : `POST /api/contact` → `200 {"ok":true,"via":"smtp"}` (email réel envoyé),
  invalide → `400`, honeypot → `{"ok":true,"via":"ignored"}`. ✅
- Tester (E2E navigateur) : partiellement couvert — Playwright indisponible dans les
  sous-sessions ; tests statiques (HTML serveur) sans régression.
- Reste à valider par l'utilisateur : statut exact de chaque projet, promesse « 24h ».
