"use client";

import { Suspense, useCallback, useMemo, useState } from "react";

import type { EntreeViz } from "@/viz/registre.genere.ts";

import { Reglages } from "./Reglages.tsx";

const valeursDuRendu = (params: readonly { cle: string; valeur: number }[]) =>
  Object.fromEntries(params.map((p) => [p.cle, p.valeur]));

/**
 * UN SPÉCIMEN — la viz en grand, ses réglages à côté.
 *
 * C'est le format qui rend le catalogue utile plutôt que décoratif : on essaie,
 * on pousse un curseur, on voit le coût bouger. Une vignette légendée ne
 * remplace pas ça.
 */
export function Specimen({ entree }: { readonly entree: EntreeViz }) {
  const { manifest, Composant } = entree;
  const rendus = manifest.rendus;
  const defaut = rendus.find((r) => r.defaut) ?? rendus[0];

  const [renduActif, setRenduActif] = useState(defaut?.id ?? "");
  const [valeurs, setValeurs] = useState(() => valeursDuRendu(defaut?.params ?? []));

  const rendu = useMemo(
    () => rendus.find((r) => r.id === renduActif) ?? defaut,
    [rendus, renduActif, defaut],
  );

  const changerRendu = useCallback(
    (id: string) => {
      setRenduActif(id);
      const suivant = rendus.find((r) => r.id === id);
      if (suivant) setValeurs(valeursDuRendu(suivant.params));
    },
    [rendus],
  );

  const reinitialiser = useCallback(() => {
    if (rendu) setValeurs(valeursDuRendu(rendu.params));
  }, [rendu]);

  const changerValeur = useCallback(
    (cle: string, valeur: number) => setValeurs((v) => ({ ...v, [cle]: valeur })),
    [],
  );

  // Colonnes bornées, pas `1fr` : le carré de la viz suivrait sinon toute la
  // largeur (plus de 1000 px sur un grand écran) et le panneau serait rejeté au
  // bord opposé, séparé par un demi-écran de vide.
  return (
    <article className="grid justify-start gap-6 border-t border-(--color-filet) pt-6 md:grid-cols-[minmax(0,34rem)_18rem] md:gap-8">
      <div className="w-full">
        <Suspense
          fallback={<div className="aspect-square w-full bg-(--color-encre-levee)" aria-hidden />}
        >
          <Composant reglages={valeurs} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg tracking-tight text-(--color-os)">{manifest.nom}</h3>
          <p className="voix-humaine text-sm text-(--color-os-mat)">{manifest.ambiance}</p>
          <p className="etiquette pt-1">
            {manifest.origine.auteur ?? manifest.origine.source}
            {manifest.origine.date ? ` · ${manifest.origine.date}` : ""} · {manifest.runtime}
          </p>
        </header>

        <Reglages
          rendus={rendus}
          renduActif={renduActif}
          surRendu={changerRendu}
          valeurs={valeurs}
          surValeur={changerValeur}
          surReinitialiser={reinitialiser}
        />
      </div>
    </article>
  );
}
