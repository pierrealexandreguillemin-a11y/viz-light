import { validerManifest } from "@/core/manifest/valider.ts";

/**
 * Le manifest valide de référence et ses mutateurs, partagés par les tests du
 * validateur (`manifest-valider*.test.ts`). Un seul manifest de référence :
 * deux copies divergeraient, et un test passerait sur l'une et pas l'autre.
 */
export const manifestValide = () => ({
  slug: "tunnel-de-points",
  nom: "Tunnel de points",
  ambiance: "Un tunnel de poussière lumineuse qui respire.",
  origine: {
    source: "atelier-generatif",
    reference: "tunnel",
    auteur: "@yuruyurau",
    date: "2026-07-29",
  },
  categorie: "animation",
  runtime: "p5",
  tags: ["tunnel", "particules", "hsb"],
  rendus: [
    { id: "origine", libelle: "Origine", defaut: false, params: [] },
    {
      id: "aligne",
      libelle: "Aligné",
      defaut: true,
      params: [
        {
          cle: "pointCount",
          libelle: "Nombre de points",
          min: 1000,
          max: 10000,
          pas: 500,
          valeur: 6000,
        },
      ],
    },
  ],
  extraction: {
    fichiers: ["TunnelDePoints.tsx", "algo.ts", "manifest.json"],
    socle: ["core/hooks/useAnimationLoop.ts"],
    deps: ["p5"],
  },
  perf: {
    mesureLe: "2026-08-12",
    machine: "Windows 11 / Chrome 151",
    cadenceFps: 60,
    jsMedianMs: 3.1,
    jsP95Ms: 5.4,
    gpuBound: false,
  },
});

export type Mutation = (m: Record<string, unknown>) => void;

/** Applique une mutation au manifest valide et renvoie les chemins fautifs. */
export function cheminsFautifs(mutation: Mutation, slug = "tunnel-de-points"): string[] {
  const m = manifestValide() as unknown as Record<string, unknown>;
  mutation(m);
  return validerManifest(m, slug).map((p) => p.chemin);
}

export const lireRendus = (m: Record<string, unknown>) => m["rendus"] as Record<string, unknown>[];
export const lirePerf = (m: Record<string, unknown>) => m["perf"] as Record<string, unknown>;
export const lireOrigine = (m: Record<string, unknown>) => m["origine"] as Record<string, unknown>;

/** Remplace le premier paramètre du rendu aligné en entier — pour tester un genre. */
export const muterParamComplet =
  (param: Record<string, unknown>): Mutation =>
  (m) => {
    const params = lireRendus(m)[1]!["params"] as Record<string, unknown>[];
    params[0] = param;
  };

export const CHEMIN_VALEUR = "rendus[1].params[0].valeur";
