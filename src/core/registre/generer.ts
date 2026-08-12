/**
 * GÉNÉRATION DU REGISTRE DES VIZ.
 *
 * Pourquoi un fichier généré plutôt qu'une découverte à l'exécution : la
 * sortie est statique (`output: "export"`), donc il n'y a personne pour
 * parcourir un dossier au moment où la page s'affiche. Un registre écrit
 * pendant le build donne en prime le **chargement paresseux par viz**
 * (SPEC.md §2) — p5.js n'entre dans le bundle que des sketches p5, parce que
 * chaque entrée est un `import()` que le bundler sait découper.
 *
 * Le fichier produit est du code que les gates relisent comme le reste :
 * il doit sortir déjà formaté et déjà conforme au lint.
 */

export interface EntreeRegistre {
  readonly slug: string;
  /** Nom du composant exporté par défaut, ex. `TunnelDePoints`. */
  readonly composant: string;
}

const BANNIERE = `// GÉNÉRÉ par \`pnpm catalog\` — ne pas éditer à la main.
// Toute modification sera écrasée à la prochaine génération.`;

/**
 * `lazy()` est appelé AU NIVEAU DU MODULE, jamais pendant un rendu : un
 * composant paresseux recréé à chaque rendu perdrait son état à chaque fois —
 * pour une viz, cela veut dire redémarrer l'animation au moindre re-rendu de la
 * planche. La règle `react-hooks` l'a signalé sur la première version, qui
 * enveloppait `lazy()` dans un `useMemo`.
 */
/** Le registre vide n'appelle pas `lazy()` : l'importer laisserait un avertissement. */
const importReact = (avecViz: boolean): string =>
  avecViz
    ? `import { lazy, type ComponentType, type LazyExoticComponent } from "react";`
    : `import type { ComponentType, LazyExoticComponent } from "react";`;

const types = (avecViz: boolean): string => `${importReact(avecViz)}

import type { VizManifest } from "../core/manifest/types.ts";

export interface EntreeViz {
  readonly manifest: VizManifest;
  /** Chargement paresseux : la viz n'entre dans le bundle que si on l'ouvre. */
  readonly Composant: LazyExoticComponent<ComponentType>;
}`;

function importManifest(entree: EntreeRegistre, index: number): string {
  return `import manifest${index} from "./${entree.slug}/manifest.json";`;
}

function entree(e: EntreeRegistre, index: number): string {
  return [
    `  "${e.slug}": {`,
    `    manifest: manifest${index} as VizManifest,`,
    `    Composant: lazy(() => import("./${e.slug}/${e.composant}.tsx")),`,
    `  },`,
  ].join("\n");
}

export function genererRegistre(entrees: readonly EntreeRegistre[]): string {
  const triees = [...entrees].sort((a, b) => a.slug.localeCompare(b.slug));

  if (triees.length === 0) {
    return [
      BANNIERE,
      "",
      types(false),
      "",
      "/** Aucune viz migrée pour l'instant — voir `docs/SPEC.md`, fil d'Ariane. */",
      "export const REGISTRE: Readonly<Record<string, EntreeViz>> = {};",
      "",
    ].join("\n");
  }

  return [
    BANNIERE,
    "",
    types(true),
    "",
    triees.map(importManifest).join("\n"),
    "",
    "export const REGISTRE: Readonly<Record<string, EntreeViz>> = {",
    triees.map(entree).join("\n"),
    "};",
    "",
  ].join("\n");
}
