import type { MonterViz, Reglages } from "@/core/viz/contrat.ts";
import { lireCouleur, lireInterrupteur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * MESH GRADIENT — réécriture libre (ADR 0010, régime « technique »).
 *
 * Le mesh gradient n'existe pas en CSS : on l'approxime avec quatre
 * `radial-gradient` superposés et un flou. Deux modes, exprès :
 * - composé (défaut) : la nappe est surdimensionnée et se déplace par
 *   `transform` — le GPU compose, rien n'est repeint ;
 * - « repeint » : `background-position` est animée à chaque image, ce que le
 *   GPU ne sait pas composer. Le banc d'essai existait pour comparer les deux.
 */
const POSITIONS = [
  [0.2, 0.25],
  [0.8, 0.2],
  [0.25, 0.8],
  [0.75, 0.75],
] as const;

function nappes(r: Reglages, temps: number, amplitude: number): string {
  const etalement = lireNombre(r, "spread", 45);
  const couleurs = ["colorA", "colorB", "colorC", "colorD"] as const;
  const defauts = ["#3d6bd6", "#b8478f", "#2f9e8f", "#e0a355"] as const;
  return POSITIONS.map((position, i) => {
    const [px, py] = position;
    const x = (px + amplitude * Math.sin(temps * 0.7 + i * 1.9)) * 100;
    const y = (py + amplitude * Math.cos(temps * 0.9 + i * 2.6)) * 100;
    const couleur = lireCouleur(r, couleurs[i] ?? "colorA", defauts[i] ?? "#3d6bd6");
    return `radial-gradient(circle at ${x}% ${y}%, ${couleur} 0%, transparent ${etalement}%)`;
  }).join(", ");
}

export const monterMeshGradient: MonterViz = (hote, _dimensions, reglages) => {
  hote.style.position = "relative";
  hote.style.overflow = "hidden";
  let r = reglages;

  const nappe = document.createElement("div");
  nappe.style.position = "absolute";
  // Surdimensionnée pour que le mode composé puisse la déplacer sans bord visible.
  nappe.style.inset = "-30%";
  nappe.style.willChange = "transform";
  hote.append(nappe);

  const habiller = (temps: number, anime: boolean) => {
    nappe.style.backgroundColor = lireCouleur(r, "base", "#101a2e");
    nappe.style.backgroundImage = nappes(r, anime ? temps : 0, anime ? 0.12 : 0);
    nappe.style.filter = `blur(${lireNombre(r, "blur", 15)}px)`;
  };
  habiller(0, false);

  return {
    frame(temps) {
      const vitesse = lireNombre(r, "speed", 0.16);
      const t = temps * vitesse * 6;
      if (lireInterrupteur(r, "repaint", false)) {
        // Mode « repeint » : la nappe est réécrite à chaque image.
        nappe.style.transform = "none";
        habiller(t, true);
        return;
      }
      const x = 6 * Math.sin(t * 0.6);
      const y = 6 * Math.cos(t * 0.45);
      nappe.style.transform = `translate(${x}%, ${y}%)`;
    },
    regler(suivants: Reglages) {
      r = suivants;
      habiller(0, false);
    },
    demonter() {
      nappe.remove();
    },
  };
};
