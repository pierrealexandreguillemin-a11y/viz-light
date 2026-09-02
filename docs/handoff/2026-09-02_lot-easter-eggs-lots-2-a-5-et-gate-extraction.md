---
authority: annex
last_verified: 2026-09-02
expires: never
---

# Handoff — 2026-09-02 (9e session) · lot Easter_eggs : Lots 2 à 5, et un gate d'extraction

**Point de départ** : `pnpm session` VERT, étape 10 en cours — Lot 1 fait le
2026-08-22, catalogue à 34 viz, rien poussé. Message de l'utilisateur :
« reprise », sans autre consigne — session autonome, ordre du plan (§6).

**Point d'arrivée** : Lots 3, 4, 5 faits (quatre viz, mesurées, regardées),
Lot 2 préparé sans être tranché, un gate nouveau qui a corrigé 34 manifests.
Catalogue à **38 viz**. `pnpm verify` vert et tamponné, 5 commits, **rien
poussé** (jamais demandé).

## 1. Lot 2 — préparé, pas tranché

Quatre captures dans `evidence/captures/` (`<slug>--easter-eggs.png` face à
`<slug>--catalogue.png`, aurore et plasma), regardées et décrites sans jugement
dans [`evidence/arbitrage-aurore-plasma.md`](../evidence/arbitrage-aurore-plasma.md),
avec les trois issues possibles et la contrainte pré-tranchée (curseurs
obligatoires). **Le verdict est à l'utilisateur** — c'est la seule question
ouverte de cette session.

## 2. Lot 3 — `explorateur-de-fractales` (`interactif`, canvas2d)

- Sept familles en TS pur (`algo/fractales.ts`), une boucle de fuite partagée,
  lissage `n + 1 − log(log|z|)/log d`, huit palettes en table (`algo/palettes.ts`).
- **Rendu progressif** (`algo/rendu.ts`) : blocs 8 → 4 → 2 → 1, une tranche par
  `frame()` sous 8 ms ; la première passe ignore le budget pour qu'un glissé
  montre toujours une image entière. Au repos, les couleurs **défilent** le long
  de la fractale — c'est le mouvement mesuré (59,9 i/s, JS 1,9 ms).
- Glisser, molette, pincer, double-clic (`algo/interaction.ts`) ; changer de
  famille remet la vue (exception « graine ») ; « Constante de Julia » est un
  `choix` de sept ensembles nommés — premier usage réel de l'ADR 0015.
- **Une scène non élue s'affine seule** (ADR 0011 respecté dans l'esprit) : un
  `requestAnimationFrame` propre, fini, qui se tait dès que le socle envoie
  une image de boucle (`delta > 0`). Sans cela, une fractale manipulée pendant
  qu'une autre viz est élue restait grossière.
- Échelle des couleurs en racine carrée : linéaire, l'extérieur lointain sortait
  d'une seule couleur plate (vu sur la première capture, corrigé, revu).
- 14 tests unitaires sur les maths pures et `lireChoix` (nouveau dans le socle).

## 3. Le défaut trouvé en chemin — et son gate

En listant le socle de la nouvelle viz, j'ai vu que **`useScenePrincipale.ts`
(ADR 0011) n'était dans aucune des 34 listes d'extraction**, et rien ne le
vérifiait. Un claude+n qui copiait la liste obtenait un import cassé.

Plutôt que corriger à la main, **un gate à la racine** (mémoire projet « un gate
à la racine bat une sonde en aval ») : `core/extraction/verifier.ts`, branché
dans `pnpm catalog`. Depuis les fichiers de la viz, il suit les imports
statiques et exige que `fichiers`, `socle` et `deps` soient **exactement** la
fermeture obtenue — rien d'oublié, rien de superflu. Calibré dans les deux sens
(8 tests, état fautif du jour reproduit). Sur les 35 manifests il a trouvé
**53 oublis** : `useScenePrincipale.ts` × 34, `toile.ts` × 18 (les sketches p5,
via `champ-de-points.ts`), `champ-de-points.ts` × 1. Corrigés depuis son
rapport, puis vert. Ajouté au plancher de couverture, relevé sur mesure
(97,04 / 94,5 / 98,36 / 100 → **96 / 94 / 98 / 99**, SPEC §5).

## 4. Lot 4 — `globe-chargement` (`composant`) et `halo-de-trace` (`animation`, dom-css)

- **Globe** : une seule toile, anneaux (`setLineDash` + `rotate`, motifs de la
  source) et rotation dans `frame()`. **L'inventaire avait manqué** que la
  source charge d3, topojson et `world-atlas` depuis unpkg. Les terres sont
  rastérisées une fois en masque 1° (8 100 octets, `algo/terres.ts`) et le
  globe se dessine en **points** projetés — pas de découpage de polygones à
  l'horizon. Piège rencontré et réglé : un sliver dégénéré de world-atlas (un
  anneau de −180° à 180° autour des Fidji) traçait une parallèle entière de
  points ; procédure rejouable et chiffre attendu dans
  `evidence/sources-easter-eggs.md` §5. 59,9 i/s, JS 1,2 ms.
- **Halo** : cinq couches d'un même `<path>` (deux flous, asphalte, trait,
  comète) ; le tracé est **généré par graine** (le circuit de Miami reste à la
  source) ; `stroke-dashoffset` est posé par `frame()` — prouvé : deux lectures
  à 0,5 s d'écart donnent −820 puis −1001. 59,9 i/s, JS 0 ms — le coût réel est
  celui des filtres, hors JS ; dit dans `notes.md`.

## 5. Lot 5 — `carte-iridescente` (`composant`, dom-css)

L'effet sans l'illustration : fond vignetté, reflet iridescent OKLCH (conique,
linéaire, holographique — `choix`), fusion (`choix`), tache spéculaire, grain
SVG embarqué, arête, halo flou dont la teinte suit le reflet, inclinaison 3D.
**Seize réglages de la source conservés** ; pointeur lissé et dérive au repos
dans `frame()`. Deux défauts vus sur capture et corrigés : halo ancré en haut à
gauche (`inset` + hauteur → centré par translation) ; `color-dodge` sur carte
nue trop violent → défaut `overlay`, fond un peu moins noir. Le rendu au repos
reste **discret** : verdict esthétique à la recette, les curseurs y pourvoient.
59,9 i/s, JS 0,1 ms.

## 6. Preuve

- `pnpm verify` exit 0 sur le dernier commit : 198 tests, couverture
  97,04 / 94,5 / 98,36 / 100, 0 clone, build Next OK. `pnpm session` VERT.
- Rejouable : `pnpm build && pnpm bench explorateur-de-fractales globe-chargement halo-de-trace carte-iridescente`
  → attendu 4 × 59,9 i/s, CPU-bound, JS ≤ 2 ms.
- Captures regardées (régime technique, œil) : fractale au repos, zoom molette
  (vallée des hippocampes), glissé, Navire en feu, Julia, Multibrot ; globe ;
  halo ; carte. Produites hors dépôt (scratchpad), non versionnées — seules les
  quatre captures de l'arbitrage du Lot 2 sont dans `evidence/captures/`.

## 7. Ce qui reste

- **Verdict du Lot 2** (utilisateur) : garder / prendre / emprunter, pour
  l'aurore et le plasma — `evidence/arbitrage-aurore-plasma.md` §3.
- **Recette** (étape 8) sur l'URL live, donc après un `git push` qui n'a pas
  été demandé ; puis **CATALOG.md final** (étape 9). Les huit viz du lot
  Easter_eggs n'ont pas encore été vues par l'utilisateur.
- La catégorie de la carte iridescente (`composant` ou `fond`) et celle des
  shaders réactifs restent des champs de manifest à confirmer à la recette.

## 8. Suite de session — « pousse », puis « go 4 » (entretien)

- **Poussé et déployé** : `6f0736b` puis `74c6fa8`, déploiements Vercel READY,
  `viz-light.vercel.app` sert 38 articles (vérifié par `curl` + captures live).
- **Vitrine live regardée** : sections « Interactifs · 1 » et « Composants · 2 »
  présentes (elles le sont par construction, `Record<Categorie, string>`). Un
  défaut vu : le halo de la carte iridescente débordait de sa case jusque sur
  le titre de section → `overflow: hidden` sur la scène, re-regardé en prod
  après déploiement : rogné.
- **`lectureDuCout`** : champ optionnel du manifest (hors de `perf`, donc jamais
  écrasé par le bench), validé non vide, rendu dans `CATALOG.md` sous
  « Comment lire ce coût ». Posé sur six viz : fractales (chiffre de repos),
  halo et carte (coût dans les filtres, hors JS), orbes floutées (GPU-bound),
  Lorenz et couronne (30 i/s voulus par l'œuvre). Pas dans la vitrine :
  « aucune légende ». SPEC §2 mis à jour.
- Tests du validateur découpés (`tests/aides/manifest.ts` partagé) parce que le
  fichier dépassait 300 lignes ; jscpd a alors mordu sur deux fixtures voisines
  → la fixture du catalogue dérive désormais de la référence partagée.
- `pnpm verify` exit 0 : 201 tests, 97,06 / 94,62 / 98,36 / 100, 0 clone.

Reste inchangé : verdict Lot 2, recette sur l'URL live, CATALOG.md final.
