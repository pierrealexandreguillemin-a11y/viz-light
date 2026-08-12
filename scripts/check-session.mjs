#!/usr/bin/env node
/**
 * LE GATE DE SESSION — `pnpm session`. Mécanique, rapide, déterministe.
 *
 * Sert aux DEUX bouts : la clôture doit le passer (dernier geste du skill
 * `project-session-end`), et l'ouverture commence par lui (hook SessionStart) —
 * une clôture bâclée est donc détectée au plus tard au démarrage suivant, sans
 * dépendre de la discipline de personne. Un seuil que rien n'exécute n'est pas
 * un gate ; celui-ci exécute.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { hashDuCode } from "./empreinte-code.mjs";

const RACINE = join(import.meta.dirname, "..");
const problemes = [];
const git = (...args) => execFileSync("git", args, { cwd: RACINE, encoding: "utf8" }).trim();

// 1 — Arbre git propre : une clôture ne laisse rien en suspens.
const sale = git("status", "--porcelain");
if (sale !== "") {
  problemes.push(
    `arbre git sale :\n${sale
      .split("\n")
      .slice(0, 5)
      .map((l) => `       ${l}`)
      .join("\n")}`,
  );
}

// 2 — Gate documentaire (délégué, jamais dupliqué).
const docs = spawnSync(process.execPath, ["scripts/check-docs.mjs"], {
  cwd: RACINE,
  encoding: "utf8",
});
if (docs.status !== 0) {
  problemes.push(
    `check-docs ROUGE :\n${(docs.stdout + docs.stderr).trim().split("\n").slice(1, 4).join("\n")}`,
  );
}

// 3 — `pnpm verify` a tourné VERT sur CE code exact (tampon posé en bout de chaîne).
const cheminTampon = join(RACINE, ".verify-stamp");
if (!existsSync(cheminTampon)) {
  problemes.push(
    "aucun tampon verify — lance `pnpm verify` (le tampon se pose seul en bout de chaîne).",
  );
} else if (readFileSync(cheminTampon, "utf8").trim() !== hashDuCode(RACINE)) {
  problemes.push("le code a changé depuis le dernier `pnpm verify` vert — relance-le.");
}

// 4 — Le fil d'Ariane ne ment pas : le « N/31 » de la SPEC = dossiers réels.
const spec = readFileSync(join(RACINE, "docs", "SPEC.md"), "utf8");
const annonce = /\*\*(\d+)\/31\*\*/.exec(spec)?.[1];
const reels = readdirSync(join(RACINE, "src", "viz"), { withFileTypes: true }).filter((e) =>
  e.isDirectory(),
).length;
if (annonce === undefined) {
  problemes.push("SPEC.md n'annonce plus de compte « **N/31** » — fil d'Ariane illisible.");
} else if (Number(annonce) !== reels) {
  problemes.push(`SPEC.md annonce ${annonce}/31 mais src/viz/ contient ${reels} viz.`);
}

// 5 — Le dernier commit a son handoff : récit ≥ date du dernier commit.
const dateCommit = git("log", "-1", "--format=%cs");
const handoffs = readdirSync(join(RACINE, "docs", "handoff")).filter((n) =>
  /^\d{4}-\d{2}-\d{2}_/.test(n),
);
const dernierHandoff =
  handoffs
    .map((n) => n.slice(0, 10))
    .sort()
    .at(-1) ?? "aucun";
if (dernierHandoff < dateCommit) {
  problemes.push(
    `dernier commit du ${dateCommit} sans handoff (dernier récit : ${dernierHandoff}).`,
  );
}

if (problemes.length > 0) {
  console.error(`\nROUGE — session non conforme, ${problemes.length} problème(s) :\n`);
  for (const p of problemes) console.error(`  x  ${p}`);
  console.error("\nUn gate rouge = clôture à corriger MAINTENANT, jamais à reporter.\n");
  process.exit(1);
}
console.log(
  `\nVERT — session saine : arbre propre, docs OK, verify tamponné sur ce code, fil d'Ariane exact (${reels}/31), handoff du ${dernierHandoff}.\n`,
);
