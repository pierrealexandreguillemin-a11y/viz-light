/**
 * L'EMPREINTE DU CODE — partagée entre le tampon (fin de `pnpm verify`) et le
 * gate de session qui la recompare. Ne couvre QUE ce que `verify` vérifie :
 * les commits purement documentaires ne périment pas un verify vert.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const PERIMETRE = [
  "src",
  "scripts",
  "tests",
  "package.json",
  "pnpm-lock.yaml",
  "eslint.config.mjs",
  "tsconfig.json",
  "vitest.config.ts",
];

const git = (racine, args) => execFileSync("git", args, { cwd: racine, encoding: "utf8" });

export function hashDuCode(racine) {
  // `git ls-files -s` donne les blobs indexés ; le diff couvre le non-commité.
  const index = git(racine, ["ls-files", "-s", "--", ...PERIMETRE]);
  const nonCommite = git(racine, ["diff", "--", ...PERIMETRE]);
  return createHash("sha256").update(index).update(nonCommite).digest("hex");
}
