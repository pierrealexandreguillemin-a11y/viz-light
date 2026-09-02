import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

import { ESPACE, tracerBoucle } from "./algo/trace.ts";

/**
 * HALO DE TRACÉ — réécriture libre (ADR 0010, régime « technique »), premier
 * `dom-css` du lot Easter_eggs (plan §3.4).
 *
 * La technique de la source : un même `<path>` empilé cinq fois — deux halos
 * flous, l'asphalte, le trait, puis une comète faite d'un `stroke-dasharray`
 * dont on fait glisser le `stroke-dashoffset`. La source la faisait glisser en
 * `@keyframes` : `frame()` n'aurait rien fait, et l'instrument aurait mesuré
 * du vide avec des chiffres parfaitement crédibles. Ici l'AVANCE EST POSÉE PAR
 * `frame()`, à chaque image — mettre la viz en pause arrête la comète.
 */
const SVG = "http://www.w3.org/2000/svg";

const DEFAUTS = {
  graine: 7,
  vitesse: 0.17,
  cometes: 1,
  longueurComete: 3,
  largeur: 1,
  halo: 1,
  couleurTrace: "#d2ff00",
  couleurComete: "#ffffff",
  couleurAsphalte: "#1a1a1a",
} as const;

interface Reglees {
  readonly graine: number;
  readonly vitesse: number;
  readonly cometes: number;
  readonly longueurComete: number;
  readonly largeur: number;
  readonly halo: number;
  readonly couleurTrace: string;
  readonly couleurComete: string;
  readonly couleurAsphalte: string;
}

function lireReglees(r: Reglages): Reglees {
  return {
    graine: Math.round(lireNombre(r, "graine", DEFAUTS.graine)),
    vitesse: lireNombre(r, "vitesse", DEFAUTS.vitesse),
    cometes: Math.max(1, Math.round(lireNombre(r, "cometes", DEFAUTS.cometes))),
    longueurComete: lireNombre(r, "longueurComete", DEFAUTS.longueurComete),
    largeur: lireNombre(r, "largeur", DEFAUTS.largeur),
    halo: lireNombre(r, "halo", DEFAUTS.halo),
    couleurTrace: lireCouleur(r, "couleurTrace", DEFAUTS.couleurTrace),
    couleurComete: lireCouleur(r, "couleurComete", DEFAUTS.couleurComete),
    couleurAsphalte: lireCouleur(r, "couleurAsphalte", DEFAUTS.couleurAsphalte),
  };
}

/** Les cinq couches, de la plus floue à la comète, dans l'ordre d'empilement. */
const COUCHES = ["haloLarge", "haloSerre", "asphalte", "trait", "comete"] as const;
type Couche = (typeof COUCHES)[number];

function creerChemin(): SVGPathElement {
  const chemin = document.createElementNS(SVG, "path");
  chemin.setAttribute("fill", "none");
  chemin.setAttribute("stroke-linecap", "round");
  chemin.setAttribute("stroke-linejoin", "round");
  return chemin;
}

/** Styles STATIQUES des couches — tout ce qui ne dépend pas du temps. */
function habiller(chemins: Record<Couche, SVGPathElement>, r: Reglees, longueur: number) {
  const echelle = ESPACE / 343;
  const poser = (
    couche: Couche,
    couleur: string,
    largeur: number,
    opacite: number,
    filtre: string,
  ) => {
    const chemin = chemins[couche];
    chemin.setAttribute("stroke", couleur);
    chemin.setAttribute("stroke-width", `${largeur * r.largeur * echelle}`);
    chemin.setAttribute("opacity", `${opacite}`);
    chemin.style.filter = filtre;
  };
  const flou = (px: number) => `blur(${px * r.halo * echelle}px)`;
  poser("haloLarge", r.couleurTrace, 8, Math.min(1, 0.4 * r.halo), flou(12));
  poser("haloSerre", r.couleurTrace, 5, Math.min(1, 0.6 * r.halo), flou(5));
  poser("asphalte", r.couleurAsphalte, 6, 1, "none");
  poser("trait", r.couleurTrace, 2, 1, "none");
  const ombre = (px: number) => `drop-shadow(0 0 ${px * r.halo * echelle}px ${r.couleurTrace})`;
  poser("comete", r.couleurComete, 4, 1, `${ombre(6)} ${ombre(12)}`);
  const tiret = (longueur * r.longueurComete) / 100;
  chemins.comete.setAttribute("stroke-dasharray", `${tiret} ${longueur / r.cometes - tiret}`);
}

export const monterHaloDeTrace: MonterViz = (hote, _dimensions, reglages) => {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${ESPACE} ${ESPACE}`);
  svg.style.display = "block";
  svg.style.width = "100%";
  svg.style.height = "100%";
  hote.append(svg);
  const chemins = Object.fromEntries(
    COUCHES.map((couche) => {
      const chemin = creerChemin();
      svg.append(chemin);
      return [couche, chemin];
    }),
  ) as Record<Couche, SVGPathElement>;

  let r = lireReglees(reglages);
  let longueur = 0;
  let avance = 0;

  const tracer = () => {
    const d = tracerBoucle(r.graine);
    for (const chemin of Object.values(chemins)) chemin.setAttribute("d", d);
    // jsdom ne mesure pas les tracés : une longueur nulle laisse la comète immobile, sans erreur.
    longueur =
      typeof chemins.trait.getTotalLength === "function" ? chemins.trait.getTotalLength() : 0;
    habiller(chemins, r, longueur);
  };
  tracer();

  return {
    frame(_temps, delta) {
      // L'avance est en fraction de tour ; le sens négatif fait courir la comète dans le sens du tracé.
      avance = (avance + delta * r.vitesse) % 1;
      chemins.comete.setAttribute("stroke-dashoffset", `${-avance * longueur}`);
    },
    regler(suivants) {
      // Une nouvelle graine redistribue le tracé (l'exception de l'exigence n°1) ;
      // tout autre réglage se réapplique sans toucher à l'avance de la comète.
      const avant = r;
      r = lireReglees(suivants);
      if (r.graine !== avant.graine) tracer();
      else habiller(chemins, r, longueur);
    },
    demonter() {
      svg.remove();
    },
  };
};
