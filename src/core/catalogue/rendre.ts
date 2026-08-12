import type { PerfMesuree, VizManifest } from "../manifest/types.ts";

/**
 * GÉNÉRATION DE `CATALOG.md` — le point d'entrée d'un claude+n (SPEC.md §3).
 *
 * Le fichier est GÉNÉRÉ, jamais édité à la main : deux endroits où lire la même
 * information finissent toujours par se contredire, et c'est celui qu'on n'a pas
 * regénéré qu'on lit. Il doit répondre à deux questions sans ouvrir le code :
 * « laquelle je prends ? » (ambiance, tags, coût mesuré) et « qu'est-ce que je
 * copie ? » (liste exacte des fichiers).
 */

const AVERTISSEMENT = "<!-- GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main. -->";

function perfEnLigne(perf: PerfMesuree): string {
  const charge = perf.gpuBound ? "GPU-bound" : "CPU-bound";
  return (
    `${perf.cadenceFps} i/s · JS ${perf.jsMedianMs} ms médian, ${perf.jsP95Ms} ms p95 · ` +
    `${charge} · mesuré le ${perf.mesureLe} sur ${perf.machine}`
  );
}

function listeFichiers(viz: VizManifest): string {
  const dansLaViz = viz.extraction.fichiers.map((f) => `\`src/viz/${viz.slug}/${f}\``);
  const socle = viz.extraction.socle.map((f) => `\`src/${f}\``);
  return [...dansLaViz, ...socle].join(" · ");
}

function fiche(viz: VizManifest): string {
  const rendus = viz.rendus
    .map((r) => (r.defaut ? `**${r.libelle}** (défaut)` : r.libelle))
    .join(" · ");
  const deps = viz.extraction.deps.length > 0 ? viz.extraction.deps.join(", ") : "aucune";

  const lignes = [
    `### ${viz.nom}`,
    "",
    `*${viz.ambiance}*`,
    "",
    `| | |`,
    `|---|---|`,
    `| Slug | \`${viz.slug}\` |`,
    `| Runtime | ${viz.runtime} |`,
    `| Tags | ${viz.tags.join(", ")} |`,
    `| Rendus | ${rendus} |`,
    `| Origine | ${viz.origine.reference} (${viz.origine.source}) |`,
    `| Coût mesuré | ${viz.perf ? perfEnLigne(viz.perf) : "**non mesuré**"} |`,
    `| Dépendances | ${deps} |`,
    `| À copier | ${listeFichiers(viz)} |`,
  ];
  if (viz.variantes && viz.variantes.length > 0) {
    lignes.push(`| Variantes écartées | ${viz.variantes.join(" · ")} |`);
  }
  return lignes.join("\n");
}

/** La recette de montage hors React, documentée UNE fois (SPEC.md §3.4). */
const RECETTE_GENERIQUE = `## Hôte non-React

Aucun consommateur réel aujourd'hui — d'où une recette générique plutôt qu'un
adaptateur par viz. Reprends \`algo.ts\` (TypeScript pur, sans aucun import
React) et monte-le toi-même :

\`\`\`ts
import { creerAlgo } from "./algo.ts";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const algo = creerAlgo({ largeur: canvas.width, hauteur: canvas.height });

let precedent = 0;
function image(maintenant: number) {
  const delta = Math.min((maintenant - precedent) / 1000, 0.1);
  precedent = maintenant;
  algo.frame(ctx, delta);
  requestAnimationFrame(image);
}
requestAnimationFrame(image);
\`\`\`

Trois choses restent à ta charge, que le socle React fait sinon pour toi :
le plafond de densité de pixels (DPR), la mise en pause quand l'onglet est
caché, et le respect de \`prefers-reduced-motion\`.`;

const ENTETE = `# CATALOG — Viz Light

${AVERTISSEMENT}

Catalogue des visualisations extractibles. **Contrat d'extraction** : copie le
dossier \`src/viz/<slug>/\` plus les fichiers de socle listés dans la fiche,
puis pose \`<VizName />\`. Les chiffres de coût sortent de \`scripts/bench.mjs\`
exécuté — jamais d'estimation.`;

export function rendreCatalogue(manifests: readonly VizManifest[]): string {
  if (manifests.length === 0) {
    return [
      ENTETE,
      "",
      "## Aucune viz publiée",
      "",
      "Le contrat de données est en place, la migration n'a pas commencé.",
      "Suivi : `docs/SPEC.md`, section « Fil d'Ariane ».",
      "",
      RECETTE_GENERIQUE,
      "",
    ].join("\n");
  }

  const tries = [...manifests].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const sommaire = tries.map((v) => `- **${v.nom}** — ${v.ambiance}`).join("\n");

  return [
    ENTETE,
    "",
    `## Les ${tries.length} viz`,
    "",
    sommaire,
    "",
    ...tries.map((v) => `${fiche(v)}\n`),
    RECETTE_GENERIQUE,
    "",
  ].join("\n");
}
