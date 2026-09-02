import { describe, expect, it } from "vitest";

import { lireChoix } from "@/core/viz/reglages.ts";
import {
  deplacer,
  echapper,
  FAMILLES,
  INTERIEUR,
  NOMS_FAMILLES,
  pixelVersPlan,
  zoomer,
} from "@/viz/explorateur-de-fractales/algo/fractales.ts";
import {
  construireLut,
  NOMS_PALETTES,
  TAILLE_LUT,
} from "@/viz/explorateur-de-fractales/algo/palettes.ts";

/**
 * Les maths de l'explorateur sont pures : on les tient par des faits connus
 * de l'ensemble de Mandelbrot plutôt que par des captures.
 */
describe("echapper — la boucle de fuite", () => {
  it("garde l'origine dans l'ensemble de Mandelbrot, quel que soit le plafond", () => {
    expect(echapper(FAMILLES.mandelbrot, 0, 0, 64, 0, 0)).toBe(INTERIEUR);
    expect(echapper(FAMILLES.mandelbrot, -1, 0, 512, 0, 0)).toBe(INTERIEUR);
  });

  it("fait fuir un point lointain en peu d'itérations, avec une valeur lissée finie et positive", () => {
    const v = echapper(FAMILLES.mandelbrot, 2, 2, 256, 0, 0);
    expect(v).not.toBe(INTERIEUR);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(5);
  });

  it("Julia : `c` est la constante, le point est le départ", () => {
    // z₀ = 0 avec c = 0 reste à 0 : intérieur. Un départ lointain fuit.
    expect(echapper(FAMILLES.julia, 0, 0, 64, 0, 0)).toBe(INTERIEUR);
    expect(echapper(FAMILLES.julia, 3, 3, 64, 0, 0)).not.toBe(INTERIEUR);
  });

  it("chaque famille sait fuir et sait rester", () => {
    for (const nom of NOMS_FAMILLES) {
      const famille = FAMILLES[nom];
      expect(echapper(famille, 0, 0, 64, 0, 0)).toBe(INTERIEUR);
      expect(echapper(famille, 4, 4, 64, 0, 0)).not.toBe(INTERIEUR);
    }
  });
});

describe("la vue — zoom et déplacement", () => {
  const vue = { centreRe: -0.5, centreIm: 0, echelle: 3.5 };

  it("zoomer vers un point le laisse au même endroit de l'écran", () => {
    const [re, im] = pixelVersPlan(100, 300, 400, 400, vue);
    const apres = zoomer(vue, 0.5, re, im);
    const [re2, im2] = pixelVersPlan(100, 300, 400, 400, apres);
    expect(re2).toBeCloseTo(re, 12);
    expect(im2).toBeCloseTo(im, 12);
    expect(apres.echelle).toBeCloseTo(1.75);
  });

  it("borne l'échelle à la précision du double et au cadre le plus large", () => {
    expect(zoomer(vue, 1e-20, 0, 0).echelle).toBe(1e-13);
    expect(zoomer(vue, 1e6, 0, 0).echelle).toBe(8);
  });

  it("déplacer d'un cadre entier décale le centre d'une échelle", () => {
    const apres = deplacer(vue, 1, 0, 1);
    expect(apres.centreRe).toBeCloseTo(vue.centreRe - 3.5);
    expect(apres.centreIm).toBe(vue.centreIm);
    expect(apres.echelle).toBe(vue.echelle);
  });

  it("le centre du cadre est le centre de la vue", () => {
    const [re, im] = pixelVersPlan(200, 100, 400, 200, vue);
    expect(re).toBeCloseTo(vue.centreRe);
    expect(im).toBeCloseTo(vue.centreIm);
  });
});

describe("les palettes", () => {
  it("chaque palette remplit une table de la bonne taille, en octets valides", () => {
    for (const nom of NOMS_PALETTES) {
      const lut = construireLut(nom);
      expect(lut.length).toBe(TAILLE_LUT * 3);
      expect(lut.every((octet) => octet >= 0 && octet <= 255)).toBe(true);
    }
  });

  it("une palette par paliers va bien de sa première à sa dernière couleur", () => {
    const gris = construireLut("gris");
    expect(gris[0]).toBe(0);
    expect(gris[(TAILLE_LUT - 1) * 3]).toBeGreaterThan(250);
  });
});

describe("lireChoix — un choix inconnu retombe sur le défaut", () => {
  const admises = ["a", "b"] as const;
  it("rend la valeur quand elle est admise", () => {
    expect(lireChoix({ x: "b" }, "x", admises, "a")).toBe("b");
  });
  it("rend le défaut sinon", () => {
    expect(lireChoix({ x: "z" }, "x", admises, "a")).toBe("a");
    expect(lireChoix({ x: 3 }, "x", admises, "a")).toBe("a");
    expect(lireChoix({}, "x", admises, "a")).toBe("a");
  });
});
