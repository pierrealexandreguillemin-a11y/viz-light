import type { Probleme } from "../manifest/valider.ts";
import type { VizManifest } from "../manifest/types.ts";

/**
 * LE GATE DE LA LISTE D'EXTRACTION (SPEC.md §3).
 *
 * Le manifest promet à un claude+n « la liste EXACTE des fichiers à copier »,
 * sans rien exécuter. Une liste écrite à la main dérive : le 2026-09-02,
 * `useScenePrincipale.ts` — importé par `SceneViz.tsx` depuis l'ADR 0011 —
 * manquait aux 34 manifests, et rien ne le voyait. Un claude+n qui aurait copié
 * la liste aurait obtenu un import cassé.
 *
 * Ici la liste est CONFRONTÉE au code : on part des fichiers de la viz, on suit
 * les imports statiques, et l'on exige que la fermeture obtenue soit exactement
 * ce que le manifest déclare — dans les deux sens (rien d'oublié, rien de
 * superflu). Logique pure : le disque est derrière `Lecteur`, ce qui rend le
 * gate testable en mémoire et calibrable dans les deux sens.
 */
export interface Lecteur {
  /** Chemins relatifs à `src/`, séparateur `/`. */
  existe(chemin: string): boolean;
  lire(chemin: string): string;
  /** Tous les fichiers d'un dossier, récursivement, relatifs au dossier. */
  listerDossier(dossier: string): readonly string[];
}

/** Paquets que tout hôte du portefeuille fournit déjà (SPEC.md §3, point 3). */
const FOURNIS_PAR_L_HOTE = ["react", "react-dom", "next"] as const;
const EXTENSIONS = [".ts", ".tsx", ".json"] as const;
/** Les `.md` accompagnent la viz mais n'entrent pas dans le graphe d'imports. */
const SUIT_LES_IMPORTS = /\.(ts|tsx)$/;

const IMPORT =
  /(?:^|\n)\s*(?:import|export)\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]|(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g;

export function extraireSpecificateurs(source: string): string[] {
  const trouves: string[] = [];
  for (const m of source.matchAll(IMPORT)) trouves.push(m[1] ?? m[2] ?? "");
  return trouves.filter((s) => s !== "");
}

function normaliser(chemin: string): string {
  const parts: string[] = [];
  for (const part of chemin.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

const dossierDe = (chemin: string): string => chemin.split("/").slice(0, -1).join("/");

/** Un spécificateur → un chemin relatif à `src/`, ou `null` si c'est un paquet. */
function resoudre(specificateur: string, depuis: string, lecteur: Lecteur): string | null {
  let base: string;
  if (specificateur.startsWith("@/")) base = specificateur.slice(2);
  else if (specificateur.startsWith("."))
    base = normaliser(`${dossierDe(depuis)}/${specificateur}`);
  else return null;
  if (lecteur.existe(base)) return base;
  const avecExtension = EXTENSIONS.map((ext) => `${base}${ext}`).find((c) => lecteur.existe(c));
  return avecExtension ?? base;
}

const estFourniParLHote = (paquet: string): boolean =>
  FOURNIS_PAR_L_HOTE.some((p) => paquet === p || paquet.startsWith(`${p}/`));

/** Nom de paquet d'un spécificateur nu (`p5`, `@scope/nom`, `p5/lib/x`). */
const nomDePaquet = (spec: string): string =>
  spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : (spec.split("/")[0] ?? spec);

interface Fermeture {
  readonly socle: Set<string>;
  readonly paquets: Set<string>;
  /** Fichier importé mais absent du disque, et par qui. */
  readonly introuvables: { chemin: string; par: string }[];
  /** Fichiers restant à parcourir. */
  readonly file: string[];
}

/** Classe UN import : paquet, fichier introuvable, ou fichier à suivre (socle s'il est hors de la viz). */
function suivreImport(
  spec: string,
  depuis: string,
  dossierViz: string,
  lecteur: Lecteur,
  fermeture: Fermeture,
): void {
  const cible = resoudre(spec, depuis, lecteur);
  if (cible === null) {
    if (!estFourniParLHote(spec)) fermeture.paquets.add(nomDePaquet(spec));
    return;
  }
  if (!lecteur.existe(cible)) {
    fermeture.introuvables.push({ chemin: cible, par: depuis });
    return;
  }
  if (!cible.startsWith(`${dossierViz}/`)) fermeture.socle.add(cible);
  fermeture.file.push(cible);
}

/** Suit les imports depuis les fichiers de départ ; s'arrête aux paquets. */
function fermer(departs: readonly string[], dossierViz: string, lecteur: Lecteur): Fermeture {
  const fermeture: Fermeture = {
    socle: new Set(),
    paquets: new Set(),
    introuvables: [],
    file: [...departs],
  };
  const vus = new Set<string>();
  while (fermeture.file.length > 0) {
    const courant = fermeture.file.shift() ?? "";
    if (vus.has(courant) || !SUIT_LES_IMPORTS.test(courant) || !lecteur.existe(courant)) continue;
    vus.add(courant);
    for (const spec of extraireSpecificateurs(lecteur.lire(courant))) {
      suivreImport(spec, courant, dossierViz, lecteur, fermeture);
    }
  }
  return fermeture;
}

function comparerEnsembles(
  declares: readonly string[],
  attendus: ReadonlySet<string>,
  chemin: string,
  motManque: string,
  motSuperflu: string,
): Probleme[] {
  const problemes: Probleme[] = [];
  for (const attendu of [...attendus].sort()) {
    if (!declares.includes(attendu))
      problemes.push({ chemin, message: `${motManque} : ${attendu}` });
  }
  for (const declare of declares) {
    if (!attendus.has(declare)) problemes.push({ chemin, message: `${motSuperflu} : ${declare}` });
  }
  return problemes;
}

/**
 * Confronte `extraction` au code. Chemins du manifest : `fichiers` relatifs au
 * dossier de la viz, `socle` relatifs à `src/`.
 */
export function verifierExtraction(manifest: VizManifest, lecteur: Lecteur): Probleme[] {
  const dossierViz = `viz/${manifest.slug}`;
  const { fichiers, socle, deps } = manifest.extraction;

  const surDisque = new Set(lecteur.listerDossier(dossierViz));
  const problemes = comparerEnsembles(
    fichiers,
    surDisque,
    "extraction.fichiers",
    "fichier du dossier non déclaré",
    "fichier déclaré absent du dossier",
  );

  const departs = fichiers.map((f) => `${dossierViz}/${f}`);
  const fermeture = fermer(departs, dossierViz, lecteur);
  for (const { chemin, par } of fermeture.introuvables) {
    problemes.push({ chemin: "extraction", message: `${par} importe ${chemin}, introuvable` });
  }
  problemes.push(
    ...comparerEnsembles(
      socle,
      fermeture.socle,
      "extraction.socle",
      "fichier de socle importé mais non déclaré",
      "fichier de socle déclaré mais jamais importé",
    ),
    ...comparerEnsembles(
      deps,
      fermeture.paquets,
      "extraction.deps",
      "paquet importé mais non déclaré",
      "paquet déclaré mais jamais importé",
    ),
  );
  return problemes;
}
