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
       * ⚠ `include` et `thresholds` sont VOLONTAIREMENT VIDES À L'ÉTAPE 3.
       *
       * Le socle se câble avant la première viz, mais un plancher de
       * couverture posé sur un dépôt sans logique métier ne garde rien : il
       * afficherait 100 % sur trois fichiers de coquille et donnerait
       * l'illusion d'un gate. « Un seuil documenté que rien n'exécute n'est
       * pas un gate » vaut aussi pour un seuil que rien ne peut faire rougir.
       *
       * Le plancher est posé à l'ÉTAPE 4, sur le premier code qui décide
       * quelque chose (schéma de manifest + registre), mesuré avant d'être
       * fixé, et jamais abaissé ensuite.
       */
      include: [],
      reporter: ["text", "html"],
    },
  },
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
});
