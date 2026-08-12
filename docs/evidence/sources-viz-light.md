---
authority: ledger
subject: sources
last_verified: 2026-08-12
expires: never
---

# Sources — les 3 artifacts du projet claude.ai « Viz Light »

> ✅ **Rapatriement effectué le 2026-08-12** (étape 1 du fil d'Ariane). Les trois
> fichiers sont commités dans `sources/`. Ce document n'est plus une alerte de
> péremption : c'est la **trace de provenance** des fichiers rapatriés.

## 1. Fichiers rapatriés

| Fichier (`sources/`) | Octets | SHA-256 | URL d'origine |
|---|---:|---|---|
| `tweet-sketches-artifact.html` | 17 368 | `D434DF85A7B050076AA830282BC46F03CCD610A86ABE34FB44BBD9E6561B8EBC` | https://claude.ai/public/artifacts/9eb103da-83a0-424c-bd0e-cac1365ae85d |
| `banc-essai-effets.html` | 56 325 | `38BC45A111904892E6F2563C1C51601E8756B5877460003A1A13063231790505` | https://claude.ai/public/artifacts/c8acd119-bc03-40c5-854b-1bb62e1d1f07 |
| `genart-studio-standalone.html` | 24 124 | `86F32CD2518924B54EDF270AD064AB31F793373B5F817B09C0AA8CA1D8768C59` | https://claude.ai/public/artifacts/b39973e0-64e3-4f88-8f10-135b83cd121e |

Vérifier l'intégrité : `Get-FileHash sources\<fichier> -Algorithm SHA256`.

**Méthode** (reproductible si un fichier doit être re-tiré) : les URLs publiques
sont des SPA — un `GET` direct ne renvoie que la coquille (47 854 octets,
identique pour les trois). Il faut la page rendue : ouvrir l'artifact dans
Chrome, cliquer **« Copier »** dans la barre supérieure (met la source complète
dans le presse-papiers), puis écrire le fichier **sans BOM**.

**Fins de ligne** : le presse-papiers Windows livre du CRLF ; les fichiers ont
été ramenés en **LF** (forme d'origine des artifacts) et `.gitattributes` fige
`sources/** -text` pour qu'aucune conversion ne rejoue. Les empreintes ci-dessus
sont donc celles du contenu versionné — un tirage refait sous Windows donnera
des tailles supérieures (respectivement 17 869 / 57 052 / 24 573 octets) tant
que le CRLF n'est pas ramené en LF.

## 2. Inventaire vérifié (compté dans les fichiers, pas estimé)

**34 entrées** — et non 33 comme annoncé à la genèse : le premier artifact
contient **19** sketches, pas 18 (le sketch du 29 juillet y figure sous deux
états, cf. §3). Le compte d'**uniques après déduplication reste ~31**.

### `tweet-sketches-artifact.html` — 19 sketches p5.js @yuruyurau

| # | Titre | # | Titre |
|---:|---|---:|---|
| 1 | 9 août 2026 — #1 | 11 | 9 mai 2026 — attracteur de Lorenz |
| 2 | 9 août 2026 — #2 | 12 | 7 mai 2026 |
| 3 | 8 août 2026 — #1 | 13 | 5 mai 2026 |
| 4 | 8 août 2026 — #2 | 14 | 10 mars 2026 |
| 5 | 1er août 2026 | 15 | 8 mars 2026 — #1 |
| 6 | 31 juillet 2026 | 16 | 8 mars 2026 — #2 |
| 7 | 29 juillet 2026 — original | 17 | 7 mars 2026 |
| 8 | 29 juillet 2026 — Tunnel de points (HSB) | 18 | 6 mars 2026 |
| 9 | 25 juillet 2026 | 19 | 22 février 2026 |
| 10 | 24 juillet 2026 | | |

### `banc-essai-effets.html` — 10 effets réglables

| `id` | Nom | Famille | Surface |
|---|---|---|---|
| `orbs` | Orbes floutées | Soft | dom |
| `mesh` | Mesh gradient | Soft | dom |
| `grain` | Grain de film | Soft | canvas2d |
| `sparse` | Poussière d'étoiles | Dark | canvas2d |
| `flow` | Flow field | Organique | canvas2d |
| `constellation` | Constellation | Tech | canvas2d |
| `synthwave` | Grille synthwave | Tech | canvas2d |
| `scan` | Balayage radar | Tech | canvas2d |
| `aurora` | Aurore boréale | Organique | webgl |
| `plasma` | Plasma déformé | Dark | webgl |

Chaque effet porte, dans le fichier, ses champs éditoriaux `claim` / `reality`
(« ce qu'on lit vs ce que la mesure montre ») et sa liste de `params` — matière
directe pour les `notes.md` et `manifest.json` de l'étape 6.

### `genart-studio-standalone.html` — 5 algos paramétrables

`tunnel` (Tunnel de points) · `flow-field` (Flow Field) ·
`orbit-particles` (Orbit Particles) · `spiral-bloom` (Spiral Bloom) ·
`noise-grid` (Noise Grid).

## 3. Doublons à arbitrer à la migration

- **Tunnel de points — 3 occurrences, 1 viz.** Le sketch #7 (« original ») est la
  version golfée d'origine ; le #8 (« Tunnel de points (HSB) ») en est la reprise
  validée par l'utilisateur ; l'algo `tunnel` de l'Atelier est cette même reprise,
  paramétrée. **Référence = la version HSB** (formule `i / 353`, `hsbToRgba`
  custom, traînée par fondu, Perlin optionnel, rotation souris, bucketing des
  teintes à 3°) — vérifié dans le code rapatrié le 2026-08-12. Les deux autres
  états sont notés en variantes dans le manifest.
- **Flow field — 2 occurrences.** `flow` (banc d'essai, canvas2d) et `flow-field`
  (Atelier). **À faire trancher par l'utilisateur** au moment de la migration :
  c'est un verdict esthétique, il lui appartient.

34 − 3 doublons = **31 viz uniques** en périmètre v1.

## 4. Ce que le rapatriement dit du code (à savoir avant l'étape 6)

- `tweet-sketches-artifact.html` : **code source lisible**, non minifié. Chaque
  sketch est un objet `{ kind, title, compute | draw }` en JS clair. Migration
  directe vers `algo.ts`.
- `banc-essai-effets.html` et `genart-studio-standalone.html` : **bundles esbuild
  minifiés**. Les identifiants internes sont manglés, mais rien n'est perdu — les
  **noms de propriétés, les métadonnées et tous les textes éditoriaux sont
  intacts et lisibles**, et le code est complet et exécutable. La migration
  demandera une relecture attentive plutôt qu'un simple copier-coller ; la
  fidélité se prouve de toute façon par captures comparées (`SPEC.md §4`).
- Aucune version « source non minifiée » de ces deux artifacts n'a été cherchée
  côté conversations claude.ai — inutile tant que le code rapatrié suffit, et il
  suffit. Piste de secours documentée au §5 si l'étape 6 bute.

## 5. Accès de secours (si un fichier devait être re-tiré autrement)

Conversations du projet claude.ai « Viz Light » (lecture via session Chrome
authentifiée) : « Effets visuels légers et impactants pour le web »,
« Dé-minification et conversion en TypeScript », « Applications et sites web ».
