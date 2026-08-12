import type { MonterViz } from "@/core/viz/contrat.ts";
import { graineChangee, lireCouleur, lireNombre } from "@/core/viz/reglages.ts";
import { creerAleatoire, creerToile } from "@/core/viz/toile.ts";

/**
 * ORBIT PARTICLES — Atelier génératif, portage fidèle (ADR 0010, « œuvre »).
 *
 * Quelques centres tirés au hasard, et autour de chacun des dizaines de corps
 * qui tournent à des rayons et des vitesses différents — certains dans un sens,
 * certains dans l'autre (`angularSpeed * (aléa > 0.5 ? 1 : -1)`). Les anneaux se
 * recouvrent, et c'est la traînée (le fond repeint en semi-transparence) qui
 * transforme des points en cercles.
 *
 * La graine est un réglage : l'Atelier avait un bouton « Nouvelle seed », et le
 * perdre serait perdre l'œuvre — chaque graine donne une composition.
 */
interface Centre {
  readonly x: number;
  readonly y: number;
}

interface Corps {
  readonly centre: number;
  readonly rayon: number;
  readonly vitesseAngulaire: number;
  angle: number;
}

const DIAMETRE = 2.5;

export const monterOrbitParticles: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  const { ctx } = toile;
  let r = reglages;
  let centres: Centre[] = [];
  let corps: Corps[] = [];

  function semer(): void {
    const alea = creerAleatoire(Math.round(lireNombre(r, "graine", 2026)));
    const intervalle = (min: number, max: number) => min + alea() * (max - min);
    const nombreCentres = Math.round(lireNombre(r, "centers", 3));
    const parCentre = Math.round(lireNombre(r, "orbiters", 40));
    const { largeur, hauteur } = toile;

    centres = Array.from({ length: nombreCentres }, () => ({
      x: intervalle(largeur * 0.2, largeur * 0.8),
      y: intervalle(hauteur * 0.2, hauteur * 0.8),
    }));
    corps = [];
    for (let c = 0; c < nombreCentres; c++) {
      for (let o = 0; o < parCentre; o++) {
        corps.push({
          centre: c,
          rayon: intervalle(20, Math.min(largeur, hauteur) * 0.35),
          angle: intervalle(0, Math.PI * 2),
          vitesseAngulaire: intervalle(0.002, 0.02) * (alea() > 0.5 ? 1 : -1),
        });
      }
    }
    ctx.fillStyle = lireCouleur(r, "background", "#10141a");
    ctx.fillRect(0, 0, largeur, hauteur);
  }
  semer();

  return {
    frame() {
      const vitesse = lireNombre(r, "speed", 1);
      const fond = lireCouleur(r, "background", "#10141a");

      ctx.globalAlpha = lireNombre(r, "trail", 0.15);
      ctx.fillStyle = fond;
      ctx.fillRect(0, 0, toile.largeur, toile.hauteur);
      ctx.globalAlpha = 1;

      ctx.fillStyle = lireCouleur(r, "orbiter", "#6fe7c8");
      ctx.beginPath();
      for (const c of corps) {
        const centre = centres[c.centre];
        if (!centre) continue;
        c.angle += c.vitesseAngulaire * vitesse;
        const x = centre.x + Math.cos(c.angle) * c.rayon;
        const y = centre.y + Math.sin(c.angle) * c.rayon;
        ctx.moveTo(x + DIAMETRE / 2, y);
        ctx.arc(x, y, DIAMETRE / 2, 0, Math.PI * 2);
      }
      ctx.fill();
    },
    regler(suivants) {
      // Vitesse, traînée et couleurs s'appliquent sans remonter ; changer la
      // graine ou le nombre de corps redistribue forcément la composition.
      const redistribuer =
        graineChangee(r, suivants) ||
        lireNombre(suivants, "centers", 3) !== lireNombre(r, "centers", 3) ||
        lireNombre(suivants, "orbiters", 40) !== lireNombre(r, "orbiters", 40);
      r = suivants;
      if (redistribuer) semer();
    },
    redimensionner(suivantes) {
      toile.redimensionner(suivantes);
      semer();
    },
    demonter: () => toile.demonter(),
  };
};
