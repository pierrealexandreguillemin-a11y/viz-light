/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOMAIN LAYER - Mandelbrot Mathematics
 * Pure functions for Mandelbrot set calculations
 * No side effects, no external dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Complex, MandelbrotResult, Viewport } from './types';

/**
 * Calculate Mandelbrot iteration for a complex point
 * Uses optimized escape-time algorithm with smooth coloring
 * 
 * @param cRe - Real part of complex number c
 * @param cIm - Imaginary part of complex number c
 * @param maxIterations - Maximum iterations before considering point in set
 * @returns MandelbrotResult with iteration count and smooth value
 */
export function calculateMandelbrot(
  cRe: number,
  cIm: number,
  maxIterations: number
): MandelbrotResult {
  let zRe = 0;
  let zIm = 0;
  let zRe2 = 0;
  let zIm2 = 0;
  let iteration = 0;

  // Escape radius squared (standard is 4, but larger values give smoother gradients)
  const escapeRadius2 = 4;

  // Main iteration loop - z(n+1) = z(n)² + c
  while (zRe2 + zIm2 <= escapeRadius2 && iteration < maxIterations) {
    zIm = 2 * zRe * zIm + cIm;
    zRe = zRe2 - zIm2 + cRe;
    zRe2 = zRe * zRe;
    zIm2 = zIm * zIm;
    iteration++;
  }

  // Point is in the Mandelbrot set
  if (iteration === maxIterations) {
    return {
      iterations: maxIterations,
      escaped: false,
      smoothValue: maxIterations
    };
  }

  // Calculate smooth iteration count for anti-aliased coloring
  // Using the formula: n + 1 - log(log|z|) / log(2)
  const log2 = Math.log(2);
  const logZn = Math.log(zRe2 + zIm2) / 2;
  const smoothValue = iteration + 1 - Math.log(logZn / log2) / log2;

  return {
    iterations: iteration,
    escaped: true,
    smoothValue
  };
}

/**
 * Convert screen coordinates to complex plane coordinates
 * 
 * @param x - Screen X coordinate
 * @param y - Screen Y coordinate
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @param viewport - Current viewport configuration
 * @returns Complex number corresponding to screen position
 */
export function screenToComplex(
  x: number,
  y: number,
  width: number,
  height: number,
  viewport: Viewport
): Complex {
  const aspectRatio = width / height;
  const { centerRe, centerIm, scale } = viewport;

  return {
    re: centerRe + (x / width - 0.5) * scale * aspectRatio,
    im: centerIm + (y / height - 0.5) * scale
  };
}

/**
 * Convert complex plane coordinates to screen coordinates
 * 
 * @param c - Complex number
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @param viewport - Current viewport configuration
 * @returns Screen coordinates {x, y}
 */
export function complexToScreen(
  c: Complex,
  width: number,
  height: number,
  viewport: Viewport
): { x: number; y: number } {
  const aspectRatio = width / height;
  const { centerRe, centerIm, scale } = viewport;

  return {
    x: ((c.re - centerRe) / (scale * aspectRatio) + 0.5) * width,
    y: ((c.im - centerIm) / scale + 0.5) * height
  };
}

/**
 * Calculate new viewport after zoom operation
 * Zooms toward the focus point
 * 
 * @param viewport - Current viewport
 * @param factor - Zoom factor (< 1 = zoom in, > 1 = zoom out)
 * @param focusRe - Real part of zoom focus point
 * @param focusIm - Imaginary part of zoom focus point
 * @returns New viewport configuration
 */
export function zoomViewport(
  viewport: Viewport,
  factor: number,
  focusRe: number,
  focusIm: number
): Viewport {
  const newScale = viewport.scale * factor;
  
  // Calculate new center to zoom toward focus point
  const newCenterRe = viewport.centerRe + (focusRe - viewport.centerRe) * (1 - factor);
  const newCenterIm = viewport.centerIm + (focusIm - viewport.centerIm) * (1 - factor);

  return {
    centerRe: newCenterRe,
    centerIm: newCenterIm,
    scale: newScale
  };
}

/**
 * Calculate new viewport after pan operation
 * 
 * @param viewport - Current viewport
 * @param deltaRe - Change in real direction
 * @param deltaIm - Change in imaginary direction
 * @returns New viewport configuration
 */
export function panViewport(
  viewport: Viewport,
  deltaRe: number,
  deltaIm: number
): Viewport {
  return {
    centerRe: viewport.centerRe + deltaRe,
    centerIm: viewport.centerIm + deltaIm,
    scale: viewport.scale
  };
}

/**
 * Calculate current zoom level relative to initial view
 * 
 * @param viewport - Current viewport
 * @param initialScale - Initial scale (default 3.5)
 * @returns Zoom multiplier (1 = initial view)
 */
export function getZoomLevel(viewport: Viewport, initialScale = 3.5): number {
  return initialScale / viewport.scale;
}

/**
 * Check if a viewport is at the precision limit
 * JavaScript numbers lose precision around 1e-15
 * 
 * @param viewport - Current viewport
 * @returns true if approaching precision limit
 */
export function isAtPrecisionLimit(viewport: Viewport): boolean {
  return viewport.scale < 1e-14;
}
