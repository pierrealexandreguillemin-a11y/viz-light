import { describe, expect, it } from "vitest";

import { CATEGORIES } from "@/core/manifest/types.ts";
import { validerManifest } from "@/core/manifest/valider.ts";

/**
 * Le validateur est le gate du contrat de données : ces tests décrivent
 * exactement ce qu'il refuse. Chaque cas correspond à une faute qu'un manifest
 * écrit à la main commettra un jour et qu'aucun autre gate ne verrait — le JSON
 * n'est pas typé, donc le typecheck ne le lit pas.
 */
const manifestValide = () => ({
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

type Mutation = (m: Record<string, unknown>) => void;

/** Applique une mutation au manifest valide et renvoie les chemins fautifs. */
function cheminsFautifs(mutation: Mutation, slug = "tunnel-de-points"): string[] {
  const m = manifestValide() as unknown as Record<string, unknown>;
  mutation(m);
  return validerManifest(m, slug).map((p) => p.chemin);
}

const lireRendus = (m: Record<string, unknown>) => m["rendus"] as Record<string, unknown>[];
const lirePerf = (m: Record<string, unknown>) => m["perf"] as Record<string, unknown>;
const lireOrigine = (m: Record<string, unknown>) => m["origine"] as Record<string, unknown>;

/** Remplace le premier paramètre du rendu aligné en entier — pour tester un genre. */
const muterParamComplet =
  (param: Record<string, unknown>): Mutation =>
  (m) => {
    const params = lireRendus(m)[1]!["params"] as Record<string, unknown>[];
    params[0] = param;
  };

const CHEMIN_VALEUR = "rendus[1].params[0].valeur";

describe("validerManifest — identité et champs de base", () => {
  it("accepte un manifest complet", () => {
    expect(validerManifest(manifestValide(), "tunnel-de-points")).toEqual([]);
  });

  it("refuse ce qui n'est pas un objet", () => {
    for (const valeur of [null, 42, "texte", [], undefined]) {
      expect(validerManifest(valeur, "x")).toHaveLength(1);
    }
  });

  it("refuse un slug qui ne correspond pas au dossier", () => {
    expect(cheminsFautifs(() => {}, "autre-dossier")).toEqual(["slug"]);
  });

  it("refuse un slug qui n'est pas en kebab-case", () => {
    for (const slug of ["Tunnel", "tunnel_de_points", "tunnel--x", "-tunnel", ""]) {
      expect(cheminsFautifs((m) => (m["slug"] = slug), slug)).toContain("slug");
    }
  });

  it("exige nom, ambiance et au moins un tag", () => {
    expect(cheminsFautifs((m) => (m["nom"] = "  "))).toContain("nom");
    expect(cheminsFautifs((m) => (m["ambiance"] = 7))).toContain("ambiance");
    expect(cheminsFautifs((m) => (m["tags"] = []))).toContain("tags");
    expect(cheminsFautifs((m) => (m["tags"] = ["ok", ""]))).toContain("tags");
  });

  it("exige une catégorie — les quatre usages ne se jugent pas pareil", () => {
    expect(cheminsFautifs((m) => (m["categorie"] = "joli"))).toContain("categorie");
    expect(cheminsFautifs((m) => delete m["categorie"])).toContain("categorie");
    // Calibré dans les deux sens sur CHACUNE des quatre : une catégorie
    // annoncée dans le type mais refusée par le validateur donnerait un gate
    // qui ment (ADR 0012).
    for (const categorie of CATEGORIES) {
      expect(cheminsFautifs((m) => (m["categorie"] = categorie))).toEqual([]);
    }
  });

  it("refuse un runtime ou une source hors énumération", () => {
    expect(cheminsFautifs((m) => (m["runtime"] = "three"))).toContain("runtime");
    expect(cheminsFautifs((m) => (lireOrigine(m)["source"] = "codepen"))).toContain(
      "origine.source",
    );
  });

  it("accepte la source easter-eggs et refuse une source inventée — les deux sens (ADR 0014)", () => {
    // Le lot Easter_eggs (SPEC §4, hors v1) est rapatrié PAR COPIE ; ses manifests
    // portent `origine.source: "easter-eggs"`. Sans cette valeur dans SOURCES, le
    // validateur les refuse, donc `pnpm catalog` — donc `pnpm verify` — est rouge.
    expect(cheminsFautifs((m) => (lireOrigine(m)["source"] = "easter-eggs"))).toEqual([]);
    expect(cheminsFautifs((m) => (lireOrigine(m)["source"] = "inventee"))).toContain(
      "origine.source",
    );
  });

  it("refuse une date d'origine mal formée mais accepte son absence", () => {
    expect(cheminsFautifs((m) => (lireOrigine(m)["date"] = "29/07/2026"))).toContain(
      "origine.date",
    );
    expect(cheminsFautifs((m) => delete lireOrigine(m)["date"])).toEqual([]);
  });
});

describe("validerManifest — rendus", () => {
  it("exige exactement un rendu par défaut", () => {
    expect(cheminsFautifs((m) => (lireRendus(m)[1]!["defaut"] = false))).toContain("rendus");
    expect(cheminsFautifs((m) => (lireRendus(m)[0]!["defaut"] = true))).toContain("rendus");
  });

  it("refuse un `defaut` qui n'est pas un booléen", () => {
    expect(cheminsFautifs((m) => (lireRendus(m)[0]!["defaut"] = "non"))).toContain(
      "rendus[0].defaut",
    );
  });

  it("refuse une liste vide ou deux identifiants identiques", () => {
    expect(cheminsFautifs((m) => (m["rendus"] = []))).toContain("rendus");
    expect(cheminsFautifs((m) => (lireRendus(m)[1]!["id"] = "origine"))).toContain("rendus");
  });
});

describe("validerManifest — paramètres", () => {
  const muterParam =
    (champ: string, valeur: unknown): Mutation =>
    (m) => {
      const params = lireRendus(m)[1]!["params"] as Record<string, unknown>[];
      params[0]![champ] = valeur;
    };

  it("refuse min >= max, un pas nul et une valeur hors bornes", () => {
    expect(cheminsFautifs(muterParam("min", 20000))).toContain("rendus[1].params[0].min");
    expect(cheminsFautifs(muterParam("pas", 0))).toContain("rendus[1].params[0].pas");
    expect(cheminsFautifs(muterParam("valeur", 99999))).toContain("rendus[1].params[0].valeur");
  });

  it("refuse un nombre non fini", () => {
    expect(cheminsFautifs(muterParam("max", Number.NaN))).toContain("rendus[1].params[0].max");
  });

  it("accepte un interrupteur 0|1 et refuse toute autre valeur", () => {
    const brancher = (valeur: unknown): Mutation =>
      muterParamComplet({ cle: "halo", libelle: "Halo", genre: "interrupteur", valeur });
    expect(cheminsFautifs(brancher(1))).toEqual([]);
    expect(cheminsFautifs(brancher(0))).toEqual([]);
    expect(cheminsFautifs(brancher(2))).toContain(CHEMIN_VALEUR);
    expect(cheminsFautifs(brancher(true))).toContain(CHEMIN_VALEUR);
  });

  it("accepte une couleur chaîne et refuse une couleur vide ou numérique", () => {
    const colorer = (valeur: unknown): Mutation =>
      muterParamComplet({ cle: "fond", libelle: "Fond", genre: "couleur", valeur });
    expect(cheminsFautifs(colorer("#080b14"))).toEqual([]);
    expect(cheminsFautifs(colorer(""))).toContain(CHEMIN_VALEUR);
    expect(cheminsFautifs(colorer(42))).toContain(CHEMIN_VALEUR);
  });

  it("refuse un genre hors énumération", () => {
    expect(cheminsFautifs(muterParam("genre", "case"))).toContain("rendus[1].params[0].genre");
  });

  it("refuse deux paramètres partageant la même clé", () => {
    expect(
      cheminsFautifs((m) => {
        const rendu = lireRendus(m)[1]!;
        const params = rendu["params"] as unknown[];
        rendu["params"] = [...params, { ...(params[0] as object) }];
      }),
    ).toContain("rendus[1].params");
  });
});

describe("validerManifest — genre choix (ADR 0015)", () => {
  const CHEMIN_OPTIONS = "rendus[1].params[0].options";
  const choixValide = () => ({
    cle: "famille",
    libelle: "Famille de fractale",
    genre: "choix",
    valeur: "julia",
    options: [
      { valeur: "mandelbrot", libelle: "Mandelbrot" },
      { valeur: "julia", libelle: "Julia" },
    ],
  });

  it("accepte un choix dont la valeur par défaut est l'une des options", () => {
    expect(cheminsFautifs(muterParamComplet(choixValide()))).toEqual([]);
  });

  it("refuse une valeur par défaut absente des options", () => {
    expect(
      cheminsFautifs(muterParamComplet({ ...choixValide(), valeur: "burning-ship" })),
    ).toContain(CHEMIN_VALEUR);
    expect(cheminsFautifs(muterParamComplet({ ...choixValide(), valeur: 1 }))).toContain(
      CHEMIN_VALEUR,
    );
  });

  it("exige au moins une option", () => {
    expect(cheminsFautifs(muterParamComplet({ ...choixValide(), options: [] }))).toContain(
      CHEMIN_OPTIONS,
    );
    const sansOptions: Record<string, unknown> = { ...choixValide() };
    delete sansOptions["options"];
    expect(cheminsFautifs(muterParamComplet(sansOptions))).toContain(CHEMIN_OPTIONS);
  });

  it("refuse une option sans `valeur` ou sans `libelle` non vides", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "mandelbrot",
          options: [{ valeur: "mandelbrot", libelle: "" }],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[0].libelle`);
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [{ libelle: "Julia" }],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[0].valeur`);
  });

  it("refuse deux options partageant la même valeur", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [
            { valeur: "julia", libelle: "Julia" },
            { valeur: "julia", libelle: "Julia bis" },
          ],
        }),
      ),
    ).toContain(CHEMIN_OPTIONS);
  });

  it("refuse une option qui n'est pas un objet", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [{ valeur: "julia", libelle: "Julia" }, "pas-un-objet"],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[1]`);
  });
});

describe("validerManifest — perf mesurée", () => {
  it("accepte null — la viz n'est simplement pas encore mesurée", () => {
    expect(cheminsFautifs((m) => (m["perf"] = null))).toEqual([]);
  });

  it("refuse une mesure partielle : c'est une mesure inventée", () => {
    expect(cheminsFautifs((m) => (m["perf"] = { machine: "x" })).length).toBeGreaterThan(0);
    expect(cheminsFautifs((m) => (m["perf"] = undefined))).toContain("perf");
  });

  it("refuse un p95 inférieur à la médiane", () => {
    expect(cheminsFautifs((m) => (lirePerf(m)["jsP95Ms"] = 0.5))).toContain("perf.jsP95Ms");
  });

  it("accepte un temps JS de 0 ms (mesuré : un fond composé arrondit à 0)", () => {
    expect(
      cheminsFautifs((m) => {
        const perf = m["perf"] as Record<string, unknown>;
        perf["jsMedianMs"] = 0;
        perf["jsP95Ms"] = 0;
      }),
    ).toEqual([]);
  });

  it("refuse un temps JS négatif", () => {
    expect(
      cheminsFautifs((m) => {
        (m["perf"] as Record<string, unknown>)["jsMedianMs"] = -1;
      }),
    ).toContain("perf.jsMedianMs");
  });

  it("refuse une cadence nulle ou négative", () => {
    expect(cheminsFautifs((m) => (lirePerf(m)["cadenceFps"] = 0))).toContain("perf.cadenceFps");
  });
});

describe("validerManifest — extraction", () => {
  it("exige au moins un fichier à copier", () => {
    expect(
      cheminsFautifs((m) => ((m["extraction"] as Record<string, unknown>)["fichiers"] = [])),
    ).toContain("extraction.fichiers");
  });

  it("accepte un socle et des dépendances vides", () => {
    expect(
      cheminsFautifs((m) => {
        const e = m["extraction"] as Record<string, unknown>;
        e["socle"] = [];
        e["deps"] = [];
      }),
    ).toEqual([]);
  });
});
