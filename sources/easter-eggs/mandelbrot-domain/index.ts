/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOMAIN LAYER - Public API
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Types
export type {
  Complex,
  MandelbrotResult,
  Viewport,
  RGB,
  ColorPalette,
  PaletteName,
  ThemeName,
  MandelbrotConfig,
  RenderStats,
  MandelbrotEvent
} from './types';

export { DEFAULT_CONFIG } from './types';

// Mandelbrot calculations
export {
  calculateMandelbrot,
  screenToComplex,
  complexToScreen,
  zoomViewport,
  panViewport,
  getZoomLevel,
  isAtPrecisionLimit
} from './mandelbrot';

// Color palettes
export {
  palettes,
  getColor,
  getPaletteNames,
  getPaletteLabel
} from './palettes';
