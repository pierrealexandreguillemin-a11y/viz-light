import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * RUBAN ONDULÉ — @yuruyurau, 8 mars 2026 (#2).
 *
 * Publié le même jour que le Ruban plissé et bâti sur le même squelette. Deux
 * différences font tout : `cos(x*2)` double la fréquence de balayage, et
 * l'amplitude du pli est modulée par `d/3` — proportionnelle à la distance.
 * Le pli s'ouvre donc vers l'extérieur, là où l'autre garde une amplitude
 * constante : d'où l'ondulation, plus large et plus lente à l'œil.
 */
function rubanOndule(i: number, t: number, decalageSouris: number): PointCalcule {
  const x = i;
  const y = i / 1000;
  const k = (5 + Math.sin(y)) * Math.cos(x * 2);
  const e = y / 6 - 13;
  const d = Math.sqrt(k * k + e * e) - 3;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d - t / 4 + (i % 2) * 8 + decalageSouris * 6;
  const q = 3 * Math.sin(k * 2) + (k / 19) * y * (e + (d / 3) * Math.sin(e - d * 4 + t)) + 99;
  return {
    x: q * Math.sin(c) * Math.cos(c / 4 + e / 3) + CENTRE,
    y: ((q * d) / 9) * Math.cos(c / 2 + 7) + CENTRE,
    angle: c,
    magnitude: d,
  };
}

export const monterRubanOndule = creerChampDePoints({
  formule: rubanOndule,
  pointsOrigine: 20000,
  pasParImage: 0.1047,
});
