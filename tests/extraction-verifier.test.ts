import { describe, expect, it } from "vitest";

import {
  extraireSpecificateurs,
  verifierExtraction,
  type Lecteur,
} from "@/core/extraction/verifier.ts";
import type { VizManifest } from "@/core/manifest/types.ts";

/** Un `src/` en mémoire : chemins relatifs à `src/`. */
function lecteurEnMemoire(fichiers: Readonly<Record<string, string>>): Lecteur {
  return {
    existe: (chemin) => chemin in fichiers,
    lire: (chemin) => fichiers[chemin] ?? "",
    listerDossier: (dossier) =>
      Object.keys(fichiers)
        .filter((c) => c.startsWith(`${dossier}/`))
        .map((c) => c.slice(dossier.length + 1))
        .sort(),
  };
}

const SRC = {
  "viz/demo/Demo.tsx": `"use client";\nimport { creerCoquille } from "@/core/composants/creerCoquille.tsx";\nimport { monter } from "./algo.ts";\nimport manifest from "./manifest.json";\nexport default creerCoquille(manifest, monter);\n`,
  "viz/demo/algo.ts": `import type { MonterViz } from "@/core/viz/contrat.ts";\nimport { creerToile } from "@/core/viz/toile.ts";\nexport const monter: MonterViz = () => ({ frame() {} });\n`,
  "viz/demo/manifest.json": "{}",
  "viz/demo/notes.md": "# notes",
  "core/composants/creerCoquille.tsx": `import type { MonterViz } from "../viz/contrat.ts";\nimport { SceneViz } from "./SceneViz.tsx";\nexport function creerCoquille() {}\n`,
  "core/composants/SceneViz.tsx": `import { useEffect } from "react";\nimport { useScenePrincipale } from "../hooks/useScenePrincipale.ts";\nexport function SceneViz() {}\n`,
  "core/hooks/useScenePrincipale.ts": `export function useScenePrincipale() {}\n`,
  "core/viz/contrat.ts": `export type MonterViz = () => { frame(): void };\n`,
  "core/viz/toile.ts": `import type { Dimensions } from "./contrat.ts";\nexport function creerToile() {}\n`,
} as const;

const SOCLE_EXACT = [
  "core/composants/creerCoquille.tsx",
  "core/composants/SceneViz.tsx",
  "core/hooks/useScenePrincipale.ts",
  "core/viz/contrat.ts",
  "core/viz/toile.ts",
];

function manifest(extraction: Partial<VizManifest["extraction"]>): VizManifest {
  return {
    slug: "demo",
    nom: "Démo",
    ambiance: "",
    origine: { source: "banc-essai", reference: "x" },
    categorie: "fond",
    runtime: "canvas2d",
    tags: [],
    rendus: [],
    extraction: {
      fichiers: ["Demo.tsx", "algo.ts", "manifest.json", "notes.md"],
      socle: SOCLE_EXACT,
      deps: [],
      ...extraction,
    },
    perf: null,
  };
}

const messages = (problemes: readonly { message: string }[]) => problemes.map((p) => p.message);

describe("extraireSpecificateurs", () => {
  it("lit les imports nommés, de type, par défaut, les ré-exports et les imports nus", () => {
    const source = [
      `import { a } from "./a.ts";`,
      `import type { B } from "../b.ts";`,
      `import c from "./c.json";`,
      `export { d } from "@/d.ts";`,
      `import "./effet.css";`,
      `const s = "from 'pas-un-import'";`,
    ].join("\n");
    expect(extraireSpecificateurs(source)).toEqual([
      "./a.ts",
      "../b.ts",
      "./c.json",
      "@/d.ts",
      "./effet.css",
    ]);
  });
});

describe("verifierExtraction — calibré dans les deux sens", () => {
  it("VERT : la liste exacte ne produit aucun problème", () => {
    expect(verifierExtraction(manifest({}), lecteurEnMemoire(SRC))).toEqual([]);
  });

  it("ROUGE : un fichier de socle importé mais non déclaré (l'état fautif du 2026-09-02)", () => {
    const socle = SOCLE_EXACT.filter((f) => !f.includes("useScenePrincipale"));
    const problemes = verifierExtraction(manifest({ socle }), lecteurEnMemoire(SRC));
    expect(messages(problemes)).toEqual([
      "fichier de socle importé mais non déclaré : core/hooks/useScenePrincipale.ts",
    ]);
  });

  it("ROUGE : un fichier de socle déclaré mais jamais importé", () => {
    const socle = [...SOCLE_EXACT, "core/viz/inutile.ts"];
    const problemes = verifierExtraction(manifest({ socle }), lecteurEnMemoire(SRC));
    expect(messages(problemes)).toEqual([
      "fichier de socle déclaré mais jamais importé : core/viz/inutile.ts",
    ]);
  });

  it("ROUGE : un fichier du dossier non déclaré, et un déclaré qui n'existe pas", () => {
    const fichiers = ["Demo.tsx", "algo.ts", "manifest.json", "fantome.ts"];
    const problemes = verifierExtraction(manifest({ fichiers }), lecteurEnMemoire(SRC));
    expect(messages(problemes)).toEqual([
      "fichier du dossier non déclaré : notes.md",
      "fichier déclaré absent du dossier : fantome.ts",
    ]);
  });

  it("ROUGE : un import qui ne résout vers rien sur le disque", () => {
    const src = { ...SRC, "viz/demo/algo.ts": `import { x } from "./algo/absent.ts";\n` };
    const problemes = verifierExtraction(
      manifest({
        socle: [
          "core/composants/creerCoquille.tsx",
          "core/composants/SceneViz.tsx",
          "core/hooks/useScenePrincipale.ts",
          "core/viz/contrat.ts",
        ],
      }),
      lecteurEnMemoire(src),
    );
    expect(messages(problemes)).toContain(
      "viz/demo/algo.ts importe viz/demo/algo/absent.ts, introuvable",
    );
  });

  it("les paquets : react/next sont fournis par l'hôte, les autres doivent être déclarés", () => {
    const src = {
      ...SRC,
      "viz/demo/algo.ts": `import p5 from "p5";\nimport { x } from "@scope/lib/sous";\nimport type { MonterViz } from "@/core/viz/contrat.ts";\nexport const monter: MonterViz = () => ({ frame() {} });\n`,
    };
    const socle = SOCLE_EXACT.filter((f) => !f.includes("toile"));
    expect(messages(verifierExtraction(manifest({ socle }), lecteurEnMemoire(src)))).toEqual([
      "paquet importé mais non déclaré : @scope/lib",
      "paquet importé mais non déclaré : p5",
    ]);
    expect(
      verifierExtraction(manifest({ socle, deps: ["@scope/lib", "p5"] }), lecteurEnMemoire(src)),
    ).toEqual([]);
    expect(
      messages(
        verifierExtraction(
          manifest({ socle, deps: ["@scope/lib", "p5", "d3"] }),
          lecteurEnMemoire(src),
        ),
      ),
    ).toEqual(["paquet déclaré mais jamais importé : d3"]);
  });

  it("résout un import sans extension vers .ts / .tsx", () => {
    const src = {
      ...SRC,
      "viz/demo/algo.ts": `import type { MonterViz } from "@/core/viz/contrat";\nimport { creerToile } from "../../core/viz/toile";\nexport const monter: MonterViz = () => ({ frame() {} });\n`,
    };
    expect(verifierExtraction(manifest({}), lecteurEnMemoire(src))).toEqual([]);
  });
});
