import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireChoix, lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

import {
  FUSIONS,
  GRAIN,
  reflet,
  STYLES,
  texture,
  type Fusion,
  type Style,
} from "./algo/iridescence.ts";

/**
 * CARTE IRIDESCENTE — réécriture libre (ADR 0010, régime « technique »),
 * second `composant` du catalogue (plan §3.6).
 *
 * L'EFFET, pas l'illustration : la source habillait une carte à jouer
 * (« Ace of Auras ») ; ici la surface est nue, et le reflet iridescent couvre
 * tout le champ — comme le préréglage clair de la source. Une pile de couches
 * DOM : fond vignetté, reflet iridescent fondu, tache spéculaire sous le
 * pointeur, grain, arête lumineuse ; et sous la carte, un halo flou dont la
 * teinte suit celle du reflet. La carte s'incline en 3D vers le pointeur.
 *
 * TOUT LE MOUVEMENT PASSE PAR `frame()` : le pointeur y est lissé, l'angle du
 * reflet y dérive au repos, les styles y sont posés. La source lissait par
 * `transition` CSS et ne bougeait pas au repos — l'instrument n'aurait rien eu
 * à mesurer. Tactile (ADR 0018) : une pression fait office de survol.
 */
const DEFAUTS = {
  inclinaison: 16,
  perspective: 1100,
  relief: 28,
  zoom: 3,
  iridescence: 80,
  style: "conique",
  chroma: 0.2,
  fusion: "overlay",
  vitesse: 220,
  derive: 12,
  reflet: 50,
  tailleReflet: 45,
  grain: 14,
  halo: 55,
  flouHalo: 60,
  fond: "#1b1815",
} as const;

interface Reglees {
  readonly inclinaison: number;
  readonly perspective: number;
  readonly relief: number;
  readonly zoom: number;
  readonly iridescence: number;
  readonly style: Style;
  readonly chroma: number;
  readonly fusion: Fusion;
  readonly vitesse: number;
  readonly derive: number;
  readonly reflet: number;
  readonly tailleReflet: number;
  readonly grain: number;
  readonly halo: number;
  readonly flouHalo: number;
  readonly fond: string;
}

function lireReglees(r: Reglages): Reglees {
  const nombre = (cle: keyof typeof DEFAUTS & string, defaut: number) => lireNombre(r, cle, defaut);
  return {
    inclinaison: nombre("inclinaison", DEFAUTS.inclinaison),
    perspective: nombre("perspective", DEFAUTS.perspective),
    relief: nombre("relief", DEFAUTS.relief),
    zoom: nombre("zoom", DEFAUTS.zoom),
    iridescence: nombre("iridescence", DEFAUTS.iridescence),
    style: lireChoix(r, "style", STYLES, DEFAUTS.style),
    chroma: nombre("chroma", DEFAUTS.chroma),
    fusion: lireChoix(r, "fusion", FUSIONS, DEFAUTS.fusion),
    vitesse: nombre("vitesse", DEFAUTS.vitesse),
    derive: nombre("derive", DEFAUTS.derive),
    reflet: nombre("reflet", DEFAUTS.reflet),
    tailleReflet: nombre("tailleReflet", DEFAUTS.tailleReflet),
    grain: nombre("grain", DEFAUTS.grain),
    halo: nombre("halo", DEFAUTS.halo),
    flouHalo: nombre("flouHalo", DEFAUTS.flouHalo),
    fond: lireCouleur(r, "fond", DEFAUTS.fond),
  };
}

const COUCHES = ["base", "iri", "spec", "grain", "arete"] as const;
type Couche = (typeof COUCHES)[number];

interface Pile {
  readonly scene: HTMLDivElement;
  readonly halo: HTMLDivElement;
  readonly carte: HTMLDivElement;
  readonly couches: Record<Couche, HTMLDivElement>;
}

function poser(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(element.style, styles);
}

/** La pile DOM, une fois ; tout ce qui bouge est posé par `habiller` et `frame`. */
function construire(hote: HTMLElement): Pile {
  const scene = document.createElement("div");
  poser(scene, {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    touchAction: "none",
    cursor: "pointer",
  });
  const halo = document.createElement("div");
  // Même boîte que la carte, centrée par translation : un `inset` négatif
  // l'ancrerait en haut à gauche dès qu'une hauteur est posée.
  poser(halo, {
    position: "absolute",
    left: "50%",
    top: "50%",
    aspectRatio: "2 / 3",
    height: "62%",
    borderRadius: "8%",
    pointerEvents: "none",
  });
  const carte = document.createElement("div");
  poser(carte, {
    position: "relative",
    aspectRatio: "2 / 3",
    height: "62%",
    borderRadius: "4%",
    overflow: "hidden",
    transformStyle: "preserve-3d",
    boxShadow: "0 30px 60px -20px oklch(0% 0 0 / 0.7)",
    willChange: "transform",
  });
  const couches = Object.fromEntries(
    COUCHES.map((nom) => {
      const couche = document.createElement("div");
      poser(couche, { position: "absolute", inset: "0", pointerEvents: "none" });
      carte.append(couche);
      return [nom, couche];
    }),
  ) as Record<Couche, HTMLDivElement>;
  scene.append(halo, carte);
  hote.append(scene);
  return { scene, halo, carte, couches };
}

/** Styles qui ne dépendent que des réglages. */
function habiller({ scene, halo, carte, couches }: Pile, r: Reglees) {
  scene.style.perspective = `${r.perspective}px`;
  poser(halo, {
    transform: `translate(-50%, -50%) scale(${1 + r.flouHalo / 150})`,
    filter: `blur(${r.flouHalo}px)`,
    opacity: `${r.halo / 100}`,
    background: texture("conique", 0, r.chroma * 1.4),
  });
  carte.style.background = r.fond;
  couches.base.style.background = `radial-gradient(120% 90% at 30% 15%, color-mix(in oklab, ${r.fond}, white 6%) 0%, ${r.fond} 60%, color-mix(in oklab, ${r.fond}, black 60%) 100%)`;
  poser(couches.iri, { mixBlendMode: r.fusion, opacity: `${r.iridescence / 100}` });
  poser(couches.spec, { mixBlendMode: "overlay", opacity: `${r.reflet / 100}` });
  poser(couches.grain, {
    backgroundImage: GRAIN,
    mixBlendMode: "overlay",
    opacity: `${r.grain / 100}`,
  });
  couches.arete.style.background =
    "linear-gradient(180deg, oklch(100% 0 0 / 0.18), oklch(100% 0 0 / 0) 12%), linear-gradient(0deg, oklch(0% 0 0 / 0.35), oklch(0% 0 0 / 0) 18%)";
}

export const monterCarteIridescente: MonterViz = (hote, _dimensions, reglages) => {
  const pile = construire(hote);
  let r = lireReglees(reglages);
  habiller(pile, r);

  const cible = { x: 0.5, y: 0.5, survol: 0 };
  const courant = { x: 0.5, y: 0.5, survol: 0 };
  let derive = 0;

  const surPointeur = (evenement: PointerEvent) => {
    const rect = pile.scene.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    cible.x = Math.min(1, Math.max(0, (evenement.clientX - rect.left) / rect.width));
    cible.y = Math.min(1, Math.max(0, (evenement.clientY - rect.top) / rect.height));
    cible.survol = 1;
  };
  const surSortie = () => {
    cible.x = 0.5;
    cible.y = 0.5;
    cible.survol = 0;
  };
  pile.scene.addEventListener("pointermove", surPointeur);
  pile.scene.addEventListener("pointerdown", surPointeur);
  pile.scene.addEventListener("pointerleave", surSortie);
  pile.scene.addEventListener("pointercancel", surSortie);

  return {
    frame(_temps, delta) {
      const lissage = 1 - Math.exp(-delta * 8);
      courant.x += (cible.x - courant.x) * lissage;
      courant.y += (cible.y - courant.y) * lissage;
      courant.survol += (cible.survol - courant.survol) * lissage;
      // Au repos, le reflet dérive lentement : le mouvement que l'instrument mesure.
      derive = (derive + delta * r.derive) % 360;
      const { x, y, survol } = courant;
      const rx = (0.5 - y) * r.inclinaison * survol;
      const ry = (x - 0.5) * r.inclinaison * survol;
      const echelle = 1 + (r.zoom / 100) * survol;
      pile.carte.style.transform = `translateZ(${r.relief * survol}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${echelle})`;
      const angle = (derive + x * r.vitesse + y * r.vitesse * 0.5) % 360;
      pile.couches.iri.style.background = texture(r.style, angle, r.chroma);
      pile.couches.spec.style.background = reflet(x, y, r.tailleReflet);
      pile.halo.style.filter = `blur(${r.flouHalo}px) hue-rotate(${(angle * 1.5) % 360}deg)`;
    },
    regler(suivants) {
      r = lireReglees(suivants);
      habiller(pile, r);
    },
    demonter() {
      pile.scene.removeEventListener("pointermove", surPointeur);
      pile.scene.removeEventListener("pointerdown", surPointeur);
      pile.scene.removeEventListener("pointerleave", surSortie);
      pile.scene.removeEventListener("pointercancel", surSortie);
      pile.scene.remove();
    },
  };
};
