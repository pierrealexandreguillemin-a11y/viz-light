"use client";

import { useEffect, useRef, useState } from "react";

import { useBoucleAnimation } from "../hooks/useBoucleAnimation.ts";
import { useInstrument } from "../hooks/useInstrument.ts";
import { usePreferenceMouvement } from "../hooks/usePreferenceMouvement.ts";
import { mesurerElement, useSurface } from "../hooks/useSurface.ts";
import { useVisible } from "../hooks/useVisible.ts";
import type { InstanceViz, MonterViz, Reglages } from "../viz/contrat.ts";
import { FiletCout } from "./FiletCout.tsx";
import { LimiteErreur } from "./LimiteErreur.tsx";

interface Proprietes {
  readonly nom: string;
  readonly slug: string;
  readonly monter: MonterViz;
  readonly reglages: Reglages;
}

/**
 * LA SCÈNE — tout ce qu'une viz obtient gratuitement, et qu'elle n'a donc pas à
 * réécrire : mesure de l'hôte avec plafond DPR, pause hors viewport et onglet
 * caché, boucle unique, instrument, respect de `prefers-reduced-motion`,
 * barrière d'erreur.
 *
 * C'est la contrepartie du contrat : parce que le socle porte tout cela, une
 * viz n'est plus qu'un `algo.ts` en TypeScript pur (SPEC.md §3).
 */
function Scene({ monter, reglages, slug }: Omit<Proprietes, "nom">) {
  const { refHote, hote, dimensions } = useSurface();
  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const visible = useVisible(conteneurRef);
  const mouvementReduit = usePreferenceMouvement();
  const [animerQuandMeme, setAnimerQuandMeme] = useState(false);
  const { enregistrer, mesures, reinitialiser } = useInstrument();

  const instanceRef = useRef<InstanceViz | null>(null);

  /**
   * Montage / démontage. L'hôte appartient à la viz : on le vide des deux côtés
   * pour qu'un algo qui oublie son ménage ne laisse rien derrière lui.
   *
   * ⚠ LES DIMENSIONS SONT MESURÉES ICI, PAS ATTENDUES DE L'OBSERVATEUR — et
   * c'est la correction d'un vrai bug, pas une préférence. La version
   * précédente lisait `dimensions` (alimenté par le `ResizeObserver`) tout en
   * l'excluant des dépendances via un `eslint-disable` : à l'instant où l'hôte
   * apparaît, la mesure n'existe pas encore, l'effet sortait par sa garde, et
   * ne rejouait jamais. Résultat : AUCUNE viz ne se montait, pendant que
   * l'instrument affichait sereinement 59,9 i/s et 0 ms de JavaScript — il
   * mesurait une boucle vide. Mesurer sur place supprime la dépendance
   * asynchrone et le `eslint-disable` avec elle.
   */
  useEffect(() => {
    if (!hote) return;
    hote.replaceChildren();
    const instance = monter(hote, mesurerElement(hote), reglages);
    instanceRef.current = instance;
    reinitialiser();
    return () => {
      instance.demonter?.();
      instanceRef.current = null;
      hote.replaceChildren();
    };
    // `reinitialiser` et non l'objet `instrument` : celui-ci est recréé à
    // chaque rendu, donc l'inscrire ici remonterait la viz quatre fois par
    // seconde, au rythme du rafraîchissement de l'instrument.
  }, [hote, monter, reglages, reinitialiser]);

  useEffect(() => {
    if (dimensions) instanceRef.current?.redimensionner?.(dimensions);
  }, [dimensions]);

  /**
   * `prefers-reduced-motion` : première image seulement, et un contournement
   * EXPLICITE (SPEC.md §6). On ne décide pas à la place de quelqu'un qui a dit
   * au système qu'il ne supporte pas le mouvement — mais on ne lui interdit pas
   * non plus de regarder.
   */
  const anime = visible && (!mouvementReduit || animerQuandMeme);

  useEffect(() => {
    if (mouvementReduit && !animerQuandMeme) instanceRef.current?.frame(0, 0);
  }, [mouvementReduit, animerQuandMeme, dimensions]);

  useBoucleAnimation((temps, delta) => instanceRef.current?.frame(temps, delta), {
    actif: anime,
    surMesure: enregistrer,
  });

  return (
    <div ref={conteneurRef} className="flex flex-col">
      <div ref={refHote} className="relative aspect-square w-full bg-(--color-encre)" />
      <FiletCout mesures={mesures} slug={slug} />
      {mouvementReduit && !animerQuandMeme && (
        <button
          type="button"
          onClick={() => setAnimerQuandMeme(true)}
          className="etiquette px-3 py-2 text-left hover:text-(--color-ambre)"
        >
          Image fixe — animer quand même
        </button>
      )}
    </div>
  );
}

export function SceneViz(proprietes: Proprietes) {
  return (
    <LimiteErreur nom={proprietes.nom}>
      <Scene {...proprietes} />
    </LimiteErreur>
  );
}
