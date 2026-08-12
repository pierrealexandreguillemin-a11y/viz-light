import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";

import { useScenePrincipale } from "@/core/hooks/useScenePrincipale.ts";

/**
 * UNE SEULE VIZ VIVANTE À LA FOIS — calibré dans les deux sens :
 * la première scène observée est élue, la seconde ne l'est PAS tant que la
 * première existe, et l'élection se rejoue au démontage de l'élue.
 *
 * La doublure d'IntersectionObserver (tests/setup.ts) rapporte chaque élément
 * pleinement visible et le mock de getBoundingClientRect donne la même boîte à
 * tous : l'égalité parfaite est donc le cas exercé — c'est l'élue en place qui
 * doit rester élue, pas la dernière arrivée.
 */
function scene() {
  return renderHook(() => {
    const ref = useRef<Element | null>(document.createElement("div"));
    return useScenePrincipale(ref);
  });
}

describe("useScenePrincipale", () => {
  it("élit la première scène et fige la seconde", () => {
    const premiere = scene();
    const seconde = scene();

    expect(premiere.result.current).toBe(true);
    expect(seconde.result.current).toBe(false);

    premiere.unmount();
    seconde.unmount();
  });

  it("réélit au démontage de l'élue", () => {
    const premiere = scene();
    const seconde = scene();

    act(() => premiere.unmount());
    expect(seconde.result.current).toBe(true);

    seconde.unmount();
  });
});
