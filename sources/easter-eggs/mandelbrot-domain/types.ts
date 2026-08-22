/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOMAIN LAYER - Types & Interfaces
 * Pure domain types, no external dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Complex number representation */
export interface Complex {
  re: number;
  im: number;
}

/** Result of Mandelbrot calculation for a single point */
export interface MandelbrotResult {
  iterations: number;
  escaped: boolean;
  smoothValue: number;
}

/** Viewport configuration for the complex plane */
export interface Viewport {
  centerRe: number;
  centerIm: number;
  scale: number;
}

/** RGB color tuple */
export type RGB = [r: number, g: number, b: number];

/** Color palette function signature */
export type ColorPalette = (t: number) => RGB;

/** Available color palette names */
export type PaletteName = 
  | 'classic'
  | 'fire'
  | 'ice'
  | 'neon'
  | 'grayscale'
  | 'psychedelic'
  | 'sunset'
  | 'miami';

/** Available theme names */
export type ThemeName = 
  | 'default'
  | 'miami'
  | 'ocean'
  | 'light';

/** Mandelbrot explorer configuration */
export interface MandelbrotConfig {
  maxIterations: number;
  palette: PaletteName;
  theme: ThemeName;
  viewport: Viewport;
}

/** Default configuration values */
export const DEFAULT_CONFIG: MandelbrotConfig = {
  maxIterations: 256,
  palette: 'classic',
  theme: 'default',
  viewport: {
    centerRe: -0.5,
    centerIm: 0,
    scale: 3.5
  }
};

/** Render statistics */
export interface RenderStats {
  zoomLevel: number;
  centerRe: number;
  centerIm: number;
  renderTime: number;
}

/** Event types for the Mandelbrot explorer */
export type MandelbrotEvent = 
  | { type: 'ZOOM'; factor: number; focusRe: number; focusIm: number }
  | { type: 'PAN'; deltaRe: number; deltaIm: number }
  | { type: 'RESET' }
  | { type: 'SET_PALETTE'; palette: PaletteName }
  | { type: 'SET_THEME'; theme: ThemeName }
  | { type: 'SET_ITERATIONS'; maxIterations: number };
