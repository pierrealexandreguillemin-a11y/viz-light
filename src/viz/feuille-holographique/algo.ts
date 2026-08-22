import { creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * FEUILLE HOLOGRAPHIQUE — réécriture libre (ADR 0010, régime « technique »).
 *
 * Un métal brossé irisé dont le reflet s'incline avec le curseur, teinté par un
 * arc-en-ciel qui glisse sur les crêtes. Porté de `Shader Wallpapers.html`
 * (fs4, « Holographic Foil »), sans réglage à la source : les sept ci-dessous
 * sont CRÉÉS. Le système de clics (ondulations chromatiques) est ABANDONNÉ —
 * c'est un fond ; la souris (`u_mouse`, posée par le socle) n'incline le reflet
 * qu'à hauteur de « Influence de la souris ».
 */
const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_speed;
uniform float u_brillance;
uniform float u_finesse;
uniform float u_grain;
uniform float u_influence;
uniform float u_teinte;
uniform vec3 u_reflet;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
vec3 spectrum(float t) {
  t = fract(t);
  return 0.5 + 0.5 * cos(6.2831 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;
  vec2 tilt = m * u_influence;
  float tiltLen = length(tilt);

  float sheen = dot(normalize(p - tilt * 0.3 + 0.0001), normalize(tilt + 0.0001));
  sheen = 0.5 + 0.5 * sheen;

  float a = atan(p.y - tilt.y * 0.5, p.x - tilt.x * 0.5);
  float r = length(p - tilt * 0.5);
  float grain = sin(a * u_finesse + noise(p * 8.0) * 4.0) * 0.5 + 0.5;
  grain *= sin(r * 40.0 + u_time * u_speed);

  float hue = sheen * 1.2 + r * 0.6 + tiltLen * 0.4 + u_time * 0.02 + u_teinte;
  vec3 col = spectrum(hue);
  col = mix(col * 0.9, u_reflet, pow(sheen, 6.0) * u_brillance);
  col *= 1.0 - u_grain + u_grain * grain;

  float stripes = sin((p.x + p.y) * 40.0 + m.x * 8.0) * 0.5 + 0.5;
  col *= 0.92 + 0.08 * stripes;
  col *= 0.45 + 0.55 * smoothstep(1.4, 0.2, length(p));
  col *= 0.85;
  col += (hash(gl_FragCoord.xy + u_time * 0.01) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const monterFeuilleHolographique = creerPleinEcranGl({
  fragment: FRAGMENT,
  appliquer(poseur, r) {
    poseur.flottant("u_speed", lireNombre(r, "vitesse", 0.5));
    poseur.flottant("u_brillance", lireNombre(r, "brillance", 0.6));
    poseur.flottant("u_finesse", lireNombre(r, "finesse", 60));
    poseur.flottant("u_grain", lireNombre(r, "grain", 0.15));
    poseur.flottant("u_influence", lireNombre(r, "influenceSouris", 1));
    poseur.flottant("u_teinte", lireNombre(r, "decalageTeinte", 0));
    poseur.couleur("u_reflet", lireCouleur(r, "couleurReflet", "#ffffff"));
  },
});
