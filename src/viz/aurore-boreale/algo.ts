import { GLSL_BRUIT, creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * AURORE BORÉALE — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des rideaux de bruit fractal étirés verticalement. Le temps JavaScript reste
 * proche de zéro — tout le travail est du remplissage de pixels : le shader
 * tourne pour CHAQUE pixel, et le curseur d'octaves multiplie ce travail.
 * « Extrêmement faible » était donc faux tel quel ; le banc d'essai existait
 * pour le montrer.
 */
const FRAGMENT = `${GLSL_BRUIT}
uniform float u_bands;
uniform float u_speed;
uniform float u_scale;
uniform float u_intensity;
uniform vec3 u_sky;
uniform vec3 u_colorA;
uniform vec3 u_colorB;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * u_speed;
  vec3 teinte = u_sky;
  for (int b = 0; b < 4; b++) {
    if (float(b) >= u_bands) break;
    float fb = float(b);
    // Chaque rideau ondule à sa propre fréquence et sa propre hauteur.
    float ondulation = fractal(vec2(uv.x * u_scale + fb * 7.3, t * 0.5 + fb * 3.1));
    float centre = 0.35 + 0.3 * ondulation + fb * 0.08;
    float rideau = exp(-pow((uv.y - centre) * 6.0, 2.0));
    float lueur = fractal(vec2(uv.x * u_scale * 2.0 - t, uv.y * 2.0 + fb));
    vec3 nuance = mix(u_colorA, u_colorB, uv.y + 0.25 * ondulation);
    teinte += nuance * rideau * lueur * u_intensity * 0.9;
  }
  gl_FragColor = vec4(teinte, 1.0);
}
`;

export const monterAuroreBoreale = creerPleinEcranGl({
  fragment: FRAGMENT,
  appliquer(poseur, r) {
    poseur.entier("u_octaves", Math.round(lireNombre(r, "octaves", 3)));
    poseur.flottant("u_bands", lireNombre(r, "bands", 3));
    poseur.flottant("u_speed", lireNombre(r, "speed", 0.12) * 4);
    poseur.flottant("u_scale", lireNombre(r, "scale", 2));
    poseur.flottant("u_intensity", lireNombre(r, "intensity", 1.1));
    poseur.couleur("u_sky", lireCouleur(r, "sky", "#04070f"));
    poseur.couleur("u_colorA", lireCouleur(r, "colorA", "#1fd68f"));
    poseur.couleur("u_colorB", lireCouleur(r, "colorB", "#7a5cf0"));
  },
});
