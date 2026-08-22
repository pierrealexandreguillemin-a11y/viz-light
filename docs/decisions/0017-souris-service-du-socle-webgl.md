---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# ADR 0017 — La souris est un service du socle WebGL (`u_mouse`), pas un branchement par viz

## Contexte

Le Lot 1 du portage Easter_eggs ([plan](../plans/portage-easter-eggs.md) §3.1)
porte trois fonds shaders (`voronoi-neon`, `feuille-holographique`,
`champ-quantique`). Leur source `Shader Wallpapers.html` n'exposait **aucun
réglage** ; le plan impose donc d'en **créer** au moins six par viz, dont une
couleur et une **« Influence de la souris »** — précédent des rendus `aligne`
des sketches p5.

Or le socle WebGL, `creerPleinEcranGl`, ne posait que `u_time` et
`u_resolution`. La souris, jusqu'ici, était branchée **par viz** : le seul
précédent, `core/viz/champ-de-points.ts`, attache son propre écouteur
`pointermove` sur l'hôte. Reproduire ce geste dans chaque shader était
impossible proprement : `creerPleinEcranGl` **possède** le canvas et l'instance
(`frame`/`demonter`) ; un `algo.ts` de fond n'a pas la main sur ce cycle de vie
sans dupliquer tout le squelette.

## Décision

**La souris devient un service du socle.** `creerPleinEcranGl` attache un unique
écouteur `pointermove` sur l'hôte et pose, à chaque image, un uniform `u_mouse`
en coordonnées **0..1, Y vers le haut** — le même repère que
`gl_FragCoord.xy / u_resolution`, pour qu'un shader n'ait aucune conversion à
faire. La position est lissée exponentiellement (la souris est un accent, pas un
joystick : un saut brut piquerait l'image).

L'uniform est **opt-in par déclaration** : un shader qui déclare
`uniform vec2 u_mouse;` s'en sert ; un shader qui ne le déclare pas l'ignore, car
`getUniformLocation` renvoie `null` et `uniform2f(null, …)` est un no-op WebGL
silencieux. `aurore-boreale` et `plasma-deforme` ne le déclarent pas :
**inchangés, non re-mesurés.**

Le **dosage** de l'effet (« Influence de la souris ») reste une donnée de chaque
viz : un paramètre de manifest, lu dans `appliquer` et posé comme uniform propre
(`u_influence`), que le shader multiplie à l'accent lié à `u_mouse`.

## Pourquoi le socle plutôt que par viz

- **DRY/SRP.** Une seule implémentation, une seule convention de repère. Le socle
  possède déjà le canvas, le contexte, le redimensionnement et la perte de
  contexte ([ADR 0016](0016-frontiere-webgl-gate-statique.md)) : l'entrée
  pointeur → uniform est de la même nature, elle lui revient. C'est le même geste
  que `GLSL_BRUIT`, service GLSL partagé exposé par le même fichier.
- **Tout fond WebGL futur reçoit la souris gratuitement**, sans re-brancher
  d'écouteur ni risquer une fuite (l'écouteur est retiré dans `demonter`).

## Ce que cette décision NE fait PAS — déclaré

- **Elle n'importe pas les clics.** Les shaders d'origine réagissaient aussi aux
  clics (`u_clicks[8]` : ondes de choc). Ces fonds sont catégorie `fond` : on ne
  les *manipule* pas. Le système de clics est **abandonné** au portage (régime
  technique, réécriture libre, [ADR 0010](0010-deux-regimes-de-migration.md)) ;
  la souris suffit comme accent. Rouvrir les clics serait un travail neuf, avec
  son plumbing d'événements au socle.
- **Elle ne casse pas l'instrument.** `u_mouse` est posé dans `frame()` ; viz en
  pause = `frame()` non appelé = souris figée avec le reste. La mesure reste
  honnête (DoD §4.1 point 8).

## Conséquences

- `tests/plein-ecran-gl.test.ts` reste vert : il ne pilote pas `frame()`, donc la
  pose de `u_mouse` ne le touche pas.
- Les trois shaders du Lot 1 portent chacun un paramètre « Influence de la
  souris » réel, vérifié à la capture (halo/reflet/source qui suit le curseur).
