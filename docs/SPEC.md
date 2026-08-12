---
authority: canonical
last_verified: 2026-08-13
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

### Deux régimes de migration, selon l'origine

([ADR 0010](decisions/0010-deux-regimes-de-migration.md) — décision de
l'utilisateur, 2026-08-12 : « pour les effets génériques, le code n'est pas
verbatim ».)

**Œuvres — `tweet-sketches` et `atelier-generatif` : portage fidèle.**
La formule EST l'œuvre. Chaque viz est vérifiée **visuellement contre
l'original** par captures comparées (Puppeteer) ; c'est le rendu `origine` qui
porte cette preuve — un rendu raffiné rendrait une erreur de portage
indiscernable d'un choix de couleur. Substituer une version générique à une
implémentation validée est une faute grave (historique Viz Light).

**Techniques — `banc-essai` (les fonds) : réécriture libre.**
Un grain de film, un dégradé flouté, une constellation sont des techniques
standard, sans auteur ni formule à préserver. On obtient l'effet, on ne
transcrit pas l'implémentation. Ils se jugent sur **le rendu et les paramètres
exposés**, pas sur une comparaison au pixel — donc pas de rendu `origine`
obligatoire, et pas de capture comparée. Le fait que leur source soit un bundle
minifié n'est **pas** un obstacle : `id`, `name`, `family`, `surface`, `params`,
`claim` et `reality` y sont en clair, et cela suffit pour réécrire du TypeScript
propre.

⚠ Confondre les deux régimes a un coût mesuré : appliquer la règle de fidélité
aux fonds a servi de motif pour les reporter, et la section « Fonds » de la
vitrine est restée vide (`evidence/erreurs-a-ne-pas-refaire.md` §12).

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
| 6 | Migration des viz par lots, deux régimes ([ADR 0010](decisions/0010-deux-regimes-de-migration.md)), dédup | 🟡 **28/31** |
| 7 | Bench Puppeteer + perf tamponnée dans les manifests | ✅ outil livré, tourne à chaque migration |
| 8 | Recette utilisateur (revue visuelle complète par Pierre-Alexandre) | ⬜ |
| 9 | Déploiement Vercel + CATALOG.md final | ⬜ |
| 10 | Entretien + ajouts au fil de l'eau (`scripts/new-viz.mjs`) — livrable permanent | ⬜ |

**L'étape 7 a fusionné dans l'étape 6** : le gate du catalogue refuse une viz
sans perf, donc chaque migration se termine par sa mesure. Mesurer en bloc à la
fin laisserait `pnpm verify` rouge pendant tout le chantier.

### État de l'étape 6 au 2026-08-13 (3e session) — 28 sur 31

**Les 18 sketches @yuruyurau sont migrés** (régime « œuvre », mesurés, chacun
avec sa paire de captures comparées dans `evidence/captures/`) :
`tunnel-de-points` (référence du rendu aligné), `spirale-tressee`,
`voile-tournante`, `coquille-cannelee`, `anneau-respirant`,
`coquille-jumelle`, `rosace-triple`, `corolle-de-maree`, `eventail-crante`,
`attracteur-de-lorenz`, `colonne-perlee`, `rosace-jumelle`,
`medaillon-tournant`, `ruban-plisse`, `ruban-ondule`, `anemone-marine`,
`couronne-battante`, `rosace-fondatrice`.

**Reste 3 viz** : les 5 algos de l'Atelier génératif moins les doublons
(Tunnel, Flow Field). L'arbitrage *Flow Field* appartient à l'utilisateur.

**Deux ajouts au moteur, tous deux exigés par une œuvre** : le champ
`PointCalcule.taille` (les cercles de diamètre variable du 7 mai) et
`placerEnPolaire(q, c, magnitude, ecart)`, forme partagée par plusieurs
sketches de la série — arithmétique identique, terme pour terme.

**Le Lorenz est le seul sketch à état** : il intègre pas à pas et se ré-amorce
quand `i` remonte, ce qui signale une nouvelle image. Les douze autres restent
des fonctions pures de `i`.

**Migrées, catégorie `fond`** (régime « technique », réécriture libre,
mesurées) : `orbes-floutees`, `mesh-gradient`, `grain-de-film`,
`poussiere-d-etoiles`, `flow-field`, `constellation`, `grille-synthwave`,
`balayage-radar`, `aurore-boreale`, `plasma-deforme`. Les réglages d'origine
survivent intégralement : le schéma de manifest porte désormais **trois genres
de paramètre** (`curseur`, `interrupteur`, `couleur`). La couleur d'une viz est
une donnée de la viz, pas de l'UI — même frontière que le gate OKLCH.

Les 18 œuvres migrées ont leur preuve de fidélité : **captures comparées dans
`evidence/captures/`** (rendu `origine` face à l'original p5), et formules
vérifiées caractère par caractère contre les one-liners golfés, rapatriés
intégralement dans **`sources/tweets-golfes.md`** — c'est CE fichier qui fait
foi, l'artifact `tweet-sketches-artifact.html` n'en est qu'une traduction.

### Les 13 derniers sketches — exécutés le 2026-08-13

(Le « 14 » précédent comptait le Tunnel deux fois : 18 golfés uniques, 5 faits
avant cette session, 13 ici.) La table ci-dessous est conservée telle qu'elle a
été exécutée : elle vaut désormais **carnet de portage** — chaque piège y est
nommé, chaque constante y est celle du golfé.

**Règles fixes, appliquées aux 13** :

- `angle` = le `c` de la formule, `magnitude` = la variable passée à `mag`
  (`d` ou `o`) — obligatoires au contrat du moteur.
- Souris : `c + decalageSouris * 6`, partout.
- Rendu `origine` : `trainee 255`, `saturation 0`, `influenceSouris 0`,
  `alphaPoint`/`points`/`vitesse` = les valeurs exactes du golfé (colonnes).
- Rendu `aligne` (défaut) : `trainee 40`, `alphaPoint 150`, `saturation 70`,
  `teinteBase 200`, `teinteEtendue 60`, `influenceSouris 0.3`, mêmes
  points/vitesse que l'origine.
- `categorie: "animation"`, `origine.source: "tweet-sketches"`, extraction =
  même liste de socle que `spirale-tressee`.
- Boucle par sketch : écrire → `pnpm catalog` → `pnpm build` → `pnpm bench` →
  paire de captures comparées dans `evidence/captures/` → `pnpm verify`.

| slug | nom | golfé (`tweets-golfes.md`) | points | vitesse | alpha | piège identifié |
|---|---|---|---|---|---|---|
| `coquille-jumelle` | Coquille jumelle | 8 août #2 | 20000 | 0.1047 | 66 | `x=i%100, y=i/250` ; sœur de la cannelée |
| `rosace-triple` | Rosace triple | 31 juillet | 10000 | 0.0524 | 96 | `m=i%3*4` |
| `corolle-de-maree` | Corolle de marée | 25 juillet | 10000 | 0.0393 | 96 | `d` NON élevé au carré ; `k` utilise `i/9` et `i/35` |
| `eventail-crante` | Éventail cranté | 24 juillet | 10000 | 0.0349 | 116 | `y^9` = XOR entier → `Math.trunc(y) ^ 9` |
| `attracteur-de-lorenz` | Attracteur de Lorenz | 9 mai | 30000 | 1 | 96 | état `x,y,z=9` réinitialisé quand `i` remonte ; intégrer PUIS tracer ; `t` = numéro d'image (`t++`) ; `magnitude = q/9` |
| `colonne-perlee` | Colonne perlée | 7 mai | 10000 | 0.0131 | 116 | cercles PLEINS, `taille` 2 si `k*k>15` sinon 1 → champ `taille` à ajouter au moteur |
| `rosace-jumelle` | Rosace jumelle | 5 mai | 20000 | 0.0698 | 96 | `m=i%2*9` ; ternaire `k*k<19` |
| `medaillon-tournant` | Médaillon tournant | 10 mars | 20000 | 0.0698 | 96 | `m=i%2*3` ; `sin(sin(…))` imbriqué |
| `ruban-plisse` | Ruban plissé | 8 mars #1 | 20000 | 0.1047 | 126 | `x=i, y=i/940` |
| `ruban-ondule` | Ruban ondulé | 8 mars #2 | 20000 | 0.1047 | 126 | `x=i, y=i/1000` |
| `anemone-marine` | Anémone marine | 7 mars | 20000 | 0.1047 | 96 | ternaire `y<19` ; `o = mag/5` |
| `couronne-battante` | Couronne battante | 6 mars | 30000 | 0.0698 | 96 | `e = i/1200-13` (`w=400` caché dans `i/w/3`) |
| `rosace-fondatrice` | Rosace fondatrice | 22 février | 20000 | 0.0524 | 96 | `a()` sans argument ; `c` dépend de `i%2` |

**Prochaine étape** : les algos de l'Atelier génératif — régime « œuvre ». La
seule décision restante du chantier appartient à l'utilisateur : l'arbitrage
*Flow Field* (banc d'essai, déjà migré en `fond`, vs Atelier) — lui montrer
les deux, ne rien trancher.

**Deux viz tiennent 30 i/s, mesurées** : `attracteur-de-lorenz` et
`couronne-battante` demandent ~33 ms de JavaScript par image, soit le double du
budget d'une image à 60 i/s. Ce n'est pas un défaut de portage — trente mille
points par image, c'est ce que demande le golfé. Le curseur « Points » permet à
l'utilisateur d'arbitrer ; les manifests portent le chiffre réel.

### Comment migrer une viz (boucle complète)

```
src/viz/<slug>/{algo.ts, <Nom>.tsx, manifest.json}   # écrire
pnpm catalog     # valide le manifest, regénère CATALOG.md + le registre
pnpm build       # le bench a besoin de out/
pnpm bench       # mesure UNE viz à la fois, écrit perf dans les manifests
pnpm verify      # docs → catalog → format → lint → typecheck → dup → test:cov → build
```

`pnpm catalog` reste **rouge tant qu'une viz n'a pas sa perf** : c'est voulu.

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
