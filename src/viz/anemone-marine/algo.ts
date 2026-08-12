import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * ANÉMONE MARINE — @yuruyurau, 7 mars 2026.
 *
 * Le ternaire `y < 19` donne à l'anémone ses deux corps : au cœur, le rayon est
 * un TENTACULE animé — `sin(t/8 + y*8) * 31`, qui va de −31 à +31 et se retourne
 * à chaque battement ; au-delà, il vaut un tranquille `9`. Une seule condition,
 * et le sketch devient un être vivant posé sur un disque.
 *
 * La magnitude est divisée par 5 (`o = mag/5`) et non élevée au carré : les
 * tentacules restent longs au lieu de se rabattre sur le centre.
 */
function anemoneMarine(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 600;
  const k = Math.cos(y * 7) * (y < 19 ? Math.sin(t / 8 + y * 8) * 31 : 9);
  const e = y / 8 - 13;
  const o = Math.sqrt(k * k + e * e) / 5;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = o / 2 - e / 6 - t / 8 + (i % 2) * 8 + decalageSouris * 6;
  const q = 59 + Math.cos(y) / k + (k / o) * 3 * (2 + Math.sin(o * 3 - e * 9 - t));
  return {
    x: q * Math.sin(c) + CENTRE,
    y: CENTRE + q * Math.cos(c) - 99 * Math.sin(c / 3),
    angle: c,
    magnitude: o,
  };
}

export const monterAnemoneMarine = creerChampDePoints({
  formule: anemoneMarine,
  pointsOrigine: 20000,
  pasParImage: 0.1047,
});
