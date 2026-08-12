import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * COQUILLE JUMELLE — @yuruyurau, 8 août 2026 (#2).
 *
 * La sœur de la Coquille cannelée, publiée le même jour : même grille de cent
 * colonnes, même `tan(y/2)` qui creuse les cannelures. Trois chiffres changent
 * (`y/11+7` au lieu de `y/9+6`, `/8` au lieu de `/9`, `i/250` au lieu de
 * `i/233`) et le battement passe de `o*sin(y)` à `cos(y)/3`, ce qui referme la
 * coquille sur elle-même au lieu de la laisser s'évaser.
 */
function coquilleJumelle(i: number, t: number, decalageSouris: number): PointCalcule {
  const x = i % 100;
  const y = i / 250;
  const k = x / 4 - 12.5;
  const e = y / 11 + 7;
  const o = Math.sqrt(k * k + e * e) / 8;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = o / 2 + e / 2 - t / 4 + decalageSouris * 6;
  // Les deux termes de la formule, nommés : la tangente qui creuse la
  // cannelure, et le battement qui referme la coquille.
  const cannelure = (3 * (Math.tan(y / 2) / 2 + Math.cos(y))) / k;
  const battement = 4 / o + Math.cos(y) / 3 + Math.sin(e + o * 4 - t * 2);
  const q = cannelure + k * battement;
  return {
    x: q + 40 * Math.cos(c) + CENTRE,
    y: q * Math.sin(c) - (k * k * o) / 6 + e * o * 11,
    angle: c,
    magnitude: o,
  };
}

export const monterCoquilleJumelle = creerChampDePoints({
  formule: coquilleJumelle,
  pointsOrigine: 20000,
  pasParImage: 0.1047,
});
