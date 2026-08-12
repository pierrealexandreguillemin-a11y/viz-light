import { GLSL_BRUIT, creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * PLASMA DÉFORMÉ — réécriture libre (ADR 0010, régime « technique »).
 *
 * Aucune physique : du bruit fractal dont les COORDONNÉES sont elles-mêmes du
 * bruit (déformation de domaine) — c'est ce qui donne l'aspect liquide, et
 * c'est aussi ce qui en fait l'effet le plus lourd du catalogue : à déformation
 * non nulle, le bruit est appelé plusieurs fois par pixel. Le curseur
 * « déformation » à zéro le ramène à un simple plasma, deux fois moins cher.
 */
const FRAGMENT = `${GLSL_BRUIT}
uniform float u_warp;
uniform float u_speed;
uniform float u_scale;
uniform float u_contrast;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * u_speed;
  vec2 p = uv * u_scale;
  vec2 deformation = vec2(0.0);
  if (u_warp > 0.0) {
    deformation = u_warp * vec2(
      fractal(p + vec2(t * 0.7, 1.3)),
      fractal(p + vec2(5.2, t * 0.6))
    );
  }
  float valeur = fractal(p + deformation + vec2(t * 0.3, -t * 0.2));
  valeur = pow(clamp(valeur * 1.6, 0.0, 1.0), u_contrast);
  vec3 teinte = mix(u_colorA, u_colorB, valeur);
  // L'accent n'apparaît que sur les crêtes — c'est lui qui « mouille » le plasma.
  teinte = mix(teinte, u_colorC, smoothstep(0.65, 1.0, valeur) * 0.7);
  gl_FragColor = vec4(teinte, 1.0);
}
`;

export const monterPlasmaDeforme = creerPleinEcranGl({
  fragment: FRAGMENT,
  appliquer(poseur, r) {
    poseur.entier("u_octaves", Math.round(lireNombre(r, "octaves", 3)));
    poseur.flottant("u_warp", lireNombre(r, "warp", 3));
    poseur.flottant("u_speed", lireNombre(r, "speed", 0.1) * 4);
    poseur.flottant("u_scale", lireNombre(r, "scale", 2.5));
    poseur.flottant("u_contrast", lireNombre(r, "contrast", 1.2));
    poseur.couleur("u_colorA", lireCouleur(r, "colorA", "#070a18"));
    poseur.couleur("u_colorB", lireCouleur(r, "colorB", "#3a5cc4"));
    poseur.couleur("u_colorC", lireCouleur(r, "colorC", "#c2456f"));
  },
});
