---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# ADR 0018 — Au tactile, la pression pilote le pointeur ; la viz ne vole pas le scroll par défaut, mais capte le glissé

## Contexte

Les viz à « Influence de la souris » — les 18 sketches p5 (moteur
`core/viz/champ-de-points.ts`) et les 3 fonds shaders du Lot 1 (socle
`core/viz/plein-ecran-gl.ts`, [ADR 0017](0017-souris-service-du-socle-webgl.md))
— écoutaient uniquement `pointermove`. Les Pointer Events unifient
souris/tactile/stylet, mais sur mobile deux faits cassaient l'usage tactile :

1. **Pas de survol.** Un doigt ne « survole » pas : `pointermove` ne se déclenche
   qu'au contact. Sans écoute de la pression, un tap ne faisait rien.
2. **Le scroll volait le geste.** Sans `touch-action`, un glissé démarré sur la
   viz était interprété comme un scroll de page : quelques `pointermove` puis
   `pointercancel`, l'accent ne suivait pas.

Question posée à l'utilisateur (2026-08-22). Sa décision : **« gérer le tactile
push comme un clic ; on peut scroller au-dessus et en-dessous des viz, pas
bloquant. »**

## Décision

Dans les deux moteurs, pour souris ET tactile :

- **`pointerdown` en plus de `pointermove`.** Une pression place le pointeur là
  où le doigt touche — « push comme un clic ». Au tactile, faute de survol,
  c'est le geste de pointage. La position **reste** après le relâchement (comme
  un clic qui pose l'accent), le lissage l'y amène en douceur.
- **`touch-action: none` sur l'hôte de la viz.** Un glissé sur la viz pilote donc
  l'accent au lieu de scroller. Le coût — on ne scrolle plus la page en partant
  d'une viz — est **assumé par l'utilisateur** : la vitrine se scrolle par les
  zones autour (en-tête, panneau de réglages sous la viz au mobile, gouttières
  entre cartes).

## Pourquoi ce compromis

- **« push comme un clic » est découvrable et sans piège.** Un tap est un geste
  discret que tout le monde connaît ; il n'entre pas en conflit avec le scroll
  (un tap ne scrolle pas).
- **`touch-action: none` rend le glissé net** plutôt que haché par un
  `pointercancel`. L'utilisateur a tranché que la perte du scroll-sur-viz n'est
  pas bloquante — c'est sa vitrine, son usage.
- **Un seul comportement souris + tactile**, pas de branche par périphérique à
  maintenir.

## Ce que cette décision NE fait PAS — déclaré

- **Elle ne ressuscite pas les clics-effets de la source shader** (`u_clicks` :
  ondes de choc), abandonnés au Lot 1 : ce sont des fonds. La pression pilote la
  *position* du pointeur, pas une impulsion.
- **Elle ne gère pas le multi-touch ni le pinch/zoom.** Les viz `interactif` à
  venir (explorateur de fractales, Lot 3) demanderont une gestion de gestes
  propre — cet ADR couvre l'*accent de pointage* d'un fond/animation, pas la
  manipulation d'une surface interactive.

## Conséquences

- Le plumbing (touch-action + deux écouteurs + nettoyage) est **dupliqué** dans
  les deux moteurs plutôt qu'extrait dans un module partagé : un fichier de socle
  en plus devrait entrer dans l'`extraction.socle` des 23 manifests concernés
  (contrat d'extraction, SPEC §3) — le coût du contrat exact l'emporte ici sur
  le gain DRY de quatre lignes.
- Bénéficie d'un coup aux 21 viz à influence souris, les deux moteurs étant
  partagés.
- `tests/plein-ecran-gl.test.ts` reste vert (il ne pilote pas les événements).
