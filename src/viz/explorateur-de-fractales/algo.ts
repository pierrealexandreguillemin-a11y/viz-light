import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { hexVersRgb, lireChoix, lireCouleur, lireNombre } from "@/core/viz/reglages.ts";
import { creerToile } from "@/core/viz/toile.ts";

import {
  CONSTANTES_JULIA,
  deplacer,
  FAMILLES,
  NOMS_CONSTANTES_JULIA,
  NOMS_FAMILLES,
  pixelVersPlan,
  zoomer,
  type NomFamille,
  type Vue,
} from "./algo/fractales.ts";
import { ecouterGestes } from "./algo/interaction.ts";
import { construireLut, NOMS_PALETTES } from "./algo/palettes.ts";
import { creerRenduProgressif, type Apparence } from "./algo/rendu.ts";

/**
 * EXPLORATEUR DE FRACTALES — réécriture libre (ADR 0010, régime « technique »),
 * composée de deux sources : les sept familles de `fractal-explorer.html` et le
 * lissage + les palettes de `mandelbrot-domain/` (plan §3.3).
 *
 * Première viz `interactif` du catalogue (ADR 0012) : on ne la regarde pas, on
 * la MANIPULE. Le centre, l'échelle et l'état du glissé sont de l'état de la
 * viz, pas des réglages du manifest ; changer de famille remet la vue à celle
 * de la famille — c'est l'exception « graine » de l'exigence n°1, un
 * changement qui redistribue tout.
 */
const DEFAUTS = {
  famille: "mandelbrot",
  iterations: 256,
  palette: "classique",
  cycle: 256,
  constanteJulia: "dendrite",
  interieur: "#000000",
  defilement: 0.15,
} as const;

/**
 * Au-delà de ce délai sans image du socle, la viz n'est pas la scène élue
 * (ADR 0011) : elle finit alors son image elle-même, à petits pas. Un
 * explorateur qui resterait grossier là où on vient de le toucher serait
 * cassé, pas économe — et l'affinage est FINI, pas une animation perpétuelle.
 */
const SILENCE_DU_SOCLE_MS = 100;

function lireApparence(r: Reglages, precedente?: Apparence): Apparence {
  const nomPalette = lireChoix(r, "palette", NOMS_PALETTES, DEFAUTS.palette);
  const [juliaRe, juliaIm] =
    CONSTANTES_JULIA[lireChoix(r, "constanteJulia", NOMS_CONSTANTES_JULIA, DEFAUTS.constanteJulia)];
  const [ri, gi, bi] = hexVersRgb(lireCouleur(r, "interieur", DEFAUTS.interieur));
  return {
    famille: FAMILLES[lireChoix(r, "famille", NOMS_FAMILLES, DEFAUTS.famille)],
    maxIter: Math.round(lireNombre(r, "iterations", DEFAUTS.iterations)),
    juliaRe,
    juliaIm,
    lut:
      precedente?.lut && precedente.nomPalette === nomPalette
        ? precedente.lut
        : construireLut(nomPalette),
    nomPalette,
    cycle: Math.max(1, lireNombre(r, "cycle", DEFAUTS.cycle)),
    interieur: [ri * 255, gi * 255, bi * 255],
  };
}

export const monterExplorateurDeFractales: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const rendu = creerRenduProgressif(toile);
  let nomFamille: NomFamille = lireChoix(reglages, "famille", NOMS_FAMILLES, DEFAUTS.famille);
  let apparence = lireApparence(reglages);
  let vue: Vue = FAMILLES[nomFamille].vue;
  let defilement = lireNombre(reglages, "defilement", DEFAUTS.defilement);
  let decalageCouleur = 0;
  let derniereImageDuSocle = Number.NEGATIVE_INFINITY;
  let reveilPrevu = false;
  let demonte = false;

  const avancer = (delta: number) => {
    // `defilement` en tours de palette par seconde ; le décalage reste dans [0, 1).
    decalageCouleur = (decalageCouleur + delta * defilement) % 1;
    rendu.avancer(vue, apparence, decalageCouleur);
  };

  /** Affinage autonome, seulement quand le socle n'anime pas cette scène. */
  const reveiller = () => {
    if (reveilPrevu) return;
    reveilPrevu = true;
    requestAnimationFrame((maintenant) => {
      reveilPrevu = false;
      if (demonte || rendu.termine || maintenant - derniereImageDuSocle < SILENCE_DU_SOCLE_MS)
        return;
      avancer(0);
      reveiller();
    });
  };

  const changerVue = (suivante: Vue) => {
    vue = suivante;
    rendu.relancer();
    reveiller();
  };

  const detacherGestes = ecouterGestes(hote, {
    deplacer(fractionX, fractionY) {
      changerVue(deplacer(vue, fractionX, fractionY, toile.largeur / toile.hauteur));
    },
    zoomer(facteur, fractionX, fractionY) {
      const { largeur, hauteur } = toile;
      const [re, im] = pixelVersPlan(
        fractionX * largeur,
        fractionY * hauteur,
        largeur,
        hauteur,
        vue,
      );
      changerVue(zoomer(vue, facteur, re, im));
    },
  });

  // Première image grossière par le socle (`frame(0, 0)`), affinage ensuite.
  reveiller();

  return {
    frame(_temps, delta) {
      // Seule une image de BOUCLE (delta > 0) prouve que le socle anime cette
      // scène ; ses repeints figés (`frame(0, 0)`) ne doivent pas faire taire
      // l'affinage autonome, sinon une scène non élue resterait grossière.
      if (delta > 0) derniereImageDuSocle = performance.now();
      avancer(delta);
    },
    regler(suivants) {
      const famille = lireChoix(suivants, "famille", NOMS_FAMILLES, DEFAUTS.famille);
      if (famille !== nomFamille) {
        nomFamille = famille;
        vue = FAMILLES[famille].vue;
      }
      apparence = lireApparence(suivants, apparence);
      defilement = lireNombre(suivants, "defilement", DEFAUTS.defilement);
      rendu.relancer();
      reveiller();
    },
    redimensionner(suivantes) {
      toile.redimensionner(suivantes);
      rendu.redimensionner();
      reveiller();
    },
    demonter() {
      demonte = true;
      detacherGestes();
      toile.demonter();
    },
  };
};
