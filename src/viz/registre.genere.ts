// GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main.
// Toute modification sera écrasée à la prochaine génération.

import { lazy, type ComponentType, type LazyExoticComponent } from "react";

import type { VizManifest } from "../core/manifest/types.ts";

export interface EntreeViz {
  readonly manifest: VizManifest;
  /** Chargement paresseux : la viz n'entre dans le bundle que si on l'ouvre. */
  readonly Composant: LazyExoticComponent<ComponentType>;
}

import manifest0 from "./tunnel-de-points/manifest.json";

export const REGISTRE: Readonly<Record<string, EntreeViz>> = {
  "tunnel-de-points": {
    manifest: manifest0 as VizManifest,
    Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx")),
  },
};
