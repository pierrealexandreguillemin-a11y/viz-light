"use client";

import { useCallback, useEffect, useState } from "react";

import type { Dimensions } from "../viz/contrat.ts";

/**
 * PLAFOND DE DENSITÉ DE PIXELS.
 *
 * Un écran moderne annonce volontiers `devicePixelRatio: 3`. Sans plafond, une
 * viz remplirait ~9 fois la surface d'un rendu à 1× — et le coût d'un shader
 * est proportionnel au nombre de pixels. C'est le réglage qui décide seul
 * qu'une viz tourne à 60 i/s ou à 20, et au-delà de 2 il n'apporte plus rien à
 * l'œil sur une image en mouvement permanent.
 */
export const DPR_MAXIMUM = 2;

/**
 * Mesure immédiate d'un élément. Exportée parce que le montage d'une viz en a
 * besoin AVANT que l'observateur n'ait rapporté quoi que ce soit — et la
 * dupliquer là-bas serait la duplication que `jscpd` traque.
 */
export function mesurerElement(element: HTMLElement): Dimensions {
  const rect = element.getBoundingClientRect();
  return {
    largeur: Math.max(1, Math.round(rect.width)),
    hauteur: Math.max(1, Math.round(rect.height)),
    dpr: Math.min(window.devicePixelRatio || 1, DPR_MAXIMUM),
  };
}

/**
 * Mesure l'élément hôte et suit ses redimensionnements. Le socle NE CRÉE PAS la
 * surface : c'est la viz qui décide si elle veut un canvas 2D, un contexte
 * WebGL, une instance p5 ou des div (`contrat.ts`). Le socle lui dit seulement
 * de quelle taille, et avec quelle densité.
 */
export function useSurface(): {
  refHote: (element: HTMLElement | null) => void;
  hote: HTMLElement | null;
  dimensions: Dimensions | null;
} {
  const [hote, setHote] = useState<HTMLElement | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  const refHote = useCallback((element: HTMLElement | null) => setHote(element), []);

  useEffect(() => {
    if (!hote) return;

    const mesurer = () => {
      const suivant = mesurerElement(hote);
      setDimensions((precedent) =>
        precedent?.largeur === suivant.largeur &&
        precedent.hauteur === suivant.hauteur &&
        precedent.dpr === suivant.dpr
          ? precedent
          : suivant,
      );
    };

    // `ResizeObserver` déclenche son rappel une première fois dès `observe()` :
    // la mesure initiale arrive donc par le rappel, sans `setState` synchrone
    // dans le corps de l'effet.
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(hote);
    return () => observateur.disconnect();
  }, [hote]);

  return { refHote, hote, dimensions };
}
