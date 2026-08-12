import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * GRAIN DE FILM — réécriture libre (ADR 0010, régime « technique »).
 *
 * Un dégradé vertical, et par-dessus une tuile de bruit générée UNE fois puis
 * simplement décalée à chaque image. C'est ce décalage qui fait tout : l'œil
 * lit un grain vivant alors que rien n'est recalculé. L'interrupteur « live »
 * régénère la tuile à chaque image — le comportement d'un feTurbulence animé,
 * conservé parce que le banc d'essai existait pour rendre ce coût visible.
 */
const TUILE = 256;

function construireTuile(cellule: number, intensite: number): HTMLCanvasElement {
  const tuile = document.createElement("canvas");
  tuile.width = TUILE;
  tuile.height = TUILE;
  const ctx = tuile.getContext("2d");
  if (!ctx) return tuile;
  const pas = Math.max(1, Math.round(cellule));
  const cotes = Math.ceil(TUILE / pas);
  const image = ctx.createImageData(TUILE, TUILE);
  for (let gy = 0; gy < cotes; gy++) {
    for (let gx = 0; gx < cotes; gx++) {
      const gris = Math.random() * 255;
      const alpha = Math.random() * intensite * 255;
      for (let y = gy * pas; y < Math.min(TUILE, (gy + 1) * pas); y++) {
        for (let x = gx * pas; x < Math.min(TUILE, (gx + 1) * pas); x++) {
          const i = (y * TUILE + x) * 4;
          image.data[i] = image.data[i + 1] = image.data[i + 2] = gris;
          image.data[i + 3] = alpha;
        }
      }
    }
  }
  ctx.putImageData(image, 0, 0);
  return tuile;
}

export const monterGrainDeFilm: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let tuile = construireTuile(lireNombre(r, "cell", 1), lireNombre(r, "intensity", 0.18));
  const derive = creerAleatoire(7);

  return {
    frame(temps) {
      if (lireInterrupteur(r, "live", false)) {
        tuile = construireTuile(lireNombre(r, "cell", 1), lireNombre(r, "intensity", 0.18));
      }
      const fond = ctx.createLinearGradient(0, 0, 0, toile.hauteur);
      fond.addColorStop(0, lireCouleur(r, "colorA", "#1d2a44"));
      fond.addColorStop(1, lireCouleur(r, "colorB", "#5c2f4a"));
      ctx.fillStyle = fond;
      ctx.fillRect(0, 0, toile.largeur, toile.hauteur);

      const vitesse = lireNombre(r, "drift", 0.8);
      const dx = Math.floor((derive() + temps * vitesse * 8) % TUILE);
      const dy = Math.floor((derive() + temps * vitesse * 5) % TUILE);
      for (let y = -dy; y < toile.hauteur; y += TUILE) {
        for (let x = -dx; x < toile.largeur; x += TUILE) {
          ctx.drawImage(tuile, x, y);
        }
      }
    },
    regler(suivants: Reglages) {
      const rebatir =
        lireNombre(suivants, "cell", 1) !== lireNombre(r, "cell", 1) ||
        lireNombre(suivants, "intensity", 0.18) !== lireNombre(r, "intensity", 0.18);
      r = suivants;
      if (rebatir) {
        tuile = construireTuile(lireNombre(r, "cell", 1), lireNombre(r, "intensity", 0.18));
      }
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
