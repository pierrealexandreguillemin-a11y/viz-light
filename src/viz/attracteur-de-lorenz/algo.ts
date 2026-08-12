import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * ATTRACTEUR DE LORENZ — @yuruyurau, 9 mai 2026.
 *
 * LE SEUL SKETCH À ÉTAT DE LA SÉRIE. Les douze autres calculent la position du
 * point `i` à partir de `i` seul ; celui-ci INTÈGRE le système de Lorenz pas à
 * pas — chaque point dépend du précédent. Trente mille pas d'Euler de 5·10⁻⁴
 * par image, repartis de `(9, 9, 9)` à chaque image.
 *
 * Ordre à respecter : le golfé met l'intégration en CORPS de boucle et le tracé
 * en clause de mise à jour, donc on intègre PUIS on trace. Tracer d'abord
 * décalerait toute la trajectoire d'un pas.
 *
 * `t` est ici un NUMÉRO D'IMAGE (`t++`), pas un angle : d'où la vitesse 1, qui
 * fait avancer le temps d'une unité par image à 60 i/s.
 */
const DEPART = 9;
const PAS = 5e-4;

/**
 * État de l'intégration. Il vit au module parce que le contrat du moteur passe
 * une fonction pure, mais il se ré-amorce tout seul : le moteur parcourt `i`
 * en DESCENDANT, donc un `i` qui remonte signale sans ambiguïté une nouvelle
 * image, et l'état repart de `(9, 9, 9)`.
 */
let x = DEPART;
let y = DEPART;
let z = DEPART;
let dernierIndice = -1;

function attracteurDeLorenz(i: number, t: number, decalageSouris: number): PointCalcule {
  if (i >= dernierIndice) {
    x = DEPART;
    y = DEPART;
    z = DEPART;
  }
  dernierIndice = i;

  const dx = x + 9 * (y - x) * PAS;
  const dy = y + (x * (28 - z) - y) * PAS;
  const dz = z + (x * y - z - z) * PAS;
  x = dx;
  y = dy;
  z = dz;

  const phase = (i % 9) * 8;
  const e = Math.sin((t * Math.PI) / 20 - (x * x) / 99 + (i % 9)) + 1;
  const q = x * e + 89;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const k = z / 59 - e / 29 + (t * Math.PI) / 480 + phase + decalageSouris * 6;
  return {
    x: q * Math.cos(k) + CENTRE,
    y: CENTRE - (q + 60 * Math.cos(k / 2)) * Math.sin(k),
    angle: k,
    // La géométrie de ce sketch n'a pas de « distance au centre » propre : le
    // rayon `q` en tient lieu, ramené à l'échelle des autres magnitudes.
    magnitude: q / 9,
  };
}

export const monterAttracteurDeLorenz = creerChampDePoints({
  formule: attracteurDeLorenz,
  pointsOrigine: 30000,
  pasParImage: 1,
});
