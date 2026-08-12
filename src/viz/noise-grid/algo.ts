import { creerBruitPerlin } from "@/core/viz/bruit-perlin.ts";
import type { MonterViz } from "@/core/viz/contrat.ts";
import { graineChangee, lireCouleur, lireNombre, melangerHex } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * NOISE GRID — Atelier génératif, portage fidèle (ADR 0010, « œuvre »).
 *
 * Une grille de cellules dont chacune lit le bruit de Perlin à sa position, à
 * une profondeur qui dérive avec le temps. Le bruit pilote DEUX choses à la
 * fois : le diamètre du disque et sa couleur, interpolée entre une teinte basse
 * et une teinte haute. C'est cette double lecture qui donne l'impression d'une
 * respiration — un plan de bruit qui glisse sous la grille.
 */
export const monterNoiseGrid: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let image = 0;
  const grainePosee = () => Math.round(lireNombre(r, "graine", 2026));
  let bruit = creerBruitPerlin(creerAleatoire(grainePosee()));

  return {
    frame() {
      const cellules = Math.round(lireNombre(r, "cells", 24));
      const echelle = lireNombre(r, "scale", 0.25);
      const derive = lireNombre(r, "speed", 0.006);
      const tailleMax = lireNombre(r, "maxSize", 0.85);
      const { largeur, hauteur } = toile;

      ctx.fillStyle = lireCouleur(r, "background", "#10141a");
      ctx.fillRect(0, 0, largeur, hauteur);
      image += 1;

      const pasX = largeur / cellules;
      const pasY = hauteur / cellules;
      const profondeur = image * derive;
      const basse = lireCouleur(r, "low", "#171d25");
      const haute = lireCouleur(r, "high", "#f2a65a");

      for (let ligne = 0; ligne < cellules; ligne++) {
        for (let colonne = 0; colonne < cellules; colonne++) {
          const valeur = bruit(colonne * echelle, ligne * echelle, profondeur);
          const diametre = valeur * tailleMax * Math.min(pasX, pasY);
          ctx.fillStyle = melangerHex(basse, haute, valeur);
          ctx.beginPath();
          ctx.arc(
            colonne * pasX + pasX / 2,
            ligne * pasY + pasY / 2,
            Math.max(0, diametre / 2),
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    },
    regler(suivants) {
      const rejouer = graineChangee(r, suivants);
      r = suivants;
      if (rejouer) bruit = creerBruitPerlin(creerAleatoire(grainePosee()));
    },
    redimensionner: (suivantes) => toile.redimensionner(suivantes),
    demonter: () => toile.demonter(),
  };
};
