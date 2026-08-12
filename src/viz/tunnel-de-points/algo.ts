import type { Dimensions, InstanceViz, Reglages } from "@/core/viz/contrat.ts";

/**
 * TUNNEL DE POINTS — @yuruyurau, 29 juillet 2026, dé-golfé puis paramétré.
 *
 * TypeScript PUR : aucun import React, aucune dépendance externe. La formule
 * d'origine n'appelait que `cos`, `sin` et `mag` de p5 — que `Math` fournit
 * déjà. Porter en canvas2d supprime donc p5 du bundle de cette viz sans changer
 * une seule opération.
 *
 * L'ESPACE DE DESSIN EST FIGÉ À 400 UNITÉS, comme l'original : les constantes
 * de la formule (`+ 200`, `55 +`, `/ 1.6`) sont calibrées pour cette taille. Le
 * socle applique une homothétie pour remplir l'hôte, ce qui préserve la forme
 * exacte au lieu de la déformer.
 */
const ESPACE = 400;
const CENTRE = ESPACE / 2;

/** Teinte HSB → chaîne CSS. Reprise telle quelle de la version validée. */
function hsbVersCss(teinte: number, sat: number, val: number, alpha255: number): string {
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
  const a = Math.min(1, Math.max(0, alpha255 / 255));
  return `rgba(${canal(r)}, ${canal(g)}, ${canal(b)}, ${a.toFixed(3)})`;
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

const lire = (reglages: Reglages, cle: string, defaut: number): number =>
  Number.isFinite(reglages[cle]) ? (reglages[cle] as number) : defaut;

const normaliser = (reglages: Reglages): Reglees => ({
  points: lire(reglages, "points", 6000),
  vitesse: lire(reglages, "vitesse", 0.0393),
  trainee: lire(reglages, "trainee", 40),
  alphaPoint: lire(reglages, "alphaPoint", 150),
  saturation: lire(reglages, "saturation", 70),
  teinteBase: lire(reglages, "teinteBase", 200),
  teinteEtendue: lire(reglages, "teinteEtendue", 60),
  influenceSouris: lire(reglages, "influenceSouris", 0.3),
});

/** La position d'un point, dans l'espace de 400 unités. */
function positionner(i: number, temps: number, decalageSouris: number) {
  const indice = i / 353;
  const rayonBase = (indice < 9 ? 9 : 5) + Math.cos(indice * 31 - temps);
  const rayon = rayonBase * Math.cos(i / 44 + decalageSouris * 6);
  const profondeur = indice / 9 - 14;
  const magnitude = Math.sqrt(rayon * rayon + profondeur * profondeur) / 1.6;
  const angle = magnitude - temps / 2;

  const x = (magnitude * 9 + rayon * rayon) * Math.cos(angle) + CENTRE;
  const y =
    (55 + magnitude * 9) * Math.sin(angle / 3) +
    4 * Math.sin(rayon * 2) +
    (indice / 29) *
      rayon *
      (profondeur + 3 * Math.sin(profondeur * 4 - magnitude * 4 + temps * 3)) +
    CENTRE;

  return { x, y, magnitude, angle };
}

export function monterTunnelDePoints(
  hote: HTMLElement,
  dimensions: Dimensions,
  reglages: Reglages,
): InstanceViz {
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  hote.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexte 2D indisponible sur ce navigateur.");

  const r = normaliser(reglages);
  let sourisX = 0;

  const surPointeur = (evenement: PointerEvent) => {
    const rect = hote.getBoundingClientRect();
    sourisX = rect.width === 0 ? 0 : (evenement.clientX - rect.left) / rect.width - 0.5;
  };
  hote.addEventListener("pointermove", surPointeur);

  let echelle = 1;
  const redimensionner = ({ largeur, hauteur, dpr }: Dimensions) => {
    canvas.width = Math.round(largeur * dpr);
    canvas.height = Math.round(hauteur * dpr);
    canvas.style.width = `${largeur}px`;
    canvas.style.height = `${hauteur}px`;
    echelle = (Math.min(largeur, hauteur) / ESPACE) * dpr;
    const marge = {
      x: (largeur * dpr - ESPACE * echelle) / 2,
      y: (hauteur * dpr - ESPACE * echelle) / 2,
    };
    ctx.setTransform(echelle, 0, 0, echelle, marge.x, marge.y);
    ctx.fillStyle = hsbVersCss(0, 0, 3.53, 255);
    ctx.fillRect(0, 0, ESPACE, ESPACE);
  };
  redimensionner(dimensions);

  return {
    frame(temps) {
      // Le temps de l'original avançait d'un pas PAR IMAGE. Le rapporter à 60
      // images par seconde rend l'animation indépendante de la cadence : la
      // même seconde de viz montre la même chose sur un écran à 60 ou 144 Hz.
      const t = temps * r.vitesse * 60;
      const decalage = r.influenceSouris * sourisX;

      ctx.fillStyle = hsbVersCss(0, 0, 3.53, r.trainee);
      ctx.fillRect(0, 0, ESPACE, ESPACE);

      let bucketPrecedent = Number.NaN;
      for (let i = r.points - 1; i >= 0; i--) {
        const { x, y, magnitude, angle } = positionner(i, t, decalage);
        const teinte = r.teinteBase + r.teinteEtendue * Math.sin(angle * 0.5) + magnitude * 4;
        // Regroupement des teintes par pas de 3° : sans lui, on changerait de
        // couleur de remplissage 6000 fois par image, ce qui coûte plus cher
        // que le calcul des points eux-mêmes.
        const bucket = Math.round((((teinte % 360) + 360) % 360) / 3) * 3;
        if (bucket !== bucketPrecedent) {
          ctx.fillStyle = hsbVersCss(bucket, r.saturation, 100, r.alphaPoint);
          bucketPrecedent = bucket;
        }
        ctx.fillRect(x, y, 1, 1);
      }
    },
    redimensionner,
    demonter() {
      hote.removeEventListener("pointermove", surPointeur);
      canvas.remove();
    },
  };
}
