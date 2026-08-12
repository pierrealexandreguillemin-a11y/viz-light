/**
 * L'INSTRUMENT — logique pure, sans React ni DOM.
 *
 * Elle vit à part parce que c'est elle qui porte la promesse du projet : les
 * chiffres affichés et tamponnés dans les manifests sortent d'une mesure, pas
 * d'une estimation (ADR 0005). Une fonction pure se teste ; un hook qui compte
 * des images dans un `useEffect` ne se prouve pas.
 */

export interface Mesures {
  /** Cadence réelle, déduite de l'intervalle MÉDIAN entre images. */
  readonly cadenceFps: number;
  readonly jsMedianMs: number;
  readonly jsP95Ms: number;
  /** Le goulot est le remplissage de pixels, pas le JavaScript. */
  readonly gpuBound: boolean;
  readonly echantillons: number;
}

/**
 * Il faut au moins ~30 images pour qu'une médiane veuille dire quelque chose,
 * et surtout pour que les premières images — toujours anormales (compilation
 * du shader, allocation des tampons) — ne dominent pas le résultat.
 */
export const ECHANTILLONS_MINIMUM = 30;

/** Au-delà, on mesure un onglet qui a été mis en arrière-plan, pas une viz. */
const INTERVALLE_ABERRANT_MS = 250;

/**
 * Percentile par interpolation linéaire, sur une copie triée.
 * `p` est une fraction : 0.5 pour la médiane, 0.95 pour le p95.
 */
export function percentile(valeurs: readonly number[], p: number): number {
  if (valeurs.length === 0) return 0;
  const triees = [...valeurs].sort((a, b) => a - b);
  const position = (triees.length - 1) * p;
  const bas = Math.floor(position);
  const haut = Math.ceil(position);
  const valeurBasse = triees[bas] ?? 0;
  if (bas === haut) return valeurBasse;
  const valeurHaute = triees[haut] ?? valeurBasse;
  return valeurBasse + (valeurHaute - valeurBasse) * (position - bas);
}

/**
 * DÉTECTION DU GPU-BOUND — l'observation que le banc d'essai formulait déjà en
 * mots : « le temps JS reste proche de zéro, d'où l'impression de gratuité ;
 * le travail réel est du remplissage de pixels ».
 *
 * Deux conditions, et les deux sont nécessaires :
 * 1. la cadence est nettement sous 60 i/s — il y a bien un goulot ;
 * 2. le JS au 95e percentile occupe moins d'un tiers du budget d'une image —
 *    donc ce n'est pas lui qui bouche.
 *
 * Le p95 plutôt que la médiane : une viz dont le JS pique une image sur vingt
 * n'est pas GPU-bound, elle a un à-coup, et la médiane le cacherait.
 */
const CADENCE_SUSPECTE = 55;
const PART_JS_NEGLIGEABLE = 1 / 3;

function estGpuBound(cadenceFps: number, jsP95Ms: number, intervalleMedianMs: number): boolean {
  if (cadenceFps >= CADENCE_SUSPECTE) return false;
  return jsP95Ms < intervalleMedianMs * PART_JS_NEGLIGEABLE;
}

/**
 * `null` tant qu'il n'y a pas de quoi conclure — préférable à un chiffre
 * prématuré qui serait lu comme une mesure.
 */
export function resumer(
  intervallesMs: readonly number[],
  tempsJsMs: readonly number[],
): Mesures | null {
  const intervalles = intervallesMs.filter((i) => i > 0 && i < INTERVALLE_ABERRANT_MS);
  if (intervalles.length < ECHANTILLONS_MINIMUM || tempsJsMs.length < ECHANTILLONS_MINIMUM) {
    return null;
  }

  const intervalleMedian = percentile(intervalles, 0.5);
  const jsMedianMs = percentile(tempsJsMs, 0.5);
  const jsP95Ms = percentile(tempsJsMs, 0.95);
  const cadenceFps = 1000 / intervalleMedian;

  return {
    cadenceFps: Math.round(cadenceFps * 10) / 10,
    jsMedianMs: Math.round(jsMedianMs * 100) / 100,
    jsP95Ms: Math.round(jsP95Ms * 100) / 100,
    gpuBound: estGpuBound(cadenceFps, jsP95Ms, intervalleMedian),
    echantillons: intervalles.length,
  };
}

/**
 * Fenêtre glissante : on garde les N dernières valeurs et on jette le reste.
 * Sans cela, une viz laissée ouverte dix minutes moyennerait sa dixième minute
 * avec sa première — donc n'afficherait plus l'effet du réglage qu'on vient de
 * bouger, ce qui est précisément l'usage de l'instrument.
 */
export function pousser(fenetre: number[], valeur: number, taille: number): number[] {
  const suite = [...fenetre, valeur];
  return suite.length > taille ? suite.slice(suite.length - taille) : suite;
}
