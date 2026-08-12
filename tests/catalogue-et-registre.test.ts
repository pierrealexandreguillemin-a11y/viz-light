import { describe, expect, it } from "vitest";

import { rendreCatalogue } from "@/core/catalogue/rendre.ts";
import { genererRegistre } from "@/core/registre/generer.ts";
import type { VizManifest } from "@/core/manifest/types.ts";

const viz = (surcharge: Partial<VizManifest> = {}): VizManifest => ({
  slug: "flow-field",
  nom: "Flow Field",
  ambiance: "Des rubans qui suivent un vent invisible.",
  origine: { source: "atelier-generatif", reference: "flow-field" },
  runtime: "canvas2d",
  tags: ["organique", "bruit"],
  rendus: [
    { id: "origine", libelle: "Origine", defaut: false, params: [] },
    { id: "aligne", libelle: "Aligné", defaut: true, params: [] },
  ],
  extraction: {
    fichiers: ["FlowField.tsx", "algo.ts"],
    socle: ["core/hooks/useCanvas.ts"],
    deps: [],
  },
  perf: {
    mesureLe: "2026-08-12",
    machine: "Windows 11 / Chrome 151",
    cadenceFps: 60,
    jsMedianMs: 2.4,
    jsP95Ms: 4.8,
    gpuBound: false,
  },
  ...surcharge,
});

describe("rendreCatalogue", () => {
  it("annonce l'absence de viz sans mentir sur le contrat", () => {
    const md = rendreCatalogue([]);
    expect(md).toContain("Aucune viz publiée");
    // La recette générique reste présente : elle documente le contrat, pas les viz.
    expect(md).toContain("Hôte non-React");
  });

  it("porte les deux questions d'un claude+n : laquelle, et quoi copier", () => {
    const md = rendreCatalogue([viz()]);
    expect(md).toContain("Flow Field");
    expect(md).toContain("Des rubans qui suivent un vent invisible.");
    expect(md).toContain("`src/viz/flow-field/algo.ts`");
    expect(md).toContain("`src/core/hooks/useCanvas.ts`");
  });

  it("affiche le coût mesuré avec sa date et sa machine", () => {
    const md = rendreCatalogue([viz()]);
    expect(md).toContain("60 i/s");
    expect(md).toContain("2.4 ms médian");
    expect(md).toContain("mesuré le 2026-08-12");
    expect(md).toContain("CPU-bound");
  });

  it("dit « non mesuré » plutôt que d'inventer un chiffre", () => {
    expect(rendreCatalogue([viz({ perf: null })])).toContain("**non mesuré**");
  });

  it("marque le rendu par défaut et liste les variantes écartées", () => {
    const md = rendreCatalogue([viz({ variantes: ["version banc d'essai"] })]);
    expect(md).toContain("**Aligné** (défaut)");
    expect(md).toContain("version banc d'essai");
  });

  it("trie par nom pour que la sortie ne dépende pas de l'ordre du disque", () => {
    const md = rendreCatalogue([viz({ slug: "zebre", nom: "Zèbre" }), viz({ nom: "Aurore" })]);
    expect(md.indexOf("### Aurore")).toBeLessThan(md.indexOf("### Zèbre"));
  });

  it("signale « aucune » quand la viz n'a pas de dépendance externe", () => {
    expect(rendreCatalogue([viz()])).toContain("| Dépendances | aucune |");
  });

  it("liste les dépendances externes quand il y en a — p5 n'est pas gratuit", () => {
    const md = rendreCatalogue([
      viz({ extraction: { fichiers: ["a.tsx"], socle: [], deps: ["p5"] } }),
    ]);
    expect(md).toContain("| Dépendances | p5 |");
  });

  it("distingue une viz GPU-bound d'une viz CPU-bound", () => {
    const md = rendreCatalogue([
      viz({
        perf: {
          mesureLe: "2026-08-12",
          machine: "Windows 11 / Chrome 151",
          cadenceFps: 42,
          jsMedianMs: 0.4,
          jsP95Ms: 0.9,
          gpuBound: true,
        },
      }),
    ]);
    expect(md).toContain("GPU-bound");
  });
});

describe("genererRegistre", () => {
  it("produit un registre vide qui reste du code valide", () => {
    const source = genererRegistre([]);
    expect(source).toContain("export const REGISTRE");
    expect(source).toContain("= {};");
    expect(source).toContain("ne pas éditer à la main");
  });

  it("charge chaque viz paresseusement — sinon tout entre dans le bundle", () => {
    const source = genererRegistre([{ slug: "tunnel-de-points", composant: "TunnelDePoints" }]);
    expect(source).toContain(
      'Composant: lazy(() => import("./tunnel-de-points/TunnelDePoints.tsx"))',
    );
    expect(source).toContain('import manifest0 from "./tunnel-de-points/manifest.json"');
  });

  it("appelle lazy() au niveau du module, jamais dans un rendu", () => {
    const source = genererRegistre([{ slug: "aurore", composant: "Aurore" }]);
    // Un composant paresseux recréé pendant le rendu redémarrerait l'animation
    // à chaque re-rendu de la planche.
    expect(source).not.toContain("useMemo");
    expect(source.indexOf("lazy(")).toBeGreaterThan(source.indexOf("export const REGISTRE"));
  });

  it("trie par slug pour que la regeneration soit reproductible", () => {
    const source = genererRegistre([
      { slug: "zebre", composant: "Zebre" },
      { slug: "aurore", composant: "Aurore" },
    ]);
    expect(source.indexOf('"aurore"')).toBeLessThan(source.indexOf('"zebre"'));
  });
});
