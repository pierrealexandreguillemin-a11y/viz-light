import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * BALAYAGE RADAR — réécriture libre (ADR 0010, régime « technique »).
 *
 * Une grille en un seul chemin, un faisceau conique qui tourne, et des échos
 * qui s'allument à son passage puis s'éteignent. Rien ici ne croît avec la
 * surface : c'est le profil de coût le plus plat du catalogue, et c'est voulu.
 */
interface Echo {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
}

function semerEchos(compte: number): readonly Echo[] {
  const alea = creerAleatoire(1959);
  return Array.from({ length: compte }, () => {
    const angle = alea() * Math.PI * 2;
    const distance = 0.15 + alea() * 0.8;
    return {
      x: 0.5 + Math.cos(angle) * distance * 0.5,
      y: 0.5 + Math.sin(angle) * distance * 0.5,
      angle,
    };
  });
}

function tracerGrille(ctx: CanvasRenderingContext2D, l: number, h: number, maille: number): void {
  ctx.beginPath();
  for (let x = maille / 2; x < l; x += maille) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = maille / 2; y < h; y += maille) {
    ctx.moveTo(0, y);
    ctx.lineTo(l, y);
  }
  ctx.lineWidth = 1;
  ctx.stroke();
}

/** Écart angulaire orienté DERRIÈRE le faisceau, dans [0, 2π). */
const ecartDerriere = (faisceau: number, angle: number): number => {
  const tau = Math.PI * 2;
  return (((faisceau - angle) % tau) + tau) % tau;
};

export const monterBalayageRadar: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let echos = semerEchos(Math.round(lireNombre(r, "blips", 18)));

  return {
    frame(temps) {
      const { largeur: l, hauteur: h } = toile;
      const faisceau = (temps * lireNombre(r, "speed", 1)) % (Math.PI * 2);
      ctx.fillStyle = lireCouleur(r, "background", "#04100e");
      ctx.fillRect(0, 0, l, h);
      ctx.strokeStyle = lireCouleur(r, "grid", "#123c33");
      tracerGrille(ctx, l, h, lireNombre(r, "cell", 48));

      // Le faisceau et sa traîne : un seul dégradé conique, aucun repeint hors de lui.
      const teinte = lireCouleur(r, "sweep", "#43e8a0");
      const traine = lireNombre(r, "trail", 1);
      const conique = ctx.createConicGradient(faisceau, l / 2, h / 2);
      conique.addColorStop(0, teinte);
      conique.addColorStop(Math.min(1, 0.25 * traine), "transparent");
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = conique;
      ctx.fillRect(0, 0, l, h);
      ctx.globalAlpha = 1;

      ctx.fillStyle = teinte;
      for (const echo of echos) {
        const age = ecartDerriere(faisceau, echo.angle);
        const eclat = Math.exp(-age * (2.4 / traine));
        if (eclat < 0.02) continue;
        ctx.globalAlpha = eclat;
        ctx.beginPath();
        ctx.arc(echo.x * l, echo.y * h, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    regler(suivants: Reglages) {
      const compte = Math.round(lireNombre(suivants, "blips", 18));
      if (compte !== echos.length) echos = semerEchos(compte);
      r = suivants;
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
