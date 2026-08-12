"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

function souscrireOnglet(surChangement: () => void): () => void {
  document.addEventListener("visibilitychange", surChangement);
  return () => document.removeEventListener("visibilitychange", surChangement);
}

const ongletAuPremierPlan = (): boolean => !document.hidden;
const supposerActif = (): boolean => true;

/**
 * Une viz est « visible » quand son élément est dans le viewport ET que
 * l'onglet est au premier plan.
 *
 * LES DEUX CONDITIONS COMPTENT, POUR DES RAISONS DIFFÉRENTES. L'onglet caché :
 * le navigateur y ralentit `requestAnimationFrame` sans l'arrêter — une planche
 * de trente viz laissée dans un onglet de fond chaufferait la machine pour
 * rien. Hors viewport : sur une planche, l'immense majorité des viz est sous la
 * ligne de flottaison ; les laisser tourner ferait payer trente animations pour
 * en regarder une.
 *
 * `false` par défaut côté viewport : on ne démarre pas avant d'avoir observé.
 * Une viz qui démarre puis s'arrête coûte plus cher qu'une viz qui attend.
 */
export function useVisible(cible: RefObject<Element | null>): boolean {
  const [dansLeViewport, setDansLeViewport] = useState(false);
  const ongletActif = useSyncExternalStore(souscrireOnglet, ongletAuPremierPlan, supposerActif);

  useEffect(() => {
    const element = cible.current;
    if (!element) return;

    // `IntersectionObserver` déclenche son rappel une première fois dès
    // `observe()` : l'état initial arrive donc par le rappel, sans avoir à
    // appeler `setState` en synchrone dans l'effet.
    const observateur = new IntersectionObserver(
      (entrees) => {
        const entree = entrees[0];
        if (entree) setDansLeViewport(entree.isIntersecting);
      },
      // Une marge : la viz est prête quand elle arrive à l'écran, plutôt que de
      // démarrer sous les yeux du lecteur.
      { rootMargin: "128px" },
    );
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [cible]);

  return dansLeViewport && ongletActif;
}
