import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * Le rayon de base respire — `4 + cos(y − t)` au lieu d'une constante. Tout
 * l'anneau se gonfle et se dégonfle ensemble, au lieu d'onduler par endroits :
 * c'est ce terme unique qui fait la différence entre un souffle et une vague.
 */
function anneauRespirant(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 265;
  // La souris module le rayon, comme dans le Tunnel (rendu aligné).
  const k = (4 + Math.cos(y - t)) * Math.cos(i / 29 + decalageSouris * 6);
  const e = y / 6 - 13;
  const d = (k * k + e * e) / 22;
  const c = d - t / 2;
  const q = 3 * Math.sin(k * 2) + 0.3 / k + (y / 22) * k * (9 + 2 * Math.sin(e * 49 - d * 4 + t));
  return {
    x: q + 50 * Math.cos(c) + CENTRE,
    y: q * Math.sin(c) + d * 40 + 40 * Math.sin(t / 4 + e + 4),
    angle: c,
    magnitude: d,
  };
}

export const monterAnneauRespirant = creerChampDePoints({
  formule: anneauRespirant,
  pointsOrigine: 10000,
  pasParImage: 0.0524,
});
