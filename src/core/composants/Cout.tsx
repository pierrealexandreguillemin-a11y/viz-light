import type { Mesures } from "../instrument/mesures.ts";

interface Proprietes {
  readonly mesures: Mesures | null;
  /** Slug de la viz — sert au bench à retrouver la mesure dans la page. */
  readonly slug?: string;
}

/**
 * LE COÛT, EN TOUTES LETTRES.
 *
 * La version précédente était une barre de 3 px accompagnée d'une légende.
 * Une interface qui a besoin d'une légende ne s'explique pas d'elle-même :
 * la légende était la preuve que la barre ne disait rien. Remplacée par la
 * phrase que la barre essayait de coder — elle se lit sans mode d'emploi et
 * tient sur une ligne.
 *
 * Les attributs `data-*` restent : `scripts/bench.ts` relève EXACTEMENT ce qui
 * est affiché, plutôt que de mesurer par un second chemin qui divergerait.
 */
export function Cout({ mesures, slug }: Proprietes) {
  if (!mesures) {
    return (
      <p className="etiquette" data-viz={slug}>
        mesure en cours…
      </p>
    );
  }

  const goulot = mesures.gpuBound
    ? "le GPU est le goulot, pas le JavaScript"
    : `sur les 16,7 ms d’une image`;

  return (
    <p
      className="etiquette normal-case"
      data-viz={slug}
      data-fps={mesures.cadenceFps}
      data-js-median={mesures.jsMedianMs}
      data-js-p95={mesures.jsP95Ms}
      data-gpu-bound={String(mesures.gpuBound)}
      data-echantillons={mesures.echantillons}
    >
      <span className="text-(--color-mesure)">{mesures.cadenceFps} images/s</span>
      {" · "}
      <span className="text-(--color-mesure)">{mesures.jsMedianMs} ms</span> de JavaScript par
      image, {goulot}
    </p>
  );
}
