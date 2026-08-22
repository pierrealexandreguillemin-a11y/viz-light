import { creerPleinEcranGl } from "@/core/viz/plein-ecran-gl.ts";
import { lireCouleur, lireNombre } from "@/core/viz/reglages.ts";

/**
 * VORONOI NÉON — réécriture libre (ADR 0010, régime « technique »).
 *
 * Une trame de cellules de Voronoï dont les germes dérivent et s'attirent vers
 * le curseur ; les arêtes brillent en néon. Porté de `Shader Wallpapers.html`
 * (fs2, « Neon Voronoi »), qui n'exposait AUCUN réglage : les sept ci-dessous
 * sont CRÉÉS (échelle, vitesse, éclat, influence de la souris, trois teintes).
 * Le système de clics de la source (ondes de choc) est ABANDONNÉ : c'est un
 * fond, pas une surface qu'on manipule — la souris reste un accent, posée par
 * le socle dans `u_mouse` (repère 0..1, Y vers le haut).
 */
const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform float u_glow;
uniform float u_influence;
uniform vec3 u_hueA;
uniform vec3 u_hueB;
uniform vec3 u_hueC;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;

  vec2 g = p * u_scale;
  vec2 i = floor(g);
  float minD = 10.0, minD2 = 10.0;
  vec2 minPt = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 n = vec2(float(x), float(y));
      vec2 o = hash2(i + n);
      o = 0.5 + 0.5 * sin(u_time * u_speed + 6.2831 * o);
      vec2 pt = i + n + o;
      vec2 mg = m * u_scale;
      pt += u_influence * 0.4 * (mg - pt) / (1.0 + length(g - pt));
      vec2 r = pt - g;
      float d = dot(r, r);
      if (d < minD) { minD2 = minD; minD = d; minPt = i + n; }
      else if (d < minD2) { minD2 = d; }
    }
  }
  float edge = sqrt(minD2) - sqrt(minD);
  float cell = sqrt(minD);

  float h = hash2(minPt).x;
  vec3 base = mix(u_hueA, u_hueB, h);
  base = mix(base, u_hueC, smoothstep(0.7, 1.0, h) * 0.5);
  base *= 0.18 + 0.4 * hash2(minPt + 1.7).x;

  float line = 1.0 - smoothstep(0.0, 0.03, edge);
  vec3 col = base + line * mix(u_hueB, u_hueA, hash2(minPt + 0.3).x) * u_glow;
  col += pow(1.0 - smoothstep(0.0, 0.6, cell), 4.0) * 0.25 * base * 3.0;

  float md = length(p - m);
  col += u_influence * exp(-md * 3.0) * u_hueA * 0.35;
  col += vec3(0.02, 0.01, 0.05);
  col *= 0.6 + 0.6 * smoothstep(1.4, 0.3, length(p));

  gl_FragColor = vec4(col, 1.0);
}
`;

export const monterVoronoiNeon = creerPleinEcranGl({
  fragment: FRAGMENT,
  appliquer(poseur, r) {
    poseur.flottant("u_scale", lireNombre(r, "echelle", 4));
    poseur.flottant("u_speed", lireNombre(r, "vitesse", 0.6));
    poseur.flottant("u_glow", lireNombre(r, "eclat", 1.2));
    poseur.flottant("u_influence", lireNombre(r, "influenceSouris", 0.5));
    poseur.couleur("u_hueA", lireCouleur(r, "teinteA", "#ff73d9"));
    poseur.couleur("u_hueB", lireCouleur(r, "teinteB", "#73f2ff"));
    poseur.couleur("u_hueC", lireCouleur(r, "teinteC", "#ffd973"));
  },
});
