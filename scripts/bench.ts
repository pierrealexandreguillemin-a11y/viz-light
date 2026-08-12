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
import { format } from "prettier";
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

/**
 * `headless: "shell"` et non le headless par défaut : mesuré sur cette machine
 * (2026-08-12), le nouveau mode bride son compositeur à ~10 i/s même sur une
 * page vide — toutes les viz sortaient à 10 i/s « GPU-bound », y compris un
 * effet à 0,1 ms de JavaScript. Le shell tient les 60 i/s attendues.
 */
const navigateur = await puppeteer.launch({ headless: "shell" });
const page = await navigateur.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

/**
 * ÉTALONNAGE AVANT MESURE. Un environnement peut brider `requestAnimationFrame`
 * (mode efficacité Windows, compositeur headless…) : les chiffres seraient
 * alors ceux du bridage, pas des viz — et ils seraient tamponnés. Un instrument
 * doit crier quand il mesure du vide ; il doit aussi crier quand il mesure
 * dans une pièce déformée.
 */
await page.goto("about:blank");
const plafondRaf = await page.evaluate(
  () =>
    new Promise<number>((resoudre) => {
      let images = 0;
      const debut = performance.now();
      const boucle = () => {
        images += 1;
        if (performance.now() - debut > 2000) resoudre(Math.round(images / 2));
        else requestAnimationFrame(boucle);
      };
      requestAnimationFrame(boucle);
    }),
);
if (plafondRaf < 55) {
  console.error(
    `\nROUGE — l'environnement plafonne a ${plafondRaf} i/s sur une page vide.` +
      "\nToute mesure serait celle du bridage, pas des viz. Bench refuse.\n",
  );
  await navigateur.close();
  serveur.close();
  process.exit(1);
}
console.log(`Etalonnage : page vide a ${plafondRaf} i/s — environnement sain.`);

/**
 * UNE VIZ À LA FOIS — condition pour que le chiffre veuille dire quelque chose.
 *
 * Laisser tourner la page entière donnerait deux erreurs simultanées : les viz
 * visibles se disputent le processeur (chacune paraîtrait plus lente qu'elle
 * n'est), et celles hors écran sont mises en pause par le socle, donc ne
 * produisent rien. On recharge, on masque toutes les autres, et on laisse
 * celle-ci seule remplir sa fenêtre de mesure.
 *
 * `domcontentloaded` et non `networkidle0` : une page qui anime en permanence
 * n'atteint pas toujours l'état « réseau au repos », et l'attente expirait.
 *
 * Le sélecteur est `[data-fps]` : la barre de coût a été remplacée par une
 * phrase, et l'ancien `.cout[data-fps]` ne trouvait plus rien — en sortant
 * proprement, ce qui est le pire mode de panne pour un instrument.
 */
async function mesurerUne(slug: string): Promise<Releve | null> {
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate((cible: string) => {
    for (const article of document.querySelectorAll<HTMLElement>("article")) {
      if (!article.querySelector(`[data-viz="${cible}"]`)) article.style.display = "none";
    }
    window.scrollTo(0, 0);
  }, slug);

  await new Promise((r) => setTimeout(r, DUREE_MESURE_MS));

  return page.evaluate((cible: string) => {
    const noeud = document.querySelector<HTMLElement>(`[data-viz="${cible}"][data-fps]`);
    if (!noeud) return null;
    return {
      slug: cible,
      cadenceFps: Number(noeud.dataset["fps"]),
      jsMedianMs: Number(noeud.dataset["jsMedian"]),
      jsP95Ms: Number(noeud.dataset["jsP95"]),
      gpuBound: noeud.dataset["gpuBound"] === "true",
      echantillons: Number(noeud.dataset["echantillons"]),
    };
  }, slug);
}

const aMesurer = readdirSync(DOSSIER_VIZ, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

console.log(`\nMesure de ${aMesurer.length} viz, ${DUREE_MESURE_MS / 1000} s chacune…`);
const releves: Releve[] = [];
for (const slug of aMesurer) {
  const releve = await mesurerUne(slug);
  if (releve) releves.push(releve);
  else console.error(`  x  ${slug} : aucune mesure produite.`);
}

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
  // Repasser par Prettier : sans ça, `pnpm bench` laisse systématiquement
  // `pnpm verify` rouge sur le formatage des manifests qu'il vient d'écrire —
  // un gate qui salit ce qu'un autre gate vérifie.
  writeFileSync(
    chemin,
    await format(JSON.stringify(manifest, null, 2), { parser: "json", filepath: chemin }),
    "utf8",
  );
  console.log(
    `  ${releve.slug} : ${releve.cadenceFps} i/s · JS ${releve.jsMedianMs}/${releve.jsP95Ms} ms ` +
      `· ${releve.gpuBound ? "GPU-bound" : "CPU-bound"} · ${releve.echantillons} images`,
  );
}

console.log(`\nVERT — ${releves.length} viz mesuree(s), manifests mis a jour.\n`);
