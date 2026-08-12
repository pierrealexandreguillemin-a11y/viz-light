#!/usr/bin/env node
/**
 * DERNIER MAILLON DE `pnpm verify` : tamponne l'empreinte du code vérifié.
 * N'est atteint QUE si toute la chaîne est verte (enchaînement par `&&`).
 * `scripts/check-session.mjs` recompare ce tampon à l'état courant.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { hashDuCode } from "./empreinte-code.mjs";

const RACINE = join(import.meta.dirname, "..");
writeFileSync(join(RACINE, ".verify-stamp"), `${hashDuCode(RACINE)}\n`);
console.log("Tampon verify posé (.verify-stamp).");
