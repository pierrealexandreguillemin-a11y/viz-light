"use client";

import { useSyncExternalStore } from "react";

const REQUETE = "(prefers-reduced-motion: reduce)";

function souscrire(surChangement: () => void): () => void {
  const media = window.matchMedia(REQUETE);
  media.addEventListener("change", surChangement);
  return () => media.removeEventListener("change", surChangement);
}

const lireClient = (): boolean => window.matchMedia(REQUETE).matches;

/**
 * Faux au rendu serveur : l'export est statique, le HTML est produit sans
 * navigateur. La valeur réelle arrive à l'hydratation, avant la première image
 * dessinée.
 */
const lireServeur = (): boolean => false;

/**
 * `prefers-reduced-motion`, EN SUIVANT LES CHANGEMENTS.
 *
 * Réactif et non lu une fois au montage : quelqu'un qui active la réduction de
 * mouvement pendant qu'une viz tourne veut qu'elle s'arrête, pas qu'elle
 * continue jusqu'au prochain rechargement.
 *
 * `useSyncExternalStore` plutôt qu'un `useEffect` + `setState` : `matchMedia`
 * EST une source externe, et l'abonner ainsi évite le rendu en cascade qu'un
 * `setState` synchrone dans un effet provoque — la règle React l'a d'ailleurs
 * refusé sur la première version de ce hook.
 */
export function usePreferenceMouvement(): boolean {
  return useSyncExternalStore(souscrire, lireClient, lireServeur);
}
