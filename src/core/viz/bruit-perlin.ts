/**
 * LE BRUIT DE PERLIN DE p5.js, PORTÉ TERME POUR TERME — TypeScript pur.
 *
 * Les algorithmes de l'Atelier génératif appellent `noise()` de p5. Ce bruit
 * n'est pas « un bruit de Perlin » générique : c'est une implémentation précise
 * — table de 4096 valeurs, **quatre octaves**, amplitude divisée par deux à
 * chaque octave, interpolation par cosinus mis à l'échelle. Un autre bruit
 * donnerait une autre image, et le régime « œuvre » (ADR 0010) l'interdit.
 *
 * UNE DIFFÉRENCE ASSUMÉE : p5 remplit sa table avec `Math.random()`, donc son
 * champ change à chaque chargement de page — l'original lui-même n'est pas
 * reproductible au pixel près d'une exécution à l'autre. Ici la table est tirée
 * d'un générateur ensemencé, ce qui rend chaque viz reproductible à graine
 * égale (même exigence que le ciel d'étoiles du socle) sans changer la nature
 * du champ.
 */

const TAILLE = 4095;
const DECALAGE_Y = 4;
const DECALAGE_Z = 8;
const ENJAMBEE_Y = 1 << DECALAGE_Y;
const ENJAMBEE_Z = 1 << DECALAGE_Z;
const OCTAVES = 4;
const ATTENUATION = 0.5;

const cosinusMisALEchelle = (i: number): number => 0.5 * (1 - Math.cos(i * Math.PI));

export type Bruit = (x: number, y: number, z: number) => number;

/** Construit un champ de bruit ensemencé. `alea` doit rendre des valeurs 0..1. */
export function creerBruitPerlin(alea: () => number): Bruit {
  const table = Array.from({ length: TAILLE + 1 }, alea);
  const lire = (index: number): number => table[index & TAILLE] ?? 0;

  return function bruit(x: number, y: number, z: number): number {
    let xi = Math.floor(Math.abs(x));
    let yi = Math.floor(Math.abs(y));
    let zi = Math.floor(Math.abs(z));
    let xf = Math.abs(x) - xi;
    let yf = Math.abs(y) - yi;
    let zf = Math.abs(z) - zi;
    let total = 0;
    let amplitude = 0.5;

    for (let octave = 0; octave < OCTAVES; octave++) {
      const base = xi + (yi << DECALAGE_Y) + (zi << DECALAGE_Z);
      const rx = cosinusMisALEchelle(xf);
      const ry = cosinusMisALEchelle(yf);

      const plan = (depart: number): number => {
        const bas = lire(depart) + rx * (lire(depart + 1) - lire(depart));
        const haut =
          lire(depart + ENJAMBEE_Y) +
          rx * (lire(depart + ENJAMBEE_Y + 1) - lire(depart + ENJAMBEE_Y));
        return bas + ry * (haut - bas);
      };

      const proche = plan(base);
      total += (proche + cosinusMisALEchelle(zf) * (plan(base + ENJAMBEE_Z) - proche)) * amplitude;
      amplitude *= ATTENUATION;

      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;
      if (xf >= 1) {
        xi++;
        xf--;
      }
      if (yf >= 1) {
        yi++;
        yf--;
      }
      if (zf >= 1) {
        zi++;
        zf--;
      }
    }
    return total;
  };
}
