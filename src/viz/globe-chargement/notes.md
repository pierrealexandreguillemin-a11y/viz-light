# Globe de chargement — notes de portage

## Ce qui a changé par rapport à la source, et pourquoi

- **Une seule toile, tout dans `frame()`.** La source faisait tourner ses
  anneaux en `@keyframes` CSS et son globe en `requestAnimationFrame` à part :
  l'instrument n'aurait mesuré que la moitié du mouvement (plan §3.5). Ici les
  anneaux sont tracés au canvas (`setLineDash` + `rotate`), avec les tirets,
  largeurs, opacités et périodes de la source.
- **Pas de d3-geo, pas de réseau.** La source téléchargeait `world-atlas`
  depuis unpkg à chaque chargement (110 m, ~108 Ko) et projetait des polygones.
  Les terres ont été **rastérisées une fois** en un masque de 1° × 1°
  (8 100 octets, `algo/terres.ts`) et le globe se dessine **en points** : chaque
  cellule se projette seule, ce qui rend inutile le découpage des polygones à
  l'horizon — la partie la plus délicate d'un globe orthographique. Le rendu est
  donc un « globe pointillé », pas un aplat de continents : c'est le choix
  esthétique de ce portage, et il est réversible (le masque contient l'info).
- **Fond transparent.** Un composant se pose sur la page de l'hôte : ici il
  prend l'encre claire sur le fond sombre de la planche ; sur un fond clair,
  régler « Encre » suffit.

## À sa taille d'emploi

« Taille » à 0,4 dans la carte de la planche (544 px) donne un globe d'environ
220 px, la taille d'emploi visée (~200 px). La lisibilité se juge là, pas en
plein cadre.

## Rejouer le masque

`docs/evidence/sources-easter-eggs.md` §4 : polygones `land` de
`world-atlas@2.0.2/countries-110m.json`, décodés (TopoJSON), unis, puis
`contains` sur les centres d'une grille de 1° ; bits empaquetés poids fort en
tête, base64. Attendu : 19 106 cellules de terre sur 64 800 (29,5 %) — après avoir écarté le sliver dégénéré de world-atlas (un anneau de −180° à 180° sur un degré de latitude, autour des Fidji), qui remplissait sinon une parallèle entière.
