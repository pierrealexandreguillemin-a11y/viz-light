# CATALOG — Viz Light

<!-- GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main. -->

Catalogue des visualisations extractibles. **Contrat d'extraction** : copie le
dossier `src/viz/<slug>/` plus les fichiers de socle listés dans la fiche,
puis pose `<VizName />`. Les chiffres de coût sortent de `scripts/bench.mjs`
exécuté — jamais d'estimation.

## Aucune viz publiée

Le contrat de données est en place, la migration n'a pas commencé.
Suivi : `docs/SPEC.md`, section « Fil d'Ariane ».

## Hôte non-React

Aucun consommateur réel aujourd'hui — d'où une recette générique plutôt qu'un
adaptateur par viz. Reprends `algo.ts` (TypeScript pur, sans aucun import
React) et monte-le toi-même :

```ts
import { creerAlgo } from "./algo.ts";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const algo = creerAlgo({ largeur: canvas.width, hauteur: canvas.height });

let precedent = 0;
function image(maintenant: number) {
  const delta = Math.min((maintenant - precedent) / 1000, 0.1);
  precedent = maintenant;
  algo.frame(ctx, delta);
  requestAnimationFrame(image);
}
requestAnimationFrame(image);
```

Trois choses restent à ta charge, que le socle React fait sinon pour toi :
le plafond de densité de pixels (DPR), la mise en pause quand l'onglet est
caché, et le respect de `prefers-reduced-motion`.
