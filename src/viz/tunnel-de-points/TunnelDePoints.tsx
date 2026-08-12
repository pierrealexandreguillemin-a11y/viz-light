"use client";

import { SceneViz } from "@/core/composants/SceneViz.tsx";
import type { ProprietesViz } from "@/viz/registre.genere.ts";

import { monterTunnelDePoints } from "./algo.ts";
import manifest from "./manifest.json";

/**
 * LA COQUILLE — volontairement mince (SPEC.md §3).
 *
 * Elle transmet les réglages courants à la scène, et rien d'autre. Boucle,
 * pause hors viewport, plafond DPR, instrument, mouvement réduit et barrière
 * d'erreur viennent du socle ; l'algorithme n'en sait rien.
 */
export default function TunnelDePoints({ reglages }: ProprietesViz) {
  return (
    <SceneViz
      nom={manifest.nom}
      slug={manifest.slug}
      monter={monterTunnelDePoints}
      reglages={reglages}
    />
  );
}
