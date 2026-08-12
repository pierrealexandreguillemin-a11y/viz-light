// GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main.
// Toute modification sera écrasée à la prochaine génération.

import { lazy, type ComponentType, type LazyExoticComponent } from "react";

import type { VizManifest } from "../core/manifest/types.ts";
import type { Reglages } from "../core/viz/contrat.ts";

/** Toute coquille de viz accepte les réglages courants — c'est ce qui rend les curseurs vivants. */
export interface ProprietesViz {
  readonly reglages: Reglages;
}

export interface EntreeViz {
  readonly manifest: VizManifest;
  /** Chargement paresseux : la viz n'entre dans le bundle que si on l'ouvre. */
  readonly Composant: LazyExoticComponent<ComponentType<ProprietesViz>>;
}

import manifest0 from "./anneau-respirant/manifest.json";
import manifest1 from "./coquille-cannelee/manifest.json";
import manifest2 from "./spirale-tressee/manifest.json";
import manifest3 from "./tunnel-de-points/manifest.json";
import manifest4 from "./voile-tournante/manifest.json";

export const REGISTRE: Readonly<Record<string, EntreeViz>> = {
  "anneau-respirant": {
    manifest: manifest0 as VizManifest,
    Composant: lazy(() => import("./anneau-respirant/AnneauRespirant.tsx")),
  },
  "coquille-cannelee": {
    manifest: manifest1 as VizManifest,
    Composant: lazy(() => import("./coquille-cannelee/CoquilleCannelee.tsx")),
  },
  "spirale-tressee": {
    manifest: manifest2 as VizManifest,
    Composant: lazy(() => import("./spirale-tressee/SpiraleTressee.tsx")),
  },
  "tunnel-de-points": {
    manifest: manifest3 as VizManifest,
    Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx")),
  },
  "voile-tournante": {
    manifest: manifest4 as VizManifest,
    Composant: lazy(() => import("./voile-tournante/VoileTournante.tsx")),
  },
};
