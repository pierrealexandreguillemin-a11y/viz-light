import type { Toile } from "@/core/viz/toile.ts";

import { echapper, INTERIEUR, pixelVersPlan, type Famille, type Vue } from "./fractales.ts";
import { TAILLE_LUT, type NomPalette } from "./palettes.ts";

/**
 * LE RENDU PROGRESSIF — le piège d'instrument du plan (§3.3), résolu ici.
 *
 * Calculer l'image entière dans un `frame()` effondrerait la cadence, et
 * l'instrument aurait raison de l'afficher. Le calcul est donc découpé en
 * PASSES de plus en plus fines (blocs de 8, 4, 2 puis 1 pixel) et chaque
 * `frame()` n'en avance qu'une TRANCHE, sous un budget de temps. La première
 * passe ignore le budget : elle est bon marché et donne une image entière —
 * grossière — dès la première image, ce qui rend le glissé et le zoom fluides.
 *
 * Les valeurs (itérations lissées) et les couleurs sont deux étapes : la table
 * de couleurs peut DÉFILER le long de la fractale à chaque image sans rien
 * recalculer — c'est le mouvement de la viz au repos, et c'est un vrai travail
 * que l'instrument mesure.
 */
const BLOCS = [8, 4, 2, 1] as const;
/** Part d'une image à 60 i/s laissée au calcul ; le reste va au coloriage et au navigateur. */
const BUDGET_MS = 8;

export interface Apparence {
  readonly famille: Famille;
  readonly maxIter: number;
  readonly juliaRe: number;
  readonly juliaIm: number;
  readonly lut: Uint8ClampedArray;
  /** Nom de la palette dont `lut` est la table — pour ne la reconstruire que si elle change. */
  readonly nomPalette: NomPalette;
  /** Longueur du cycle de couleurs, en itérations. */
  readonly cycle: number;
  /** Couleur de l'intérieur de l'ensemble, RVB 0..255. */
  readonly interieur: readonly [number, number, number];
}

export interface RenduProgressif {
  /** Repart de la passe grossière — après tout changement de vue ou d'apparence. */
  relancer(): void;
  /** Le tampon a changé de taille : nouveaux tableaux, puis relance. */
  redimensionner(): void;
  /** Avance le calcul sous budget, décale les couleurs (fraction 0..1), repeint si besoin. */
  avancer(vue: Vue, apparence: Apparence, decalageCouleur: number): void;
  readonly termine: boolean;
}

/** Une rangée de blocs : calcul au centre de chaque bloc, valeur étalée sur le bloc. */
function calculerRangee(
  valeurs: Float32Array,
  largeur: number,
  hauteur: number,
  y: number,
  bloc: number,
  vue: Vue,
  a: Apparence,
): void {
  const hauteurBloc = Math.min(bloc, hauteur - y);
  for (let x = 0; x < largeur; x += bloc) {
    const largeurBloc = Math.min(bloc, largeur - x);
    const [re, im] = pixelVersPlan(x + largeurBloc / 2, y + hauteurBloc / 2, largeur, hauteur, vue);
    const v = echapper(a.famille, re, im, a.maxIter, a.juliaRe, a.juliaIm);
    for (let dy = 0; dy < hauteurBloc; dy += 1) {
      valeurs.fill(v, (y + dy) * largeur + x, (y + dy) * largeur + x + largeurBloc);
    }
  }
}

/**
 * Valeurs → octets RVBA, à travers la table de couleurs décalée. L'échelle est
 * en RACINE CARRÉE des itérations : linéaire, le lointain (1 à 5 itérations)
 * n'occupait qu'un centième de la palette et l'extérieur sortait d'une seule
 * couleur plate ; en racine, il reçoit un vrai dégradé et la frontière garde
 * ses anneaux. `cycle` reste en itérations : à `v = cycle`, la palette a fait
 * un tour. `decalage` est une fraction de palette (0..1).
 */
function colorier(
  data: Uint8ClampedArray,
  valeurs: Float32Array,
  a: Apparence,
  decalage: number,
): void {
  const [rInt, gInt, bInt] = a.interieur;
  const inverseCycle = 1 / a.cycle;
  const decalageEntrees = Math.floor(decalage * TAILLE_LUT);
  for (let i = 0, p = 0; i < valeurs.length; i += 1, p += 4) {
    const v = valeurs[i] ?? INTERIEUR;
    if (v === INTERIEUR) {
      data[p] = rInt;
      data[p + 1] = gInt;
      data[p + 2] = bInt;
    } else {
      const entree = Math.floor(Math.sqrt(v * inverseCycle) * TAILLE_LUT) + decalageEntrees;
      const index = (entree % TAILLE_LUT) * 3;
      data[p] = a.lut[index] ?? 0;
      data[p + 1] = a.lut[index + 1] ?? 0;
      data[p + 2] = a.lut[index + 2] ?? 0;
    }
    data[p + 3] = 255;
  }
}

export function creerRenduProgressif(toile: Toile): RenduProgressif {
  const { ctx } = toile;
  let largeur = 0;
  let hauteur = 0;
  let valeurs = new Float32Array(0);
  let image = ctx.createImageData(1, 1);
  let passe = 0;
  let ligne = 0;
  let termine = false;
  let couleursSales = true;
  let decalagePeint = Number.NaN;

  const relancer = () => {
    passe = 0;
    ligne = 0;
    termine = false;
    couleursSales = true;
  };

  const redimensionner = () => {
    largeur = ctx.canvas.width;
    hauteur = ctx.canvas.height;
    valeurs = new Float32Array(largeur * hauteur);
    image = ctx.createImageData(largeur, hauteur);
    relancer();
  };

  const travailler = (vue: Vue, a: Apparence): boolean => {
    if (termine) return false;
    const debut = performance.now();
    while (passe < BLOCS.length) {
      const bloc = BLOCS[passe] ?? 1;
      while (ligne < hauteur) {
        calculerRangee(valeurs, largeur, hauteur, ligne, bloc, vue, a);
        ligne += bloc;
        if (passe > 0 && performance.now() - debut > BUDGET_MS) return true;
      }
      passe += 1;
      ligne = 0;
    }
    termine = true;
    return true;
  };

  return {
    relancer,
    redimensionner,
    avancer(vue, apparence, decalageCouleur) {
      if (valeurs.length === 0) redimensionner();
      const calcule = travailler(vue, apparence);
      if (calcule || couleursSales || decalageCouleur !== decalagePeint) {
        colorier(image.data, valeurs, apparence, decalageCouleur);
        ctx.putImageData(image, 0, 0);
        decalagePeint = decalageCouleur;
        couleursSales = false;
      }
    },
    get termine() {
      return termine;
    },
  };
}
