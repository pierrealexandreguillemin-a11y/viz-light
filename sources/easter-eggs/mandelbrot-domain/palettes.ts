/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOMAIN LAYER - Color Palettes
 * Pure functions for color generation
 * No side effects, no external dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { RGB, ColorPalette, PaletteName, MandelbrotResult } from './types';

/**
 * Classic blue-green palette (Bernstein polynomials)
 */
const classicPalette: ColorPalette = (t) => {
  const r = Math.floor(9 * (1 - t) * t * t * t * 255);
  const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
  const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
  return [r, g, b];
};

/**
 * Fire palette - black to red to yellow to white
 */
const firePalette: ColorPalette = (t) => {
  const r = Math.floor(Math.min(255, t * 3 * 255));
  const g = Math.floor(Math.max(0, Math.min(255, (t - 0.33) * 3 * 255)));
  const b = Math.floor(Math.max(0, Math.min(255, (t - 0.66) * 3 * 255)));
  return [r, g, b];
};

/**
 * Ice palette - cool blue tones
 */
const icePalette: ColorPalette = (t) => {
  const r = Math.floor(t * 150);
  const g = Math.floor(t * 200 + 55);
  const b = Math.floor(t * 50 + 205);
  return [r, g, b];
};

/**
 * Neon palette - cycling RGB with sine waves
 */
const neonPalette: ColorPalette = (t) => {
  const phase = t * Math.PI * 2;
  const r = Math.floor((Math.sin(phase) * 0.5 + 0.5) * 255);
  const g = Math.floor((Math.sin(phase + 2.094) * 0.5 + 0.5) * 255);
  const b = Math.floor((Math.sin(phase + 4.189) * 0.5 + 0.5) * 255);
  return [r, g, b];
};

/**
 * Grayscale palette
 */
const grayscalePalette: ColorPalette = (t) => {
  const v = Math.floor(t * 255);
  return [v, v, v];
};

/**
 * Psychedelic palette - rapid color cycling
 */
const psychedelicPalette: ColorPalette = (t) => {
  const r = Math.floor((Math.sin(t * 20) * 0.5 + 0.5) * 255);
  const g = Math.floor((Math.sin(t * 20 + 2) * 0.5 + 0.5) * 255);
  const b = Math.floor((Math.sin(t * 20 + 4) * 0.5 + 0.5) * 255);
  return [r, g, b];
};

/**
 * Sunset palette - warm oranges to cool purples
 */
const sunsetPalette: ColorPalette = (t) => {
  if (t < 0.5) {
    const tt = t * 2;
    return [255, Math.floor(tt * 150 + 50), Math.floor(tt * 100)];
  }
  const tt = (t - 0.5) * 2;
  return [
    Math.floor(255 - tt * 100),
    Math.floor(200 - tt * 150),
    Math.floor(100 + tt * 155)
  ];
};

/**
 * Miami palette - neon pink, cyan, and purple
 */
const miamiPalette: ColorPalette = (t) => {
  // Pink -> Cyan -> Purple cycle
  const phase = t * Math.PI * 2;
  
  // Miami neon colors: #ff6b9d (pink), #00d4ff (cyan), #a855f7 (purple)
  const pink: RGB = [255, 107, 157];
  const cyan: RGB = [0, 212, 255];
  const purple: RGB = [168, 85, 247];

  if (t < 0.33) {
    const tt = t * 3;
    return [
      Math.floor(pink[0] + (cyan[0] - pink[0]) * tt),
      Math.floor(pink[1] + (cyan[1] - pink[1]) * tt),
      Math.floor(pink[2] + (cyan[2] - pink[2]) * tt)
    ];
  } else if (t < 0.66) {
    const tt = (t - 0.33) * 3;
    return [
      Math.floor(cyan[0] + (purple[0] - cyan[0]) * tt),
      Math.floor(cyan[1] + (purple[1] - cyan[1]) * tt),
      Math.floor(cyan[2] + (purple[2] - cyan[2]) * tt)
    ];
  } else {
    const tt = (t - 0.66) * 3;
    return [
      Math.floor(purple[0] + (pink[0] - purple[0]) * tt),
      Math.floor(purple[1] + (pink[1] - purple[1]) * tt),
      Math.floor(purple[2] + (pink[2] - purple[2]) * tt)
    ];
  }
};

/**
 * Palette registry - maps palette names to functions
 */
export const palettes: Record<PaletteName, ColorPalette> = {
  classic: classicPalette,
  fire: firePalette,
  ice: icePalette,
  neon: neonPalette,
  grayscale: grayscalePalette,
  psychedelic: psychedelicPalette,
  sunset: sunsetPalette,
  miami: miamiPalette
};

/**
 * Get color for a Mandelbrot calculation result
 * 
 * @param result - Mandelbrot calculation result
 * @param maxIterations - Maximum iterations used
 * @param paletteName - Name of the color palette
 * @returns RGB color tuple
 */
export function getColor(
  result: MandelbrotResult,
  maxIterations: number,
  paletteName: PaletteName
): RGB {
  // Points in the set are black
  if (!result.escaped) {
    return [0, 0, 0];
  }

  const palette = palettes[paletteName] ?? palettes.classic;
  
  // Normalize smooth value to [0, 1] range with modulo for cyclic colors
  const t = (result.smoothValue % 256) / 256;
  
  return palette(t);
}

/**
 * Get all available palette names
 */
export function getPaletteNames(): PaletteName[] {
  return Object.keys(palettes) as PaletteName[];
}

/**
 * Get human-readable label for a palette
 */
export function getPaletteLabel(name: PaletteName): string {
  const labels: Record<PaletteName, string> = {
    classic: 'Classique',
    fire: 'Feu',
    ice: 'Glace',
    neon: 'Néon',
    grayscale: 'Niveaux de gris',
    psychedelic: 'Psychédélique',
    sunset: 'Coucher de soleil',
    miami: 'Miami'
  };
  return labels[name] ?? name;
}
