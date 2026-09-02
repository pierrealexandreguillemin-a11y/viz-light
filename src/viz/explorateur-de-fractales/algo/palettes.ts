/**
 * LES PALETTES — fonctions pures t ∈ [0, 1) → RVB 0..255.
 *
 * Réécriture libre des huit palettes de la source. Deux formes suffisent à les
 * exprimer sans en recopier une seule : des PALIERS interpolés linéairement
 * (feu, glace, gris, coucher de soleil, miami) et des SINUSOÏDES déphasées
 * (néon, psychédélique) ; la « classique » garde ses polynômes de Bernstein.
 * Les couleurs sont des triplets numériques, pas des chaînes CSS : la palette
 * est une donnée de la viz, hors du gate OKLCH de l'interface.
 */
type Rvb = readonly [number, number, number];
type Palette = (t: number) => Rvb;

/** Paliers équidistants sur [0, 1], interpolés canal par canal. */
const parPaliers =
  (...paliers: readonly Rvb[]): Palette =>
  (t) => {
    const position = Math.min(1, Math.max(0, t)) * (paliers.length - 1);
    const i = Math.min(paliers.length - 2, Math.floor(position));
    const f = position - i;
    const a = paliers[i] ?? [0, 0, 0];
    const b = paliers[i + 1] ?? a;
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  };

/** Trois sinusoïdes déphasées d'un tiers de tour : `tours` cycles complets sur [0, 1]. */
const sinusoidale =
  (tours: number, dephasage: number): Palette =>
  (t) => {
    const phase = t * Math.PI * 2 * tours;
    const canal = (k: number) => (Math.sin(phase + k * dephasage) * 0.5 + 0.5) * 255;
    return [canal(0), canal(1), canal(2)];
  };

/** Les polynômes de Bernstein du bleu-vert classique. */
const classique: Palette = (t) => {
  const u = 1 - t;
  return [9 * u * t * t * t * 255, 15 * u * u * t * t * 255, 8.5 * u * u * u * t * 255];
};

export const PALETTES = {
  classique,
  feu: parPaliers([0, 0, 0], [255, 0, 0], [255, 255, 0], [255, 255, 255]),
  glace: parPaliers([0, 55, 205], [150, 255, 255]),
  neon: sinusoidale(1, 2.094),
  gris: parPaliers([0, 0, 0], [255, 255, 255]),
  psychedelique: sinusoidale(20 / (Math.PI * 2), 2),
  crepuscule: parPaliers([255, 50, 0], [255, 200, 100], [155, 50, 255]),
  miami: parPaliers([255, 107, 157], [0, 212, 255], [168, 85, 247], [255, 107, 157]),
} as const satisfies Record<string, Palette>;

export type NomPalette = keyof typeof PALETTES;
export const NOMS_PALETTES = Object.keys(PALETTES) as readonly NomPalette[];

/** Entrées de la table : assez pour qu'aucun palier ne se voie à l'écran. */
export const TAILLE_LUT = 1024;

/**
 * Table précalculée — trois octets par entrée. Colorier un million de pixels
 * par image en appelant la fonction de palette (sinus, puissances) coûterait
 * dix fois le prix d'une lecture indexée ; la table se reconstruit seulement
 * quand la palette change.
 */
export function construireLut(nom: NomPalette): Uint8ClampedArray {
  const palette = PALETTES[nom];
  const lut = new Uint8ClampedArray(TAILLE_LUT * 3);
  for (let i = 0; i < TAILLE_LUT; i += 1) {
    const [r, g, b] = palette(i / TAILLE_LUT);
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}
