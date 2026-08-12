"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * UNE SEULE VIZ VIVANTE À LA FOIS — décision utilisateur du 2026-08-12.
 *
 * Même en pausant hors viewport, deux ou trois viz visibles se partagent la
 * machine : la cadence perçue en défilant n'était pas celle des manifests.
 * Ici, un observateur PARTAGÉ suit le taux de visibilité de chaque scène et
 * n'ÉLIT que la plus visible ; les autres restent figées sur leur dernière
 * image. Départage entre deux scènes pleinement visibles : la plus proche du
 * centre du viewport. En cas d'égalité parfaite, l'élue en place le reste —
 * une élection stable ne clignote pas.
 */
type Notifier = (principale: boolean) => void;

const ratios = new Map<Element, number>();
const abonnes = new Map<Element, Notifier>();
let elue: Element | null = null;
let observateur: IntersectionObserver | null = null;

function score(element: Element, ratio: number): number {
  const boite = element.getBoundingClientRect();
  const hauteurViewport = window.innerHeight || 1;
  const distanceAuCentre = Math.abs((boite.top + boite.bottom) / 2 - hauteurViewport / 2);
  // Le ratio prime (paliers de l'observateur), la distance départage.
  return ratio * 10000 - distanceAuCentre;
}

function meilleureCandidate(): Element | null {
  let meilleure: Element | null = null;
  let meilleurScore = Number.NEGATIVE_INFINITY;
  for (const [element, ratio] of ratios) {
    if (ratio <= 0) continue;
    const s = score(element, ratio);
    // À égalité parfaite, l'élue en place gagne : une élection stable ne clignote pas.
    const egaliteAvecElue = s === meilleurScore && element === elue;
    if (s > meilleurScore || egaliteAvecElue) {
      meilleurScore = s;
      meilleure = element;
    }
  }
  return meilleure;
}

function elire(): void {
  const meilleure = meilleureCandidate();
  if (meilleure === elue) return;
  const ancienne = elue;
  elue = meilleure;
  if (ancienne) abonnes.get(ancienne)?.(false);
  if (elue) abonnes.get(elue)?.(true);
}

function obtenirObservateur(): IntersectionObserver {
  observateur ??= new IntersectionObserver(
    (entrees) => {
      for (const entree of entrees) {
        // `|| 1` et non `??` : la doublure de test rapporte un ratio absent
        // (undefined) et un vrai observateur peut rapporter 0 en étant
        // intersectant au seuil zéro — les deux valent « pleinement visible ».
        ratios.set(entree.target, entree.isIntersecting ? entree.intersectionRatio || 1 : 0);
      }
      elire();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  return observateur;
}

/** `true` pour la scène la plus visible du viewport, `false` pour les autres. */
export function useScenePrincipale(cible: RefObject<Element | null>): boolean {
  const [principale, setPrincipale] = useState(false);

  useEffect(() => {
    const element = cible.current;
    if (!element) return;
    abonnes.set(element, setPrincipale);
    ratios.set(element, 0);
    const partage = obtenirObservateur();
    partage.observe(element);

    return () => {
      partage.unobserve(element);
      ratios.delete(element);
      abonnes.delete(element);
      if (elue === element) elue = null;
      elire();
      if (ratios.size === 0) {
        partage.disconnect();
        observateur = null;
      }
    };
  }, [cible]);

  return principale;
}
