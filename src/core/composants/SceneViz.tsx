"use client";

import { useEffect, useRef, useState } from "react";

import { useBoucleAnimation } from "../hooks/useBoucleAnimation.ts";
import { useInstrument } from "../hooks/useInstrument.ts";
import { usePreferenceMouvement } from "../hooks/usePreferenceMouvement.ts";
import { useScenePrincipale } from "../hooks/useScenePrincipale.ts";
import { mesurerElement, useSurface } from "../hooks/useSurface.ts";
import { useVisible } from "../hooks/useVisible.ts";
import type { InstanceViz, MonterViz, Reglages } from "../viz/contrat.ts";
import { Cout } from "./Cout.tsx";
import { LimiteErreur } from "./LimiteErreur.tsx";

interface Proprietes {
  readonly nom: string;
  readonly slug: string;
  readonly monter: MonterViz;
  readonly reglages: Reglages;
}

/**
 * LA SCÈNE — tout ce qu'une viz obtient sans l'écrire : mesure de l'hôte avec
 * plafond DPR, pause hors viewport et onglet caché, boucle unique, instrument,
 * respect de `prefers-reduced-motion`, barrière d'erreur.
 */
function Scene({ monter, reglages, slug }: Omit<Proprietes, "nom">) {
  const { refHote, hote, dimensions } = useSurface();
  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const visible = useVisible(conteneurRef);
  const principale = useScenePrincipale(conteneurRef);
  const mouvementReduit = usePreferenceMouvement();
  const [animerQuandMeme, setAnimerQuandMeme] = useState(false);
  const { enregistrer, mesures, reinitialiser } = useInstrument();

  const instanceRef = useRef<InstanceViz | null>(null);
  // Les réglages du montage, hors dépendances : les changer doit passer par
  // `regler`, jamais remonter la viz. La synchronisation est dans un effet et
  // non dans le corps du rendu — écrire une ref pendant le rendu est ce que la
  // règle `react-hooks/refs` interdit, et pour une raison : le rendu peut être
  // rejoué ou abandonné.
  const reglagesRef = useRef(reglages);
  useEffect(() => {
    reglagesRef.current = reglages;
  }, [reglages]);

  /**
   * ⚠ LES DIMENSIONS SONT MESURÉES ICI, PAS ATTENDUES DE L'OBSERVATEUR — c'est
   * la correction d'un vrai bug (2026-08-12) : lire `dimensions` en l'excluant
   * des dépendances faisait que l'effet sortait par sa garde et ne rejouait
   * jamais. Aucune viz ne se montait, pendant que l'instrument affichait
   * 59,9 i/s et 0 ms de JavaScript — il mesurait une boucle vide.
   * Gardé par `tests/scene-viz.test.tsx`.
   */
  useEffect(() => {
    if (!hote) return;
    hote.replaceChildren();
    const instance = monter(hote, mesurerElement(hote), reglagesRef.current);
    instanceRef.current = instance;
    // Première image immédiate : une scène non élue (une seule viz vit à la
    // fois) doit montrer quelque chose, pas un carré vide.
    instance.frame(0, 0);
    reinitialiser();
    return () => {
      instance.demonter?.();
      instanceRef.current = null;
      hote.replaceChildren();
    };
  }, [hote, monter, reinitialiser]);

  /**
   * Une scène NON ÉLUE est figée : sa boucle ne tourne pas. Tout ce qui change
   * son image (réglage, redimensionnement — `canvas.width = …` EFFACE le
   * canvas) doit donc repeindre une image lui-même, sinon la vignette reste
   * noire jusqu'à sa prochaine élection.
   */
  const animeRef = useRef(false);

  // Réglages à chaud. Une viz sans `regler` garde ceux du montage.
  useEffect(() => {
    instanceRef.current?.regler?.(reglages);
    if (!animeRef.current) instanceRef.current?.frame(0, 0);
  }, [reglages]);

  useEffect(() => {
    if (!dimensions) return;
    instanceRef.current?.redimensionner?.(dimensions);
    if (!animeRef.current) instanceRef.current?.frame(0, 0);
  }, [dimensions]);

  /**
   * `prefers-reduced-motion` : première image seulement, et un contournement
   * EXPLICITE (SPEC.md §6). On ne décide pas à la place de quelqu'un qui a dit
   * au système qu'il ne supporte pas le mouvement — on ne lui interdit pas non
   * plus de regarder.
   */
  // Une seule viz vit à la fois (la plus visible) : les autres restent figées
  // sur leur dernière image — décision utilisateur, 2026-08-12.
  const anime = visible && principale && (!mouvementReduit || animerQuandMeme);

  useEffect(() => {
    animeRef.current = anime;
  }, [anime]);

  useEffect(() => {
    if (mouvementReduit && !animerQuandMeme) instanceRef.current?.frame(0, 0);
  }, [mouvementReduit, animerQuandMeme, dimensions, reglages]);

  useBoucleAnimation((temps, delta) => instanceRef.current?.frame(temps, delta), {
    actif: anime,
    surMesure: enregistrer,
  });

  return (
    <div ref={conteneurRef} className="flex flex-col gap-2">
      <div ref={refHote} className="aspect-square w-full bg-(--color-encre)" />
      <Cout mesures={mesures} slug={slug} />
      {mouvementReduit && !animerQuandMeme && (
        <button
          type="button"
          onClick={() => setAnimerQuandMeme(true)}
          className="etiquette self-start underline underline-offset-4 hover:text-(--color-ambre)"
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
