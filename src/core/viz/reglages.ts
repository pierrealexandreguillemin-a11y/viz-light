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

/**
 * La graine a-t-elle changé ? Les algos de l'Atelier tirent leur composition
 * d'un générateur ensemencé : changer la vitesse ou une couleur s'applique en
 * direct, changer la graine redistribue forcément tout.
 */
export function graineChangee(avant: Reglages, apres: Reglages): boolean {
  return lireNombre(avant, "graine", 0) !== lireNombre(apres, "graine", 0);
}

/**
 * Interpolation entre deux couleurs `#rrggbb`, canal par canal — le dégradé
 * du cœur vers le bord dont plusieurs algos de l'Atelier tirent leur couleur.
 */
export function melangerHex(depart: string, arrivee: string, t: number): string {
  const part = Math.min(1, Math.max(0, t));
  const octet = (hex: string, i: number) =>
    Number.parseInt(hex.replace("#", "").slice(i, i + 2), 16);
  const canal = (i: number) => {
    const a = octet(depart, i);
    const b = octet(arrivee, i);
    const v = Math.round(a + (b - a) * part);
    return Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0");
  };
  return `#${canal(0)}${canal(2)}${canal(4)}`;
}

/** `#rrggbb` → composantes 0..1, pour les uniforms WebGL. */
export function hexVersRgb(hex: string): readonly [number, number, number] {
  const brut = hex.replace("#", "");
  const lire = (i: number) => Number.parseInt(brut.slice(i, i + 2), 16) / 255;
  if (brut.length !== 6 || [lire(0), lire(2), lire(4)].some(Number.isNaN)) return [0, 0, 0];
  return [lire(0), lire(2), lire(4)];
}

/**
 * Un `choix` (ADR 0015) vaut la clé d'une de ses options. Une clé inconnue —
 * manifest édité, option retirée — retombe sur le défaut au lieu de laisser
 * la viz chercher une famille ou une palette qui n'existe pas.
 */
export function lireChoix<T extends string>(
  r: Reglages,
  cle: string,
  admises: readonly T[],
  defaut: T,
): T {
  const valeur = r[cle];
  return admises.find((option) => option === valeur) ?? defaut;
}
