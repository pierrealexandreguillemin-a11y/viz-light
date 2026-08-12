import type { Dimensions } from "./contrat.ts";

/**
 * UNE TOILE CANVAS 2D DPR-CORRECTE — TypeScript pur, zéro dépendance.
 *
 * Tous les fonds canvas2d commencent pareil : créer un canvas dans l'hôte,
 * dimensionner son tampon en pixels physiques, et poser une transformation qui
 * permet à l'algorithme de raisonner en pixels CSS. Le recopier dans chaque
 * algo serait la duplication que `jscpd` interdit — et huit endroits où se
 * tromper de DPR.
 */
export interface Toile {
  readonly ctx: CanvasRenderingContext2D;
  /** Dimensions courantes en pixels CSS — mises à jour par `redimensionner`. */
  readonly largeur: number;
  readonly hauteur: number;
  redimensionner(dimensions: Dimensions): void;
  demonter(): void;
}

export function creerToile(hote: HTMLElement, dimensions: Dimensions): Toile {
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  hote.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexte 2D indisponible sur ce navigateur.");

  const toile = {
    ctx,
    largeur: 0,
    hauteur: 0,
    redimensionner({ largeur, hauteur, dpr }: Dimensions) {
      toile.largeur = largeur;
      toile.hauteur = hauteur;
      canvas.width = Math.max(1, Math.round(largeur * dpr));
      canvas.height = Math.max(1, Math.round(hauteur * dpr));
      canvas.style.width = `${largeur}px`;
      canvas.style.height = `${hauteur}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    demonter() {
      canvas.remove();
    },
  };
  toile.redimensionner(dimensions);
  return toile;
}

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32). Les fonds à points
 * (étoiles, échos radar…) doivent produire le même ciel à chaque montage :
 * un `Math.random()` ferait sauter les points à chaque changement de réglage.
 */
export function creerAleatoire(graine: number): () => number {
  let etat = graine >>> 0;
  return () => {
    etat = (etat + 0x6d2b79f5) >>> 0;
    let t = etat;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
