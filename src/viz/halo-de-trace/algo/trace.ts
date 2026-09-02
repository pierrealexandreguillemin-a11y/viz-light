import { creerAleatoire } from "@/core/viz/toile.ts";

/**
 * UN TRACÉ ABSTRAIT — pur calcul, aucun DOM.
 *
 * La source parcourait le circuit de Miami, qui appartient à un autre projet
 * du portefeuille (plan §3.4) : on importe l'effet, pas le contenu. Le tracé
 * est ici une boucle fermée tirée d'une graine — des rayons irréguliers autour
 * d'un centre, lissés par une spline de Catmull-Rom convertie en cubiques.
 * Une fonction du rayon selon l'angle ne se recoupe jamais : le circuit reste
 * lisible quelle que soit la graine.
 */
export const ESPACE = 1000;

interface Point {
  readonly x: number;
  readonly y: number;
}

function sommets(graine: number, nombre: number): Point[] {
  const alea = creerAleatoire(graine);
  const centre = ESPACE / 2;
  const points: Point[] = [];
  for (let i = 0; i < nombre; i += 1) {
    const angle = ((i + (alea() - 0.5) * 0.6) / nombre) * Math.PI * 2;
    const rayon = centre * (0.42 + alea() * 0.46);
    points.push({ x: centre + Math.cos(angle) * rayon, y: centre + Math.sin(angle) * rayon });
  }
  return points;
}

/** Catmull-Rom fermée → segments cubiques (tension 1/6), en une commande `d`. */
export function tracerBoucle(graine: number, nombre = 9): string {
  const p = sommets(graine, nombre);
  const n = p.length;
  const a = (i: number): Point => p[((i % n) + n) % n] ?? { x: 0, y: 0 };
  const premier = a(0);
  let d = `M ${premier.x.toFixed(1)} ${premier.y.toFixed(1)}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = a(i - 1);
    const p1 = a(i);
    const p2 = a(i + 1);
    const p3 = a(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return `${d} Z`;
}
