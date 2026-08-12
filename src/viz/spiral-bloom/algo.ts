import { creerBruitPerlin } from "@/core/viz/bruit-perlin.ts";
import type { MonterViz } from "@/core/viz/contrat.ts";
import { graineChangee, lireCouleur, lireNombre, melangerHex } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * SPIRAL BLOOM — Atelier génératif, portage fidèle (ADR 0010, « œuvre »).
 *
 * Une spirale par bras, tracée en 260 segments, dont le rayon croît avec
 * l'avancée `b` le long du bras — et se fait bousculer par un bruit de Perlin
 * (`wobble`). La couleur passe du cœur vers le bord par interpolation entre
 * deux teintes.
 *
 * LA FLORAISON N'ARRIVE QU'UNE FOIS : `progression` monte de 0 à 1 par pas de
 * `growth` et s'y arrête (`Math.min(1, …)`). Le rayon maximal en dépend, donc
 * la spirale s'ouvre puis se stabilise ; seul le bruit continue de la faire
 * respirer. C'est l'œuvre, pas un défaut d'animation.
 */
const SEGMENTS = 260;
const OFFSETS = 8;

export const monterSpiralBloom: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let progression = 0;
  let image = 0;
  let decalages: number[] = [];
  let bruit = creerBruitPerlin(creerAleatoire(2026));

  function semer(): void {
    const graine = Math.round(lireNombre(r, "graine", 2026));
    const alea = creerAleatoire(graine);
    decalages = Array.from({ length: OFFSETS }, () => alea() * 1000);
    bruit = creerBruitPerlin(creerAleatoire(graine + 1));
    progression = 0;
  }
  semer();

  return {
    frame() {
      const bras = Math.round(lireNombre(r, "arms", 3));
      const tours = lireNombre(r, "turns", 7);
      const oscillation = lireNombre(r, "wobble", 12);
      const croissance = lireNombre(r, "growth", 0.006);
      const { largeur, hauteur } = toile;

      ctx.fillStyle = lireCouleur(r, "background", "#0b0f14");
      ctx.fillRect(0, 0, largeur, hauteur);
      progression = Math.min(1, progression + croissance);
      image += 1;

      const rayonMax = Math.min(largeur, hauteur) * 0.45 * progression;
      const coeur = lireCouleur(r, "inner", "#f2a65a");
      const bord = lireCouleur(r, "outer", "#6fe7c8");
      ctx.lineWidth = 1.5;

      for (let bras_ = 0; bras_ < bras; bras_++) {
        const depart = (bras_ / bras) * Math.PI * 2;
        const decalage = decalages[bras_ % OFFSETS] ?? 0;
        let precedentX = 0;
        let precedentY = 0;

        for (let segment = 0; segment <= SEGMENTS; segment++) {
          const avancee = segment / SEGMENTS;
          const angle = depart + avancee * Math.PI * 2 * tours;
          const rayon = avancee * rayonMax;
          const ecart = (bruit(decalage + avancee * 3, image * 0.001, 0) - 0.5) * oscillation;
          const x = Math.cos(angle) * (rayon + ecart);
          const y = Math.sin(angle) * (rayon + ecart);

          if (segment > 0) {
            ctx.strokeStyle = melangerHex(coeur, bord, avancee);
            ctx.beginPath();
            ctx.moveTo(largeur / 2 + precedentX, hauteur / 2 + precedentY);
            ctx.lineTo(largeur / 2 + x, hauteur / 2 + y);
            ctx.stroke();
          }
          precedentX = x;
          precedentY = y;
        }
      }
    },
    regler(suivants) {
      const rejouer = graineChangee(r, suivants);
      r = suivants;
      if (rejouer) semer();
    },
    redimensionner: (suivantes) => toile.redimensionner(suivantes),
    demonter: () => toile.demonter(),
  };
};
