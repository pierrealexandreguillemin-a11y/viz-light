"use client";

import type { Param, Rendu } from "../manifest/types.ts";
import type { Reglages as ValeursReglages } from "../viz/contrat.ts";

interface Proprietes {
  readonly rendus: readonly Rendu[];
  readonly renduActif: string;
  readonly surRendu: (id: string) => void;
  readonly valeurs: ValeursReglages;
  readonly surValeur: (cle: string, valeur: number) => void;
  readonly surReinitialiser: () => void;
}

/** Un curseur affiche sa valeur : sinon on règle à l'aveugle. */
function Curseur({
  param,
  valeur,
  surValeur,
}: {
  readonly param: Param;
  readonly valeur: number;
  readonly surValeur: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="etiquette flex items-baseline justify-between gap-3 normal-case">
        <span>{param.libelle}</span>
        <span className="text-(--color-os)">{valeur}</span>
      </span>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.pas}
        value={valeur}
        onChange={(e) => surValeur(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-none bg-(--color-filet) accent-(--color-ambre)"
      />
    </label>
  );
}

/**
 * LE PANNEAU DE RÉGLAGES — ce qui manquait, et ce sans quoi le catalogue
 * n'était qu'une vitrine morte.
 *
 * Le banc d'essai d'origine se réglait en direct ; le perdre en migrant aurait
 * été perdre l'essentiel. Les curseurs agissent SANS remonter la viz
 * (`InstanceViz.regler`) : on voit l'effet pendant qu'on déplace.
 *
 * Le choix du rendu est en haut parce que c'est lui qui change le plus de
 * choses d'un coup : il remplace toutes les valeurs en dessous.
 */
export function Reglages({
  rendus,
  renduActif,
  surRendu,
  valeurs,
  surValeur,
  surReinitialiser,
}: Proprietes) {
  const rendu = rendus.find((r) => r.id === renduActif) ?? rendus[0];
  if (!rendu) return null;

  return (
    <div className="flex flex-col gap-5">
      {rendus.length > 1 && (
        <div className="flex flex-wrap gap-px">
          {rendus.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => surRendu(r.id)}
              aria-pressed={r.id === renduActif}
              className={
                r.id === renduActif
                  ? "etiquette bg-(--color-ambre) px-3 py-2 text-(--color-encre)"
                  : "etiquette bg-(--color-encre-levee) px-3 py-2 text-(--color-os-mat) hover:text-(--color-os)"
              }
            >
              {r.libelle}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {rendu.params.map((param) => (
          <Curseur
            key={param.cle}
            param={param}
            valeur={valeurs[param.cle] ?? param.valeur}
            surValeur={(v) => surValeur(param.cle, v)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={surReinitialiser}
        className="etiquette self-start text-(--color-os-pale) underline underline-offset-4 hover:text-(--color-ambre)"
      >
        Revenir aux valeurs du rendu
      </button>
    </div>
  );
}
