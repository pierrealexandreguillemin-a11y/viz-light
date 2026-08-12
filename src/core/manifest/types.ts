/**
 * LE CONTRAT DE DONNÉES DU CATALOGUE.
 *
 * Un `manifest.json` par viz. C'est la seule chose qu'un claude+n envoyé depuis
 * un projet hôte a besoin de lire pour décider et pour extraire (SPEC.md §3) :
 * il doit donc porter de quoi CHOISIR (ambiance, tags, coût mesuré) et de quoi
 * COPIER (liste exacte des fichiers), sans avoir à ouvrir le code.
 */

/** Les trois artifacts rapatriés — cf. evidence/sources-viz-light.md. */
export const SOURCES = ["tweet-sketches", "banc-essai", "atelier-generatif"] as const;
export type Source = (typeof SOURCES)[number];

/** Runtimes couverts par le socle (SPEC.md §2). `iframe` est la soupape. */
export const RUNTIMES = ["canvas2d", "webgl", "p5", "dom-css", "iframe"] as const;
export type Runtime = (typeof RUNTIMES)[number];

/** D'où vient la viz, et à quoi la comparer pour prouver sa fidélité. */
export interface Origine {
  readonly source: Source;
  /** Titre ou `id` exact dans l'artifact source — la clé de la comparaison. */
  readonly reference: string;
  readonly auteur?: string;
  /** Date de publication d'origine, AAAA-MM-JJ. */
  readonly date?: string;
}

/** Un réglage exposé par un rendu. */
export interface Param {
  readonly cle: string;
  readonly libelle: string;
  readonly min: number;
  readonly max: number;
  readonly pas: number;
  readonly valeur: number;
  readonly note?: string;
}

/**
 * Un rendu = un jeu de paramètres appliqué à l'UNIQUE `algo.ts` de la viz
 * (ADR 0008). `origine` porte la preuve de fidélité, `aligne` le raffinement
 * du Tunnel de points.
 */
export interface Rendu {
  readonly id: string;
  readonly libelle: string;
  readonly defaut: boolean;
  readonly params: readonly Param[];
}

/** Tout ce qu'il faut copier pour emporter la viz ailleurs (SPEC.md §3). */
export interface Extraction {
  /** Fichiers du dossier de la viz, chemins relatifs à `src/viz/<slug>/`. */
  readonly fichiers: readonly string[];
  /** Fichiers de socle à emporter, chemins relatifs à `src/`. */
  readonly socle: readonly string[];
  /** Dépendances npm externes (ex. `p5`). Vide si aucune. */
  readonly deps: readonly string[];
}

/**
 * Chiffres SORTIS DE `scripts/bench.mjs` EXÉCUTÉ — jamais estimés (CLAUDE.md
 * §5.7). `null` tant que le bench n'a pas tourné : le générateur de catalogue
 * refuse alors de publier la viz, ce qui rend l'absence de mesure bloquante
 * plutôt que silencieuse.
 */
export interface PerfMesuree {
  readonly mesureLe: string;
  readonly machine: string;
  readonly cadenceFps: number;
  readonly jsMedianMs: number;
  readonly jsP95Ms: number;
  readonly gpuBound: boolean;
}

export interface VizManifest {
  /** Identique au nom du dossier — vérifié, pas supposé. */
  readonly slug: string;
  readonly nom: string;
  /** Une phrase pour parcourir : ce qu'on ressent, pas ce que ça calcule. */
  readonly ambiance: string;
  readonly origine: Origine;
  readonly runtime: Runtime;
  readonly tags: readonly string[];
  readonly rendus: readonly Rendu[];
  readonly extraction: Extraction;
  readonly perf: PerfMesuree | null;
  /** Doublons écartés, notés ici plutôt que perdus (SPEC.md §4). */
  readonly variantes?: readonly string[];
}
