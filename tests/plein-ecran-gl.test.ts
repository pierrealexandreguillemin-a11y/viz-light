import { describe, expect, it, vi } from "vitest";

import { creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";

/**
 * LE GARDE-FOU DU BUG DU 2026-08-22 — « les fonds WebGL virent au noir ».
 *
 * `aurore-boreale` et `plasma-deforme` sont les deux seules viz WebGL du
 * catalogue. En prod, elles s'affichaient noires : une seule viz vit à la fois
 * (SceneViz), les autres sont figées sur leur unique `frame(0, 0)`. Sans
 * `preserveDrawingBuffer: true`, le compositeur vide le canvas WebGL après
 * l'avoir présenté une fois — d'où le noir, que les fonds canvas2d n'ont jamais
 * eu (leur buffer 2D est conservé). Reproduit à la sonde (luminance 0 sur les
 * deux, > 55 après correction) ; ce test verrouille l'option au niveau du socle.
 *
 * jsdom n'a pas de vrai WebGL : on double le contexte juste assez pour que le
 * moteur passe la compilation, et on n'assère qu'une chose — les ARGUMENTS de
 * `getContext`. Rouge sans l'option, vert avec : gate calibré dans les deux sens.
 */
function contexteDouble() {
  return {
    createShader: () => ({}),
    shaderSource: () => {},
    compileShader: () => {},
    getShaderParameter: () => true,
    isContextLost: () => false,
    getShaderInfoLog: () => "",
    createProgram: () => ({}),
    attachShader: () => {},
    linkProgram: () => {},
    useProgram: () => {},
    createBuffer: () => ({}),
    bindBuffer: () => {},
    bufferData: () => {},
    getAttribLocation: () => 0,
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    viewport: () => {},
    VERTEX_SHADER: 0,
    FRAGMENT_SHADER: 1,
    COMPILE_STATUS: 2,
    ARRAY_BUFFER: 3,
    STATIC_DRAW: 4,
    FLOAT: 5,
    TRIANGLES: 6,
  };
}

describe("creerPleinEcranGl", () => {
  it("demande un contexte WebGL à buffer préservé — sinon les viz figées virent au noir", () => {
    const getContext = vi.fn(() => contexteDouble());
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      getContext as unknown as HTMLCanvasElement["getContext"],
    );

    const monter = creerPleinEcranGl({ fragment: "void main(){}", appliquer: () => {} });
    monter(document.createElement("div"), { largeur: 10, hauteur: 10, dpr: 1 }, {});

    expect(getContext).toHaveBeenCalledWith("webgl", { preserveDrawingBuffer: true });

    vi.restoreAllMocks();
  });
});
