#!/usr/bin/env node
/**
 * GATE DU CONTRAT DE DONNÉES (SPEC.md §5) — `pnpm catalog`.
 *
 * Lit chaque `src/viz/<slug>/manifest.json`, le valide, puis écrit `CATALOG.md`
 * et `src/viz/registre.genere.ts`. **Manifest invalide OU perf manquante =
 * rouge.**
 *
 * Pourquoi la perf manquante bloque : ce catalogue promet à un claude+n de
 * choisir « sur données sans rien exécuter » (SPEC.md §2). Publier une viz sans
 * son coût mesuré transformerait cette promesse en devinette — et l'absence de
 * mesure passerait inaperçue, ce qui est précisément la faute que ce dépôt
 * existe pour empêcher.
 *
 * Ce fichier ne fait QUE des entrées-sorties : toute la logique est dans
 * `src/core/`, où elle est testable sans toucher au disque.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { rendreCatalogue } from "../src/core/catalogue/rendre.ts";
import { enManifest, validerManifest, type Probleme } from "../src/core/manifest/valider.ts";
import { genererRegistre, type EntreeRegistre } from "../src/core/registre/generer.ts";
import type { VizManifest } from "../src/core/manifest/types.ts";

const RACINE = join(import.meta.dirname, "..");
const DOSSIER_VIZ = join(RACINE, "src", "viz");
const SORTIE_CATALOGUE = join(RACINE, "CATALOG.md");
const SORTIE_REGISTRE = join(DOSSIER_VIZ, "registre.genere.ts");

interface Echec {
  readonly slug: string;
  readonly problemes: readonly Probleme[];
}

function slugsPresents(): string[] {
  if (!existsSync(DOSSIER_VIZ)) return [];
  return readdirSync(DOSSIER_VIZ, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function lireManifest(slug: string): VizManifest | Echec {
  const chemin = join(DOSSIER_VIZ, slug, "manifest.json");
  if (!existsSync(chemin)) {
    return { slug, problemes: [{ chemin: "manifest.json", message: "fichier absent" }] };
  }

  let brut: unknown;
  try {
    brut = JSON.parse(readFileSync(chemin, "utf8"));
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : String(erreur);
    return {
      slug,
      problemes: [{ chemin: "manifest.json", message: `JSON illisible — ${message}` }],
    };
  }

  const problemes = validerManifest(brut, slug);
  if (problemes.length > 0) return { slug, problemes };

  const manifest = enManifest(brut);
  if (manifest.perf === null) {
    return {
      slug,
      problemes: [
        {
          chemin: "perf",
          message:
            "non mesurée. Lance `pnpm bench` : un catalogue promet un coût mesuré, pas une estimation.",
        },
      ],
    };
  }
  return manifest;
}

const estEchec = (v: VizManifest | Echec): v is Echec => "problemes" in v;

function nomComposant(slug: string): string {
  return slug
    .split("-")
    .map((mot) => (mot[0] ?? "").toUpperCase() + mot.slice(1))
    .join("");
}

function ecrireSiChange(chemin: string, contenu: string): boolean {
  mkdirSync(DOSSIER_VIZ, { recursive: true });
  const actuel = existsSync(chemin) ? readFileSync(chemin, "utf8") : null;
  if (actuel === contenu) return false;
  writeFileSync(chemin, contenu, "utf8");
  return true;
}

function rapporterEchecs(echecs: readonly Echec[]): never {
  console.error(`\nROUGE — ${echecs.length} viz au manifest invalide :\n`);
  for (const echec of echecs) {
    console.error(`  x  src/viz/${echec.slug}/manifest.json`);
    for (const p of echec.problemes) console.error(`       ${p.chemin} : ${p.message}`);
    console.error("");
  }
  console.error("Un gate rouge = donnée a corriger. Ne jamais assouplir la regle pour passer.\n");
  process.exit(1);
}

const resultats = slugsPresents().map(lireManifest);
const echecs = resultats.filter(estEchec);
if (echecs.length > 0) rapporterEchecs(echecs);

const manifests = resultats.filter((r): r is VizManifest => !estEchec(r));
const entrees: EntreeRegistre[] = manifests.map((m) => ({
  slug: m.slug,
  composant: nomComposant(m.slug),
}));

const catalogueChange = ecrireSiChange(SORTIE_CATALOGUE, rendreCatalogue(manifests));
const registreChange = ecrireSiChange(SORTIE_REGISTRE, genererRegistre(entrees));

const ecrits = [
  catalogueChange ? relative(RACINE, SORTIE_CATALOGUE) : null,
  registreChange ? relative(RACINE, SORTIE_REGISTRE) : null,
].filter((v) => v !== null);

console.log(
  `\nVERT — ${manifests.length} viz publiee(s).` +
    (ecrits.length > 0 ? ` Regenere : ${ecrits.join(", ")}.` : " Rien a regenerer."),
);
