---
authority: annex
last_verified: 2026-08-12
expires: never
---

# Handoff — 2026-08-12 · étapes 1, 2 et 3

**Session** : première de `claude-viz-light`. Point de départ : étape 0 seule
verte, aucun code applicatif.
**Point d'arrivée** : étapes **1, 2 et 3 vertes**. La prochaine session ouvre
sur l'**étape 4** (contrat de données : schéma manifest + registre + générateur
`CATALOG.md`).

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

### 3.3 La dette assumée de l'étape 3

Le **plancher de couverture est vide** (`vitest.config.ts`,
`coverage.include: []`) et c'est délibéré : sur un dépôt sans logique métier, un
plancher affiche 100 % sur des coquilles. **C'est à l'étape 4 de le poser**, sur
le schéma de manifest et le registre, **mesuré avant d'être fixé**, jamais
abaissé ensuite. Si l'étape 4 se termine sans ce plancher, la promesse du
`SPEC.md §5` est en défaut.

### 3.4 Le socle a déjà mordu une fois

Le gate type-aware a attrapé une assertion inutile dans le test OKLCH
lui-même, écrit dix minutes plus tôt. C'est le signe qu'il fonctionne — et le
rappel que l'auto-revue ne suffit pas (`evidence/socle-qualite.md §4`).

---

## 4. État à la passation

- Fil d'Ariane : **0-1-2-3 ✅**, 4 à 10 ⬜.
- 4 commits sur `master`. **Aucun push, aucun remote** — conforme.
- `pnpm verify` → **exit 0**. `node scripts/check-docs.mjs` → **VERT**.
- Puppeteer opérationnel (Chrome 151.0.7922.77) — prêt pour les captures de
  fidélité (étape 6) et le bench (étape 7).
- **Rien n'a été montré à l'utilisateur** hors de ce dépôt : aucune viz n'est
  encore migrée, donc aucun verdict esthétique ne lui a été demandé.
