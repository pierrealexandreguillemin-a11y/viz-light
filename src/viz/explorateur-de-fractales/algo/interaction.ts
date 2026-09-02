/**
 * L'INTERACTION — DOM brut, aucun React.
 *
 * Une surface qu'on MANIPULE (catégorie `interactif`, ADR 0012) : glisser
 * déplace, la molette zoome vers le curseur, deux doigts pincent, un
 * double-clic (ou double-tap) rapproche d'un cran. Tout est exprimé en
 * FRACTIONS du cadre, pour que l'algorithme ne connaisse jamais un pixel CSS.
 *
 * `touch-action: none` sur l'hôte, comme le socle WebGL (ADR 0018) : un doigt
 * sur la fractale la pilote au lieu de faire défiler la page — on défile par
 * les zones autour. La molette est capturée pour la même raison.
 */
export interface Gestes {
  /** Déplacement, en fraction du cadre (positif = vers la droite / le bas). */
  deplacer(fractionX: number, fractionY: number): void;
  /** Zoom d'un facteur (< 1 = rapprocher) vers un point du cadre, en fractions. */
  zoomer(facteur: number, fractionX: number, fractionY: number): void;
}

/** Un cran de molette ou de double-clic : ±15 %, le pas de la source. */
const CRAN_MOLETTE = 1.15;
const CRAN_DOUBLE_CLIC = 0.5;

interface Doigt {
  x: number;
  y: number;
}

function ecouterPointeurs(hote: HTMLElement, gestes: Gestes) {
  const doigts = new Map<number, Doigt>();
  const fraction = (evenement: PointerEvent): Doigt => {
    const rect = hote.getBoundingClientRect();
    return {
      x: (evenement.clientX - rect.left) / Math.max(1, rect.width),
      y: (evenement.clientY - rect.top) / Math.max(1, rect.height),
    };
  };
  const ecart = () => {
    const [a, b] = [...doigts.values()];
    return a && b ? Math.hypot(b.x - a.x, b.y - a.y) : 0;
  };

  const surBas = (evenement: PointerEvent) => {
    hote.setPointerCapture(evenement.pointerId);
    doigts.set(evenement.pointerId, fraction(evenement));
  };
  const surMouvement = (evenement: PointerEvent) => {
    const avant = doigts.get(evenement.pointerId);
    if (!avant) return;
    const ecartAvant = ecart();
    const apres = fraction(evenement);
    doigts.set(evenement.pointerId, apres);
    if (doigts.size === 1) {
      gestes.deplacer(apres.x - avant.x, apres.y - avant.y);
      return;
    }
    // Pincement : le zoom suit le rapport des écarts, centré entre les doigts.
    const ecartApres = ecart();
    if (ecartAvant > 0 && ecartApres > 0) {
      const [a, b] = [...doigts.values()];
      if (a && b) gestes.zoomer(ecartAvant / ecartApres, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
  };
  const surFin = (evenement: PointerEvent) => {
    doigts.delete(evenement.pointerId);
  };

  hote.addEventListener("pointerdown", surBas);
  hote.addEventListener("pointermove", surMouvement);
  hote.addEventListener("pointerup", surFin);
  hote.addEventListener("pointercancel", surFin);
  return () => {
    hote.removeEventListener("pointerdown", surBas);
    hote.removeEventListener("pointermove", surMouvement);
    hote.removeEventListener("pointerup", surFin);
    hote.removeEventListener("pointercancel", surFin);
  };
}

export function ecouterGestes(hote: HTMLElement, gestes: Gestes): () => void {
  const fraction = (evenement: MouseEvent) => {
    const rect = hote.getBoundingClientRect();
    return [
      (evenement.clientX - rect.left) / Math.max(1, rect.width),
      (evenement.clientY - rect.top) / Math.max(1, rect.height),
    ] as const;
  };
  const surMolette = (evenement: WheelEvent) => {
    evenement.preventDefault();
    const [x, y] = fraction(evenement);
    gestes.zoomer(evenement.deltaY > 0 ? CRAN_MOLETTE : 1 / CRAN_MOLETTE, x, y);
  };
  const surDoubleClic = (evenement: MouseEvent) => {
    const [x, y] = fraction(evenement);
    gestes.zoomer(CRAN_DOUBLE_CLIC, x, y);
  };

  hote.style.touchAction = "none";
  hote.style.cursor = "grab";
  hote.addEventListener("wheel", surMolette, { passive: false });
  hote.addEventListener("dblclick", surDoubleClic);
  const detacherPointeurs = ecouterPointeurs(hote, gestes);
  return () => {
    hote.style.touchAction = "";
    hote.style.cursor = "";
    hote.removeEventListener("wheel", surMolette);
    hote.removeEventListener("dblclick", surDoubleClic);
    detacherPointeurs();
  };
}
