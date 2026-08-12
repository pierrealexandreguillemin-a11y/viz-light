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

import manifest0 from "./anemone-marine/manifest.json";
import manifest1 from "./anneau-respirant/manifest.json";
import manifest2 from "./attracteur-de-lorenz/manifest.json";
import manifest3 from "./aurore-boreale/manifest.json";
import manifest4 from "./balayage-radar/manifest.json";
import manifest5 from "./colonne-perlee/manifest.json";
import manifest6 from "./constellation/manifest.json";
import manifest7 from "./coquille-cannelee/manifest.json";
import manifest8 from "./coquille-jumelle/manifest.json";
import manifest9 from "./corolle-de-maree/manifest.json";
import manifest10 from "./couronne-battante/manifest.json";
import manifest11 from "./eventail-crante/manifest.json";
import manifest12 from "./flow-field/manifest.json";
import manifest13 from "./grain-de-film/manifest.json";
import manifest14 from "./grille-synthwave/manifest.json";
import manifest15 from "./medaillon-tournant/manifest.json";
import manifest16 from "./mesh-gradient/manifest.json";
import manifest17 from "./noise-grid/manifest.json";
import manifest18 from "./orbes-floutees/manifest.json";
import manifest19 from "./orbit-particles/manifest.json";
import manifest20 from "./plasma-deforme/manifest.json";
import manifest21 from "./poussiere-d-etoiles/manifest.json";
import manifest22 from "./rosace-fondatrice/manifest.json";
import manifest23 from "./rosace-jumelle/manifest.json";
import manifest24 from "./rosace-triple/manifest.json";
import manifest25 from "./ruban-ondule/manifest.json";
import manifest26 from "./ruban-plisse/manifest.json";
import manifest27 from "./spiral-bloom/manifest.json";
import manifest28 from "./spirale-tressee/manifest.json";
import manifest29 from "./tunnel-de-points/manifest.json";
import manifest30 from "./voile-tournante/manifest.json";

export const REGISTRE: Readonly<Record<string, EntreeViz>> = {
  "anemone-marine": {
    manifest: manifest0 as VizManifest,
    Composant: lazy(() => import("./anemone-marine/AnemoneMarine.tsx")),
  },
  "anneau-respirant": {
    manifest: manifest1 as VizManifest,
    Composant: lazy(() => import("./anneau-respirant/AnneauRespirant.tsx")),
  },
  "attracteur-de-lorenz": {
    manifest: manifest2 as VizManifest,
    Composant: lazy(() => import("./attracteur-de-lorenz/AttracteurDeLorenz.tsx")),
  },
  "aurore-boreale": {
    manifest: manifest3 as VizManifest,
    Composant: lazy(() => import("./aurore-boreale/AuroreBoreale.tsx")),
  },
  "balayage-radar": {
    manifest: manifest4 as VizManifest,
    Composant: lazy(() => import("./balayage-radar/BalayageRadar.tsx")),
  },
  "colonne-perlee": {
    manifest: manifest5 as VizManifest,
    Composant: lazy(() => import("./colonne-perlee/ColonnePerlee.tsx")),
  },
  constellation: {
    manifest: manifest6 as VizManifest,
    Composant: lazy(() => import("./constellation/Constellation.tsx")),
  },
  "coquille-cannelee": {
    manifest: manifest7 as VizManifest,
    Composant: lazy(() => import("./coquille-cannelee/CoquilleCannelee.tsx")),
  },
  "coquille-jumelle": {
    manifest: manifest8 as VizManifest,
    Composant: lazy(() => import("./coquille-jumelle/CoquilleJumelle.tsx")),
  },
  "corolle-de-maree": {
    manifest: manifest9 as VizManifest,
    Composant: lazy(() => import("./corolle-de-maree/CorolleDeMaree.tsx")),
  },
  "couronne-battante": {
    manifest: manifest10 as VizManifest,
    Composant: lazy(() => import("./couronne-battante/CouronneBattante.tsx")),
  },
  "eventail-crante": {
    manifest: manifest11 as VizManifest,
    Composant: lazy(() => import("./eventail-crante/EventailCrante.tsx")),
  },
  "flow-field": {
    manifest: manifest12 as VizManifest,
    Composant: lazy(() => import("./flow-field/FlowField.tsx")),
  },
  "grain-de-film": {
    manifest: manifest13 as VizManifest,
    Composant: lazy(() => import("./grain-de-film/GrainDeFilm.tsx")),
  },
  "grille-synthwave": {
    manifest: manifest14 as VizManifest,
    Composant: lazy(() => import("./grille-synthwave/GrilleSynthwave.tsx")),
  },
  "medaillon-tournant": {
    manifest: manifest15 as VizManifest,
    Composant: lazy(() => import("./medaillon-tournant/MedaillonTournant.tsx")),
  },
  "mesh-gradient": {
    manifest: manifest16 as VizManifest,
    Composant: lazy(() => import("./mesh-gradient/MeshGradient.tsx")),
  },
  "noise-grid": {
    manifest: manifest17 as VizManifest,
    Composant: lazy(() => import("./noise-grid/NoiseGrid.tsx")),
  },
  "orbes-floutees": {
    manifest: manifest18 as VizManifest,
    Composant: lazy(() => import("./orbes-floutees/OrbesFloutees.tsx")),
  },
  "orbit-particles": {
    manifest: manifest19 as VizManifest,
    Composant: lazy(() => import("./orbit-particles/OrbitParticles.tsx")),
  },
  "plasma-deforme": {
    manifest: manifest20 as VizManifest,
    Composant: lazy(() => import("./plasma-deforme/PlasmaDeforme.tsx")),
  },
  "poussiere-d-etoiles": {
    manifest: manifest21 as VizManifest,
    Composant: lazy(() => import("./poussiere-d-etoiles/PoussiereDEtoiles.tsx")),
  },
  "rosace-fondatrice": {
    manifest: manifest22 as VizManifest,
    Composant: lazy(() => import("./rosace-fondatrice/RosaceFondatrice.tsx")),
  },
  "rosace-jumelle": {
    manifest: manifest23 as VizManifest,
    Composant: lazy(() => import("./rosace-jumelle/RosaceJumelle.tsx")),
  },
  "rosace-triple": {
    manifest: manifest24 as VizManifest,
    Composant: lazy(() => import("./rosace-triple/RosaceTriple.tsx")),
  },
  "ruban-ondule": {
    manifest: manifest25 as VizManifest,
    Composant: lazy(() => import("./ruban-ondule/RubanOndule.tsx")),
  },
  "ruban-plisse": {
    manifest: manifest26 as VizManifest,
    Composant: lazy(() => import("./ruban-plisse/RubanPlisse.tsx")),
  },
  "spiral-bloom": {
    manifest: manifest27 as VizManifest,
    Composant: lazy(() => import("./spiral-bloom/SpiralBloom.tsx")),
  },
  "spirale-tressee": {
    manifest: manifest28 as VizManifest,
    Composant: lazy(() => import("./spirale-tressee/SpiraleTressee.tsx")),
  },
  "tunnel-de-points": {
    manifest: manifest29 as VizManifest,
    Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx")),
  },
  "voile-tournante": {
    manifest: manifest30 as VizManifest,
    Composant: lazy(() => import("./voile-tournante/VoileTournante.tsx")),
  },
};
