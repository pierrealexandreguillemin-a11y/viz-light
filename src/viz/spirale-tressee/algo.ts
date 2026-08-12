import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * Deux cents brins parallèles (`i % 200`) enroulés par bandes de cinq, dont
 * l'épaisseur bat au rythme de `sin(d² − t)`. C'est cette division en brins,
 * et non un bruit, qui donne la tresse.
 */
function positionner(i: number, t: number): PointCalcule {
  const y = 5 * ((i / 200) | 0);
  const k = Math.cos(i % 200) * 13;
  const e = y / 8 - 12;
  const d = (k * k + e * e) / 109;
  const c = d / 2 - t / 8;
  const q = k * 3 + 80 + (k / Math.cos(y * 5)) * Math.sin(d * d - t);
  return {
    x: q * Math.sin(c) + e * Math.sin(d + k - t) + CENTRE,
    y: (q + 30) * Math.cos(c) + CENTRE,
  };
}

export const monterSpiraleTressee = creerChampDePoints({
  formule: positionner,
  pointsOrigine: 8200,
  pasParImage: 0.0524,
});
