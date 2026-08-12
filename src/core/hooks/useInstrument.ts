"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { pousser, resumer, type Mesures } from "../instrument/mesures.ts";

/** ~1,5 s à 60 i/s : assez pour une médiane stable, assez court pour réagir. */
const TAILLE_FENETRE = 90;

/**
 * Rafraîchir l'affichage à chaque image ferait de l'instrument le poste le plus
 * coûteux de la page — un rendu React 60 fois par seconde pour montrer que la
 * viz tourne à 60 i/s. Quatre fois par seconde suffit à lire un chiffre.
 */
const PERIODE_AFFICHAGE_MS = 250;

export interface Instrument {
  /** À passer à `useBoucleAnimation` via `surMesure`. */
  readonly enregistrer: (intervalleMs: number, jsMs: number) => void;
  /** `null` tant qu'il n'y a pas de quoi conclure — jamais un chiffre prématuré. */
  readonly mesures: Mesures | null;
  readonly reinitialiser: () => void;
}

/**
 * L'instrument en socle (ADR 0005) : il accumule dans des refs et ne provoque
 * un rendu qu'au rythme de l'affichage.
 */
export function useInstrument(): Instrument {
  const intervallesRef = useRef<number[]>([]);
  const tempsJsRef = useRef<number[]>([]);
  const [mesures, setMesures] = useState<Mesures | null>(null);

  const enregistrer = useCallback((intervalleMs: number, jsMs: number) => {
    intervallesRef.current = pousser(intervallesRef.current, intervalleMs, TAILLE_FENETRE);
    tempsJsRef.current = pousser(tempsJsRef.current, jsMs, TAILLE_FENETRE);
  }, []);

  const reinitialiser = useCallback(() => {
    intervallesRef.current = [];
    tempsJsRef.current = [];
    setMesures(null);
  }, []);

  useEffect(() => {
    const minuterie = setInterval(() => {
      setMesures(resumer(intervallesRef.current, tempsJsRef.current));
    }, PERIODE_AFFICHAGE_MS);
    return () => clearInterval(minuterie);
  }, []);

  return { enregistrer, mesures, reinitialiser };
}
