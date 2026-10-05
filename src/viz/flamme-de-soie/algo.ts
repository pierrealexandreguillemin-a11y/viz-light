import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * FLAMME DE SOIE — @yuruyurau, #つぶやきProcessing (fourni le 2026-10-05).
 *
 * Même squelette que la Corolle de marée — magnitude linéaire, `q + 30·cos(c)`
 * en abscisse, `d·39` en ordonnée — mais tout bat trois à six fois plus vite
 * sur une horloge huit fois plus lente (`t += π/480`) : la flamme ondule sans
 * jamais avancer.
 *
 * Deux pièges du golfé :
 * - `sin(t*3 − k*k/8)` est AJOUTÉ à la magnitude, pas multiplié : c'est lui qui
 *   fait vaciller chaque mèche à sa propre phase (`k²`).
 * - la largeur `5 + 3·sin(y + 4)` dépend de `y` seul ; `i/7` ne fait que
 *   balayer chaque rang de gauche à droite. Confondre les deux donnerait un
 *   fuseau régulier au lieu d'une flamme qui s'évase et se resserre.
 */
function flammeDeSoie(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 885;
  const k = (5 + 3 * Math.sin(y + 4)) * Math.cos(i / 7);
  const e = y / 5 - 9;
  const d = Math.sqrt(k * k + e * e) - 2.8 + Math.sin(t * 3 - (k * k) / 8);
  const q = 3 * Math.sin(k * 2) + ((k * y) / 25) * (9 + 2 * Math.sin(e * 6 - d * 5 + t * 6));
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d - t + decalageSouris * 6;
  return {
    x: q + 30 * Math.cos(c) + CENTRE,
    y: q * Math.sin(c) + d * 39,
    angle: c,
    magnitude: d,
  };
}

export const monterFlammeDeSoie = creerChampDePoints({
  formule: flammeDeSoie,
  pointsOrigine: 20000,
  pasParImage: 0.006545,
});
