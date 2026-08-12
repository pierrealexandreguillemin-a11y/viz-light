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

/**
 * jsdom n'implémente ni `ResizeObserver` ni `IntersectionObserver`. Les
 * doublures reproduisent le comportement dont le socle dépend réellement :
 * les deux invoquent leur rappel une première fois dès `observe()`.
 */
class ObservateurDouble {
  private readonly rappel: (entrees: unknown[]) => void;
  constructor(rappel: (entrees: unknown[]) => void) {
    this.rappel = rappel;
  }
  observe(cible: Element) {
    this.rappel([
      { target: cible, isIntersecting: true, contentRect: { width: 400, height: 400 } },
    ]);
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  prefersReducedMotion = false;
  vi.stubGlobal("ResizeObserver", ObservateurDouble);
  vi.stubGlobal("IntersectionObserver", ObservateurDouble);
  // jsdom renvoie 0 partout : sans cela le socle mesurerait un hôte de 0 px.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 400,
    height: 400,
    top: 0,
    left: 0,
    right: 400,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });

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
