import type { Dimensions, InstanceViz, MonterViz, Reglages } from "./contrat.ts";
import { creerToile } from "./toile.ts";

/**
 * LE MOTEUR COMMUN DES SKETCHES #つぶやきProcessing.
 *
 * TypeScript PUR : aucun import React, aucune dépendance. Les formules
 * d'origine n'appellent que `cos`, `sin`, `tan`, `atan2` et `mag` de p5 — que
 * `Math` fournit déjà. Porter en canvas2d retire donc p5 du bundle sans changer
 * une opération.
 *
 * POURQUOI UN MOTEUR PARTAGÉ. Dix-neuf sketches diffèrent par UNE fonction : la
 * position d'un point. Tout le reste — traînée par fondu, teinte HSB dérivée de
 * la géométrie, regroupement des teintes, rotation souris, homothétie vers
 * l'hôte — est identique. Le recopier dix-neuf fois serait la duplication que
 * `jscpd` interdit, et surtout dix-neuf endroits où corriger un défaut.
 *
 * C'est aussi ce qui exécute « aligner les sketches sur le Tunnel de points »
 * (ADR 0008) : le raffinement du Tunnel EST ce moteur, et chaque sketch en
 * hérite en fournissant sa seule formule.
 */

/** L'espace de dessin des sketches d'origine : 400 unités de côté. */
export const ESPACE = 400;
/** Exporté : chaque formule recentre ses points, et le recopier créait un clone. */
export const CENTRE = ESPACE / 2;

export interface PointCalcule {
  readonly x: number;
  readonly y: number;
  /**
   * Angle et magnitude de la GÉOMÉTRIE DE LA FORMULE (son `c` et son `d`) —
   * OBLIGATOIRES. Le traitement du Tunnel validé dérive la teinte de ces
   * quantités-là ; les déduire de la position à l'écran (première version)
   * donnait une autre logique de coloration, constatée fausse par
   * l'utilisateur le 2026-08-12.
   */
  readonly angle: number;
  readonly magnitude: number;
  /**
   * Côté du point, en unités de l'espace 400×400. Absent = 1, le cas de tous
   * les sketches qui appellent `point()`. Le 7 mai 2026 (« Colonne perlée »)
   * appelle `circle(…, k*k>15?2:1)` : sa formule fait varier la grosseur d'un
   * grain à l'autre, et perdre cette variation aplatirait le relief de l'œuvre.
   */
  readonly taille?: number;
}

export type Formule = (i: number, temps: number, decalageSouris: number) => PointCalcule;

/**
 * LE PLACEMENT POLAIRE DE LA SÉRIE.
 *
 * Plusieurs sketches finissent exactement pareil —
 * `point(q·sin(c) + 200, (q + ecart)·cos(c) + 200)` : un rayon `q`, un angle
 * `c`, et un décalage vertical qui ovalise la figure. Seul `ecart` change (30,
 * 40, 50). Le nommer une fois évite d'en recopier la forme dans chaque œuvre
 * sans rien retirer à la fidélité : l'arithmétique est identique, terme pour
 * terme.
 */
export function placerEnPolaire(
  q: number,
  c: number,
  magnitude: number,
  ecart: number,
): PointCalcule {
  return {
    x: q * Math.sin(c) + CENTRE,
    y: (q + ecart) * Math.cos(c) + CENTRE,
    angle: c,
    magnitude,
  };
}

interface Reglees {
  readonly points: number;
  readonly vitesse: number;
  readonly trainee: number;
  readonly alphaPoint: number;
  readonly saturation: number;
  readonly teinteBase: number;
  readonly teinteEtendue: number;
  readonly influenceSouris: number;
}

const lire = (r: Reglages, cle: string, defaut: number): number =>
  Number.isFinite(r[cle]) ? (r[cle] as number) : defaut;

const normaliser = (r: Reglages, points: number, vitesse: number): Reglees => ({
  points: lire(r, "points", points),
  vitesse: lire(r, "vitesse", vitesse),
  trainee: lire(r, "trainee", 40),
  alphaPoint: lire(r, "alphaPoint", 150),
  saturation: lire(r, "saturation", 70),
  teinteBase: lire(r, "teinteBase", 200),
  teinteEtendue: lire(r, "teinteEtendue", 60),
  influenceSouris: lire(r, "influenceSouris", 0.3),
});

/** Teinte HSB → chaîne CSS. Reprise telle quelle de la version validée. */
export function hsbVersCss(teinte: number, sat: number, val: number, alpha255: number): string {
  const h = ((teinte % 360) + 360) % 360;
  const s = Math.min(1, Math.max(0, sat / 100));
  const v = Math.min(1, Math.max(0, val / 100));
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const table: readonly [number, number, number][] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r, g, b] = table[Math.min(5, Math.floor(h / 60))] ?? [0, 0, 0];
  const canal = (n: number) => Math.round((n + m) * 255);
  return `rgba(${canal(r)}, ${canal(g)}, ${canal(b)}, ${Math.min(1, Math.max(0, alpha255 / 255)).toFixed(3)})`;
}

export interface OptionsChamp {
  readonly formule: Formule;
  /** Nombre de points du sketch d'origine. */
  readonly pointsOrigine: number;
  /** Pas de temps PAR IMAGE du sketch d'origine (`t += pas`). */
  readonly pasParImage: number;
}

export function creerChampDePoints({
  formule,
  pointsOrigine,
  pasParImage,
}: OptionsChamp): MonterViz {
  return (hote: HTMLElement, dimensions: Dimensions, reglages: Reglages): InstanceViz => {
    const toile = creerToile(hote, dimensions);
    const { ctx } = toile;
    let r = normaliser(reglages, pointsOrigine, pasParImage);
    let sourisX = 0;

    const surPointeur = (evenement: PointerEvent) => {
      const rect = hote.getBoundingClientRect();
      sourisX = rect.width === 0 ? 0 : (evenement.clientX - rect.left) / rect.width - 0.5;
    };
    hote.addEventListener("pointermove", surPointeur);

    const redimensionner = (suivantes: Dimensions) => {
      toile.redimensionner(suivantes);
      const { largeur, hauteur, dpr } = suivantes;
      // Le moteur raisonne dans l'espace 400×400 des sketches d'origine : sa
      // transformation remplace celle (en pixels CSS) posée par la toile.
      const echelle = (Math.min(largeur, hauteur) / ESPACE) * dpr;
      ctx.setTransform(
        echelle,
        0,
        0,
        echelle,
        (largeur * dpr - ESPACE * echelle) / 2,
        (hauteur * dpr - ESPACE * echelle) / 2,
      );
      ctx.fillStyle = hsbVersCss(0, 0, 3.53, 255);
      ctx.fillRect(0, 0, ESPACE, ESPACE);
    };
    redimensionner(dimensions);

    return {
      frame(temps) {
        // Le temps des originaux avançait d'un pas PAR IMAGE. Le rapporter à
        // 60 images par seconde rend l'animation indépendante de la cadence.
        const t = temps * r.vitesse * 60;
        const decalage = r.influenceSouris * sourisX;

        ctx.fillStyle = hsbVersCss(0, 0, 3.53, r.trainee);
        ctx.fillRect(0, 0, ESPACE, ESPACE);

        let bucketPrecedent = Number.NaN;
        for (let i = r.points - 1; i >= 0; i--) {
          const point = formule(i, t, decalage);
          if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;

          const teinte =
            r.teinteBase + r.teinteEtendue * Math.sin(point.angle * 0.5) + point.magnitude * 4;
          // Regroupement par pas de 3° : sans lui on changerait de couleur de
          // remplissage des milliers de fois par image, ce qui coûte plus cher
          // que le calcul des points.
          const bucket = Math.round((((teinte % 360) + 360) % 360) / 3) * 3;
          if (bucket !== bucketPrecedent) {
            ctx.fillStyle = hsbVersCss(bucket, r.saturation, 100, r.alphaPoint);
            bucketPrecedent = bucket;
          }
          const taille = point.taille ?? 1;
          ctx.fillRect(point.x, point.y, taille, taille);
        }
      },
      regler(suivants) {
        r = normaliser(suivants, pointsOrigine, pasParImage);
      },
      redimensionner,
      demonter() {
        hote.removeEventListener("pointermove", surPointeur);
        toile.demonter();
      },
    };
  };
}
