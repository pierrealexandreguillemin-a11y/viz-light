import { RUNTIMES, SOURCES, type VizManifest } from "./types.ts";

/**
 * VALIDATION DU CONTRAT DE DONNÉES — c'est le gate de `pnpm catalog`.
 *
 * Un manifest est écrit à la main pour chaque viz. Il sera donc faux un jour :
 * un `pas` à zéro, une `valeur` par défaut hors bornes, deux rendus marqués par
 * défaut, un `slug` qui ne correspond plus au dossier après un renommage.
 * Chacun de ces défauts est invisible au typecheck (le JSON n'est pas typé) et
 * casserait la galerie ou l'extraction en silence. D'où une validation à
 * l'exécution, qui NOMME le défaut plutôt que de le laisser filer.
 */
export interface Probleme {
  readonly chemin: string;
  readonly message: string;
}

type Dict = Record<string, unknown>;

const estDict = (v: unknown): v is Dict => typeof v === "object" && v !== null && !Array.isArray(v);

const probleme = (chemin: string, message: string): Probleme => ({ chemin, message });

/** À la racine, `chemin` est vide : `joindre("", "nom")` donne `nom`, pas `.nom`. */
const joindre = (chemin: string, cle: string): string => (chemin === "" ? cle : `${chemin}.${cle}`);

/** `kebab-case` strict : c'est aussi un nom de dossier et un segment d'URL. */
const SLUG_VALIDE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_VALIDE = /^\d{4}-\d{2}-\d{2}$/;

const OBJET_ATTENDU = "objet attendu";
const TABLEAU_ATTENDU = "tableau attendu";
const BOOLEEN_ATTENDU = "booléen attendu";
const DATE_ATTENDUE = "format AAAA-MM-JJ attendu";

function chaineNonVide(source: Dict, cle: string, chemin: string): Probleme[] {
  const valeur = source[cle];
  if (typeof valeur !== "string" || valeur.trim() === "") {
    return [probleme(joindre(chemin, cle), "chaîne non vide attendue")];
  }
  return [];
}

function listeDeChaines(source: Dict, cle: string, chemin: string, minimum: number): Probleme[] {
  const valeur = source[cle];
  const ou = joindre(chemin, cle);
  if (!Array.isArray(valeur)) return [probleme(ou, TABLEAU_ATTENDU)];
  if (valeur.length < minimum) {
    return [probleme(ou, `au moins ${minimum} entrée(s) attendue(s)`)];
  }
  const fautives = valeur.filter((e) => typeof e !== "string" || e.trim() === "");
  return fautives.length > 0
    ? [probleme(ou, "toutes les entrées doivent être des chaînes non vides")]
    : [];
}

function validerOrigine(valeur: unknown, chemin: string): Probleme[] {
  if (!estDict(valeur)) return [probleme(chemin, OBJET_ATTENDU)];
  const problemes = [...chaineNonVide(valeur, "reference", chemin)];
  if (!SOURCES.includes(valeur["source"] as never)) {
    problemes.push(probleme(`${chemin}.source`, `attendu : ${SOURCES.join(" | ")}`));
  }
  const date = valeur["date"];
  if (date !== undefined && (typeof date !== "string" || !DATE_VALIDE.test(date))) {
    problemes.push(probleme(`${chemin}.date`, DATE_ATTENDUE));
  }
  return problemes;
}

function validerParam(valeur: unknown, chemin: string): Probleme[] {
  if (!estDict(valeur)) return [probleme(chemin, OBJET_ATTENDU)];
  const problemes = [
    ...chaineNonVide(valeur, "cle", chemin),
    ...chaineNonVide(valeur, "libelle", chemin),
  ];
  const nombres = ["min", "max", "pas", "valeur"] as const;
  for (const cle of nombres) {
    if (typeof valeur[cle] !== "number" || !Number.isFinite(valeur[cle])) {
      problemes.push(probleme(`${chemin}.${cle}`, "nombre fini attendu"));
    }
  }
  if (problemes.length > 0) return problemes;

  const min = valeur["min"] as number;
  const max = valeur["max"] as number;
  const pas = valeur["pas"] as number;
  const defaut = valeur["valeur"] as number;
  if (min >= max)
    problemes.push(probleme(`${chemin}.min`, `min (${min}) doit être < max (${max})`));
  if (pas <= 0) problemes.push(probleme(`${chemin}.pas`, `pas (${pas}) doit être > 0`));
  if (defaut < min || defaut > max) {
    problemes.push(probleme(`${chemin}.valeur`, `${defaut} hors des bornes [${min}, ${max}]`));
  }
  return problemes;
}

function validerParams(valeur: unknown, chemin: string): Probleme[] {
  if (!Array.isArray(valeur)) return [probleme(chemin, TABLEAU_ATTENDU)];
  const problemes = valeur.flatMap((p, i) => validerParam(p, `${chemin}[${i}]`));
  const cles = valeur.filter(estDict).map((p) => p["cle"]);
  if (new Set(cles).size !== cles.length) {
    problemes.push(probleme(chemin, "deux paramètres partagent la même `cle`"));
  }
  return problemes;
}

function validerRendu(valeur: unknown, chemin: string): Probleme[] {
  if (!estDict(valeur)) return [probleme(chemin, OBJET_ATTENDU)];
  const problemes = [
    ...chaineNonVide(valeur, "id", chemin),
    ...chaineNonVide(valeur, "libelle", chemin),
    ...validerParams(valeur["params"], `${chemin}.params`),
  ];
  if (typeof valeur["defaut"] !== "boolean") {
    problemes.push(probleme(`${chemin}.defaut`, BOOLEEN_ATTENDU));
  }
  return problemes;
}

/**
 * Exactement UN rendu par défaut. Zéro laisserait la galerie sans quoi afficher ;
 * deux la feraient dépendre de l'ordre du tableau, c'est-à-dire du hasard.
 */
function validerRendus(valeur: unknown, chemin: string): Probleme[] {
  if (!Array.isArray(valeur)) return [probleme(chemin, TABLEAU_ATTENDU)];
  if (valeur.length === 0) return [probleme(chemin, "au moins un rendu attendu")];

  const problemes = valeur.flatMap((r, i) => validerRendu(r, `${chemin}[${i}]`));
  const dicts = valeur.filter(estDict);
  const ids = dicts.map((r) => r["id"]);
  if (new Set(ids).size !== ids.length) {
    problemes.push(probleme(chemin, "deux rendus partagent le même `id`"));
  }
  const defauts = dicts.filter((r) => r["defaut"] === true).length;
  if (defauts !== 1) {
    problemes.push(
      probleme(chemin, `exactement un rendu par défaut attendu, ${defauts} trouvé(s)`),
    );
  }
  return problemes;
}

function validerExtraction(valeur: unknown, chemin: string): Probleme[] {
  if (!estDict(valeur)) return [probleme(chemin, OBJET_ATTENDU)];
  return [
    ...listeDeChaines(valeur, "fichiers", chemin, 1),
    ...listeDeChaines(valeur, "socle", chemin, 0),
    ...listeDeChaines(valeur, "deps", chemin, 0),
  ];
}

/**
 * `null` est LÉGITIME ici (viz pas encore mesurée) — c'est le générateur de
 * catalogue qui refuse de la publier. Un objet partiel, en revanche, est une
 * mesure inventée : c'est exactement ce que ce projet interdit.
 */
function validerDureesPerf(valeur: Dict, chemin: string): Probleme[] {
  const problemes: Probleme[] = [];
  for (const cle of ["cadenceFps", "jsMedianMs", "jsP95Ms"] as const) {
    const n = valeur[cle];
    if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) {
      problemes.push(probleme(`${chemin}.${cle}`, "nombre fini > 0 attendu"));
    }
  }
  const median = valeur["jsMedianMs"];
  const p95 = valeur["jsP95Ms"];
  if (typeof median === "number" && typeof p95 === "number" && p95 < median) {
    problemes.push(
      probleme(`${chemin}.jsP95Ms`, `p95 (${p95}) ne peut être < médiane (${median})`),
    );
  }
  return problemes;
}

function validerPerf(valeur: unknown, chemin: string): Probleme[] {
  if (valeur === null) return [];
  if (!estDict(valeur)) return [probleme(chemin, "objet ou null attendu")];

  const problemes = [
    ...chaineNonVide(valeur, "machine", chemin),
    ...validerDureesPerf(valeur, chemin),
  ];
  const date = valeur["mesureLe"];
  if (typeof date !== "string" || !DATE_VALIDE.test(date)) {
    problemes.push(probleme(`${chemin}.mesureLe`, DATE_ATTENDUE));
  }
  if (typeof valeur["gpuBound"] !== "boolean") {
    problemes.push(probleme(`${chemin}.gpuBound`, BOOLEEN_ATTENDU));
  }
  return problemes;
}

function validerSlug(valeur: unknown, slugAttendu: string): Probleme[] {
  if (typeof valeur !== "string" || !SLUG_VALIDE.test(valeur)) {
    return [probleme("slug", "kebab-case attendu (a-z, 0-9, tirets)")];
  }
  if (valeur !== slugAttendu) {
    return [probleme("slug", `« ${valeur} » ne correspond pas au dossier « ${slugAttendu} »`)];
  }
  return [];
}

/** Point d'entrée. Liste vide = manifest conforme. */
export function validerManifest(valeur: unknown, slugAttendu: string): Probleme[] {
  if (!estDict(valeur)) return [probleme(".", "objet JSON attendu")];

  const problemes = [
    ...validerSlug(valeur["slug"], slugAttendu),
    ...chaineNonVide(valeur, "nom", ""),
    ...chaineNonVide(valeur, "ambiance", ""),
    ...listeDeChaines(valeur, "tags", "", 1),
    ...validerOrigine(valeur["origine"], "origine"),
    ...validerRendus(valeur["rendus"], "rendus"),
    ...validerExtraction(valeur["extraction"], "extraction"),
    ...validerPerf(valeur["perf"] === undefined ? "absent" : valeur["perf"], "perf"),
  ];
  if (!RUNTIMES.includes(valeur["runtime"] as never)) {
    problemes.push(probleme("runtime", `attendu : ${RUNTIMES.join(" | ")}`));
  }
  return problemes;
}

/** Ne l'appeler qu'après un `validerManifest` sans problème. */
export const enManifest = (valeur: unknown): VizManifest => valeur as VizManifest;
