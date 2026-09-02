# Halo de tracé — notes de portage

## L'effet, pas le contenu

Le tracé de Miami et les logos d'équipes appartiennent à un autre projet du
portefeuille (plan §3.4). Le circuit est ici **généré** : « Tracé » est une
graine (1 à 99) qui tire des rayons irréguliers autour du centre, lissés en
spline fermée. Changer la graine redistribue tout — c'est l'exception « graine »
de l'exigence n°1 ; tous les autres réglages se réappliquent sans que la comète
reparte de zéro.

## Le piège d'instrument, évité

La source faisait avancer la comète en `@keyframes` CSS. Avec ce mécanisme,
`frame()` ne ferait rien et l'instrument afficherait 59,9 i/s pour 0 ms — des
chiffres crédibles mesurant du vide. Ici c'est `frame()` qui pose
`stroke-dashoffset` à chaque image : mettre la viz en pause arrête la comète.

Ce que l'instrument mesure alors est le JavaScript (une poignée de
microsecondes) — pas le coût des **filtres** (`blur`, `drop-shadow`), que le
navigateur rastérise hors du fil principal. Si la cadence baisse avec « Halo »
au maximum, l'instrument le dira comme _GPU-bound_ : c'est le rendu des flous,
pas le code.

## Cinq couches, un seul tracé

Deux halos flous (larges, translucides), l'asphalte sombre, le trait fluo, puis
la comète : un `stroke-dasharray` dont le motif se répète « Comètes » fois sur la
longueur du tracé, mesurée par `getTotalLength()`. Les couleurs sont des données
du manifest, appliquées telles quelles aux attributs SVG.
