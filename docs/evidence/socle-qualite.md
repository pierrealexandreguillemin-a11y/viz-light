---
authority: ledger
subject: socle-qualite
last_verified: 2026-08-22
expires: never
---

# Socle qualité — calibration de chaque gate, dans les deux sens

> **Un seuil qu'on n'a jamais vu rougir n'est pas un gate, c'est une décoration.**
> Chaque ligne ci-dessous a été prouvée le 2026-08-12 en deux temps : un état
> fautif écrit exprès (le gate **doit** échouer, avec un message qui nomme le
> défaut), puis sa suppression (le gate **doit** repasser). Les états fautifs
> vivaient dans `src/_calibration/` et `src/viz/_calibration/`, supprimés depuis.

## 1. La chaîne

`pnpm verify` = `docs` → `catalog` → `format:check` → `lint` → `typecheck` →
`dup` → `test:cov` → `build`. Un seul rouge suffit à bloquer.

⚠ **`test:cov`, pas `test`.** Le premier câblage lançait `pnpm test`, donc le
plancher de couverture n'était **jamais exécuté par la chaîne** — un seuil écrit
dans `vitest.config.ts` que rien ne faisait tourner. Corrigé le 2026-08-12 :
c'est exactement la panne que « un seuil documenté que rien n'exécute n'est pas
un gate » décrit, et elle s'est produite ici.

Elle est branchée en **pre-push**
(`.husky/pre-push`) ; le **pre-commit** ne lance que `lint-staged` sur les
fichiers indexés, et le **commit-msg** commitlint.

## 2. Calibration — sortie réelle de chaque gate sur l'état fautif

| Gate | Seuil | Message obtenu sur l'état fautif |
|---|---|---|
| `complexity` | 10 | `Function 'tropDeChemins' has a complexity of 12. Maximum allowed is 10` |
| `sonarjs/cognitive-complexity` | 15 | `Refactor this function to reduce its Cognitive Complexity from 80 to the 15 allowed` |
| `max-depth` | 4 | `Blocks are nested too deeply (5). Maximum allowed is 4` |
| `max-lines-per-function` | 80 | `Function 'fonctionFleuve' has too many lines (99). Maximum allowed is 80` |
| `max-lines` | 300 | `File has too many lines (340). Maximum allowed is 300` |
| `@typescript-eslint/no-explicit-any` | — | `Unexpected any. Specify a different type` |
| `@typescript-eslint/no-floating-promises` | — | `Promises must be awaited, end with a call to .catch…` |
| `@typescript-eslint/require-await` | — | `Async function 'attendre' has no 'await' expression` |
| `sonarjs/no-identical-functions` (intra) | — | `Update this function so that its implementation is not identical to the one on line 46` |
| `jscpd` (inter-fichiers) | 0 % | `Clone found (typescript) — dup-a.ts [1:33 - 9:2] / dup-b.ts [1:33 - 9:2]`, **exit 1** |
| `no-restricted-imports` (portabilité) | — | `'react' import is restricted… algo.ts est du TS pur (SPEC.md §3)` |
| `tsc` `noUncheckedIndexedAccess` | — | `TS2322: Type 'number \| undefined' is not assignable to type 'number'` |
| `tsc` `exactOptionalPropertyTypes` | — | `TS2375: … with 'exactOptionalPropertyTypes: true'` |
| `prettier --check` | — | `Code style issues found in 5 files`, **exit 1** |
| Test OKLCH | — | `Couleur hex interdite — utiliser un jeton OKLCH de globals.css` / `Fonction de couleur héritée interdite — utiliser oklch()` |
| `commitlint` | conventionnel | `subject may not be empty [subject-empty]` / `type may not be empty [type-empty]`, **exit 1** |
| `pnpm catalog` — manifest | schéma | `rendus : exactement un rendu par défaut attendu, 2 trouvé(s)` · `rendus[1].params[0].min : min (10) doit être < max (5)` · `extraction.fichiers : au moins 1 entrée(s) attendue(s)`, **exit 1** |
| `pnpm catalog` — perf | mesurée | `perf : non mesurée. Lance \`pnpm bench\` : un catalogue promet un coût mesuré, pas une estimation.`, **exit 1** |
| Plancher de couverture | 94/93/97/99 | `ERROR: Coverage for lines (97.58%) does not meet global threshold (99%)` (+ 3 autres), **exit non nul** |

### Retour au vert, après suppression des états fautifs

```
> pnpm verify
All matched files use Prettier code style!
Found 0 clones.
 Test Files  1 passed (1)
      Tests  7 passed (7)
✓ Compiled successfully in 619ms
✓ Generating static pages using 4 workers (3/3) in 773ms
verify EXIT=0
```

Et `commitlint --edit` sur `feat(socle): cabler le gate de duplication` → **exit 0**.

## 3. Deux gates que ce projet ajoute au socle générique

### 3.1 La frontière de portabilité (`eslint.config.mjs`)

`src/viz/**/algo.ts` ne peut importer ni `react`, ni `react-dom`, ni `next`, ni
`@/core/hooks/*`.

**Ce qu'aucun autre gate ne voit** : le contrat d'extraction (`SPEC.md §3`)
repose entièrement sur le fait qu'`algo.ts` est du TS pur. Le jour où un algo
importe un hook du socle, la copie de dossier cesse de suffire — et **rien** ne
le signale : le fichier compile, il est court, il n'est pas dupliqué, il est
formaté. « Qui a le droit d'importer React » est un fait d'**architecture**,
qu'aucun linter ne connaît tant qu'on ne l'écrit pas.

**Son angle mort, déclaré** : la règle voit les imports, pas les intentions. Un
`algo.ts` qui lirait `window` ou `document` reste portable au sens du lint mais
pas au sens du contrat. C'est la revue qui l'attrape, pas cette règle.

### 3.2 Le test OKLCH (`tests/couleurs-oklch.test.ts`)

« OKLCH partout dans l'UI — aucune couleur hex/hsl en dur » était une règle
écrite (`CLAUDE.md §5.3`) que **rien n'exécutait**. Elle allait céder exactement
à l'étape 6, quand 31 viz venues de fichiers pleins de `#111` seront migrées.
Le test balaie `src/**/*.{css,ts,tsx}` et échoue sur tout `#rrggbb`, `rgb()`,
`rgba()`, `hsl()`, `hsla()`.

**Périmètre assumé** : `src/` seulement. `sources/` est une archive brute, et
les couleurs internes d'un **algorithme** (une teinte HSB calculée par point)
sont la viz elle-même, pas de l'UI — d'où l'exclusion de `src/viz/**/algo*`. La
frontière est le dossier, pas le goût.

**Garde-fou du garde-fou** : le premier cas du test vérifie que le balayage a
bien trouvé des fichiers. Sans lui, un `src/` déplacé rendrait le test vert en
ne vérifiant plus rien — le pire mode de panne d'un gate.

## 3.3 Le test de montage (`tests/scene-viz.test.tsx`) — ajouté sur un vrai bug

Le 2026-08-12, l'effet de montage de `SceneViz` lisait les dimensions fournies
par le `ResizeObserver` **tout en les excluant de ses dépendances** via un
`eslint-disable`. À l'instant où l'hôte apparaît, la mesure n'existe pas encore :
l'effet sortait par sa garde et ne rejouait jamais.

**Aucune viz ne se montait. Et l'instrument affichait 59,9 i/s et 0 ms de
JavaScript** — il mesurait une boucle vide. Le bench a failli tamponner ces
chiffres dans le manifest. C'est le pire mode de panne possible pour ce projet :
un instrument qui répond avec assurance sur du vide.

Ce qu'aucun autre gate ne voyait : le fichier compilait, faisait moins de 300
lignes, n'était pas dupliqué, était formaté, et les chiffres semblaient
plausibles. **Seule une assertion qui exige un élément dans l'hôte l'attrape.**

Calibration, dans les deux sens :

```
# bug réintroduit (garde sur `dimensions`, hors dépendances)
tests/scene-viz.test.tsx (4 tests | 4 failed)
  × monte réellement la viz dans le DOM
  × transmet des dimensions non nulles — un hôte de 0 px ne dessine rien
  × démonte la viz et vide l'hôte
  × affiche une carte d'erreur au lieu de tomber quand l'algo échoue

# après correction
Tests  4 passed (4)
```

**Leçon généralisable** : un chiffre produit par un instrument ne prouve rien
tant qu'on n'a pas vérifié que l'objet mesuré existait. Le diagnostic qui a
tranché lisait le canvas : `canvasPresent: false`, `pixelsAllumes: 0`.

## 3.4 Correction de calibration du test OKLCH

La première version refusait `\b(?:rgba?|hsla?)\s*\(` — donc **rougissait sur la
phrase « aucune valeur hex/hsl (CLAUDE.md §5.3) » écrite en commentaire** : le
gate se déclenchait sur l'énoncé de sa propre règle. Un appel de fonction n'a
jamais d'espace avant sa parenthèse ; exiger l'accolement supprime le faux
positif sans rien laisser passer. Deux cas de test gardent désormais les deux
sens (il attrape `rgba(…)`, il ignore la prose).

## 3.5 `jscpd` recalibré de 25 à 40 tokens (2026-08-12)

25 était **la valeur par défaut de l'outil**, jamais confrontée à ce dépôt — or
le tier global interdit précisément de faire confiance à un seuil par défaut.

Ce qu'il signalait à cinq viz : l'`import` du moteur et la signature
`function positionner(i, t): PointCalcule` — identiques dans chaque `algo.ts`
**par construction**, puisque c'est le contrat. Ce n'est pas de la duplication,
c'est de la conformité. (`mode: "weak"` a été essayé d'abord : sans effet, la
correspondance ne venait pas des commentaires.)

Recalibré dans les deux sens après le changement :

```
etat sain           : Found 0 clones — exit 0
duplication de code : Found 1 clones — exit 1   (deux fois la même fonction de 8 lignes)
apres suppression   : Found 0 clones — exit 0
```

40 tokens ≈ une petite fonction. Le gate attrape toujours ce pour quoi il
existe ; il ne compte plus l'obligation contractuelle comme une faute.

## 3.6 La frontière WebGL (`eslint.config.mjs`, ADR 0016) — 2026-08-22

Le bug du 2026-08-22 (aurore et plasma noires en prod) avait une cause unique :
un contexte WebGL créé sans `preserveDrawingBuffer: true`, si bien qu'une viz
**figée** (une seule vit à la fois, ADR 0011) perdait son image au
re-compositing. La correction vit à un seul endroit — `creerPleinEcranGl`
(`core/viz/plein-ecran-gl.ts`) — qui possède aussi la perte de contexte et le
repeint opaque. Le seul chemin par lequel le bug peut revenir est **une viz qui
crée son contexte WebGL à la main** au lieu de passer par ce socle.

Le gate `no-restricted-syntax` interdit donc, dans `src/viz/**/algo.ts`, tout
`getContext("webgl" | "webgl2" | "experimental-webgl")`. `getContext("2d")`
reste permis — seul le contexte WebGL est visé.

**Pourquoi ce gate STATIQUE plutôt que la « luminance d'une viz figée » proposée
au handoff du 2026-08-22.** Mesurer la luminance en aval exige un rendu headless
qui force chaque viz à l'état figé — or l'état figé dépend de l'élection de
scène (`useScenePrincipale`), pas d'un réglage qu'on pose de l'extérieur : le
gate serait fragile, et un gate qui rougit à tort est pire que pas de gate. La
cause racine, elle, est un seul site d'appel, attrapable à la syntaxe, sans
flakiness. Angle mort déclaré : ce gate n'attrape PAS un shader qui rendrait
tout noir pour une raison de logique GLSL (mauvais uniform, formule fausse) —
cela reste couvert par l'œil porté sur la capture *figée* à la migration
(DoD du plan Easter_eggs, §4.1 point 10), pas par une mesure automatique.

Calibré dans les deux sens, le 2026-08-22 :

```
etat sain (aurore/plasma via creerPleinEcranGl) : eslint . — exit 0
faute (canvas.getContext("webgl") dans un algo) :
  5:60  error  Un fond WebGL passe par creerPleinEcranGl … Ne crée pas de
               contexte WebGL à la main   no-restricted-syntax
apres suppression                                : eslint . — exit 0
```

## 4. Ce que ce socle ne peut PAS voir

- ~~La couverture n'a pas encore de plancher~~ — **posé à l'étape 4, le
  2026-08-12.** Mesuré d'abord (94,87 / 93,51 / 97,22 / 100 sur le validateur,
  le rendu du catalogue et le générateur de registre), seuils fixés juste en
  dessous : **94 / 93 / 97 / 99**. Les composants React n'y sont pas : les
  couvrir gonflerait le chiffre sans rien garder.
  **Piège rencontré** : le rapport `text` de v8 **omet les fichiers couverts à
  100 % sur les quatre colonnes**. `generer.ts` en avait disparu, ce qui donnait
  l'impression qu'il n'était pas suivi. Pour vérifier qu'un fichier est
  réellement dans le périmètre, lire `coverage/coverage-summary.json`, jamais le
  tableau de la console.
- **La fidélité d'une viz migrée.** Aucun de ces gates ne regarde un pixel. Un
  algorithme faux passe tout. C'est le rôle des captures comparées de
  l'étape 6, et du verdict de l'utilisateur à l'étape 8.
- **La qualité d'une abstraction.** ESLint compte des lignes et des chemins ; il
  ne dit pas si un hook est au bon niveau. **Et l'auto-revue est biaisée** — je
  relis avec les angles morts qui ont produit le code. La forme forte est une
  revue par un tiers ; la forme faible, celle pratiquée ici par défaut, est ma
  propre relecture. C'est dit, pas caché.
