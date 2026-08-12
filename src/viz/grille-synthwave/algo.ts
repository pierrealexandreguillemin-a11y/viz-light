import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";
import { creerToile } from "@/core/viz/toile.ts";

/**
 * GRILLE SYNTHWAVE — réécriture libre (ADR 0010, régime « technique »).
 *
 * Un ciel dégradé, un soleil strié, et une grille en perspective qui défile.
 * Tous les segments de la grille sont accumulés dans UN SEUL chemin puis
 * tracés d'un coup : dessinée avec un `beginPath` par ligne, la même grille
 * coûterait plusieurs fois plus — c'est la leçon que portait le banc d'essai.
 */
function peindreCiel(ctx: CanvasRenderingContext2D, l: number, yh: number, r: Reglages): void {
  const ciel = ctx.createLinearGradient(0, 0, 0, yh);
  ciel.addColorStop(0, lireCouleur(r, "skyTop", "#160b2e"));
  ciel.addColorStop(1, lireCouleur(r, "skyBottom", "#4b1450"));
  ctx.fillStyle = ciel;
  ctx.fillRect(0, 0, l, yh);
}

function peindreSoleil(ctx: CanvasRenderingContext2D, l: number, yh: number, r: Reglages): void {
  const rayon = yh * 0.42;
  const cx = l / 2;
  const cy = yh * 0.92;
  const soleil = ctx.createLinearGradient(0, cy - rayon, 0, cy + rayon);
  soleil.addColorStop(0, lireCouleur(r, "sunTop", "#ffd76e"));
  soleil.addColorStop(1, lireCouleur(r, "sunBottom", "#ff4d7d"));
  ctx.save();
  // Double découpe : le disque, ET l'horizon — le soleil ne déborde jamais dessous.
  ctx.beginPath();
  ctx.rect(0, 0, l, yh);
  ctx.clip();
  ctx.beginPath();
  ctx.arc(cx, cy, rayon, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = soleil;
  ctx.fillRect(cx - rayon, cy - rayon, rayon * 2, rayon * 2);
  // Les stries : des bandes vides de plus en plus épaisses vers le bas.
  ctx.fillStyle = lireCouleur(r, "skyTop", "#160b2e");
  for (let i = 0; i < 6; i++) {
    const y = cy - rayon * 0.1 + i * rayon * 0.16;
    ctx.fillRect(cx - rayon, y, rayon * 2, 1.5 + i * 1.2);
  }
  ctx.restore();
}

function tracerGrille(
  ctx: CanvasRenderingContext2D,
  l: number,
  h: number,
  yh: number,
  defil: number,
  r: Reglages,
): void {
  ctx.fillStyle = lireCouleur(r, "ground", "#0a0616");
  ctx.fillRect(0, yh, l, h - yh);
  const colonnes = Math.round(lireNombre(r, "columns", 16));
  const rangees = Math.round(lireNombre(r, "rows", 24));
  ctx.beginPath();
  for (let c = -colonnes; c <= colonnes; c++) {
    const xBas = l / 2 + (c / colonnes) * l * 1.6;
    ctx.moveTo(l / 2 + (xBas - l / 2) * 0.02, yh);
    ctx.lineTo(xBas, h);
  }
  for (let i = 0; i < rangees; i++) {
    // Progression exponentielle : les rangées s'écartent en s'approchant.
    const t = ((i + defil) % rangees) / rangees;
    const y = yh + (h - yh) * (t * t);
    ctx.moveTo(0, y);
    ctx.lineTo(l, y);
  }
  ctx.strokeStyle = lireCouleur(r, "grid", "#ff5fa8");
  ctx.lineWidth = 1;
  ctx.stroke();
}

export const monterGrilleSynthwave: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;

  return {
    frame(temps) {
      const { largeur: l, hauteur: h } = toile;
      const yh = h * lireNombre(r, "horizon", 0.55);
      peindreCiel(ctx, l, yh, r);
      peindreSoleil(ctx, l, yh, r);
      tracerGrille(ctx, l, h, yh, temps * lireNombre(r, "speed", 0.5) * 4, r);
    },
    regler(suivants: Reglages) {
      r = suivants;
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
