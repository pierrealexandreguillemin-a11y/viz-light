import type { Dimensions, MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * ORBES FLOUTÉES — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des disques dégradés, floutés une fois, déplacés par `transform` : le
 * navigateur garde chaque orbe dans une couche composée par le GPU et ne
 * repeint rien. L'interrupteur « animer le flou » casse exprès cette
 * propriété — la couche est refaite à chaque image — parce que le banc
 * d'essai existait pour rendre ce coût visible.
 */
const COULEURS_DEFAUT = ["#4a5fd6", "#c94f8a", "#2fae9c"] as const;

const couleurOrbe = (r: Reglages, indice: number): string =>
  lireCouleur(r, `color${"ABC"[indice % 3] ?? "A"}`, COULEURS_DEFAUT[indice % 3] ?? "#4a5fd6");

function construireOrbes(hote: HTMLElement, r: Reglages, cote: number): HTMLDivElement[] {
  const compte = Math.round(lireNombre(r, "count", 4));
  const taille = lireNombre(r, "size", 0.6) * cote;
  const flou = lireNombre(r, "blur", 90);
  return Array.from({ length: compte }, (_, i) => {
    const orbe = document.createElement("div");
    orbe.style.position = "absolute";
    orbe.style.width = `${taille}px`;
    orbe.style.height = `${taille}px`;
    orbe.style.borderRadius = "50%";
    orbe.style.background = `radial-gradient(circle, ${couleurOrbe(r, i)} 0%, transparent 70%)`;
    orbe.style.filter = `blur(${flou}px)`;
    orbe.style.willChange = "transform";
    hote.append(orbe);
    return orbe;
  });
}

export const monterOrbesFloutees: MonterViz = (hote, dimensions, reglages) => {
  hote.style.position = "relative";
  hote.style.overflow = "hidden";
  let d = dimensions;
  let r = reglages;
  let orbes = construireOrbes(hote, r, Math.min(d.largeur, d.hauteur));

  const rebatir = () => {
    for (const orbe of orbes) orbe.remove();
    orbes = construireOrbes(hote, r, Math.min(d.largeur, d.hauteur));
  };

  return {
    frame(temps) {
      const vitesse = lireNombre(r, "speed", 0.3);
      const flouAnime = lireInterrupteur(r, "animateBlur", false);
      const flou = lireNombre(r, "blur", 90);
      orbes.forEach((orbe, i) => {
        const phase = i * 2.4;
        const x = (0.5 + 0.38 * Math.sin(temps * vitesse + phase)) * d.largeur;
        const y = (0.5 + 0.38 * Math.cos(temps * vitesse * 0.8 + phase * 1.7)) * d.hauteur;
        orbe.style.transform = `translate(${x - orbe.offsetWidth / 2}px, ${y - orbe.offsetHeight / 2}px)`;
        if (flouAnime) {
          orbe.style.filter = `blur(${flou * (0.6 + 0.4 * Math.sin(temps * 2 + phase))}px)`;
        }
      });
    },
    regler(suivants: Reglages) {
      const structurel = ["count", "size", "blur", "colorA", "colorB", "colorC"].some(
        (cle) => suivants[cle] !== r[cle],
      );
      r = suivants;
      if (structurel) rebatir();
    },
    redimensionner(suivantes: Dimensions) {
      d = suivantes;
      rebatir();
    },
    demonter() {
      for (const orbe of orbes) orbe.remove();
    },
  };
};
