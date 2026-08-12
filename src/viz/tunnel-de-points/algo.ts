import { CENTRE, creerChampDePoints, type PointCalcule } from "@/core/viz/champ-de-points.ts";

/**
 * TUNNEL DE POINTS — @yuruyurau, 29 juillet 2026, dé-golfé puis paramétré.
 *
 * C'est la viz de RÉFÉRENCE du rendu « aligné » (ADR 0008) : son traitement —
 * teinte HSB par point, traînée par fondu, rotation souris — est devenu le
 * moteur commun `champ-de-points.ts`, dont les dix-huit autres sketches
 * héritent.
 *
 * Elle fournit SES PROPRES `angle` et `magnitude`, calculés dans l'espace de la
 * formule et non depuis la position à l'écran : c'est ce qui reproduit à
 * l'identique la version que l'utilisateur a validée.
 */
function positionner(i: number, temps: number, decalageSouris: number): PointCalcule {
  const indice = i / 353;
  const rayonBase = (indice < 9 ? 9 : 5) + Math.cos(indice * 31 - temps);
  const rayon = rayonBase * Math.cos(i / 44 + decalageSouris * 6);
  const profondeur = indice / 9 - 14;
  const magnitude = Math.sqrt(rayon * rayon + profondeur * profondeur) / 1.6;
  const angle = magnitude - temps / 2;

  return {
    x: (magnitude * 9 + rayon * rayon) * Math.cos(angle) + CENTRE,
    y:
      (55 + magnitude * 9) * Math.sin(angle / 3) +
      4 * Math.sin(rayon * 2) +
      (indice / 29) *
        rayon *
        (profondeur + 3 * Math.sin(profondeur * 4 - magnitude * 4 + temps * 3)) +
      CENTRE,
    angle,
    magnitude,
  };
}

export const monterTunnelDePoints = creerChampDePoints({
  formule: positionner,
  pointsOrigine: 6000,
  pasParImage: 0.0393,
});
