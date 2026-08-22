---
authority: annex
last_verified: 2026-08-22
expires: never
---

# Handoff — 2026-08-22 (8e session) · lot Easter_eggs : Lot 1, trois fonds shaders

**Point de départ** : `pnpm session` VERT, étape 6 close (31/31), étape 10 en
cours — lot Easter_eggs, Lot 0 (déblocages du contrat, ADR 0014/0015), garde-fou
WebGL (ADR 0016) et rapatriement des sources (Lot 0 bis) déjà faits. Question de
l'utilisateur à la reprise : *« on inclut les easter eggs comment — on importe et
adapte, ou autre solution ? »*, puis « go, enchaîne les 3 » et « tu décides
[les réglages], montre-moi ».

**Point d'arrivée** : Lot 1 fait — trois fonds shaders WebGL portés, mesurés,
regardés, `pnpm verify` vert et tamponné. Catalogue à **34 viz**.

## 1. La réponse au « comment » : copier puis réécrire

Deux gestes distincts, gardés séparés :

- **Importer = copier la source, intacte** (`sources/easter-eggs/`, déjà fait au
  Lot 0 bis). `C:\Dev\Easter_eggs` reste intact.
- **Adapter = réécriture libre dans notre contrat** (régime technique, ADR 0010) :
  `algo.ts` TS pur + coquille `.tsx` + `manifest.json`. **Pas de portage
  verbatim** — on prend l'effet, on impose nos réglages, l'OKLCH par le manifest,
  et le mouvement piloté par `frame()`.

La soupape iframe (`public/labs/` + `<IframeViz>`) a été **écartée** : elle perd
les réglages, fait mesurer du vide à l'instrument, et casse le contrat
d'extraction. Elle est faite pour une stack incompatible ; GLSL entre dans
`contrat.ts` sans adaptateur.

## 2. Ce qui a été porté

| slug | source | catégorie | 59,9 i/s ? | réglages créés |
|---|---|---|---|---|
| `voronoi-neon` | `Shader Wallpapers.html` fs2 | `fond` | oui, CPU-bound | densité, vitesse, éclat, influence souris, 3 teintes |
| `feuille-holographique` | fs4 | `fond` | oui, CPU-bound | vitesse, brillance, finesse, grain, influence souris, décalage teinte, couleur reflet |
| `champ-quantique` | fs5 | `fond` | oui, CPU-bound | fréquence, vitesse, intensité, influence souris, 3 couleurs |

**Sept réglages par viz** là où la source n'en exposait **aucun** — ce sont des
**créations**, pas des conservations (plan §3.1, DoD §4.1 point 4). Chacune a une
couleur et une « Influence de la souris ». Le **système de clics** de la source
(`u_clicks[8]`, ondes de choc) est **abandonné** : ce sont des fonds, la souris
suffit comme accent.

## 3. La souris passée au socle — ADR 0017

Le socle WebGL ne posait que `u_time`/`u_resolution`. Plutôt que rebrancher un
écouteur `pointermove` dans chaque shader (impossible proprement : le socle
possède le canvas et l'instance), **`creerPleinEcranGl` pose désormais `u_mouse`**
(0..1, Y vers le haut, lissé), **opt-in par déclaration** : aurore/plasma ne le
déclarent pas → inchangés, non re-mesurés. Le dosage reste une donnée de la viz
(`u_influence`, paramètre de manifest). Détail et *pourquoi* : ADR 0017.

## 4. Outillage : `pnpm bench` accepte des slugs

`scripts/bench.ts` mesurait **toutes** les viz sans filtre — porter 3 nouvelles
aurait re-tamponné les 34 manifests existants (date du jour sur du code
inchangé = churn de commit). Ajout d'un filtre : `pnpm bench <slug> [<slug>…]` ne
mesure que ceux-là ; sans argument, tout le catalogue comme avant. Slug inconnu =
rouge franc.

Second ajustement, révélé par le premier dépassement de 31 viz :
`scripts/check-session.mjs` comparait le « N/31 » de la SPEC au **nombre total**
de dossiers `src/viz/`. Ce modèle conflait progression v1 et total catalogue —
faux dès l'étape 10, qui ajoute des viz hors v1. Le « /31 » suit le **périmètre
v1** (SPEC §4) : le gate ne compte plus que les dossiers de source v1
(`tweet-sketches`, `banc-essai`, `atelier-generatif`) ; les ajouts `easter-eggs`
ne le faussent plus. Ce n'est pas un seuil baissé — l'assertion v1 (31 = 31)
reste protectrice, une suppression de viz v1 la rougirait encore.

## 5. Preuve

- **`pnpm verify` exit 0**, tamponné sur ce code : 168 tests, couverture
  95,91 / 95 / 97,82 / 100 (planchers 94/93/97/99), `dup` n'a pas mordu sur le
  GLSL partagé, build Next OK.
- **Captures regardées** (DoD §4.1 point 10, régime technique — œil, pas
  comparaison au pixel) : cellules néon aux arêtes lumineuses et halo qui suit la
  souris (voronoi) ; irisation arc-en-ciel avec reflet blanc sous le curseur
  (feuille) ; interférences cyan/navy avec particules et source vive au curseur
  (quantique). Captures produites hors dépôt (scratchpad), non versionnées : le
  régime technique n'exige pas de captures comparées.
- Commande rejouable des mesures :
  `pnpm build && pnpm bench voronoi-neon feuille-holographique champ-quantique` →
  attendu : 3 × ~59,9 i/s, CPU-bound.

## 6. Ce qui reste au lot

Ordre du plan (§6) : **Lot 2** — arbitrages esthétiques aurore/plasma (verdict
visuel de l'utilisateur, curseurs obligatoires) ; **Lot 3** —
`explorateur-de-fractales` (`interactif`, dépend du genre `choix`) ; **Lot 4** —
`halo-de-trace` puis `globe-chargement` ; **Lot 5** — `carte-iridescente`.

La **recette** (étape 8) et le **CATALOG.md final** (étape 9) restent dus, sur
l'URL live — donc après un `git push`, qui **n'a pas été demandé** cette session.
Le verdict visuel des trois shaders appartient à l'utilisateur ; il se fera sur
la vitrine déployée.

## 7. Tactile — ADR 0018 (après retour utilisateur, même session)

Question soulevée à la reprise : le tactile est-il géré pour mobile sur les viz à
influence souris ? Constat vérifié : les deux moteurs (`champ-de-points.ts`,
`plein-ecran-gl.ts`) écoutaient `pointermove` seul — au tactile, pas de survol
(tap ignoré) et le scroll volait le glissé (pas de `touch-action`).

Décision de l'utilisateur : **« gérer le tactile push comme un clic ; on scrolle
au-dessus/en-dessous, pas bloquant. »** Appliqué aux deux moteurs (donc aux
**21 viz** à influence souris) : `pointerdown` en plus de `pointermove` (une
pression place le pointeur — « push comme un clic ») + `touch-action: none` sur
l'hôte (le glissé pilote l'accent au lieu de scroller). ADR 0018.

**Prouvé au tactile émulé** (iPhone, `hasTouch: true`) : deux taps sur coins
opposés de `feuille-holographique` → le reflet suit exactement (haut-gauche puis
bas-droite). Rejouable : émuler un écran tactile, `page.touchscreen.tap(...)` sur
la viz, comparer les captures.
