import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * RUBAN PLISSÉ — @yuruyurau, 8 mars 2026 (#1).
 *
 * `x = i` (et non `i % 100`) : l'abscisse ne se replie jamais, elle balaie
 * vingt mille valeurs d'affilée dans `cos(x)`. Comme un radian ne divise pas le
 * tour, chaque point tombe à un endroit différent du cycle — c'est cet
 * échantillonnage jamais aligné qui plisse le ruban au lieu de le rayer.
 *
 * Sa jumelle du même jour, le Ruban ondulé, ne change que trois chiffres :
 * `i/940` au lieu de `i/1000`, `cos(x)` au lieu de `cos(x*2)`, et une amplitude
 * fixe là où l'autre module par `d/3`.
 */
function rubanPlisse(i: number, t: number, decalageSouris: number): PointCalcule {
  const x = i;
  const y = i / 940;
  const k = (4 + Math.cos(y)) * Math.cos(x);
  const e = y / 6 - 13;
  const d = Math.sqrt(k * k + e * e) - 3;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d / 1.2 - t / 4 + (i % 2) * 3 + decalageSouris * 6;
  const q = 3 * Math.sin(k * 2) + (k / 16) * y * (e + 2 * Math.sin(e - d * 5 + t)) + 99;
  return {
    x: q * Math.sin(c) * Math.sin(c / 4 + e / 6 - 8) + CENTRE,
    y: ((q * d) / 9) * Math.cos(c) + d * 22,
    angle: c,
    magnitude: d,
  };
}

export const monterRubanPlisse = creerChampDePoints({
  formule: rubanPlisse,
  pointsOrigine: 20000,
  pasParImage: 0.1047,
});
