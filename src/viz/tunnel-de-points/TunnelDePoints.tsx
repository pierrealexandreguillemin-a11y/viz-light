"use client";

import { SceneViz } from "@/core/composants/SceneViz.tsx";

import { monterTunnelDePoints } from "./algo.ts";
import manifest from "./manifest.json";

/**
 * LA COQUILLE — volontairement mince (SPEC.md §3).
 *
 * Elle ne fait que choisir un rendu et le passer à la scène. Tout le reste —
 * boucle, pause hors viewport, plafond DPR, instrument, mouvement réduit,
 * barrière d'erreur — vient du socle, et l'algorithme n'en sait rien.
 */
const REGLAGES = Object.fromEntries(
  (manifest.rendus.find((r) => r.defaut) ?? manifest.rendus[0])!.params.map((p) => [
    p.cle,
    p.valeur,
  ]),
);

export default function TunnelDePoints() {
  return (
    <SceneViz
      nom={manifest.nom}
      slug={manifest.slug}
      monter={monterTunnelDePoints}
      reglages={REGLAGES}
    />
  );
}
