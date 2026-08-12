# CATALOG — Viz Light

<!-- GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main. -->

Catalogue des visualisations extractibles. **Contrat d'extraction** : copie le
dossier `src/viz/<slug>/` plus les fichiers de socle listés dans la fiche,
puis pose `<VizName />`. Les chiffres de coût sortent de `scripts/bench.mjs`
exécuté — jamais d'estimation.

## Les 1 viz

- **Tunnel de points** — Une gorge de poussière lumineuse qui respire et se tord lentement.

### Tunnel de points

*Une gorge de poussière lumineuse qui respire et se tord lentement.*

| | |
|---|---|
| Slug | `tunnel-de-points` |
| Runtime | canvas2d |
| Tags | tunnel, particules, hsb, souris |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 29 juillet 2026 — Tunnel de points (HSB) (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 3.1 ms médian, 3.55 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/tunnel-de-points/TunnelDePoints.tsx` · `src/viz/tunnel-de-points/algo.ts` · `src/viz/tunnel-de-points/manifest.json` · `src/core/viz/contrat.ts` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/FiletCout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |
| Variantes écartées | 29 juillet 2026 — original (version golfée, rendue par le préréglage « Origine ») · atelier-generatif / tunnel (même reprise, paramétrée autrement) |

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
