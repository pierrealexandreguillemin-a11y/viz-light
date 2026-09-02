/**
 * LES SEPT FAMILLES — mathématiques pures, aucune référence au DOM.
 *
 * Réécriture libre (ADR 0010, régime « technique ») des calculateurs de
 * `fractal-explorer.html` et du lissage de `mandelbrot-domain/`. Chaque famille
 * ne diffère que par son PAS d'itération ; la boucle de fuite, le lissage
 * (`n + 1 − log(log|z|)/log d`) et les vues par défaut sont partagés ici.
 */

/** Vue sur le plan complexe : centre et largeur du cadre (en unités). */
export interface Vue {
  readonly centreRe: number;
  readonly centreIm: number;
  readonly echelle: number;
}

/**
 * L'état d'itération vit dans DEUX variables de module, pas dans un tableau :
 * la boucle de fuite est le point chaud de toute la viz (un million de pixels
 * fois des dizaines d'itérations), et un accès indexé vérifié par pas coûterait
 * plus que le pas lui-même. Les familles sont définies ici même, donc elles y
 * lisent et y écrivent directement.
 */
let zRe = 0;
let zIm = 0;

/** z ← f(z, c), écrit en place dans `zRe` / `zIm`. */
type Pas = (cRe: number, cIm: number) => void;

export interface Famille {
  readonly pas: Pas;
  /** Degré de la formule — base du logarithme du lissage. */
  readonly degre: number;
  /** Julia : z part du point et `c` est fixe. Les autres : z part de 0, c = point. */
  readonly julia: boolean;
  readonly vue: Vue;
}

const quadratique: Pas = (cRe, cIm) => {
  const re = zRe;
  zRe = re * re - zIm * zIm + cRe;
  zIm = 2 * re * zIm + cIm;
};

/** Burning Ship : les deux composantes passent en valeur absolue avant le carré. */
const navire: Pas = (cRe, cIm) => {
  const re = Math.abs(zRe);
  const im = Math.abs(zIm);
  zRe = re * re - im * im + cRe;
  zIm = 2 * re * im + cIm;
};

/** Tricorne (Mandelbar) : le carré du conjugué — le signe de la partie imaginaire s'inverse. */
const tricorne: Pas = (cRe, cIm) => {
  const re = zRe;
  zRe = re * re - zIm * zIm + cRe;
  zIm = -2 * re * zIm + cIm;
};

/** Multibrot z → zⁿ + c, par la forme polaire. */
const multibrot =
  (n: number): Pas =>
  (cRe, cIm) => {
    const rayon = Math.pow(Math.sqrt(zRe * zRe + zIm * zIm), n);
    const angle = n * Math.atan2(zIm, zRe);
    zRe = rayon * Math.cos(angle) + cRe;
    zIm = rayon * Math.sin(angle) + cIm;
  };

const vue = (centreRe: number, centreIm: number, echelle: number): Vue => ({
  centreRe,
  centreIm,
  echelle,
});

export const FAMILLES = {
  mandelbrot: { pas: quadratique, degre: 2, julia: false, vue: vue(-0.5, 0, 3.5) },
  julia: { pas: quadratique, degre: 2, julia: true, vue: vue(0, 0, 3.5) },
  navire: { pas: navire, degre: 2, julia: false, vue: vue(-0.5, -0.5, 3.5) },
  tricorne: { pas: tricorne, degre: 2, julia: false, vue: vue(-0.3, 0, 3.5) },
  multibrot3: { pas: multibrot(3), degre: 3, julia: false, vue: vue(0, 0, 3) },
  multibrot4: { pas: multibrot(4), degre: 4, julia: false, vue: vue(0, 0, 2.5) },
  multibrot5: { pas: multibrot(5), degre: 5, julia: false, vue: vue(0, 0, 2.2) },
} as const satisfies Record<string, Famille>;

export type NomFamille = keyof typeof FAMILLES;
export const NOMS_FAMILLES = Object.keys(FAMILLES) as readonly NomFamille[];

/** Constantes `c` de Julia célèbres — un choix libellé, jamais deux curseurs à légende. */
export const CONSTANTES_JULIA = {
  dendrite: [-0.7, 0.27015],
  lapin: [-0.8, 0.156],
  dragon: [-0.4, 0.6],
  spirale: [0.285, 0.01],
  etoile: [-0.835, -0.2321],
  "san-marco": [-0.75, 0],
  flocon: [0.355, 0.355],
} as const satisfies Record<string, readonly [number, number]>;

export type NomConstanteJulia = keyof typeof CONSTANTES_JULIA;
export const NOMS_CONSTANTES_JULIA = Object.keys(CONSTANTES_JULIA) as readonly NomConstanteJulia[];

/** Rayon de fuite au carré : large, pour que le lissage ne bande pas. */
const FUITE = 256;

/** Un point n'ayant pas fui après `maxIter` itérations est DANS l'ensemble. */
export const INTERIEUR = -1;

/**
 * Nombre d'itérations LISSÉ avant la fuite, ou `INTERIEUR`. Le lissage
 * `n + 1 − log(log|z| / log d) / log d` transforme les paliers entiers en un
 * dégradé continu — c'est lui qui fait les couleurs soyeuses, pas la palette.
 */
export function echapper(
  famille: Famille,
  pointRe: number,
  pointIm: number,
  maxIter: number,
  juliaRe: number,
  juliaIm: number,
): number {
  const cRe = famille.julia ? juliaRe : pointRe;
  const cIm = famille.julia ? juliaIm : pointIm;
  zRe = famille.julia ? pointRe : 0;
  zIm = famille.julia ? pointIm : 0;
  let iter = 0;
  let module2 = zRe * zRe + zIm * zIm;
  while (module2 <= FUITE && iter < maxIter) {
    famille.pas(cRe, cIm);
    module2 = zRe * zRe + zIm * zIm;
    iter += 1;
  }
  if (iter >= maxIter) return INTERIEUR;
  const logD = Math.log(famille.degre);
  const logZn = Math.log(module2) / 2;
  // Borné à 0 : un point qui fuit dès le départ donnerait une valeur négative,
  // que le coloriage prendrait pour l'intérieur ou lirait hors de la table.
  return Math.max(0, iter + 1 - Math.log(logZn / logD) / logD);
}

/** Pixel (centre) → point du plan, l'axe imaginaire vers le BAS comme la source. */
export function pixelVersPlan(
  x: number,
  y: number,
  largeur: number,
  hauteur: number,
  v: Vue,
): readonly [number, number] {
  const aspect = largeur / hauteur;
  return [
    v.centreRe + (x / largeur - 0.5) * v.echelle * aspect,
    v.centreIm + (y / hauteur - 0.5) * v.echelle,
  ];
}

/** Bornes de l'échelle : la précision double lâche vers 1e-14, et au-delà de 8 on ne voit qu'un point. */
const ECHELLE_MIN = 1e-13;
const ECHELLE_MAX = 8;

/** Zoom d'un facteur (< 1 = rapprocher) VERS un point du plan, qui reste sous le curseur. */
export function zoomer(v: Vue, facteur: number, versRe: number, versIm: number): Vue {
  const echelle = Math.min(ECHELLE_MAX, Math.max(ECHELLE_MIN, v.echelle * facteur));
  const f = echelle / v.echelle;
  return {
    centreRe: v.centreRe + (versRe - v.centreRe) * (1 - f),
    centreIm: v.centreIm + (versIm - v.centreIm) * (1 - f),
    echelle,
  };
}

/** Déplacement exprimé en fraction du cadre (dx = 1 → un cadre entier). */
export function deplacer(v: Vue, fractionX: number, fractionY: number, aspect: number): Vue {
  return {
    centreRe: v.centreRe - fractionX * v.echelle * aspect,
    centreIm: v.centreIm - fractionY * v.echelle,
    echelle: v.echelle,
  };
}
