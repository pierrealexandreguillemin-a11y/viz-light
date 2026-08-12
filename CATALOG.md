# CATALOG — Viz Light

<!-- GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main. -->

Catalogue des visualisations extractibles. **Contrat d'extraction** : copie le
dossier `src/viz/<slug>/` plus les fichiers de socle listés dans la fiche,
puis pose `<VizName />`. Les chiffres de coût sortent de `scripts/bench.mjs`
exécuté — jamais d'estimation.

## Les 5 viz

- **Anneau respirant** — Un anneau de poussière qui se gonfle et se dégonfle, comme un souffle.
- **Coquille cannelée** — Un coquillage strié qui s'ouvre lentement vers le spectateur.
- **Spirale tressée** — Des mèches qui s'enroulent et se dénouent sans jamais se rompre.
- **Tunnel de points** — Une gorge de poussière lumineuse qui respire et se tord lentement.
- **Voile tournante** — Une étoffe prise dans un courant, qui claque et retombe.

### Anneau respirant

*Un anneau de poussière qui se gonfle et se dégonfle, comme un souffle.*

| | |
|---|---|
| Slug | `anneau-respirant` |
| Runtime | canvas2d |
| Tags | anneau, souffle, particules |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 1er août 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 6 ms médian, 8.07 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/anneau-respirant/AnneauRespirant.tsx` · `src/viz/anneau-respirant/algo.ts` · `src/viz/anneau-respirant/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Coquille cannelée

*Un coquillage strié qui s'ouvre lentement vers le spectateur.*

| | |
|---|---|
| Slug | `coquille-cannelee` |
| Runtime | canvas2d |
| Tags | coquille, cannelure, dense |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 8 août 2026 — #1 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 13.65 ms médian, 17.15 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/coquille-cannelee/CoquilleCannelee.tsx` · `src/viz/coquille-cannelee/algo.ts` · `src/viz/coquille-cannelee/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Spirale tressée

*Des mèches qui s'enroulent et se dénouent sans jamais se rompre.*

| | |
|---|---|
| Slug | `spirale-tressee` |
| Runtime | canvas2d |
| Tags | spirale, tresse, particules |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 9 août 2026 — #1 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 10.3 ms médian, 14.5 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/spirale-tressee/SpiraleTressee.tsx` · `src/viz/spirale-tressee/algo.ts` · `src/viz/spirale-tressee/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Tunnel de points

*Une gorge de poussière lumineuse qui respire et se tord lentement.*

| | |
|---|---|
| Slug | `tunnel-de-points` |
| Runtime | canvas2d |
| Tags | tunnel, particules, hsb, souris |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 29 juillet 2026 — Tunnel de points (HSB) (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 3.3 ms médian, 4.71 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/tunnel-de-points/TunnelDePoints.tsx` · `src/viz/tunnel-de-points/algo.ts` · `src/viz/tunnel-de-points/manifest.json` · `src/core/viz/contrat.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |
| Variantes écartées | 29 juillet 2026 — original (version golfée, rendue par le préréglage « Origine ») · atelier-generatif / tunnel (même reprise, paramétrée autrement) |

### Voile tournante

*Une étoffe prise dans un courant, qui claque et retombe.*

| | |
|---|---|
| Slug | `voile-tournante` |
| Runtime | canvas2d |
| Tags | voile, rotation, particules |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 9 août 2026 — #2 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 5.9 ms médian, 7.62 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · Chrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/voile-tournante/VoileTournante.tsx` · `src/viz/voile-tournante/algo.ts` · `src/viz/voile-tournante/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

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
