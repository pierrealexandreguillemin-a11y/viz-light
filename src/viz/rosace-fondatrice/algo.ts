import {
  creerChampDePoints,
  placerEnPolaire,
  type PointCalcule,
} from "@/core/viz/champ-de-points.ts";

/**
 * ROSACE FONDATRICE — @yuruyurau, 22 février 2026.
 *
 * La plus ancienne des dix-huit, et le patron dont descendent la Rosace jumelle
 * (5 mai) et le Médaillon tournant (10 mars) : même squelette
 * `q·sin(c) + 200 / (q+40)·cos(c) + 200`, mêmes `9·cos(i/N)` et `i/652`.
 *
 * Elle est la seule dont la fonction s'appelle SANS ARGUMENT (`a()`) : là où
 * ses descendantes reçoivent un décalage `m` calculé dans la boucle, celle-ci
 * lit `i % 2 * 3` directement dans son angle. Le dédoublement en deux familles
 * de points est donc déjà là, simplement écrit à l'intérieur.
 */
function rosaceFondatrice(i: number, t: number, decalageSouris: number): PointCalcule {
  const k = 8 * Math.cos(i / 41);
  const e = i / 652 - 14;
  const d = (k * k + e * e) / 79 + 1;
  // La souris tourne la scène — même geste que le Tunnel (rendu aligné).
  const c = d / 2 + Math.sin(t - d) / d / 8 - t / 16 + (i % 2) * 3 + decalageSouris * 6;
  const q =
    79 -
    2 * Math.sin((k / d) * 5) +
    Math.sin(d / 2 + 7) * k * (4 + 3 * Math.sin(Math.sin(d * d + e / 7 - t)));
  return placerEnPolaire(q, c, d, 40);
}

export const monterRosaceFondatrice = creerChampDePoints({
  formule: rosaceFondatrice,
  pointsOrigine: 20000,
  pasParImage: 0.0524,
});
