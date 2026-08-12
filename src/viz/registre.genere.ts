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
import manifest1 from "./aurore-boreale/manifest.json";
import manifest2 from "./balayage-radar/manifest.json";
import manifest3 from "./constellation/manifest.json";
import manifest4 from "./coquille-cannelee/manifest.json";
import manifest5 from "./flow-field/manifest.json";
import manifest6 from "./grain-de-film/manifest.json";
import manifest7 from "./grille-synthwave/manifest.json";
import manifest8 from "./mesh-gradient/manifest.json";
import manifest9 from "./orbes-floutees/manifest.json";
import manifest10 from "./plasma-deforme/manifest.json";
import manifest11 from "./poussiere-d-etoiles/manifest.json";
import manifest12 from "./spirale-tressee/manifest.json";
import manifest13 from "./tunnel-de-points/manifest.json";
import manifest14 from "./voile-tournante/manifest.json";

export const REGISTRE: Readonly<Record<string, EntreeViz>> = {
  "anneau-respirant": {
    manifest: manifest0 as VizManifest,
    Composant: lazy(() => import("./anneau-respirant/AnneauRespirant.tsx")),
  },
  "aurore-boreale": {
    manifest: manifest1 as VizManifest,
    Composant: lazy(() => import("./aurore-boreale/AuroreBoreale.tsx")),
  },
  "balayage-radar": {
    manifest: manifest2 as VizManifest,
    Composant: lazy(() => import("./balayage-radar/BalayageRadar.tsx")),
  },
  constellation: {
    manifest: manifest3 as VizManifest,
    Composant: lazy(() => import("./constellation/Constellation.tsx")),
  },
  "coquille-cannelee": {
    manifest: manifest4 as VizManifest,
    Composant: lazy(() => import("./coquille-cannelee/CoquilleCannelee.tsx")),
  },
  "flow-field": {
    manifest: manifest5 as VizManifest,
    Composant: lazy(() => import("./flow-field/FlowField.tsx")),
  },
  "grain-de-film": {
    manifest: manifest6 as VizManifest,
    Composant: lazy(() => import("./grain-de-film/GrainDeFilm.tsx")),
  },
  "grille-synthwave": {
    manifest: manifest7 as VizManifest,
    Composant: lazy(() => import("./grille-synthwave/GrilleSynthwave.tsx")),
  },
  "mesh-gradient": {
    manifest: manifest8 as VizManifest,
    Composant: lazy(() => import("./mesh-gradient/MeshGradient.tsx")),
  },
  "orbes-floutees": {
    manifest: manifest9 as VizManifest,
    Composant: lazy(() => import("./orbes-floutees/OrbesFloutees.tsx")),
  },
  "plasma-deforme": {
    manifest: manifest10 as VizManifest,
    Composant: lazy(() => import("./plasma-deforme/PlasmaDeforme.tsx")),
  },
  "poussiere-d-etoiles": {
    manifest: manifest11 as VizManifest,
    Composant: lazy(() => import("./poussiere-d-etoiles/PoussiereDEtoiles.tsx")),
  },
  "spirale-tressee": {
    manifest: manifest12 as VizManifest,
    Composant: lazy(() => import("./spirale-tressee/SpiraleTressee.tsx")),
  },
  "tunnel-de-points": {
    manifest: manifest13 as VizManifest,
    Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx")),
  },
  "voile-tournante": {
    manifest: manifest14 as VizManifest,
    Composant: lazy(() => import("./voile-tournante/VoileTournante.tsx")),
  },
};
