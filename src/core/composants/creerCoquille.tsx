"use client";

import type { MonterViz, ProprietesViz } from "../viz/contrat.ts";
import { SceneViz } from "./SceneViz.tsx";

/**
 * FABRIQUE DE COQUILLES.
 *
 * La coquille d'une viz ne fait qu'une chose : passer les réglages courants à
 * la scène. Écrite à la main, elle est donc identique d'une viz à l'autre — et
 * `jscpd` l'a signalé dès la cinquième (8 clones). La factoriser garde le
 * contrat intact : chaque viz exporte toujours son composant par défaut, et son
 * dossier reste copiable tel quel, `creerCoquille` figurant simplement dans la
 * liste `extraction.socle` du manifest.
 */
export function creerCoquille(
  manifest: { readonly nom: string; readonly slug: string },
  monter: MonterViz,
) {
  return function CoquilleViz({ reglages }: ProprietesViz) {
    return <SceneViz nom={manifest.nom} slug={manifest.slug} monter={monter} reglages={reglages} />;
  };
}
