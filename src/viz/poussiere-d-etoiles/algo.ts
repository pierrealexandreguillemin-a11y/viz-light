import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * POUSSIÈRE D'ÉTOILES — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des points fixes qui scintillent chacun à son rythme. Le ciel est semé par un
 * générateur déterministe : changer un réglage ne fait pas sauter les étoiles.
 * L'interrupteur « halo » active `shadowBlur` — un flou PAR POINT et PAR IMAGE,
 * gardé parce que le banc d'essai existait pour rendre ce coût visible.
 */
interface Etoile {
  readonly x: number;
  readonly y: number;
  readonly rayon: number;
  readonly phase: number;
  readonly rythme: number;
}

function semer(compte: number): readonly Etoile[] {
  const alea = creerAleatoire(4242);
  return Array.from({ length: compte }, () => ({
    x: alea(),
    y: alea(),
    rayon: 0.4 + alea() * alea() * 2.6,
    phase: alea() * Math.PI * 2,
    rythme: 0.3 + alea() * 1.6,
  }));
}

export const monterPoussiereDEtoiles: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let etoiles = semer(Math.round(lireNombre(r, "count", 260)));

  return {
    frame(temps) {
      ctx.fillStyle = lireCouleur(r, "background", "#080b14");
      ctx.fillRect(0, 0, toile.largeur, toile.hauteur);

      const taille = lireNombre(r, "size", 1);
      const couleur = lireCouleur(r, "color", "#e8eaf2");
      const halo = lireInterrupteur(r, "halo", false);
      ctx.shadowBlur = halo ? lireNombre(r, "haloSize", 8) : 0;
      ctx.shadowColor = halo ? couleur : "transparent";
      ctx.fillStyle = couleur;

      for (const etoile of etoiles) {
        const scintille = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(temps * etoile.rythme + etoile.phase));
        ctx.globalAlpha = scintille;
        ctx.beginPath();
        ctx.arc(
          etoile.x * toile.largeur,
          etoile.y * toile.hauteur,
          etoile.rayon * taille,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    },
    regler(suivants: Reglages) {
      const compte = Math.round(lireNombre(suivants, "count", 260));
      if (compte !== etoiles.length) etoiles = semer(compte);
      r = suivants;
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
