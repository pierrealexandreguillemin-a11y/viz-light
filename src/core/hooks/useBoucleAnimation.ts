"use client";

import { useEffect, useRef } from "react";

/** Une image dessinée : temps écoulé total, et pas depuis l'image précédente. */
export type Dessiner = (temps: number, delta: number) => void;

/** Rapporté à chaque image pour alimenter l'instrument (ADR 0005). */
export type SurMesure = (intervalleMs: number, jsMs: number) => void;

export interface OptionsBoucle {
  readonly actif: boolean;
  readonly surMesure?: SurMesure;
}

/**
 * Un delta plus grand qu'un dixième de seconde vient d'un onglet revenu au
 * premier plan ou d'un point d'arrêt, jamais d'une image lente. Le laisser
 * passer ferait « sauter » la viz de plusieurs secondes d'un coup — une
 * particule traverserait l'écran d'un bond.
 */
const DELTA_MAXIMUM_S = 0.1;

/**
 * LA BOUCLE PARTAGÉE — une seule dans tout le catalogue.
 *
 * C'est elle qui rend p5 utilisable sans lui laisser sa propre boucle : les
 * sketches tournent en mode instance, piloté d'ici (SPEC.md §2). Sans cela,
 * chaque viz p5 installerait son `requestAnimationFrame`, et ni la pause hors
 * viewport ni l'instrument ne les verraient.
 *
 * `dessiner` est gardé dans une ref : une fonction recréée à chaque rendu
 * relancerait la boucle à chaque frappe sur un curseur de réglage — c'est-à-dire
 * exactement quand il ne faut pas.
 */
export function useBoucleAnimation(dessiner: Dessiner, options: OptionsBoucle): void {
  const dessinerRef = useRef(dessiner);
  const surMesureRef = useRef(options.surMesure);
  const tempsRef = useRef(0);

  useEffect(() => {
    dessinerRef.current = dessiner;
    surMesureRef.current = options.surMesure;
  });

  useEffect(() => {
    if (!options.actif) return;

    let identifiant = 0;
    let precedente = 0;

    const image = (horodatage: number) => {
      identifiant = requestAnimationFrame(image);

      const premiere = precedente === 0;
      const intervalleMs = premiere ? 1000 / 60 : horodatage - precedente;
      precedente = horodatage;
      tempsRef.current += Math.min(intervalleMs / 1000, DELTA_MAXIMUM_S);

      const debut = performance.now();
      dessinerRef.current(tempsRef.current, Math.min(intervalleMs / 1000, DELTA_MAXIMUM_S));
      const jsMs = performance.now() - debut;

      // La toute première image porte la compilation des shaders et
      // l'allocation des tampons : la compter fausserait durablement le p95.
      if (!premiere) surMesureRef.current?.(intervalleMs, jsMs);
    };

    identifiant = requestAnimationFrame(image);
    return () => cancelAnimationFrame(identifiant);
  }, [options.actif]);
}
