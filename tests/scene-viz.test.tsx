import { describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";

import { SceneViz } from "@/core/composants/SceneViz.tsx";
import type { Dimensions, InstanceViz, MonterViz } from "@/core/viz/contrat.ts";

afterEach(cleanup);

/**
 * LE GARDE-FOU DU BUG DU 2026-08-12 — « la viz ne se monte jamais ».
 *
 * Ce jour-là, l'effet de montage lisait les dimensions fournies par le
 * `ResizeObserver` tout en les excluant de ses dépendances (`eslint-disable`).
 * À l'instant où l'hôte apparaît, la mesure n'existe pas encore : l'effet
 * sortait par sa garde et ne rejouait jamais. AUCUNE viz ne s'affichait —
 * pendant que l'instrument annonçait 59,9 i/s et 0 ms de JavaScript, parce
 * qu'il mesurait une boucle vide.
 *
 * Aucun autre gate ne pouvait le voir : le fichier compilait, il était court,
 * formaté, non dupliqué, et les chiffres affichés semblaient plausibles. Seul
 * un test qui EXIGE UN ÉLÉMENT DANS L'HÔTE l'attrape.
 */
function algoTemoin() {
  const frame = vi.fn();
  const demonter = vi.fn();
  const monter = vi.fn((hote: HTMLElement, dimensions: Dimensions) => {
    const marque = document.createElement("canvas");
    marque.dataset["temoin"] = `${dimensions.largeur}x${dimensions.hauteur}@${dimensions.dpr}`;
    hote.append(marque);
    return { frame, demonter } satisfies InstanceViz;
  });
  return { monter, frame, demonter };
}

/** Rendu témoin. Factorisé : trois cas le répétaient à l'identique. */
const afficher = (monter: MonterViz) =>
  render(<SceneViz nom="Témoin" slug="temoin" monter={monter} reglages={{}} />);

describe("SceneViz", () => {
  it("monte réellement la viz dans le DOM", () => {
    const { monter } = algoTemoin();
    const { container } = afficher(monter);

    expect(monter).toHaveBeenCalledTimes(1);
    // L'assertion qui compte : quelque chose est APPARU dans l'hôte.
    expect(container.querySelector("canvas[data-temoin]")).not.toBeNull();
  });

  it("transmet des dimensions non nulles — un hôte de 0 px ne dessine rien", () => {
    const { monter } = algoTemoin();
    const { container } = afficher(monter);

    const marque = container.querySelector<HTMLElement>("canvas[data-temoin]");
    expect(marque?.dataset["temoin"]).toBe("400x400@1");
  });

  it("démonte la viz et vide l'hôte", () => {
    const { monter, demonter } = algoTemoin();
    const { container, unmount } = afficher(monter);
    unmount();

    expect(demonter).toHaveBeenCalledTimes(1);
    expect(container.querySelector("canvas[data-temoin]")).toBeNull();
  });

  it("affiche une carte d'erreur au lieu de tomber quand l'algo échoue", () => {
    const console_ = vi.spyOn(console, "error").mockImplementation(() => {});
    const explose = vi.fn(() => {
      throw new Error("contexte 2D indisponible");
    });

    const { container } = render(
      <SceneViz nom="Explosive" slug="explosive" monter={explose} reglages={{}} />,
    );

    expect(container.textContent).toContain("Explosive");
    expect(container.textContent).toContain("contexte 2D indisponible");
    console_.mockRestore();
  });
});
