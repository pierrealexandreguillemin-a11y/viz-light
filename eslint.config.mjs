import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Seuils mécaniques (SPEC.md §5). Ce sont des GATES, pas des suggestions : une
 * violation fait échouer `pnpm lint`. Chaque seuil est calibré dans les deux
 * sens — il doit rougir sur l'état fautif connu et passer sur l'état corrigé —
 * et les preuves de calibration vivent dans docs/evidence/socle-qualite.md.
 */
const quality = {
  files: ["**/*.ts", "**/*.tsx"],
  plugins: { sonarjs },
  rules: {
    // Chemins d'exécution.
    complexity: ["error", 10],
    "max-depth": ["error", 4],
    "max-lines-per-function": ["error", { max: 80, skipBlankLines: true, skipComments: true }],
    // « Jamais de code monolithique » : max-lines-per-function ne dit rien d'un
    // fichier fait de trente petites fonctions.
    "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
    // La complexité COGNITIVE mesure la difficulté de LECTURE (imbrication,
    // ruptures de flot) ; la cyclomatique compte les chemins. Deux métriques
    // distinctes, donc deux gates.
    "sonarjs/cognitive-complexity": ["error", 15],
    // Duplication INTRA-fichier (le détecteur inter-fichiers est jscpd).
    "sonarjs/no-identical-functions": "error",
    "sonarjs/no-duplicate-string": ["error", { threshold: 4 }],
    "@typescript-eslint/no-explicit-any": "error",
  },
};

/**
 * Règles TYPE-AWARE — celles qui ont besoin du vérificateur de types, pas
 * seulement de l'arbre syntaxique. Ce sont les seules capables de voir qu'une
 * promesse n'a jamais été attendue : un linter syntaxique n'en voit rien.
 * C'est aussi la raison pour laquelle TypeScript est plafonné à 6.0.3
 * (ADR 0007) — ces règles n'existent pas au-delà.
 */
const typeAware = {
  files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "scripts/**/*.{ts,mts}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { project: ["./tsconfig.json"], tsconfigRootDir: import.meta.dirname },
  },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    // Avec `noUncheckedIndexedAccess`, une garde redondante trahit presque
    // toujours une lecture fausse des types.
    "@typescript-eslint/no-unnecessary-condition": "error",
  },
};

/**
 * FRONTIÈRE DE PORTABILITÉ — le gate propre à ce projet (SPEC.md §3).
 *
 * Le contrat d'extraction repose entièrement sur un fait : dans chaque viz,
 * `algo.ts` est du TypeScript PUR. S'il importe React, la copie de dossier
 * cesse de suffire et le contrat se casse en silence — aucun autre gate ne le
 * verrait, parce que « qui a le droit d'importer React » est un fait
 * d'architecture, pas de syntaxe.
 */
const portability = {
  files: ["src/viz/**/algo.ts", "src/viz/**/algo/**/*.ts"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            message:
              "algo.ts est du TS pur : la coquille React importe l'algo, jamais l'inverse (SPEC.md §3).",
          },
          {
            name: "react-dom",
            message: "algo.ts est du TS pur (SPEC.md §3).",
          },
          {
            name: "next",
            message: "algo.ts est du TS pur (SPEC.md §3).",
          },
        ],
        patterns: [
          {
            group: ["react/*", "next/*", "@/core/hooks/*"],
            message:
              "algo.ts ne dépend d'aucun socle React : c'est ce qui rend l'extraction triviale (SPEC.md §3).",
          },
        ],
      },
    ],
  },
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  quality,
  typeAware,
  portability,
  // Doit rester en dernier : éteint les règles stylistiques qui se battraient
  // avec Prettier.
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "coverage/**",
    // Archives brutes, versionnées telles que publiées (bundles minifiés).
    "sources/**",
  ]),
]);
