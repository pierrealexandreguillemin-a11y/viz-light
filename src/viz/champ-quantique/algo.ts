import { creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * CHAMP QUANTIQUE — réécriture libre (ADR 0010, régime « technique »).
 *
 * Des figures d'interférence : trois émetteurs dérivent, leurs ondes se
 * superposent, et le curseur en devient une source forte. Porté de
 * `Shader Wallpapers.html` (fs5, « Quantum Field »), sans réglage à la source :
 * les sept ci-dessous sont CRÉÉS. Le système de clics (émetteurs éphémères) est
 * ABANDONNÉ — c'est un fond ; la souris (`u_mouse`, posée par le socle) reste un
 * accent, dosé par « Influence de la souris ».
 */
const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_wavelength;
uniform float u_speed;
uniform float u_intensite;
uniform float u_influence;
uniform vec3 u_creux;
uniform vec3 u_mid;
uniform vec3 u_crete;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;

  vec2 e1 = vec2(cos(u_time * 0.20) * 0.7, sin(u_time * 0.17) * 0.5);
  vec2 e2 = vec2(cos(u_time * 0.13 + 2.1) * 0.6, sin(u_time * 0.23 + 1.7) * 0.55);
  vec2 e3 = vec2(cos(u_time * 0.27 + 4.0) * 0.55, sin(u_time * 0.19 + 3.3) * 0.65);

  float k = u_wavelength;
  float t = u_time * u_speed;
  float wave = 0.0;
  wave += sin(length(p - e1) * k - t) / (1.0 + length(p - e1) * 0.6);
  wave += sin(length(p - e2) * k - t * 1.07) / (1.0 + length(p - e2) * 0.6);
  wave += sin(length(p - e3) * k - t * 0.93) / (1.0 + length(p - e3) * 0.6);
  wave += u_influence * 1.8 * sin(length(p - m) * k * 0.9 - t * 1.2) / (1.0 + length(p - m) * 0.4);
  wave *= u_intensite;

  float lum = smoothstep(-0.2, 1.2, wave);
  float crest = smoothstep(0.7, 1.05, abs(wave));
  vec3 white = vec3(1.00, 0.98, 0.92);

  vec3 col = mix(u_creux, u_mid, lum);
  col = mix(col, u_crete, smoothstep(0.55, 0.95, lum));
  col += crest * white * 0.6;
  col = mix(col, vec3(0.20, 0.10, 0.30), smoothstep(0.25, 0.0, lum) * 0.4);

  vec2 gp = floor(p * 40.0);
  float dot1 = pow(hash(gp), 80.0);
  vec2 fp = fract(p * 40.0) - 0.5;
  float dotR = exp(-dot(fp, fp) * 120.0) * dot1;
  col += dotR * vec3(0.9, 1.0, 1.0) * (0.5 + 0.5 * sin(u_time * 3.0 + hash(gp) * 40.0));

  col *= 0.55 + 0.55 * smoothstep(1.5, 0.3, length(p));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const monterChampQuantique = creerPleinEcranGl({
  fragment: FRAGMENT,
  appliquer(poseur, r) {
    poseur.flottant("u_wavelength", lireNombre(r, "longueurOnde", 28));
    poseur.flottant("u_speed", lireNombre(r, "vitesse", 2.2));
    poseur.flottant("u_intensite", lireNombre(r, "intensite", 0.35));
    poseur.flottant("u_influence", lireNombre(r, "influenceSouris", 1));
    poseur.couleur("u_creux", lireCouleur(r, "couleurCreux", "#050a1a"));
    poseur.couleur("u_mid", lireCouleur(r, "couleurMid", "#1a66d9"));
    poseur.couleur("u_crete", lireCouleur(r, "couleurCrete", "#8cebff"));
  },
});
