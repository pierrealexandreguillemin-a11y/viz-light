---
authority: canonical
last_verified: 2026-08-12
expires: never
---

# SPEC — Viz Light

> **Ce document tranche tout.** En cas de contradiction avec un autre document, un
> message ou un souvenir : SPEC.md gagne. Les *pourquoi* sont dans
> `docs/decisions/`, les mesures dans `docs/evidence/`, l'histoire dans
> `docs/handoff/`.

## 1. Objet

Catalogue unifié des visualisations / backgrounds animés du portefeuille, né du
projet claude.ai « Viz Light ». Deux publics :

1. **Pierre-Alexandre** — parcourir pour le beau et l'original (wow effect,
   élégance), sur une vitrine déployée.
2. **Un claude+n** — envoyé depuis n'importe quel projet hôte chercher un
   background et l'**extraire sans friction**.

Le projet claude.ai « Viz Light » reste une **antenne de sourcing** (repérage,
conversion en mobilité). **Ce dépôt est la source unique de vérité** : tout ce qui
naît là-bas est rapatrié ici ([ADR 0001](decisions/0001-catalogue-unifie-dans-claude-code.md)).

## 2. Produit

- **App Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind 4**,
  couleurs **OKLCH** partout — le moule exact de ma-cdm / ma-nfl
  ([ADR 0003](decisions/0003-moule-next-16-ma-cdm-ma-nfl.md)). Sortie statique,
  pas de backend. Pas de PWA en v1 (YAGNI).
- **Une viz = un dossier = un composant React natif**
  ([ADR 0002](decisions/0002-viz-en-composants-react-natifs.md)) :

  ```
  src/viz/<slug>/
  ├── <Name>.tsx      # coquille mince (composant client)
  ├── algo.ts         # logique de dessin en TS PUR — aucun import React
  ├── manifest.json   # fiche : origine, tags, params, deps, perf mesurée,
  │                   #   liste exacte des fichiers à copier
  └── notes.md        # optionnel : éditorial, toggles pédago, pièges
  ```

- **Socle = hooks React partagés** (`src/core/hooks/`) : `useBoucleAnimation`,
  `useSurface` (plafond DPR), `useVisible` (pause onglet caché / hors viewport),
  `usePreferenceMouvement`, `useInstrument` — composés par
  `<SceneViz>`. **Le contrat entre une viz et le socle est
  `src/core/viz/contrat.ts`** : la viz reçoit un élément hôte et rend
  `{ frame, redimensionner?, demonter? }`. Il ne nomme aucun runtime, ce qui
  couvre canvas2d, webgl brut, p5 (mode instance piloté par notre boucle) et
  dom-css sans adaptateur par famille. Soupape pour stack incompatible : HTML
  autonome dans `public/labs/` rendu via `<IframeViz>`, catalogué avec le même
  manifest.
- **Registre auto-découvert** depuis les manifests ; chargement paresseux par viz
  (p5.js n'est chargé que pour les sketches p5).
- **Instrument de mesure en socle**, replié par défaut dans la vitrine : cadence
  réelle, temps JS médian/p95, détection GPU-bound
  ([ADR 0005](decisions/0005-instrument-en-socle-perf-tamponnee.md)). Les blocs
  éditoriaux « ce qu'on lit vs ce que la mesure montre » et les toggles
  « mauvaise pratique » sont du **contenu par viz** (notes.md), pas du socle.
- **Perf tamponnée** : `scripts/bench.mjs` (Puppeteer) mesure chaque viz et écrit
  les chiffres dans son manifest — un claude+n choisit sur données sans rien
  exécuter.

## 3. Contrat d'extraction (claude+n)

([ADR 0004](decisions/0004-extraction-par-copie-de-dossier.md))

1. Lire `CATALOG.md` (généré depuis les manifests) : nom, aperçu, ambiance, coût
   mesuré, **liste exacte des fichiers à copier**.
2. Copier `src/viz/<slug>/` + les 2-3 fichiers de socle listés dans la fiche.
3. Hôte React/Next (le standard du portefeuille, cf.
   `evidence/stacks-portfolio.md`) : poser `<VizName />`. Terminé.
4. Hôte non-React (rare — aucun consommateur réel aujourd'hui) : reprendre
   `algo.ts` + la **recette de montage générique** documentée une fois dans
   `CATALOG.md` (~20-30 lignes). Pas d'adaptateur par viz maintenu (YAGNI).

**Règle de portabilité** : dans chaque viz, l'algorithme est du TS pur ; le
composant n'est qu'une coquille mince. C'est ce qui rend 3. trivial et 4. bon
marché.

## 4. Périmètre v1

Rapatrier et unifier les **34 viz rapatriées** (→ **31 uniques** après
déduplication) depuis les trois artifacts sources (provenance et inventaire
vérifié : `evidence/sources-viz-light.md`) :

- 19 sketches p5.js @yuruyurau (#つぶやきProcessing) — compté dans le fichier
  rapatrié le 2026-08-12 ; la genèse en annonçait 18
- 10 effets réglables du banc d'essai (canvas2d / dom-css / webgl)
- 5 algos paramétrables de l'« Atelier génératif »

Doublons (Tunnel de points ×3, Flow Field ×2) : **la version validée par
l'utilisateur gagne**, l'autre est notée en variante dans le manifest. Pour le
Flow Field, l'arbitrage revient à l'utilisateur au moment de la migration.

**Deux rendus par viz p5** ([ADR 0008](decisions/0008-deux-rendus-par-viz-origine-et-aligne.md)) :
`origine` (portage fidèle, monochrome) et `aligne` (traitement du Tunnel de
points — teinte HSB dérivée de la géométrie, traînée par fondu, souris,
paramètres). **`aligne` est le rendu par défaut** ; les deux partagent le même
`algo.ts`. Le Tunnel n'est pas une trahison du style @yuruyurau, c'en est un
raffinement — décision de l'utilisateur, 2026-08-12.

**Fidélité non négociable** : chaque viz migrée est vérifiée **visuellement
contre l'original** par captures comparées (Puppeteer). C'est le rendu
`origine` qui porte cette preuve — un rendu raffiné rendrait une erreur de
portage indiscernable d'un choix de couleur. Substituer une version générique à
une implémentation validée est une faute grave (historique Viz Light).

Hors v1 (après recette) : nouvelles créations à la demande, rapatriement d'autres
sources (conversations claude.ai, tweets, CodePen, Shadertoy), HTML autonome
généré si un besoin réel apparaît, PWA, remote GitHub.

## 5. Socle qualité

Câblé **avant la première viz** (étape 3 du fil d'Ariane), principes du tier
global : TS strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) ·
ESLint type-aware · complexité cyclomatique **et** cognitive · longueur de
fonction **et** de fichier · duplication intra (linter) **et** inter-fichiers
(jscpd) · formatage · Vitest (hooks du socle, schéma manifest, registre) ·
Husky pre-commit + message conventionnel · **chaque gate calibré dans les deux
sens**. Gate documentaire déjà en place : `node scripts/check-docs.mjs`.
Preuves de calibration : `evidence/socle-qualite.md`. Chaîne complète :
`pnpm verify`, branchée en pre-push.

Deux gates propres à ce projet s'ajoutent au socle générique : la **frontière de
portabilité** (`src/viz/**/algo.ts` ne peut importer React/Next — c'est ce qui
fait tenir le contrat d'extraction du §3) et le **test OKLCH** (aucune couleur
hex/hsl en dur dans `src/`).

**Plancher de couverture** posé à l'étape 4 (2026-08-12) sur le code qui décide
— validateur de manifest, rendu du catalogue, générateur de registre : **94 /
93 / 97 / 99** (statements / branches / functions / lines), mesurés avant d'être
fixés. Ils se relèvent avec la mesure, jamais l'inverse.

`scripts/build-catalog.ts` est un gate : **manifest invalide ou perf manquante =
rouge**. Il écrit `CATALOG.md` et `src/viz/registre.genere.ts` — deux fichiers
générés, jamais édités à la main.

## 6. Gestion d'erreurs

- Error boundary par viz : une viz qui crashe affiche une carte d'erreur,
  l'app ne tombe jamais.
- Perte de contexte WebGL gérée dans le hook webgl.
- `prefers-reduced-motion` : première image statique par défaut, contournement
  explicite.

## 7. Déploiement

Vercel free tier, **après validation locale complète**
([ADR 0006](decisions/0006-deploiement-vercel-apres-validation-locale.md)) —
repo local + Vercel CLI, comme suminagashi.

## 8. Fil d'Ariane

Une étape ne commence pas tant que la précédente n'est pas verte. Chaque étape
produit quelque chose de visible ou compréhensible par l'utilisateur.

| # | Étape | État |
|---|-------|------|
| 0 | Genèse : cadrage, décisions, projection bootstrap (gardien) | ✅ 2026-08-11 |
| 1 | **Rapatriement brut des 3 artifacts** dans `sources/` (URLs périssables — en premier) | ✅ 2026-08-12 |
| 2 | Épinglage versions latest stables + scaffold Next 16 (`evidence/versions-epinglees.md`) | ✅ 2026-08-12 |
| 3 | Socle qualité câblé + calibré dans les deux sens (`evidence/socle-qualite.md`) | ✅ 2026-08-12 |
| 4 | Contrat de données : schéma manifest + registre + générateur CATALOG.md (gate) | ✅ 2026-08-12 |
| 5 | Socle viz : hooks core + instrument + coquille UI, prouvé par une viz réelle | ✅ 2026-08-12 |
| 5b | **Direction artistique + revue UI/UX** ([ADR 0009](decisions/0009-direction-artistique-planche-contact.md)) — repassée à l'étape 8, sur planche pleine | ✅ 2026-08-12 |
| 6 | Migration des viz par lots, fidélité par captures comparées, dédup | 🟡 1/31 |
| 7 | Bench Puppeteer + perf tamponnée dans les manifests | ✅ outil livré, tourne à chaque migration |
| 8 | Recette utilisateur (revue visuelle complète par Pierre-Alexandre) | ⬜ |
| 9 | Déploiement Vercel + CATALOG.md final | ⬜ |
| 10 | Entretien + ajouts au fil de l'eau (`scripts/new-viz.mjs`) — livrable permanent | ⬜ |

**L'étape 7 a fusionné dans l'étape 6** : le gate du catalogue refuse une viz
sans perf, donc chaque migration se termine par sa mesure. Mesurer en bloc à la
fin laisserait `pnpm verify` rouge pendant tout le chantier.

### Exigences ajoutées par l'utilisateur le 2026-08-12

Elles ne sont pas négociables et s'appliquent à **chaque** viz migrée :

1. **Les réglages survivent à la migration.** Le matériel d'origine se réglait
   en direct ; une viz migrée sans ses curseurs est une régression, pas une
   étape. `InstanceViz.regler()` change les valeurs sans remonter l'animation.
2. **Fonds et animations sont séparés** (champ `categorie`, requis et validé) —
   on ne les choisit pas de la même façon.
3. **Aucune légende.** Si un élément d'interface demande une explication, c'est
   l'élément qu'il faut remplacer.
4. **L'espace appartient aux visuels.** L'en-tête tient sur une ligne.
