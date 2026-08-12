import {
  creerChampDePoints,
  placerEnPolaire,
  type PointCalcule,
} from "@/core/viz/champ-de-points.ts";

/**
 * MÉDAILLON TOURNANT — @yuruyurau, 10 mars 2026.
 *
 * `sin(sin(…))` — un sinus DANS un sinus. La double application écrête le
 * battement : la modulation ne dépasse jamais `sin(1) ≈ 0,84` et perd ses
 * pointes, ce qui donne au médaillon son ondulation ronde plutôt qu'un
 * clignotement. Écrire un seul sinus le rendrait nerveux.
 *
 * Le `cos(t − d*3 + m)/11` glissé dans l'angle fait osciller la rotation
 * elle-même : le médaillon tourne en avançant et en reculant légèrement.
 */
function medaillonTournant(i: number, t: number, decalageSouris: number): PointCalcule {
  const m = (i % 2) * 3;
  const k = 9 * Math.cos(i / 61);
  const e = i / 652 - 13;
  const d = (k * k + e * e) / 89 + 1;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d / 1.9 + Math.cos(t - d * 3 + m) / 11 - t / 16 + m + decalageSouris * 6;
  // Le sinus dans le sinus, isolé : c'est lui qui arrondit le battement.
  const modulation = Math.sin(Math.sin(d * d + e / 9 - t + m));
  const q = 79 - (e / 2) * Math.sin(k) + (k / d) * (6 + 5 * modulation);
  return placerEnPolaire(q, c, d, 40);
}

export const monterMedaillonTournant = creerChampDePoints({
  formule: medaillonTournant,
  pointsOrigine: 20000,
  pasParImage: 0.0698,
});
