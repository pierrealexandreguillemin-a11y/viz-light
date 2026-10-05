---
authority: annex
last_verified: 2026-10-05
expires: never
---

# Handoff — 2026-10-05 (10e session) · `flamme-de-soie`, premier one-liner collé hors artifact

**Point de départ** : `pnpm session` VERT, étape 10. Message de l'utilisateur :
« un nouveau code à dé-minifier et à ajouter aux viz ! » + un one-liner
@yuruyurau (#つぶやきProcessing).

**Point d'arrivée** : `flamme-de-soie` cataloguée (39 viz), source nouvelle
`tweet-direct` ([ADR 0019](../decisions/0019-source-tweet-direct.md)).
`pnpm verify` exit 0, 2 commits + ce handoff, **rien poussé** (pas demandé).

## 1. La viz

- `src/viz/flamme-de-soie/` : même squelette que `corolle-de-maree` (moteur
  `champ-de-points`), formule transcrite terme pour terme. 20 000 points,
  `t += π/480` (0,006545), alpha 46 au rendu `origine`, rendus `origine` +
  `aligne` (défaut) aux valeurs fixes de la série (SPEC §8).
- Golfé recopié à l'octet dans `sources/tweets-golfes.md`, section nouvelle
  « Ajouts au fil de l'eau ». **Date du post** : inconnue au portage (recherche web
  infructueuse, rien inventé), puis fournie par l'utilisateur en collant la page X
  du post : **4 octobre 2026**. Code de la page identique à l'octet (`diff`).
  `origine.date: "2026-10-04"`. L'ADR 0019 (immuable) dit encore « date
  inconnue » : c'était vrai au moment de la décision.
- Nom « Flamme de soie » choisi par moi d'après l'image : **renommable au goût
  de l'utilisateur**.

## 2. Pourquoi une source nouvelle

`tweet-sketches` désigne l'artifact claude.ai des sketches v1. Y ranger ce
one-liner aurait faussé la provenance ET le compte v1 de `pnpm session`
(32/31 → rouge). Test « accepte tweet-direct » vu rouge avant l'ajout, vert
après. Le régime reste « œuvre » (ADR 0010).

## 3. Preuve

- **Identité numérique** (plus forte que l'œil) : le golfé est lu dans
  `sources/tweets-golfes.md` et exécuté tel quel, la fonction est lue dans
  `algo.ts` ; 20 000 points × 5 instants → **écart max 0**. Calibré dans
  l'autre sens : `2.8` → `2.81` donne un écart de 1,29. Script hors dépôt
  (scratchpad, `identite.cjs`), non versionné.
- **Captures comparées** regardées : `evidence/captures/flamme-de-soie--original-p5.png`
  (p5 1.9.4 depuis cdnjs, image 121) face à `flamme-de-soie--origine-catalogue.png`
  (rendu Origine, 2 s après `aria-pressed="true"` sur le bouton de CET article).
  Même silhouette, même phase. Rendu aligné regardé aussi (cyan → violet).
- Piège rencontré sur le banc : `page.screenshot({ clip })` attend des
  coordonnées de PAGE ; après `scrollIntoView`, `getBoundingClientRect` donne
  des coordonnées de viewport → découpe décalée, vue sur l'image, corrigée par
  `+ scrollX/scrollY`.
- **Perf** : `pnpm build && pnpm bench flamme-de-soie` → 59,9 i/s, JS
  13,2 / 15,05 ms, CPU-bound. Dans la fourchette des sketches à 20 000 points
  (7,5 à 18,3 ms).
- `pnpm verify` exit 0 : 204 tests, couverture 97,06 / 94,62 / 98,36 / 100,
  0 clone.

## 4. Ce qui reste

- **Utilisateur** : a validé la viz (« c'est ça ! »), puis « pousse » :
  `44012c5` poussé, déployé, vérifié en ligne (39 articles, flamme à
  59,9 i/s, deux relevés de pixels à 1 s d'écart différents, capture regardée).
- Inchangé : verdict Lot 2 (`evidence/arbitrage-aurore-plasma.md`), recette
  (étape 8) sur l'URL live, CATALOG.md final (étape 9).
