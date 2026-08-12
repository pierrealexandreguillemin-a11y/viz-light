import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * COLONNE PERLÉE — @yuruyurau, 7 mai 2026.
 *
 * Le seul sketch de la série qui appelle `circle()` et non `point()`, avec un
 * diamètre qui dépend de la formule : `k*k > 15 ? 2 : 1`. Les grains du bord de
 * la colonne, où `k` est grand, sont donc DEUX FOIS plus gros que ceux du
 * centre — c'est ce contraste qui donne le relief perlé. D'où le champ `taille`
 * ajouté au moteur pour cette viz.
 *
 * `t += PI/240` : la plus lente du lot, quatre fois plus lente que ses voisines.
 * Le `−475` sur l'ordonnée sort le motif par le bas de la toile ; c'est voulu,
 * on n'en voit que la colonne.
 */
function colonnePerlee(i: number, t: number, decalageSouris: number): PointCalcule {
  const y = i / 235;
  const k = 4 * Math.cos(i / 21);
  const e = y / 8 - 20;
  const d = Math.sqrt(k * k + e * e);
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d - t + decalageSouris * 6;
  const q =
    3 * Math.sin(k * 2) +
    0.3 / k +
    Math.sin(y / 19) * k * (9 + 2 * Math.sin(e * 14 - d * 3 + t * 2));
  return {
    x: q + 50 * Math.cos(c) + CENTRE,
    y: q * Math.sin(c) + d * 39 - 475,
    angle: c,
    magnitude: d,
    taille: k * k > 15 ? 2 : 1,
  };
}

export const monterColonnePerlee = creerChampDePoints({
  formule: colonnePerlee,
  pointsOrigine: 10000,
  pasParImage: 0.0131,
});
