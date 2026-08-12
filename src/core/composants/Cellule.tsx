"use client";

import { Suspense } from "react";

import type { EntreeViz } from "@/viz/registre.genere.ts";

/**
 * UNE CELLULE DE PLANCHE — un spécimen et son étiquette.
 *
 * Le composant de la viz est chargé PARESSEUSEMENT : sans cela, ouvrir la
 * planche téléchargerait p5.js et tous les shaders du catalogue pour afficher
 * une page. Le `lazy()` vient du registre généré, où il est construit au niveau
 * du module — jamais pendant un rendu, sinon l'animation redémarrerait à chaque
 * re-rendu de la planche.
 */
export function Cellule({ entree }: { readonly entree: EntreeViz }) {
  const { manifest, Composant } = entree;

  return (
    <article
      className={manifest.perf ? "planche__cellule planche__cellule--mesuree" : "planche__cellule"}
    >
      <Suspense
        fallback={
          <div
            className="aspect-square w-full animate-pulse bg-(--color-encre-levee)"
            aria-hidden
          />
        }
      >
        <Composant />
      </Suspense>

      <div className="flex flex-col gap-1.5 p-3">
        {/* La provenance, courte : la référence exacte vit dans CATALOG.md, la
            répéter ici ferait déborder l'étiquette sur trois lignes. */}
        <p className="etiquette">
          {manifest.origine.source}
          {manifest.origine.date ? ` · ${manifest.origine.date}` : ""}
          {manifest.origine.auteur ? ` · ${manifest.origine.auteur}` : ""}
        </p>
        <h2 className="text-sm tracking-tight text-(--color-os)">{manifest.nom}</h2>
        <p className="voix-humaine text-xs text-(--color-os-mat)">{manifest.ambiance}</p>
        <p className="etiquette pt-1">
          {manifest.runtime}
          {manifest.perf ? ` · ${manifest.perf.cadenceFps} i/s` : " · non mesurée"}
        </p>
      </div>
    </article>
  );
}
