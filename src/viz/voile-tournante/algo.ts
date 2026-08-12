import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * Un `atan2` dans le rayon : la distance au centre dépend de l'ANGLE du point,
 * pas seulement de son indice. D'où le drapé — l'étoffe se creuse d'un côté
 * pendant qu'elle se tend de l'autre.
 */
function voileTournante(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 43;
  const k = 5 * Math.cos(i / 14) * Math.cos(y / 30);
  const e = y / 8 - 13;
  const d = (k * k + e * e) / 59 + 6;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d / 2 - t / 18 + decalageSouris * 6;
  const q = 90 - 5 * Math.sin(Math.atan2(k, e) * e) + k * (3 + Math.sin(d * d - t * 2));
  return {
    x: q * Math.sin(c) + CENTRE,
    y: (q + d * d ** Math.sin(d * 2 - t / 3)) * Math.cos(c) + CENTRE,
    angle: c,
    magnitude: d,
  };
}

export const monterVoileTournante = creerChampDePoints({
  formule: voileTournante,
  pointsOrigine: 10000,
  pasParImage: 0.1571,
});
