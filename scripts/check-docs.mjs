#!/usr/bin/env node
/**
 * check-docs.mjs — documentation gate for viz-light.
 * Projected from skills-templates/project-bootstrap (2026-08-11), rules unchanged.
 *
 * WHY IT EXISTS: on a long-lived project a tired reader (human or LLM) reads the
 * first document it finds and decides on it. If two documents contradict each
 * other, it decides wrong. This script makes that fault IMPOSSIBLE TO IGNORE:
 * it fails, it does not warn.
 *
 * It does not judge content — it enforces structural rules:
 *   1. there is ONE source of truth, dated, everything else declares itself
 *      subordinate to it;
 *   2. documentation is organized BY THEME, not by date. A fact is rewritten in
 *      its subject; only session narratives (handoff/) carry a date in their
 *      name;
 *   3. decisions (ADR) are immutable: superseded, never edited.
 *
 * No dependencies. Node >= 18. Usage: node scripts/check-docs.mjs
 * Exit code 0 = green, 1 = red.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const TODAY = new Date().toISOString().slice(0, 10);

const AUTHORITIES = ["canonical", "ledger", "annex", "archive"];
const ARCHIVE_BANNER = "NE PAS UTILISER POUR DÉCIDER";
const ADR_STATUSES = ["proposed", "accepted", "rejected", "superseded"];
/** Dossiers où un nom de fichier daté est légitime (récits chronologiques). */
const DATED_DIRS = ["/handoff/", "/archive/"];
const DATED_NAME = /^\d{4}-\d{2}-\d{2}[_-]/;
const ADR_NAME = /^\d{4}-[a-z0-9-]+\.md$/;

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}\n      → ${msg}`);
const warn = (file, msg) => warnings.push(`${file}\n      → ${msg}`);

/** Liste récursive des .md sous docs/. */
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".md") ? [full] : [];
  });
}

/** Parse minimaliste du frontmatter YAML (clés scalaires de premier niveau). */
function frontmatter(raw) {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  const out = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const files = walk(DOCS);
if (files.length === 0) {
  console.error("ROUGE : aucun document trouvé sous docs/.");
  process.exit(1);
}

const canonicals = [];

for (const full of files) {
  const rel = relative(ROOT, full).split(sep).join("/");
  const raw = readFileSync(full, "utf8");
  const fm = frontmatter(raw);
  const isArchive = rel.includes("/archive/");

  if (!fm) {
    fail(rel, "aucun frontmatter YAML. Chaque document doit déclarer son autorité.");
    continue;
  }

  // --- autorité ---
  if (!fm.authority) {
    fail(rel, `champ "authority" absent (attendu : ${AUTHORITIES.join(" | ")}).`);
  } else if (!AUTHORITIES.includes(fm.authority)) {
    fail(rel, `authority "${fm.authority}" inconnue (attendu : ${AUTHORITIES.join(" | ")}).`);
  }
  if (fm.authority === "canonical") canonicals.push(rel);

  // --- cohérence emplacement / autorité ---
  if (isArchive && fm.authority !== "archive") {
    fail(rel, `est dans docs/archive/ mais déclare authority "${fm.authority}".`);
  }
  if (!isArchive && fm.authority === "archive") {
    fail(rel, 'déclare authority "archive" mais n\'est pas dans docs/archive/. Déplace-le.');
  }

  // --- bannière obligatoire sur les archives ---
  if (isArchive && !raw.includes(ARCHIVE_BANNER)) {
    fail(rel, `document archivé sans la bannière « ${ARCHIVE_BANNER} » dans le corps.`);
  }

  // --- rangement par thème, pas par date ---
  const name = rel.split("/").pop();
  const inDatedDir = DATED_DIRS.some((d) => rel.includes(d));
  if (DATED_NAME.test(name) && !inDatedDir) {
    fail(
      rel,
      "nom de fichier daté hors de handoff/ et archive/. " +
        "La documentation se range PAR THÈME : renomme-le d'après son sujet et " +
        'porte la date dans "last_verified". Un document daté fige une information ' +
        "dans sa phase de recherche au lieu de la laisser se corriger.",
    );
  }
  if (rel.includes("/handoff/") && !DATED_NAME.test(name)) {
    fail(rel, "un handoff est un récit de session : son nom doit commencer par AAAA-MM-JJ.");
  }

  // --- ADR : immuables, numérotés, supersession explicite ---
  if (rel.includes("/decisions/")) {
    if (!ADR_NAME.test(name)) {
      fail(rel, "un ADR se nomme NNNN-titre-en-kebab.md (numéro à 4 chiffres).");
    }
    if (!fm.adr_status || !ADR_STATUSES.includes(fm.adr_status)) {
      fail(rel, `champ "adr_status" absent ou invalide (attendu : ${ADR_STATUSES.join(" | ")}).`);
    }
    if (fm.adr_status === "superseded" && !/\]\(\.\/\d{4}-/.test(raw)) {
      fail(
        rel,
        'ADR marqué "superseded" sans lien vers l\'ADR qui le remplace. ' +
          "Une décision annulée doit dire par quoi — sinon elle reste applicable en pratique.",
      );
    }
  }

  // --- evidence : chaque document déclare son sujet ---
  if (rel.includes("/evidence/") && !fm.subject) {
    fail(rel, 'champ "subject" absent. Un document de mesures se range par sujet.');
  }

  // --- datation ---
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.last_verified || "")) {
    fail(rel, 'champ "last_verified" absent ou mal formé (attendu AAAA-MM-JJ).');
  }
  if (fm.authority !== "archive") {
    if (!fm.expires || (fm.expires !== "never" && !/^\d{4}-\d{2}-\d{2}$/.test(fm.expires))) {
      fail(rel, 'champ "expires" absent ou mal formé (attendu AAAA-MM-JJ ou "never").');
    } else if (fm.expires !== "never" && fm.expires < TODAY) {
      fail(
        rel,
        `PÉRIMÉ depuis le ${fm.expires} (nous sommes le ${TODAY}). ` +
          "Les valeurs volatiles de ce document doivent être RE-MESURÉES, " +
          "puis expires repoussé. Ne pas repousser la date sans re-mesurer.",
      );
    } else if (fm.expires !== "never") {
      const days = Math.round((Date.parse(fm.expires) - Date.parse(TODAY)) / 86400000);
      if (days <= 7) warn(rel, `expire dans ${days} jour(s) — prévoir la re-mesure.`);
    }
  }
}

// --- règle centrale : une seule source de vérité ---
if (canonicals.length === 0) {
  errors.push(
    "AUCUN document canonique.\n" +
      '      → Exactement un document doit porter "authority: canonical". ' +
      "Sans lui, rien ne tranche en cas de contradiction.",
  );
} else if (canonicals.length > 1) {
  errors.push(
    `${canonicals.length} documents canoniques : ${canonicals.join(", ")}.\n` +
      "      → C'est précisément la situation que ce gate existe pour interdire. " +
      "Un seul doit rester canonical, les autres passent en ledger/annex/archive.",
  );
}

// --- le CLAUDE.md doit pointer vers le canonique ---
const claudeMd = join(ROOT, "CLAUDE.md");
if (!existsSync(claudeMd)) {
  errors.push("CLAUDE.md\n      → absent à la racine du projet.");
} else if (canonicals.length === 1) {
  const body = readFileSync(claudeMd, "utf8");
  const name = canonicals[0].split("/").pop();
  if (!body.includes(name)) {
    fail(
      "CLAUDE.md",
      `ne cite pas le document canonique (${name}). Une session neuve ne le trouvera pas.`,
    );
  }
}

// --- restitution ---
for (const w of warnings) console.log(`  ORANGE  ${w}`);

if (errors.length > 0) {
  console.error(`\nROUGE — ${errors.length} probleme(s) sur ${files.length} document(s) :\n`);
  for (const e of errors) console.error(`  x  ${e}\n`);
  console.error(
    "Un gate rouge = documentation a corriger. Ne jamais assouplir la regle pour passer.\n",
  );
  process.exit(1);
}

console.log(`\nVERT — ${files.length} document(s), 1 source de verite : ${canonicals[0]}`);
console.log(`Verifie le ${TODAY}.\n`);
process.exit(0);
