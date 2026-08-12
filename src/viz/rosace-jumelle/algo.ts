import {
  creerChampDePoints,
  placerEnPolaire,
  type PointCalcule,
} from "@/core/viz/champ-de-points.ts";

/**
 * ROSACE JUMELLE — @yuruyurau, 5 mai 2026.
 *
 * `m = i % 2 * 9` sépare les points en DEUX familles décalées de neuf radians :
 * deux rosaces superposées, presque en opposition de phase.
 *
 * Le ternaire `k*k < 19` bascule l'argument d'un sinus, pas sa valeur : au
 * centre le battement suit le TEMPS (`t*3 + d*4`), au bord il suit la DISTANCE
 * (`d/2 + 4`). C'est ce changement de régime qui fait que le cœur pulse pendant
 * que la couronne reste figée.
 */
function rosaceJumelle(i: number, t: number, decalageSouris: number): PointCalcule {
  const m = (i % 2) * 9;
  const k = 9 * Math.cos(i / 81);
  const e = i / 765 - 13;
  const d = Math.sqrt(k * k + e * e) / 4;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = (d * d) / 9 - t / 16 + m + decalageSouris * 6;
  const battement = k * k < 19 ? t * 3 + d * 4 : d / 2 + 4;
  const q =
    79 -
    2 * Math.sin(k * 3) +
    (Math.sin(battement) / 2) * k * (9 + 5 * Math.sin(d * d - e / 6 - t + m));
  return placerEnPolaire(q, c, d, 50);
}

export const monterRosaceJumelle = creerChampDePoints({
  formule: rosaceJumelle,
  pointsOrigine: 20000,
  pasParImage: 0.0698,
});
