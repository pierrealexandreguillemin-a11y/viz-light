/**
 * Amorce commune des tests.
 *
 * jsdom n'implémente ni `matchMedia` ni `requestAnimationFrame` de façon
 * exploitable pour ce projet : le socle viz s'appuie sur les deux
 * (`prefers-reduced-motion`, boucle d'animation — SPEC.md §2 et §6). Les
 * doublures vivent ici pour que chaque test n'ait pas à les réinventer, ce qui
 * serait exactement la duplication que jscpd est censé traquer.
 */
import { afterEach, beforeEach, vi } from "vitest";

type MediaQueryListener = (event: MediaQueryListEvent) => void;

/** Pilote `prefers-reduced-motion` depuis un test. */
export let prefersReducedMotion = false;

export function setPrefersReducedMotion(value: boolean): void {
  prefersReducedMotion = value;
}

beforeEach(() => {
  prefersReducedMotion = false;

  vi.stubGlobal("matchMedia", (query: string) => {
    const listeners = new Set<MediaQueryListener>();
    return {
      media: query,
      get matches() {
        return query.includes("prefers-reduced-motion: reduce") && prefersReducedMotion;
      },
      onchange: null,
      addEventListener: (_: string, listener: MediaQueryListener) => listeners.add(listener),
      removeEventListener: (_: string, listener: MediaQueryListener) => listeners.delete(listener),
      dispatchEvent: () => false,
      addListener: (listener: MediaQueryListener) => listeners.add(listener),
      removeListener: (listener: MediaQueryListener) => listeners.delete(listener),
    };
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
