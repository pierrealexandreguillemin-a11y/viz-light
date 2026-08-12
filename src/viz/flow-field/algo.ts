import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * FLOW FIELD — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des particules qui suivent un champ de bruit fractal. Le coût est le produit
 * particules × octaves — « très peu de calculs » était l'affirmation la plus
 * trompeuse du tableau d'origine, et le curseur d'octaves le prouve en direct.
 *
 * NOTE (SPEC.md §4) : il existe une seconde version dans l'Atelier génératif ;
 * l'arbitrage esthétique entre les deux appartient à l'utilisateur.
 */
const hacher = (x: number, y: number, z: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

const lisser = (t: number): number => t * t * (3 - 2 * t);

/** Bruit de valeur 3D : huit coins interpolés — le temps est la 3e dimension. */
function bruit(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const tx = lisser(x - xi);
  const ty = lisser(y - yi);
  const tz = lisser(z - zi);
  const coin = (dx: number, dy: number, dz: number) => hacher(xi + dx, yi + dy, zi + dz);
  const melanger = (a: number, b: number, t: number) => a + (b - a) * t;
  const bas = melanger(
    melanger(coin(0, 0, 0), coin(1, 0, 0), tx),
    melanger(coin(0, 1, 0), coin(1, 1, 0), tx),
    ty,
  );
  const haut = melanger(
    melanger(coin(0, 0, 1), coin(1, 0, 1), tx),
    melanger(coin(0, 1, 1), coin(1, 1, 1), tx),
    ty,
  );
  return melanger(bas, haut, tz);
}

function fractal(x: number, y: number, z: number, octaves: number): number {
  let somme = 0;
  let amplitude = 0.5;
  let frequence = 1;
  for (let o = 0; o < octaves; o++) {
    somme += bruit(x * frequence, y * frequence, z * frequence) * amplitude;
    amplitude /= 2;
    frequence *= 2;
  }
  return somme;
}

interface Particule {
  x: number;
  y: number;
  vie: number;
}

export const monterFlowField: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  const alea = creerAleatoire(2026);
  const naitre = (): Particule => ({
    x: alea() * toile.largeur,
    y: alea() * toile.hauteur,
    vie: 60 + alea() * 240,
  });
  let particules = Array.from({ length: Math.round(lireNombre(r, "count", 1200)) }, naitre);
  ctx.fillStyle = lireCouleur(r, "background", "#0d1020");
  ctx.fillRect(0, 0, toile.largeur, toile.hauteur);

  return {
    frame(temps) {
      const octaves = Math.round(lireNombre(r, "octaves", 2));
      const echelle = lireNombre(r, "scale", 2) / 300;
      const vitesse = lireNombre(r, "speed", 1.2);
      const z = temps * lireNombre(r, "evolution", 0.06) * 10;

      ctx.globalAlpha = lireNombre(r, "fade", 0.04);
      ctx.fillStyle = lireCouleur(r, "background", "#0d1020");
      ctx.fillRect(0, 0, toile.largeur, toile.hauteur);
      ctx.globalAlpha = lireNombre(r, "opacity", 0.55);
      ctx.strokeStyle = lireCouleur(r, "color", "#7fb4e8");
      ctx.lineWidth = lireNombre(r, "thickness", 0.8);

      ctx.beginPath();
      for (const p of particules) {
        const angle = fractal(p.x * echelle, p.y * echelle, z, octaves) * Math.PI * 4;
        const nx = p.x + Math.cos(angle) * vitesse;
        const ny = p.y + Math.sin(angle) * vitesse;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        p.x = nx;
        p.y = ny;
        p.vie -= 1;
        const dehors = p.x < 0 || p.x > toile.largeur || p.y < 0 || p.y > toile.hauteur;
        if (dehors || p.vie <= 0) Object.assign(p, naitre());
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    regler(suivants: Reglages) {
      const compte = Math.round(lireNombre(suivants, "count", 1200));
      if (compte !== particules.length) {
        particules = Array.from({ length: compte }, naitre);
      }
      r = suivants;
    },
    redimensionner: (d) => toile.redimensionner(d),
    demonter: () => toile.demonter(),
  };
};
