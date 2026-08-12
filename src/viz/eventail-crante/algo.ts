import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * ÉVENTAIL CRANTÉ — @yuruyurau, 24 juillet 2026.
 *
 * LE PIÈGE DU SKETCH : `y ^ 9` n'est pas une puissance, c'est le OU EXCLUSIF
 * BINAIRE de JavaScript. Il tronque `y` en entier 32 bits avant d'opérer —
 * d'où `Math.trunc(y) ^ 9`. Lire `y**9` donnerait un nombre astronomique et
 * une image vide ; c'est justement cette troncature qui crée les CRANS, en
 * faisant sauter le rayon d'un rang de points au suivant.
 *
 * Les crans ne concernent que le cœur de l'éventail (`y < 7`) ; au-delà, le
 * rayon redevient une simple ondulation.
 */
function eventailCrante(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 790;
  const rayonBase = y < 7 ? 8 + Math.sin(Math.trunc(y) ^ 9) * 6 : 4 + Math.cos(y);
  const k = rayonBase * Math.cos(i + t / 2);
  const e = y / 2 - 13;
  const d = Math.sqrt(k * k + e * e);
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d / 4 - t / 2 + (i % 2) * 3 + decalageSouris * 6;
  const q = ((y * k) / 5) * (2 + Math.sin(d * 2 + y - t * 4)) + 80;
  return {
    x: q * Math.cos(c) * Math.cos(c / 2 + e / 8) + CENTRE,
    y: ((q * d) / 8) * Math.sin(c) + CENTRE,
    angle: c,
    magnitude: d,
  };
}

export const monterEventailCrante = creerChampDePoints({
  formule: eventailCrante,
  pointsOrigine: 10000,
  pasParImage: 0.0349,
});
