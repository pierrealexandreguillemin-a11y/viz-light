---
authority: annex
last_verified: 2026-08-12
expires: never
---

# Handoff — 2026-08-12 · étapes 1 à 5b, et 1re migration

**Session** : première de `claude-viz-light`. Point de départ : étape 0 seule
verte, aucun code applicatif.
**Point d'arrivée** : étapes **1 à 5b vertes**, **étape 6 entamée (1 viz sur
31)**. La vitrine tourne, avec le Tunnel de points mesuré à 59,9 i/s.

---

## 1. Ce qui a été fait

### Étape 1 — rapatriement (la seule urgente)

Les 3 artifacts sont dans `sources/`, commités, empreintes SHA-256 ancrées.
Provenance et méthode complètes : `evidence/sources-viz-light.md`.

**Méthode, à connaître si un fichier doit être re-tiré** : les URLs publiques
sont des SPA, un `GET` direct ne renvoie que la coquille (47 854 o, identique
pour les trois). Il faut la page rendue dans Chrome → bouton **« Copier »** →
presse-papiers → écriture **sans BOM**, puis **CRLF ramené en LF** (le
presse-papiers Windows livre du CRLF ; `.gitattributes` fige `sources/** -text`
pour qu'aucune conversion ne rejoue).

### Étape 2 — versions et scaffold

Next 16.3.0 / React 19.2.8 / TS strict / Tailwind 4.3.3, OKLCH, sortie statique.
Table d'épinglage complète : `evidence/versions-epinglees.md`.

### Étape 3 — socle qualité

`pnpm verify` = docs → format:check → lint → typecheck → dup → test → build,
branchée en pre-push. Seize gates calibrés dans les deux sens, sorties réelles
dans `evidence/socle-qualite.md`.

### Étape 4 — contrat de données

Schéma de manifest, validateur, rendu de `CATALOG.md`, générateur de registre.
Logique pure dans `src/core/`, entrées-sorties isolées dans
`scripts/build-catalog.ts`. Le gate rougit sur manifest invalide **et** sur perf
non mesurée. Plancher de couverture posé ici, mesuré avant d'être fixé.

### Étape 5 — socle viz

Contrat `src/core/viz/contrat.ts` : une viz reçoit un élément hôte et rend
`{ frame, redimensionner?, demonter? }`. Il ne nomme aucun runtime, donc
canvas2d, webgl, p5 et dom-css passent sans adaptateur par famille. Hooks :
`useBoucleAnimation`, `useSurface`, `useVisible`, `usePreferenceMouvement`,
`useInstrument`, composés par `<SceneViz>`.

### Étape 5b — direction artistique ([ADR 0009](../decisions/0009-direction-artistique-planche-contact.md))

Ajoutée à la demande de l'utilisateur. La palette du scaffold était un **défaut
d'IA** (fond quasi-noir + accent cyan vif), remplacée par la « planche
contact ». **À repasser à l'étape 8**, sur planche pleine : une direction se
juge sur du contenu réel.

### Étape 6 — 1 viz sur 31

**Tunnel de points**, porté en TypeScript pur canvas2d : la formule n'appelait
que `cos`, `sin` et `mag`, donc **p5 disparaît du bundle**. Deux rendus
(`origine`, `aligne`) issus du même algo. Mesuré : 59,9 i/s, JS 3,1 ms médian /
3,55 ms p95, CPU-bound.

### Décision de l'utilisateur en cours de session

« Aligne les p5 sur le tunnel de points » · « le tunnel de points est un
raffinement, une amélioration de ce style ». → **deux rendus par viz p5**,
`origine` et `aligne`, `aligne` par défaut
([ADR 0008](../decisions/0008-deux-rendus-par-viz-origine-et-aligne.md)).
Le schéma de manifest les porte déjà. **La mise en œuvre visible est à
l'étape 6** — c'est ce que l'utilisateur attend de voir.

---

## 2. Trois corrections apportées à ce qu'on croyait savoir

Elles comptent plus que la liste des livrables : à chaque fois, **la mesure a
contredit un document ou une déclaration**.

1. **L'inventaire annonçait 18 sketches ; il y en a 19.** Le sketch du 29 juillet
   figure sous deux états (« original » golfé et la reprise « Tunnel de points
   (HSB) » validée par l'utilisateur). Total réel : **34 entrées**, ~~33~~.
   Le compte d'uniques après dédup reste **31** — le Tunnel a donc **3**
   occurrences, pas 2. `SPEC.md §4` corrigé.
2. **`typescript@latest` = 7.0.2 est inutilisable ici.** Aucune version publiée
   de `typescript-eslint`, canary comprise, n'accepte TS 7 (peer `<6.1.0`).
   Épingler TS 7 revenait à perdre le lint type-aware exigé par `SPEC.md §5`.
   → TS **6.0.3**, [ADR 0007](../decisions/0007-typescript-6-plafonne-par-le-lint-type-aware.md).
3. **ESLint 10 a été épinglé puis retiré, et c'est l'exécution qui a tranché.**
   `eslint-config-next@16.3.0` déclare `eslint >=9.0.0`, mais sa dépendance
   transitive `eslint-plugin-react@7.37.5` plafonne à `^9.7` : `pnpm lint`
   plantait (`contextOrFilename.getFilename is not a function`). → ESLint
   **9.39.5**. **Leçon générale** : un `peerDependencies` de surface ne voit pas
   l'arbre transitif ; un épinglage n'est vérifié que quand la commande qu'il
   sert a réellement tourné.

---

## 3. Ce que la prochaine session doit savoir avant de coder

### 3.1 Les deux artifacts minifiés

`banc-essai-effets.html` et `genart-studio-standalone.html` sont des **bundles
esbuild**. Rien n'est perdu — noms de propriétés, métadonnées et **tous les
textes éditoriaux (`claim` / `reality`) sont intacts et lisibles**, le code est
complet — mais l'étape 6 demandera une relecture attentive, pas un
copier-coller. `tweet-sketches-artifact.html`, lui, est en clair.

Matière directe déjà repérée pour les manifests : chaque effet du banc d'essai
porte `id`, `name`, `family`, `surface`, `claim`, `reality` et sa liste de
`params`.

### 3.2 Un arbitrage appartient à l'utilisateur

**Flow Field** existe en deux versions (banc d'essai `flow`, canvas2d — et
Atelier `flow-field`). C'est un **verdict esthétique** : ne pas trancher à sa
place, lui montrer les deux au moment de la migration.

Le Tunnel, lui, est tranché : la référence est la version **HSB**, vérifiée dans
le code rapatrié (formule `i / 353`, `hsbToRgba` custom, traînée par fondu,
Perlin optionnel, rotation souris, bucketing des teintes à 3°).

### 3.3 Deux pannes de gate trouvées à l'étape 4 — à ne pas réintroduire

- **`pnpm verify` lançait `test` et non `test:cov`** : le plancher de couverture
  était écrit dans `vitest.config.ts` et **exécuté par rien**. C'est
  littéralement « un seuil documenté que rien n'exécute n'est pas un gate »,
  survenu à l'intérieur du dépôt qui énonce la règle.
- **Le rapport `text` de v8 omet les fichiers couverts à 100 %** sur les quatre
  colonnes. `generer.ts` en avait disparu et paraissait hors périmètre. Vérifier
  via `coverage/coverage-summary.json`, jamais via le tableau console.

### 3.3bis LE BUG À NE JAMAIS REFAIRE — l'instrument mesurait le vide

L'effet de montage de `SceneViz` lisait les dimensions du `ResizeObserver` tout
en les excluant de ses dépendances (`eslint-disable`). À l'instant où l'hôte
apparaît, la mesure n'existe pas : l'effet sortait par sa garde et ne rejouait
jamais. **Aucune viz ne se montait — et l'instrument annonçait 59,9 i/s et 0 ms
de JavaScript**, parce qu'il mesurait une boucle vide. Le bench a failli
tamponner ces chiffres dans le manifest.

Ce qui a tranché : lire le canvas dans la page (`canvasPresent: false`,
`pixelsAllumes: 0`). **Règle à garder** : un chiffre d'instrument ne prouve rien
tant qu'on n'a pas vérifié que l'objet mesuré existe. `tests/scene-viz.test.tsx`
l'exige désormais ; calibré dans les deux sens.

### 3.4 Le gate du catalogue bloque tant que le bench n'a pas tourné

`pnpm catalog` refuse de publier une viz dont `perf` vaut `null`. Conséquence
concrète pour l'étape 6 : **mesurer chaque viz au fur et à mesure de sa
migration** plutôt que d'attendre l'étape 7 en bloc, sinon `pnpm verify` reste
rouge pendant toute la migration. C'est voulu — l'absence de mesure doit gêner.

### 3.4 Le socle a déjà mordu une fois

Le gate type-aware a attrapé une assertion inutile dans le test OKLCH
lui-même, écrit dix minutes plus tôt. C'est le signe qu'il fonctionne — et le
rappel que l'auto-revue ne suffit pas (`evidence/socle-qualite.md §4`).

---

## 3.5 CE QU'IL FAUT FAIRE EN PREMIER À LA REPRISE

**Les 10 effets `fond` du banc d'essai.** Ce sont les plus simples du
catalogue — grain de film, orbes floutées, mesh gradient, constellation,
poussière d'étoiles, grille synthwave, balayage radar, plus deux WebGL — et
**la section « Fonds » de la vitrine est vide sans eux**. C'est ce que
l'utilisateur attend de voir, et c'est le reproche qu'il a formulé en fin de
session.

Ne pas se laisser arrêter par le fait que `sources/banc-essai-effets.html` est
un bundle minifié : chaque effet y porte, **en clair**, son `id`, son `name`,
sa `family`, sa `surface`, ses `params` et ses textes `claim` / `reality`. Un
grain ou un dégradé se réécrit depuis cette description ; il n'y a rien à
désassembler. Cf. `evidence/erreurs-a-ne-pas-refaire.md` §12.

## 4. État à la passation

- Fil d'Ariane : **0 à 5b ✅**, étape 6 à 1/31, 7 à 10 ⬜.
- 7 commits sur `master`. **Aucun push, aucun remote** — conforme.
- Chaîne : `pnpm verify` (docs → catalog → format → lint → typecheck → dup →
  test:cov → build) et `pnpm bench` (mesure réelle, écrit les manifests).
- ⚠ `next dev` réécrit un bloc `nextjs-agent-rules` dans `CLAUDE.md` à chaque
  démarrage. Il est commité pour garder l'arbre propre.
- `pnpm verify` → **exit 0**. `node scripts/check-docs.mjs` → **VERT**.
- Puppeteer opérationnel (Chrome 151.0.7922.77) — prêt pour les captures de
  fidélité (étape 6) et le bench (étape 7).
- **Rien n'a été montré à l'utilisateur** hors de ce dépôt : aucune viz n'est
  encore migrée, donc aucun verdict esthétique ne lui a été demandé.
