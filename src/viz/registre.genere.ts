// GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main.
// Toute modification sera écrasée à la prochaine génération.

import type { ComponentType } from "react";

import type { VizManifest } from "../core/manifest/types.ts";

export interface EntreeViz {
  readonly manifest: VizManifest;
  /** Chargement paresseux : la viz n'entre dans le bundle que si on l'ouvre. */
  readonly charger: () => Promise<{ default: ComponentType }>;
}

/** Aucune viz migrée pour l'instant — voir `docs/SPEC.md`, fil d'Ariane. */
export const REGISTRE: Readonly<Record<string, EntreeViz>> = {};
