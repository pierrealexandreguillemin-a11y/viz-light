import type { Dimensions, MonterViz, Reglages } from "./contrat.ts";
import { hexVersRgb } from "./reglages.ts";

/**
 * SHADER PLEIN ÉCRAN — le socle WebGL, TypeScript pur.
 *
 * Les fonds WebGL du catalogue sont tous le même objet : un triangle qui couvre
 * l'écran et un fragment shader qui décide de chaque pixel. Ce fichier porte ce
 * squelette UNE fois — compilation, uniforms, redimensionnement, et la PERTE DE
 * CONTEXTE (SPEC.md §6) : quand le navigateur reprend le GPU, le programme est
 * reconstruit au retour du contexte au lieu de laisser un canvas noir.
 */
const SOMMET = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

/** Ce qu'un fond fournit : son fragment et la pose de SES uniforms. */
export interface Poseur {
  flottant(nom: string, valeur: number): void;
  entier(nom: string, valeur: number): void;
  couleur(nom: string, hex: string): void;
}

export interface OptionsPleinEcran {
  readonly fragment: string;
  readonly appliquer: (poseur: Poseur, reglages: Reglages) => void;
}

/**
 * Suit le pointeur sur l'hôte, en coordonnées 0..1 avec Y VERS LE HAUT — le même
 * repère que `gl_FragCoord.xy / u_resolution` dans les shaders, pour qu'un fond
 * n'ait aucune conversion à faire. Le socle pose `u_mouse` à chaque image ; un
 * fond qui ne déclare pas cet uniform l'ignore (aurore, plasma), ce qui rend la
 * souris OPT-IN sans adaptateur. Lissage exponentiel : la souris est un accent,
 * pas un joystick — un saut brut piquerait l'image.
 */
function suivrePointeur(hote: HTMLElement) {
  let cibleX = 0.5;
  let cibleY = 0.5;
  let x = 0.5;
  let y = 0.5;
  const surPointeur = (evenement: PointerEvent) => {
    const rect = hote.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    cibleX = (evenement.clientX - rect.left) / rect.width;
    cibleY = 1 - (evenement.clientY - rect.top) / rect.height;
  };
  hote.addEventListener("pointermove", surPointeur);
  return {
    lisser(): readonly [number, number] {
      x += (cibleX - x) * 0.08;
      y += (cibleY - y) * 0.08;
      return [x, y];
    },
    detacher() {
      hote.removeEventListener("pointermove", surPointeur);
    },
  };
}

function compiler(gl: WebGLRenderingContext, fragment: string): WebGLProgram {
  const construire = (type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Création de shader impossible.");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      throw new Error(`Shader invalide : ${gl.getShaderInfoLog(shader) ?? "?"}`);
    }
    return shader;
  };
  const programme = gl.createProgram();
  gl.attachShader(programme, construire(gl.VERTEX_SHADER, SOMMET));
  gl.attachShader(programme, construire(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(programme);
  gl.useProgram(programme);

  const tampon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(programme, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  return programme;
}

export function creerPleinEcranGl({ fragment, appliquer }: OptionsPleinEcran): MonterViz {
  return (hote, dimensions, reglages) => {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    hote.append(canvas);
    // `preserveDrawingBuffer: true` est VITAL ici, pas une option de confort.
    // Une seule viz vit à la fois (SceneViz) : les autres sont figées sur leur
    // unique `frame(0, 0)` et n'appellent plus jamais `drawArrays`. Or, buffer
    // NON préservé, le compositeur vide le canvas WebGL après l'avoir présenté —
    // les viz figées viraient donc au noir dès le premier re-compositing (défilement,
    // repaint), pendant que les fonds canvas2d, eux, conservaient leur image. Le
    // bench ne l'a jamais vu : il isole chaque viz, qui redevient l'unique élue et
    // réanime en continu. Reproduit à la sonde (luminance 0 sur les deux seuls
    // fonds WebGL du catalogue), corrigé ici. Chaque image repeint tout l'écran en
    // opaque : aucune accumulation à craindre.
    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) throw new Error("WebGL indisponible sur ce navigateur.");

    let r = reglages;
    let programme = compiler(gl, fragment);
    let perdu = false;
    const pointeur = suivrePointeur(hote);

    const surPerte = (evenement: Event) => {
      evenement.preventDefault();
      perdu = true;
    };
    const surRetour = () => {
      programme = compiler(gl, fragment);
      perdu = false;
    };
    canvas.addEventListener("webglcontextlost", surPerte);
    canvas.addEventListener("webglcontextrestored", surRetour);

    const redimensionner = ({ largeur, hauteur, dpr }: Dimensions) => {
      canvas.width = Math.max(1, Math.round(largeur * dpr));
      canvas.height = Math.max(1, Math.round(hauteur * dpr));
      canvas.style.width = `${largeur}px`;
      canvas.style.height = `${hauteur}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    redimensionner(dimensions);

    const poseur: Poseur = {
      flottant: (nom, valeur) => gl.uniform1f(gl.getUniformLocation(programme, nom), valeur),
      entier: (nom, valeur) => gl.uniform1i(gl.getUniformLocation(programme, nom), valeur),
      couleur: (nom, hex) =>
        gl.uniform3fv(gl.getUniformLocation(programme, nom), Float32Array.from(hexVersRgb(hex))),
    };

    return {
      frame(temps) {
        if (perdu) return;
        gl.useProgram(programme);
        poseur.flottant("u_time", temps);
        gl.uniform2f(gl.getUniformLocation(programme, "u_resolution"), canvas.width, canvas.height);
        const [sourisX, sourisY] = pointeur.lisser();
        gl.uniform2f(gl.getUniformLocation(programme, "u_mouse"), sourisX, sourisY);
        appliquer(poseur, r);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      regler(suivants: Reglages) {
        r = suivants;
      },
      redimensionner,
      demonter() {
        pointeur.detacher();
        canvas.removeEventListener("webglcontextlost", surPerte);
        canvas.removeEventListener("webglcontextrestored", surRetour);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
      },
    };
  };
}

/** Le socle GLSL partagé des fonds à bruit : hash, bruit de valeur, fractal. */
export const GLSL_BRUIT = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform int u_octaves;

float hacher(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float bruit(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hacher(i), hacher(i + vec2(1.0, 0.0)), u.x),
             mix(hacher(i + vec2(0.0, 1.0)), hacher(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fractal(vec2 p) {
  float somme = 0.0;
  float amplitude = 0.5;
  for (int o = 0; o < 5; o++) {
    if (o >= u_octaves) break;
    somme += bruit(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return somme;
}
`;
