/**
 * LE CONTRAT ENTRE UNE VIZ ET LE SOCLE — le pivot de tout le projet.
 *
 * Ce fichier ne contient que des types : aucun import React, aucun DOM
 * instancié. C'est ce qui permet à `algo.ts` de l'implémenter en TypeScript pur
 * (SPEC.md §3) et donc à l'extraction de se réduire à une copie de dossier. La
 * règle est mécanisée : `eslint.config.mjs` interdit à `src/viz/**\/algo.ts`
 * d'importer React, Next ou un hook du socle.
 *
 * Le contrat est volontairement UNIVERSEL — il ne parle ni de canvas2d, ni de
 * WebGL, ni de p5. Une viz reçoit un élément hôte et se débrouille : un algo
 * canvas y crée son canvas, un sketch p5 y monte son instance, un effet CSS y
 * pose ses div. Le socle ne connaît que `frame`, `redimensionner`, `demonter`.
 */

export interface Dimensions {
  /** Pixels CSS — ce avec quoi l'algorithme doit raisonner. */
  readonly largeur: number;
  readonly hauteur: number;
  /** Densité de pixels, DÉJÀ PLAFONNÉE par le socle. */
  readonly dpr: number;
}

/** Réglages d'un rendu, tels que déclarés dans le manifest. */
export type Reglages = Readonly<Record<string, number>>;

export interface InstanceViz {
  /** Une image. `temps` en secondes depuis le montage, `delta` déjà borné. */
  frame(temps: number, delta: number): void;
  /**
   * Nouveaux réglages, SANS REMONTER. C'est ce qui rend les curseurs vivants :
   * on voit l'effet d'un réglage pendant qu'on le déplace, au lieu de voir
   * l'animation repartir de zéro à chaque cran. Une viz qui ne l'implémente pas
   * est remontée — correct, mais moins agréable.
   */
  regler?(reglages: Reglages): void;
  /** Le conteneur a changé de taille. Optionnel : beaucoup d'algos s'en moquent. */
  redimensionner?(dimensions: Dimensions): void;
  /** Libérer contextes, tampons, instances p5. Optionnel. */
  demonter?(): void;
}

/**
 * Point d'entrée d'une viz. `hote` est un élément vide dont la viz a la pleine
 * propriété : le socle le vide avant chaque montage et après chaque démontage.
 */
/** Ce que toute coquille de viz reçoit : les réglages courants du panneau. */
export interface ProprietesViz {
  readonly reglages: Reglages;
}

export type MonterViz = (
  hote: HTMLElement,
  dimensions: Dimensions,
  reglages: Reglages,
) => InstanceViz;
