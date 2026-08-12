import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * Une grille de cent colonnes (`i % 100`) sur deux cents rangs, avec une
 * `tan(y/2)` dans le rayon : la tangente diverge périodiquement, et ce sont ces
 * divergences qui creusent les cannelures. Vingt mille points — la plus chère
 * du lot, et la mesure le confirme.
 */
function positionner(i: number, t: number): PointCalcule {
  const x = i % 100;
  const y = i / 233;
  const k = x / 4 - 12.5;
  const e = y / 9 + 6;
  const o = Math.sqrt(k * k + e * e) / 9;
  const c = o / 2 + e / 2 - t / 4;
  const q =
    (3 * (Math.tan(y / 2) / 2 + Math.cos(y))) / k +
    k * (5 / o + o * Math.sin(y) * Math.sin(e + o * 4 - t));
  return { x: q + 40 * Math.cos(c) + CENTRE, y: q * Math.sin(c) - (k * k * o) / 6 + e * o * 12 };
}

export const monterCoquilleCannelee = creerChampDePoints({
  formule: positionner,
  pointsOrigine: 20000,
  pasParImage: 0.1047,
});
