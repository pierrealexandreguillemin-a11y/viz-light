import type { Mesures } from "../instrument/mesures.ts";

/** Budget d'une image à 60 images par seconde. */
const BUDGET_IMAGE_MS = 1000 / 60;

interface Proprietes {
  readonly mesures: Mesures | null;
  /** Slug de la viz — sert au bench à retrouver sa barre dans la page. */
  readonly slug?: string;
}

/**
 * L'ÉLÉMENT SIGNATURE DE LA PLANCHE (ADR 0009).
 *
 * Une barre de 3 px sous chaque viz : la part du budget d'image que le
 * JavaScript consomme réellement. Elle rend visible, sans une phrase, la leçon
 * que le banc d'essai formulait en paragraphes — une viz GPU-bound affiche une
 * barre presque VIDE tout en tournant lentement, parce que son coût n'est pas
 * du JavaScript mais du remplissage de pixels.
 *
 * Sans mesure, la barre reste vide et grise : elle ne devine pas.
 */
export function FiletCout({ mesures, slug }: Proprietes) {
  if (!mesures) {
    return <div className="cout" data-viz={slug} aria-hidden />;
  }

  const part = Math.min(1, mesures.jsP95Ms / BUDGET_IMAGE_MS);
  const charge = mesures.gpuBound ? "limitée par le GPU" : "limitée par le JavaScript";
  const resume = `${mesures.cadenceFps} images par seconde, ${mesures.jsP95Ms} ms de JavaScript au 95e centile sur un budget de 16.7 ms, ${charge}`;

  return (
    <div
      className={mesures.gpuBound ? "cout cout--gpu" : "cout"}
      role="img"
      aria-label={resume}
      title={resume}
      // Lus par `scripts/bench.ts` : le bench relève EXACTEMENT ce que
      // l'instrument affiche à l'écran, plutôt que de mesurer par un second
      // chemin qui pourrait diverger.
      data-viz={slug}
      data-fps={mesures.cadenceFps}
      data-js-median={mesures.jsMedianMs}
      data-js-p95={mesures.jsP95Ms}
      data-gpu-bound={String(mesures.gpuBound)}
      data-echantillons={mesures.echantillons}
    >
      <span className="cout__js" style={{ width: `${(part * 100).toFixed(1)}%` }} />
    </div>
  );
}
