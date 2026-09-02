import { describe, expect, it } from "vitest";

import { CHEMIN_VALEUR, cheminsFautifs, muterParamComplet } from "./aides/manifest.ts";

describe("validerManifest — genre choix (ADR 0015)", () => {
  const CHEMIN_OPTIONS = "rendus[1].params[0].options";
  const choixValide = () => ({
    cle: "famille",
    libelle: "Famille de fractale",
    genre: "choix",
    valeur: "julia",
    options: [
      { valeur: "mandelbrot", libelle: "Mandelbrot" },
      { valeur: "julia", libelle: "Julia" },
    ],
  });

  it("accepte un choix dont la valeur par défaut est l'une des options", () => {
    expect(cheminsFautifs(muterParamComplet(choixValide()))).toEqual([]);
  });

  it("refuse une valeur par défaut absente des options", () => {
    expect(
      cheminsFautifs(muterParamComplet({ ...choixValide(), valeur: "burning-ship" })),
    ).toContain(CHEMIN_VALEUR);
    expect(cheminsFautifs(muterParamComplet({ ...choixValide(), valeur: 1 }))).toContain(
      CHEMIN_VALEUR,
    );
  });

  it("exige au moins une option", () => {
    expect(cheminsFautifs(muterParamComplet({ ...choixValide(), options: [] }))).toContain(
      CHEMIN_OPTIONS,
    );
    const sansOptions: Record<string, unknown> = { ...choixValide() };
    delete sansOptions["options"];
    expect(cheminsFautifs(muterParamComplet(sansOptions))).toContain(CHEMIN_OPTIONS);
  });

  it("refuse une option sans `valeur` ou sans `libelle` non vides", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "mandelbrot",
          options: [{ valeur: "mandelbrot", libelle: "" }],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[0].libelle`);
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [{ libelle: "Julia" }],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[0].valeur`);
  });

  it("refuse deux options partageant la même valeur", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [
            { valeur: "julia", libelle: "Julia" },
            { valeur: "julia", libelle: "Julia bis" },
          ],
        }),
      ),
    ).toContain(CHEMIN_OPTIONS);
  });

  it("refuse une option qui n'est pas un objet", () => {
    expect(
      cheminsFautifs(
        muterParamComplet({
          ...choixValide(),
          valeur: "julia",
          options: [{ valeur: "julia", libelle: "Julia" }, "pas-un-objet"],
        }),
      ),
    ).toContain(`${CHEMIN_OPTIONS}[1]`);
  });
});
