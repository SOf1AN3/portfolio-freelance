# Polices de la carte Open Graph

Fichiers TTF statiques utilisés par `src/app/api/og/route.tsx` (rendu Satori).

Toutes sont distribuées sous licence **SIL Open Font License 1.1** :

| Fichier | Famille | Poids | Source |
|---|---|---|---|
| `Syne-Bold.ttf` | Syne | 700 | Google Fonts |
| `PlusJakartaSans-Regular.ttf` | Plus Jakarta Sans | 400 | Google Fonts |
| `PlusJakartaSans-SemiBold.ttf` | Plus Jakarta Sans | 600 | Google Fonts |
| `JetBrainsMono-Medium.ttf` | JetBrains Mono | 500 | Google Fonts |
| `Cairo-Regular.ttf` | Cairo | 400 | Google Fonts (utilisé pour `locale=ar`) |
| `Cairo-Bold.ttf` | Cairo | 700 | Google Fonts (utilisé pour `locale=ar`) |

Le texte intégral de la licence OFL 1.1 figure dans `OFL.txt`.

Les binaires ont été récupérés via l'API Google Fonts CSS2 avec un User-Agent
ancien, qui force la fourniture de **TTF statiques** (et non de fichiers
variables), seule forme acceptée par Satori pour un poids donné.
