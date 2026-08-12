import type { Reglages } from "./contrat.ts";

/**
 * LECTURE DÉFENSIVE DES RÉGLAGES — TypeScript pur, zéro dépendance.
 *
 * Les réglages arrivent du manifest via l'état du panneau : trois genres
 * cohabitent dans le même dictionnaire (nombres, 0|1, chaînes CSS). Chaque
 * algorithme lit ce qu'il attend et retombe sur son défaut sinon — un réglage
 * manquant ou du mauvais genre ne doit jamais faire crasher une viz.
 */

export function lireNombre(r: Reglages, cle: string, defaut: number): number {
  const valeur = r[cle];
  return typeof valeur === "number" && Number.isFinite(valeur) ? valeur : defaut;
}

/** Un interrupteur vaut 0 ou 1 dans les réglages. */
export function lireInterrupteur(r: Reglages, cle: string, defaut: boolean): boolean {
  const valeur = r[cle];
  return typeof valeur === "number" ? valeur > 0 : defaut;
}

/** Une couleur est une chaîne CSS (hexadécimale dans les manifests des fonds). */
export function lireCouleur(r: Reglages, cle: string, defaut: string): string {
  const valeur = r[cle];
  return typeof valeur === "string" && valeur.trim() !== "" ? valeur : defaut;
}

/** `#rrggbb` → composantes 0..1, pour les uniforms WebGL. */
export function hexVersRgb(hex: string): readonly [number, number, number] {
  const brut = hex.replace("#", "");
  const lire = (i: number) => Number.parseInt(brut.slice(i, i + 2), 16) / 255;
  if (brut.length !== 6 || [lire(0), lire(2), lire(4)].some(Number.isNaN)) return [0, 0, 0];
  return [lire(0), lire(2), lire(4)];
}
