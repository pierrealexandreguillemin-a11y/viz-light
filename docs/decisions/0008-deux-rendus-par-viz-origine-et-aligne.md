---
authority: annex
adr_status: accepted
last_verified: 2026-08-12
expires: never
---

# ADR 0008 — Deux rendus par viz : `origine` et `aligne`

**Date** : 2026-08-12 · **Statut** : accepted
**Demandé par l'utilisateur** : « aligne les p5 sur le tunnel de points » ·
« le tunnel de points est un raffinement, une amélioration de ce style ».

## Contexte

Dans `sources/tweet-sketches-artifact.html`, 17 des 19 sketches sont rendus par
une boucle générique commune (`kind: "points"`) : trait blanc
`stroke(255, alpha)`, `background(9)` à chaque image, aucune traînée, aucune
interaction. Deux sketches échappent à cette boucle (`kind: "custom"`) : Lorenz,
et le **Tunnel de points (HSB)** — la reprise validée par l'utilisateur, qui
ajoute une teinte HSB dérivée de la géométrie de chaque point, une traînée par
fondu du fond, une rotation pilotée par la souris, un bucketing des teintes à 3°
et des paramètres réglables.

L'utilisateur veut ce traitement sur l'ensemble des sketches p5, et a tranché la
tension avec la fidélité : le Tunnel n'est pas une trahison du style
@yuruyurau, c'en est **un raffinement**.

## Décision

**Chaque viz p5 migrée porte deux rendus**, déclarés dans son `manifest.json` :

- **`origine`** — le portage fidèle de la formule d'origine, monochrome, sans
  traînée ;
- **`aligne`** — le traitement Tunnel appliqué à la géométrie propre du sketch
  (teinte dérivée de son angle et de sa magnitude, traînée, souris, paramètres).

**`aligne` est le rendu par défaut** de la galerie et de l'extraction.

Les deux rendus partagent **le même `algo.ts`** : l'algorithme calcule des
points, le rendu décide de leur couleur et de leur rémanence. Un rendu n'est
donc pas une seconde implémentation — c'est un jeu de paramètres appliqué à une
seule.

## Pourquoi garder `origine` alors que l'utilisateur préfère `aligne`

**Pas par prudence esthétique — pour une raison mécanique.** `SPEC.md §4` exige
que chaque viz migrée soit prouvée fidèle à l'original par captures comparées.
Cette preuve est impossible contre un rendu raffiné : une erreur dans le portage
de la formule golfée (un `i--` mal traduit, un `mag()` divisé par la mauvaise
constante) produirait une image différente que le raffinement rendrait
indiscernable d'un choix de couleur. Le rendu `origine` est donc
**l'instrument de mesure de la migration** : il se compare au pixel près à
l'artifact source, ce qui prouve l'algorithme juste ; `aligne` s'appuie ensuite
sur un algorithme dont la justesse est établie.

Sans `origine`, « la viz est fidèle » redeviendrait une affirmation invérifiable
— exactement la classe de faute que ce dépôt existe pour empêcher.

## Conséquences

- Le schéma de manifest (étape 4) doit porter la liste des rendus et leurs
  paramètres, pas un seul jeu de réglages.
- L'étape 6 produit, pour chaque viz p5, **deux captures** : `origine` comparée
  à l'artifact source (gate de fidélité), et `aligne` soumise au verdict de
  l'utilisateur (étape 8).
- Le coût est faible : les deux rendus partagent l'algorithme et le socle. Ce
  n'est pas deux viz à maintenir, c'est une viz et deux presets.
- Le Tunnel de points est le **cas de référence** du rendu `aligne` : sa formule
  de teinte (`hueBase + hueSpread * sin(angle * 0.5) + mag * 4`, bucketing à 3°)
  sert de modèle, adaptée à la géométrie de chaque sketch.

## Alternative écartée

- **Remplacer purement les originaux par le rendu aligné** : supprime
  l'instrument qui prouve la fidélité du portage, pour une économie nulle (les
  deux rendus partagent l'algorithme). L'utilisateur peut demander la
  suppression des `origine` après recette — ce serait alors une décision prise
  sur une migration déjà prouvée, pas à la place de la preuve.
