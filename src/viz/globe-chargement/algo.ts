import type { Dimensions, MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";
import { creerToile, type Toile } from "@/core/viz/toile.ts";

import { cellulesDeTerre, type Cellule } from "./algo/terres.ts";

/**
 * GLOBE DE CHARGEMENT — réécriture libre (ADR 0010, régime « technique »),
 * premier `composant` du catalogue (ADR 0012, plan §3.5).
 *
 * La source mêlait des anneaux SVG en `@keyframes` et un canvas d3-geo nourri
 * par le réseau : la moitié du mouvement échappait à toute mesure. Ici TOUT est
 * dessiné dans `frame()`, sur une seule toile : les anneaux tournent par
 * `ctx.rotate`, le globe par une rotation de longitude, et les continents sont
 * des points projetés un à un (`algo/terres.ts`) — pas de bibliothèque, pas de
 * requête. Le fond reste transparent : un composant se pose sur la page de
 * l'hôte, il n'apporte pas son décor.
 */
const DEFAUTS = {
  vitesse: 0.11,
  inclinaison: -18,
  anneaux: 3,
  epaisseur: 1,
  taille: 0.4,
  pas: 2,
  disque: true,
  encre: "#ece8df",
} as const;

/** Les trois anneaux de la source : rayon (pour 100), largeur, opacité, période (s), sens, tirets. */
const ANNEAUX = [
  { rayon: 0.94, largeur: 2, opacite: 0.9, periode: 2.2, sens: 1, tirets: [2, 22, 50, 14, 8, 60] },
  {
    rayon: 0.88,
    largeur: 1.2,
    opacite: 0.55,
    periode: 3.4,
    sens: -1,
    tirets: [40, 30, 12, 80, 6, 40],
  },
  { rayon: 0.98, largeur: 1.4, opacite: 0.7, periode: 5.5, sens: 1, tirets: [1, 7, 1, 7, 90, 30] },
] as const;

/** Trois profondeurs : les points près du bord s'estompent, comme une sphère mate. */
const PROFONDEURS = [0.3, 0.65, 1] as const;

interface Reglees {
  readonly vitesse: number;
  readonly inclinaison: number;
  readonly anneaux: number;
  readonly epaisseur: number;
  readonly taille: number;
  readonly pas: number;
  readonly disque: boolean;
  readonly encre: string;
}

function lireReglees(r: Reglages): Reglees {
  return {
    vitesse: lireNombre(r, "vitesse", DEFAUTS.vitesse),
    inclinaison: (lireNombre(r, "inclinaison", DEFAUTS.inclinaison) * Math.PI) / 180,
    anneaux: Math.round(lireNombre(r, "anneaux", DEFAUTS.anneaux)),
    epaisseur: lireNombre(r, "epaisseur", DEFAUTS.epaisseur),
    taille: lireNombre(r, "taille", DEFAUTS.taille),
    pas: Math.max(1, Math.round(lireNombre(r, "pas", DEFAUTS.pas))),
    disque: lireInterrupteur(r, "disque", DEFAUTS.disque),
    encre: lireCouleur(r, "encre", DEFAUTS.encre),
  };
}

function dessinerAnneaux(ctx: CanvasRenderingContext2D, rayon: number, temps: number, r: Reglees) {
  ctx.lineCap = "round";
  ctx.strokeStyle = r.encre;
  for (const anneau of ANNEAUX.slice(0, r.anneaux)) {
    ctx.save();
    ctx.rotate(((anneau.sens * temps) / anneau.periode) * Math.PI * 2);
    ctx.globalAlpha = anneau.opacite;
    ctx.lineWidth = anneau.largeur * r.epaisseur * (rayon / 100);
    ctx.setLineDash(anneau.tirets.map((t) => (t * rayon) / 100));
    ctx.beginPath();
    ctx.arc(0, 0, anneau.rayon * rayon, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Projection orthographique : longitude tournée de `lambda`, puis bascule
 * d'`inclinaison` autour de l'axe horizontal. Un point est visible si sa
 * profondeur est positive ; elle sert aussi à l'estomper vers le bord.
 */
function dessinerTerres(
  ctx: CanvasRenderingContext2D,
  cellules: readonly Cellule[],
  rayon: number,
  lambda: number,
  r: Reglees,
) {
  const cosInc = Math.cos(r.inclinaison);
  const sinInc = Math.sin(r.inclinaison);
  const taillePoint = (rayon * r.pas * 0.42) / 90;
  const chemins = PROFONDEURS.map(() => new Path2D());
  for (const { lon, lat } of cellules) {
    const cosLat = Math.cos(lat);
    const x = cosLat * Math.sin(lon + lambda);
    const y = Math.sin(lat);
    const z = cosLat * Math.cos(lon + lambda);
    const yIncline = y * cosInc - z * sinInc;
    const profondeur = y * sinInc + z * cosInc;
    if (profondeur <= 0) continue;
    const seau = profondeur < PROFONDEURS[0] ? 0 : profondeur < PROFONDEURS[1] ? 1 : 2;
    const chemin = chemins[seau];
    chemin?.moveTo(x * rayon + taillePoint, -yIncline * rayon);
    chemin?.arc(x * rayon, -yIncline * rayon, taillePoint, 0, Math.PI * 2);
  }
  ctx.fillStyle = r.encre;
  chemins.forEach((chemin, i) => {
    ctx.globalAlpha = PROFONDEURS[i] ?? 1;
    ctx.fill(chemin);
  });
}

function dessiner(
  toile: Toile,
  cellules: readonly Cellule[],
  temps: number,
  lambda: number,
  r: Reglees,
) {
  const { ctx, largeur, hauteur } = toile;
  const rayon = (Math.min(largeur, hauteur) / 2) * r.taille;
  ctx.clearRect(0, 0, largeur, hauteur);
  ctx.save();
  ctx.translate(largeur / 2, hauteur / 2);
  if (r.disque) {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = r.encre;
    ctx.beginPath();
    ctx.arc(0, 0, rayon * 0.82, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = r.encre;
  ctx.lineWidth = 1.2 * r.epaisseur * (rayon / 100);
  ctx.beginPath();
  ctx.arc(0, 0, rayon * 0.82, 0, Math.PI * 2);
  ctx.stroke();
  dessinerTerres(ctx, cellules, rayon * 0.82, lambda, r);
  ctx.globalAlpha = 1;
  dessinerAnneaux(ctx, rayon, temps, r);
  ctx.restore();
}

export const monterGlobeChargement: MonterViz = (hote, dimensions, reglages) => {
  const toile = creerToile(hote, dimensions);
  let r = lireReglees(reglages);
  let cellules = cellulesDeTerre(r.pas);
  let lambda = 0;
  let temps = 0;
  return {
    frame(_temps, delta) {
      temps += delta;
      lambda = (lambda + delta * r.vitesse * Math.PI * 2) % (Math.PI * 2);
      dessiner(toile, cellules, temps, lambda, r);
    },
    regler(suivants) {
      const avant = r;
      r = lireReglees(suivants);
      if (r.pas !== avant.pas) cellules = cellulesDeTerre(r.pas);
    },
    redimensionner(suivantes: Dimensions) {
      toile.redimensionner(suivantes);
    },
    demonter() {
      toile.demonter();
    },
  };
};
