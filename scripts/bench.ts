#!/usr/bin/env node
/**
 * LE BENCH (SPEC.md §2, ADR 0005) — `pnpm bench`.
 *
 * Sert le site CONSTRUIT (jamais le serveur de développement : le HMR et les
 * gardes de React en mode dev fausseraient les chiffres), laisse chaque viz
 * tourner, puis relève ce que l'instrument affiche et l'inscrit dans le
 * manifest.
 *
 * IL LIT L'INSTRUMENT DE LA PAGE PLUTÔT QUE DE MESURER À PART. Deux chemins de
 * mesure finiraient par diverger, et le catalogue publierait alors des chiffres
 * que l'écran contredit. Ici, ce qui est tamponné dans le manifest est
 * exactement ce que l'utilisateur voit.
 */
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import puppeteer from "puppeteer";

const RACINE = join(import.meta.dirname, "..");
const SORTIE = join(RACINE, "out");
const DOSSIER_VIZ = join(RACINE, "src", "viz");
const PORT = 4321;
/** ~7 s : largement plus que les 90 images de la fenêtre glissante. */
const DUREE_MESURE_MS = 7000;

const TYPES: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
};

function servir() {
  return createServer((requete, reponse) => {
    const chemin = (requete.url ?? "/").split("?")[0] ?? "/";
    const candidats = [
      join(SORTIE, chemin),
      join(SORTIE, chemin, "index.html"),
      join(SORTIE, "index.html"),
    ];
    const fichier = candidats.find((c) => existsSync(c) && extname(c) !== "");
    if (!fichier) {
      reponse.writeHead(404).end("introuvable");
      return;
    }
    reponse.writeHead(200, {
      "Content-Type": TYPES[extname(fichier)] ?? "application/octet-stream",
    });
    reponse.end(readFileSync(fichier));
  });
}

interface Releve {
  readonly slug: string;
  readonly cadenceFps: number;
  readonly jsMedianMs: number;
  readonly jsP95Ms: number;
  readonly gpuBound: boolean;
  readonly echantillons: number;
}

function machine(version: string): string {
  return `${process.platform} ${process.arch} · ${version}`;
}

if (!existsSync(join(SORTIE, "index.html"))) {
  console.error("\nROUGE — `out/` absent. Lance `pnpm build` avant `pnpm bench`.\n");
  process.exit(1);
}

const serveur = servir();
await new Promise<void>((resoudre) => serveur.listen(PORT, resoudre));

const navigateur = await puppeteer.launch();
const page = await navigateur.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0", timeout: 60000 });

console.log(`\nMesure en cours (${DUREE_MESURE_MS / 1000} s par passage)…`);
await new Promise((r) => setTimeout(r, DUREE_MESURE_MS));

// `[data-fps]` et non `.cout[data-fps]` : la barre de coût a été remplacée par
// une phrase (une interface qui a besoin d'une légende ne s'explique pas), et
// le sélecteur de classe a suivi le composant supprimé — le bench ne relevait
// alors plus rien, en sortant proprement.
const releves: Releve[] = await page.evaluate(() =>
  [...document.querySelectorAll<HTMLElement>("[data-fps]")].map((noeud) => ({
    slug: noeud.dataset["viz"] ?? "",
    cadenceFps: Number(noeud.dataset["fps"]),
    jsMedianMs: Number(noeud.dataset["jsMedian"]),
    jsP95Ms: Number(noeud.dataset["jsP95"]),
    gpuBound: noeud.dataset["gpuBound"] === "true",
    echantillons: Number(noeud.dataset["echantillons"]),
  })),
);

const version = await navigateur.version();
await navigateur.close();
serveur.close();

if (releves.length === 0) {
  console.error("\nROUGE — aucune viz n'a produit de mesure. L'instrument a-t-il tourne ?\n");
  process.exit(1);
}

const aujourdhui = new Date().toISOString().slice(0, 10);
for (const releve of releves) {
  const chemin = join(DOSSIER_VIZ, releve.slug, "manifest.json");
  if (!existsSync(chemin)) {
    console.error(`  x  ${releve.slug} : manifest introuvable, releve ignore.`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(chemin, "utf8")) as Record<string, unknown>;
  manifest["perf"] = {
    mesureLe: aujourdhui,
    machine: machine(version),
    cadenceFps: releve.cadenceFps,
    jsMedianMs: releve.jsMedianMs,
    jsP95Ms: releve.jsP95Ms,
    gpuBound: releve.gpuBound,
  };
  writeFileSync(chemin, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    `  ${releve.slug} : ${releve.cadenceFps} i/s · JS ${releve.jsMedianMs}/${releve.jsP95Ms} ms ` +
      `· ${releve.gpuBound ? "GPU-bound" : "CPU-bound"} · ${releve.echantillons} images`,
  );
}

const slugs = new Set(releves.map((r) => r.slug));
const manquantes = readdirSync(DOSSIER_VIZ, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !slugs.has(e.name))
  .map((e) => e.name);
if (manquantes.length > 0) {
  console.log(`\n⚠ Non mesurees (absentes de la page ou hors viewport) : ${manquantes.join(", ")}`);
}

console.log(`\nVERT — ${releves.length} viz mesuree(s), manifests mis a jour.\n`);
