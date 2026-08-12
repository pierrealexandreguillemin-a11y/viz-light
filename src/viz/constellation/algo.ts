import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * CONSTELLATION — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des points en dérive lente, reliés quand ils se rapprochent. La liaison est
 * cherchée dans une GRILLE SPATIALE : chaque point ne se compare qu'à ses
 * voisins de case, pas aux n−1 autres. L'interrupteur « naïf » restaure le
 * n²/2 des tutoriels — gardé parce que le banc d'essai existait pour rendre
 * cette falaise visible.
 */
interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function semer(compte: number, largeur: number, hauteur: number): Point[] {
  const alea = creerAleatoire(77);
  return Array.from({ length: compte }, () => ({
    x: alea() * largeur,
    y: alea() * hauteur,
    vx: (alea() - 0.5) * 2,
    vy: (alea() - 0.5) * 2,
  }));
}

function* paresNaives(points: readonly Point[]): Generator<readonly [Point, Point]> {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      yield [points[i] as Point, points[j] as Point];
    }
  }
}

function* paresEntre(
  premiers: readonly Point[],
  seconds: readonly Point[],
  memeCase: boolean,
): Generator<readonly [Point, Point]> {
  for (let i = 0; i < premiers.length; i++) {
    for (let j = memeCase ? i + 1 : 0; j < seconds.length; j++) {
      yield [premiers[i] as Point, seconds[j] as Point];
    }
  }
}

/**
 * Grille spatiale : seules les cases voisines peuvent contenir un lié. Chaque
 * case ne regarde que ses voisines « en avant » — chaque paire sort une fois.
 */
const CASES_EN_AVANT = [
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

function* paresParGrille(
  points: readonly Point[],
  maille: number,
): Generator<readonly [Point, Point]> {
  const cases = new Map<string, Point[]>();
  for (const p of points) {
    const k = `${Math.floor(p.x / maille)}:${Math.floor(p.y / maille)}`;
    const existante = cases.get(k);
    if (existante) existante.push(p);
    else cases.set(k, [p]);
  }
  for (const [k, occupants] of cases) {
    const [cx = 0, cy = 0] = k.split(":").map(Number);
    for (const [dx, dy] of CASES_EN_AVANT) {
      const memeCase = dx === 0 && dy === 0;
      const autres = memeCase ? occupants : cases.get(`${cx + dx}:${cy + dy}`);
      if (autres) yield* paresEntre(occupants, autres, memeCase);
    }
  }
}

export const monterConstellation: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let points = semer(Math.round(lireNombre(r, "count", 160)), toile.largeur, toile.hauteur);

  const avancer = (delta: number) => {
    const vitesse = lireNombre(r, "speed", 1.4) * delta * 30;
    for (const p of points) {
      p.x = (p.x + p.vx * vitesse + toile.largeur) % toile.largeur;
      p.y = (p.y + p.vy * vitesse + toile.hauteur) % toile.hauteur;
    }
  };

  const relier = (distance: number) => {
    const couleurLien = lireCouleur(r, "line", "#2f6f7a");
    const naif = lireInterrupteur(r, "naive", false);
    const pares = naif ? paresNaives(points) : paresParGrille(points, distance);
    ctx.strokeStyle = couleurLien;
    ctx.lineWidth = 1;
    for (const [p, q] of pares) {
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > distance * distance) continue;
      ctx.globalAlpha = 1 - Math.sqrt(d2) / distance;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  return {
    frame(_temps, delta) {
      avancer(delta);
      ctx.fillStyle = lireCouleur(r, "background", "#070d12");
      ctx.fillRect(0, 0, toile.largeur, toile.hauteur);
      relier(lireNombre(r, "distance", 110));

      const rayon = lireNombre(r, "nodeSize", 1.5);
      ctx.fillStyle = lireCouleur(r, "node", "#7fe3d4");
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, rayon, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    regler(suivants: Reglages) {
      const compte = Math.round(lireNombre(suivants, "count", 160));
      if (compte !== points.length) points = semer(compte, toile.largeur, toile.hauteur);
      r = suivants;
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
