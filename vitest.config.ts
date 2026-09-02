import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // Explicite plutôt que par défaut : Vitest possède `tests/`, et rien
    // d'autre. Sans cette ligne, le glob par défaut balaierait aussi
    // `sources/` et `out/`.
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      /**
       * LE PLANCHER GARDE LE CODE QUI DÉCIDE, PAS LES COQUILLES.
       *
       * Posé à l'étape 4 (2026-08-12) sur les trois modules qui tranchent
       * quelque chose : le validateur de manifest (il refuse ou accepte une
       * viz), le rendu du catalogue et le générateur de registre (ils
       * produisent des fichiers que personne ne relit ensuite). Les composants
       * React et la coquille d'app n'y sont pas : les couvrir gonflerait le
       * chiffre sans rien garder.
       *
       * Les seuils ci-dessous ont été MESURÉS d'abord, puis fixés juste en
       * dessous du mesuré. Ils se relèvent quand la mesure monte, jamais
       * l'inverse — un plancher sous ce que le code atteint déjà ne protège
       * plus rien.
       */
      include: [
        "src/core/manifest/valider.ts",
        "src/core/catalogue/rendre.ts",
        "src/core/registre/generer.ts",
        // Ajouté le 2026-09-02 : le gate de la liste d'extraction décide, lui
        // aussi, ce qu'un claude+n copie — il entre sous le plancher.
        "src/core/extraction/verifier.ts",
      ],
      reporter: ["text", "html"],
      /**
       * Mesuré le 2026-08-12 AVANT d'être fixé : 94,66 / 93,51 / 97,14 / 100.
       * Les seuils sont posés juste en dessous — assez près pour qu'une
       * régression réelle les franchisse, pas assez pour clignoter au moindre
       * refactor. Ils se relèvent quand la mesure monte ; ils ne s'abaissent
       * jamais pour faire passer un build.
       *
       * ⚠ Piège du rapport `text` : il OMET les fichiers couverts à 100 % sur
       * les quatre colonnes. `generer.ts` en a disparu alors qu'il était bien
       * couvert. Pour vérifier qu'un fichier est réellement suivi, lire
       * `coverage/coverage-summary.json`, pas le tableau de la console.
       */
      // Re-mesuré le 2026-09-02 avec le gate d'extraction sous le plancher :
      // 97,06 / 94,5 / 98,33 / 100 → relevés à 96 / 94 / 98 / 99.
      thresholds: { statements: 96, branches: 94, functions: 98, lines: 99 },
    },
  },
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
});
