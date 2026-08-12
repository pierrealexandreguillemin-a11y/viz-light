import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

/**
 * « OKLCH PARTOUT DANS L'UI — aucune couleur hex/hsl en dur » (CLAUDE.md §5.3).
 *
 * C'était une règle écrite que rien n'exécutait. Une règle que rien n'exécute
 * n'est pas un gate : elle tient tant qu'on y pense, et cède le jour où on
 * copie trois lignes d'un artifact source — c'est-à-dire précisément à
 * l'étape 6, quand 31 viz venues de fichiers pleins de `#111` seront migrées.
 * Ce test la rend mécanique avant que ce moment arrive.
 *
 * PORTÉE : `src/` seulement — l'UI du catalogue. `sources/` est une archive
 * brute versionnée telle que publiée, et les couleurs internes d'un ALGORITHME
 * de viz (une teinte HSB calculée par point, par exemple) ne sont pas de l'UI :
 * elles sont la viz elle-même. La frontière est le dossier, pas le goût.
 */
const ROOT = resolve(import.meta.dirname, "..");
const UI_ROOT = join(ROOT, "src");
const EXTENSIONS = [".css", ".ts", ".tsx"];

/** `#abc`, `#aabbcc`, `#aabbccdd` — mais pas `#region` ni une ancre `#top`. */
const HEX_COLOR = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi;
/**
 * `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`.
 *
 * AUCUN espace toléré avant la parenthèse, et c'est une correction de
 * calibration, pas un détail : la version tolérante (`\s*\(`) rougissait sur la
 * phrase « aucune valeur hex/hsl (CLAUDE.md §5.3) » écrite en commentaire — le
 * gate se déclenchait sur l'énoncé de sa propre règle. En CSS comme en JS, un
 * appel de fonction n'a pas d'espace avant sa parenthèse ; exiger l'accolement
 * supprime le faux positif sans rien laisser passer.
 */
const LEGACY_COLOR_FN = /\b(?:rgba?|hsla?)\(/gi;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTENSIONS.some((ext) => name.endsWith(ext)) ? [full] : [];
  });
}

/**
 * LA FRONTIÈRE : ce qui DESSINE une viz n'est pas de l'UI.
 *
 * Une teinte HSB calculée par point est la viz elle-même — l'imposer en OKLCH
 * n'aurait aucun sens et changerait le rendu. Sont donc hors périmètre :
 * - `src/viz/<slug>/algo*` : la formule propre à chaque viz ;
 * - `src/core/viz/**` : le contrat et le moteur de dessin partagé.
 *
 * Tout le reste — coquille, planche, panneau, jetons — reste tenu par la règle.
 * La frontière est le dossier, pas le goût.
 */
function isVizAlgorithm(relativePath: string): boolean {
  const parts = relativePath.split(sep);
  if (parts[0] === "core" && parts[1] === "viz") return true;
  return parts[0] === "viz" && parts.some((part) => part === "algo" || part.startsWith("algo."));
}

function offendingLines(source: string, pattern: RegExp): string[] {
  return source
    .split("\n")
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => new RegExp(pattern.source, pattern.flags).test(line))
    .map(({ line, number }) => `L${number}: ${line.trim()}`);
}

describe("couleurs de l'UI", () => {
  const files = walk(UI_ROOT)
    .map((full) => ({ full, rel: relative(UI_ROOT, full) }))
    .filter(({ rel }) => !isVizAlgorithm(rel));

  it("balaie effectivement des fichiers (sinon le gate ne garde rien)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("attrape une vraie couleur héritée et ignore une prose qui la nomme", () => {
    const attrape = (source: string) => offendingLines(source, LEGACY_COLOR_FN).length;
    expect(attrape("color: rgba(255, 0, 0, 0.4);")).toBe(1);
    expect(attrape("color: hsl(200 50% 40%);")).toBe(1);
    // Un commentaire qui énonce la règle n'est pas une infraction à la règle.
    expect(attrape("/* aucune valeur hex/hsl (CLAUDE.md §5.3) */")).toBe(0);
  });

  it("attrape un hexadécimal et ignore une ancre ou un mot-dièse", () => {
    const attrape = (source: string) => offendingLines(source, HEX_COLOR).length;
    expect(attrape('background: "#111827";')).toBe(1);
    expect(attrape('href="#sommaire"')).toBe(0);
  });

  it.each(files.map(({ full, rel }) => [rel, full]))(
    "%s n'utilise aucune couleur hexadécimale en dur",
    (_rel, full) => {
      const found = offendingLines(readFileSync(full, "utf8"), HEX_COLOR);
      expect(
        found,
        `Couleur hex interdite — utiliser un jeton OKLCH de globals.css :\n${found.join("\n")}`,
      ).toEqual([]);
    },
  );

  it.each(files.map(({ full, rel }) => [rel, full]))(
    "%s n'utilise ni rgb() ni hsl()",
    (_rel, full) => {
      const found = offendingLines(readFileSync(full, "utf8"), LEGACY_COLOR_FN);
      expect(
        found,
        `Fonction de couleur héritée interdite — utiliser oklch() :\n${found.join("\n")}`,
      ).toEqual([]);
    },
  );
});
