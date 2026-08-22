---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# ADR 0016 — Frontière WebGL : un gate statique à la racine, pas une sonde de luminance

## Contexte

Le 2026-08-22, `aurore-boreale` et `plasma-deforme` — les deux seules viz WebGL
du catalogue — s'affichaient **noires en prod**. Cause racine
([handoff du 2026-08-22](../handoff/2026-08-22_correctif-noir-webgl-et-liaison-git-vercel.md)) :
`creerPleinEcranGl` créait le contexte sans `preserveDrawingBuffer: true` ; une
viz **figée** (une seule scène vit à la fois, [ADR 0011](0011-une-seule-scene-vivante.md))
perdait son buffer WebGL au premier re-compositing. Corrigé par l'option, et
verrouillé par `tests/plein-ecran-gl.test.ts` (calibré des deux côtés).

Ce test ne couvre **que ce réglage**. Le handoff a laissé une question ouverte,
explicitement déléguée à l'utilisateur : câbler ou non un garde-fou de **classe**
— « la luminance d'une viz *figée* doit être > 0 » — promouvant la sonde du
correctif en script versionné dans `pnpm verify`. L'utilisateur a délégué le
choix (« aucune idée, je comprends pas la question », 2026-08-22).

Le lot Easter_eggs qui démarre **ajoute trois nouveaux fonds shaders WebGL**
(Lot 1) : le moment d'agir, parce que c'est exactement l'objet qui peut rendre
du noir.

## Décision

**On gate à la RACINE, statiquement : dans `src/viz/**/algo.ts`, un
`getContext("webgl" | "webgl2" | "experimental-webgl")` est interdit** (règle
ESLint `no-restricted-syntax`, `eslint.config.mjs`, bloc `webglBoundary`). Toute
viz WebGL passe par `creerPleinEcranGl` — l'unique endroit qui possède
`preserveDrawingBuffer: true`, la perte de contexte et le repeint opaque.
`getContext("2d")` reste permis.

C'est la même famille que la **frontière de portabilité** (ADR déjà en place :
un gate d'architecture que le socle générique ne connaît pas), et le geste est
le même : rendre impossible à la racine ce qui, en aval, se paierait cher.

## Pourquoi ce gate plutôt que la sonde de luminance

En traçant le mécanisme (`useScenePrincipale`), le fait a changé mon analyse :

- **La sonde de luminance est fragile.** L'état « figé » d'une viz dépend de
  l'élection de scène — la plus visible anime, les autres figent — pas d'un
  réglage qu'on pose de l'extérieur. Un rendu headless qui force *chaque* viz à
  l'état figé pour lire sa luminance dépendrait du défilement, du layout et de
  l'élection ; il rougirait un jour à tort. **Un gate qui crie au loup est pire
  que pas de gate** (il finit désactivé).
- **La cause racine est un seul site d'appel**, attrapable à la syntaxe,
  déterministe, sans flakiness. Il protège les trois shaders du Lot 1 et tous
  les fonds WebGL futurs.

## Ce que ce gate NE voit PAS — déclaré

Il n'attrape pas un shader qui rendrait tout noir pour une raison de **logique
GLSL** (uniform oublié, formule fausse) : le contexte serait bien créé par le
socle. Ce cas reste couvert par **l'œil porté sur la capture *figée*** à la
migration (plan Easter_eggs, DoD §4.1 point 10) — un contrôle humain, pas une
mesure automatique. La sonde de luminance reste donc *possible* comme travail
futur si un tel cas se produit ; elle n'est pas *nécessaire* pour empêcher la
régression qui, elle, a eu lieu.

## Conséquences

- Calibré dans les deux sens le 2026-08-22 (`evidence/socle-qualite.md §3.6`) :
  rouge sur `canvas.getContext("webgl")` dans un algo, vert sur le code réel
  (aurore/plasma passent par le socle).
- Un futur auteur de fond WebGL est *forcé* vers `creerPleinEcranGl` — ce qui lui
  donne gratuitement le correctif, la perte de contexte et le repeint opaque.
- Résidu non traité, à surveiller (hors ce gate) : `surRetour` (retour de
  contexte WebGL) reconstruit le programme mais ne redessine pas ; une viz figée
  resterait noire après un reset GPU jusqu'au prochain réglage. Intermittent,
  signalé au handoff du 2026-08-22, à corriger si observé.
