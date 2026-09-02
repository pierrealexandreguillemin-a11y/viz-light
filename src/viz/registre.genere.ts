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
import manifest5 from "./carte-iridescente/manifest.json";
import manifest6 from "./champ-quantique/manifest.json";
import manifest7 from "./colonne-perlee/manifest.json";
import manifest8 from "./constellation/manifest.json";
import manifest9 from "./coquille-cannelee/manifest.json";
import manifest10 from "./coquille-jumelle/manifest.json";
import manifest11 from "./corolle-de-maree/manifest.json";
import manifest12 from "./couronne-battante/manifest.json";
import manifest13 from "./eventail-crante/manifest.json";
import manifest14 from "./explorateur-de-fractales/manifest.json";
import manifest15 from "./feuille-holographique/manifest.json";
import manifest16 from "./flow-field/manifest.json";
import manifest17 from "./globe-chargement/manifest.json";
import manifest18 from "./grain-de-film/manifest.json";
import manifest19 from "./grille-synthwave/manifest.json";
import manifest20 from "./halo-de-trace/manifest.json";
import manifest21 from "./medaillon-tournant/manifest.json";
import manifest22 from "./mesh-gradient/manifest.json";
import manifest23 from "./noise-grid/manifest.json";
import manifest24 from "./orbes-floutees/manifest.json";
import manifest25 from "./orbit-particles/manifest.json";
import manifest26 from "./plasma-deforme/manifest.json";
import manifest27 from "./poussiere-d-etoiles/manifest.json";
import manifest28 from "./rosace-fondatrice/manifest.json";
import manifest29 from "./rosace-jumelle/manifest.json";
import manifest30 from "./rosace-triple/manifest.json";
import manifest31 from "./ruban-ondule/manifest.json";
import manifest32 from "./ruban-plisse/manifest.json";
import manifest33 from "./spiral-bloom/manifest.json";
import manifest34 from "./spirale-tressee/manifest.json";
import manifest35 from "./tunnel-de-points/manifest.json";
import manifest36 from "./voile-tournante/manifest.json";
import manifest37 from "./voronoi-neon/manifest.json";

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
  "carte-iridescente": {
    manifest: manifest5 as VizManifest,
    Composant: lazy(() => import("./carte-iridescente/CarteIridescente.tsx")),
  },
  "champ-quantique": {
    manifest: manifest6 as VizManifest,
    Composant: lazy(() => import("./champ-quantique/ChampQuantique.tsx")),
  },
  "colonne-perlee": {
    manifest: manifest7 as VizManifest,
    Composant: lazy(() => import("./colonne-perlee/ColonnePerlee.tsx")),
  },
  constellation: {
    manifest: manifest8 as VizManifest,
    Composant: lazy(() => import("./constellation/Constellation.tsx")),
  },
  "coquille-cannelee": {
    manifest: manifest9 as VizManifest,
    Composant: lazy(() => import("./coquille-cannelee/CoquilleCannelee.tsx")),
  },
  "coquille-jumelle": {
    manifest: manifest10 as VizManifest,
    Composant: lazy(() => import("./coquille-jumelle/CoquilleJumelle.tsx")),
  },
  "corolle-de-maree": {
    manifest: manifest11 as VizManifest,
    Composant: lazy(() => import("./corolle-de-maree/CorolleDeMaree.tsx")),
  },
  "couronne-battante": {
    manifest: manifest12 as VizManifest,
    Composant: lazy(() => import("./couronne-battante/CouronneBattante.tsx")),
  },
  "eventail-crante": {
    manifest: manifest13 as VizManifest,
    Composant: lazy(() => import("./eventail-crante/EventailCrante.tsx")),
  },
  "explorateur-de-fractales": {
    manifest: manifest14 as VizManifest,
    Composant: lazy(() => import("./explorateur-de-fractales/ExplorateurDeFractales.tsx")),
  },
  "feuille-holographique": {
    manifest: manifest15 as VizManifest,
    Composant: lazy(() => import("./feuille-holographique/FeuilleHolographique.tsx")),
  },
  "flow-field": {
    manifest: manifest16 as VizManifest,
    Composant: lazy(() => import("./flow-field/FlowField.tsx")),
  },
  "globe-chargement": {
    manifest: manifest17 as VizManifest,
    Composant: lazy(() => import("./globe-chargement/GlobeChargement.tsx")),
  },
  "grain-de-film": {
    manifest: manifest18 as VizManifest,
    Composant: lazy(() => import("./grain-de-film/GrainDeFilm.tsx")),
  },
  "grille-synthwave": {
    manifest: manifest19 as VizManifest,
    Composant: lazy(() => import("./grille-synthwave/GrilleSynthwave.tsx")),
  },
  "halo-de-trace": {
    manifest: manifest20 as VizManifest,
    Composant: lazy(() => import("./halo-de-trace/HaloDeTrace.tsx")),
  },
  "medaillon-tournant": {
    manifest: manifest21 as VizManifest,
    Composant: lazy(() => import("./medaillon-tournant/MedaillonTournant.tsx")),
  },
  "mesh-gradient": {
    manifest: manifest22 as VizManifest,
    Composant: lazy(() => import("./mesh-gradient/MeshGradient.tsx")),
  },
  "noise-grid": {
    manifest: manifest23 as VizManifest,
    Composant: lazy(() => import("./noise-grid/NoiseGrid.tsx")),
  },
  "orbes-floutees": {
    manifest: manifest24 as VizManifest,
    Composant: lazy(() => import("./orbes-floutees/OrbesFloutees.tsx")),
  },
  "orbit-particles": {
    manifest: manifest25 as VizManifest,
    Composant: lazy(() => import("./orbit-particles/OrbitParticles.tsx")),
  },
  "plasma-deforme": {
    manifest: manifest26 as VizManifest,
    Composant: lazy(() => import("./plasma-deforme/PlasmaDeforme.tsx")),
  },
  "poussiere-d-etoiles": {
    manifest: manifest27 as VizManifest,
    Composant: lazy(() => import("./poussiere-d-etoiles/PoussiereDEtoiles.tsx")),
  },
  "rosace-fondatrice": {
    manifest: manifest28 as VizManifest,
    Composant: lazy(() => import("./rosace-fondatrice/RosaceFondatrice.tsx")),
  },
  "rosace-jumelle": {
    manifest: manifest29 as VizManifest,
    Composant: lazy(() => import("./rosace-jumelle/RosaceJumelle.tsx")),
  },
  "rosace-triple": {
    manifest: manifest30 as VizManifest,
    Composant: lazy(() => import("./rosace-triple/RosaceTriple.tsx")),
  },
  "ruban-ondule": {
    manifest: manifest31 as VizManifest,
    Composant: lazy(() => import("./ruban-ondule/RubanOndule.tsx")),
  },
  "ruban-plisse": {
    manifest: manifest32 as VizManifest,
    Composant: lazy(() => import("./ruban-plisse/RubanPlisse.tsx")),
  },
  "spiral-bloom": {
    manifest: manifest33 as VizManifest,
    Composant: lazy(() => import("./spiral-bloom/SpiralBloom.tsx")),
  },
  "spirale-tressee": {
    manifest: manifest34 as VizManifest,
    Composant: lazy(() => import("./spirale-tressee/SpiraleTressee.tsx")),
  },
  "tunnel-de-points": {
    manifest: manifest35 as VizManifest,
    Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx")),
  },
  "voile-tournante": {
    manifest: manifest36 as VizManifest,
    Composant: lazy(() => import("./voile-tournante/VoileTournante.tsx")),
  },
  "voronoi-neon": {
    manifest: manifest37 as VizManifest,
    Composant: lazy(() => import("./voronoi-neon/VoronoiNeon.tsx")),
  },
};
