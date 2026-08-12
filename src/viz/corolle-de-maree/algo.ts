import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * COROLLE DE MARÉE — @yuruyurau, 25 juillet 2026.
 *
 * Le sketch le plus partagé de la série. Sa magnitude n'est PAS élevée au
 * carré, contrairement à la plupart des autres : `mag(k, e) + sin(e/9 + t/2) −
 * 4`. C'est cette linéarité qui étale la corolle au lieu de la ramasser au
 * centre, et c'est le `sin(e/9 + t/2)` ajouté ensuite qui la fait monter et
 * redescendre comme une marée.
 *
 * Deux fréquences distinctes sur `i` (`i/9` pour le battement, `i/35` pour
 * l'ondulation) : les confondre écraserait la corolle en un simple anneau.
 */
function corolleDeMaree(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 235;
  const k = (4 + Math.cos(i / 9 - t * 2)) * Math.cos(i / 35);
  const e = y / 7 - 13;
  const d = Math.sqrt(k * k + e * e) + Math.sin(e / 9 + t / 2) - 4;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d - t + decalageSouris * 6;
  const q = 2 * Math.sin(k * 3) - (y / 35) * k * (9 + k * Math.sin(Math.cos(e) * 9 - d * 2 + t));
  return {
    x: q + 40 * Math.cos(c) + CENTRE,
    y: q * Math.sin(c) + d * 35,
    angle: c,
    magnitude: d,
  };
}

export const monterCorolleDeMaree = creerChampDePoints({
  formule: corolleDeMaree,
  pointsOrigine: 10000,
  pasParImage: 0.0393,
});
