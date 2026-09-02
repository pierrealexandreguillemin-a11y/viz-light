/**
 * LES TEXTURES IRIDESCENTES — pures fonctions de chaîne CSS, aucun DOM.
 *
 * Trois habits pour le même reflet (source `card-app.jsx`, `iriGradient`) :
 * conique (une roue de teintes autour du centre), linéaire (la roue étirée),
 * holographique (des bandes diagonales serrées, comme une carte à jouer
 * métallisée). Les teintes sont posées en OKLCH, à chroma constant : c'est ce
 * qui donne un arc-en-ciel d'égale intensité d'un bout à l'autre.
 */
export const STYLES = ["conique", "lineaire", "holographique"] as const;
export type Style = (typeof STYLES)[number];

/** Modes de fusion du reflet sur le fond — les valeurs CSS, choisies par le manifest. */
export const FUSIONS = ["color-dodge", "screen", "overlay", "soft-light", "multiply"] as const;
export type Fusion = (typeof FUSIONS)[number];

const teinte = (chroma: number, h: number, l = 75) => `oklch(${l}% ${chroma} ${h})`;

export function texture(style: Style, angle: number, chroma: number): string {
  const roue = [0, 60, 120, 180, 240, 300, 360].map((h) => teinte(chroma, h)).join(", ");
  if (style === "conique") return `conic-gradient(from ${angle}deg at 50% 50%, ${roue})`;
  if (style === "lineaire") return `linear-gradient(${angle}deg, ${roue})`;
  const bandes: string[] = [];
  const n = 12;
  for (let i = 0; i <= n; i += 1) {
    bandes.push(`${teinte(chroma, (i / n) * 360 + angle)} ${(i / n) * 100}%`);
  }
  return `repeating-linear-gradient(${angle}deg, ${bandes.join(", ")})`;
}

/** Le reflet spéculaire : une tache blanche qui suit le pointeur (fractions 0..1). */
export function reflet(x: number, y: number, taille: number): string {
  const blanc = (alpha: number) => `oklch(100% 0 0 / ${alpha})`;
  return `radial-gradient(circle ${taille}% at ${x * 100}% ${y * 100}%, ${blanc(0.85)}, ${blanc(0.25)} 25%, ${blanc(0)} 60%)`;
}

/** Le grain : un bruit fractal SVG en fond répété, sans requête réseau. */
export const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`,
)}")`;
