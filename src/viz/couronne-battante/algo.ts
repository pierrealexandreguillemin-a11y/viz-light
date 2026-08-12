import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * COURONNE BATTANTE — @yuruyurau, 6 mars 2026.
 *
 * PIÈGE DE LECTURE : le golfé écrit `e = i/w/3 - 13`, où `w` est la largeur de
 * la toile posée plus loin par `createCanvas(w = 400, w)`. La constante est donc
 * cachée dans le décor : `e = i/1200 - 13`. Lire `w` comme une variable libre
 * mènerait à un `NaN` silencieux.
 *
 * Le battement est dans l'ordonnée, pas dans le rayon : `30*sin(c*2 + m)` ajouté
 * au rayon vertical fait que la couronne s'aplatit et se redresse deux fois par
 * tour — elle bat comme une méduse.
 */
const LARGEUR_TOILE = 400;

function couronneBattante(i: number, t: number, decalageSouris: number): PointCalcule {
  const m = (i % 2) * 3;
  const k = 14 * Math.cos(i / 39);
  const e = i / LARGEUR_TOILE / 3 - 13;
  const d = (k * k + e * e) / 59 + 1;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d * 0.45 - Math.sin(t - d) / 8 - t / 8 + m + decalageSouris * 6;
  const q = 89 - Math.sin(k) * d + k * (8 / d + Math.sin(d * 3 + e / 9 - t));
  return {
    x: q * Math.sin(c) + CENTRE,
    y: (q + 40 + 30 * Math.sin(c * 2 + m)) * Math.cos(c) + CENTRE,
    angle: c,
    magnitude: d,
  };
}

export const monterCouronneBattante = creerChampDePoints({
  formule: couronneBattante,
  pointsOrigine: 30000,
  pasParImage: 0.0698,
});
