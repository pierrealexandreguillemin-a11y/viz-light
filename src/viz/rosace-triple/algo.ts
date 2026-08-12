import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * ROSACE TRIPLE — @yuruyurau, 31 juillet 2026.
 *
 * `m = i % 3 * 4` répartit les points en TROIS familles décalées de quatre
 * radians : la même rosace dessinée trois fois, tournée d'un tiers de tour à
 * chaque fois. Le `sin(t/2 + m)/4` ajouté au rayon fait respirer les trois
 * copies en décalé — c'est ce déphasage qui donne l'impression de pétales qui
 * se croisent.
 *
 * `mag(k, e) ** 4` : la magnitude est élevée à la PUISSANCE QUATRE, donc le
 * carré du carré — écrire `(k*k + e*e)` sans le recarrer donnerait une rosace
 * beaucoup plus molle.
 */
function rosaceTriple(i: number, t: number, decalageSouris: number): PointCalcule {
  const m = (i % 3) * 4;
  const k = 9 * Math.cos(i / 81);
  const e = i / 461 - 11;
  const carre = k * k + e * e;
  const d = (carre * carre) / 4e4 + 1.5 + Math.sin(t / 2 + m) / 4;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d + Math.sin(t - d * 4) / 9 - t / 9 + m + decalageSouris * 6;
  const q = 89 - e * Math.sin(k) + k * (4 + 2 * Math.sin(d * 9 + e / 9 - t));
  return {
    x: q * Math.cos(c) + CENTRE,
    y: (q + 30) * Math.sin(c) + CENTRE,
    angle: c,
    magnitude: d,
  };
}

export const monterRosaceTriple = creerChampDePoints({
  formule: rosaceTriple,
  pointsOrigine: 10000,
  pasParImage: 0.0524,
});
