# CATALOG — Viz Light

<!-- GÉNÉRÉ par `pnpm catalog` — ne pas éditer à la main. -->

Catalogue des visualisations extractibles. **Contrat d'extraction** : copie le
dossier `src/viz/<slug>/` plus les fichiers de socle listés dans la fiche,
puis pose `<VizName />`. Les chiffres de coût sortent de `scripts/bench.mjs`
exécuté — jamais d'estimation.

## Les 31 viz

- **Anémone marine** — Une anémone posée au fond, dont les tentacules cherchent le courant.
- **Anneau respirant** — Un anneau de poussière qui se gonfle et se dégonfle, comme un souffle.
- **Attracteur de Lorenz** — Le papillon du chaos, retracé trente mille fois par seconde.
- **Aurore boréale** — Des rideaux de lumière qui ondulent dans un ciel noir.
- **Balayage radar** — Un faisceau qui tourne et réveille des échos au passage.
- **Colonne perlée** — Une colonne de perles qui roule très lentement sur elle-même.
- **Constellation** — Des points en dérive lente qui se relient quand ils se frôlent.
- **Coquille cannelée** — Un coquillage strié qui s'ouvre lentement vers le spectateur.
- **Coquille jumelle** — Un coquillage refermé sur lui-même, qui respire sans jamais s'ouvrir.
- **Corolle de marée** — Une fleur d'eau qui monte et redescend avec la marée.
- **Couronne battante** — Une couronne qui bat comme une méduse, deux fois par tour.
- **Éventail cranté** — Un éventail qui s'ouvre par crans, comme un mécanisme d'horlogerie.
- **Flow field** — Des filaments qui suivent un courant invisible.
- **Grain de film** — Une pellicule qui vit doucement sur un dégradé sombre.
- **Grille synthwave** — Un soleil strié sur une grille qui file vers l'horizon.
- **Médaillon tournant** — Un médaillon suspendu qui tourne, hésite, et repart.
- **Mesh gradient** — Une nappe de couleurs fondues qui respire à peine.
- **Noise Grid** — Une grille de cellules qui respirent au passage d'un plan de bruit.
- **Orbes floutées** — De grandes lueurs molles qui dérivent l'une dans l'autre.
- **Orbit Particles** — Des corps tournent autour de quelques centres, et leurs anneaux se recouvrent.
- **Plasma déformé** — Une matière liquide qui se plie et se replie sans fin.
- **Poussière d'étoiles** — Un ciel calme où chaque point scintille à son propre rythme.
- **Rosace fondatrice** — La première rosace de la série — celle dont toutes les autres descendent.
- **Rosace jumelle** — Deux rosaces jumelles, l'une pulsant quand l'autre se repose.
- **Rosace triple** — Trois pétales de lumière tournent l'un dans l'autre, à contretemps.
- **Ruban ondulé** — Le même ruban, plus large, qui ondule au lieu de se plisser.
- **Ruban plissé** — Un ruban de soie plissé qui glisse sans jamais se froisser.
- **Spiral Bloom** — Une spirale qui s'ouvre une fois, puis respire sous le bruit.
- **Spirale tressée** — Des mèches qui s'enroulent et se dénouent sans jamais se rompre.
- **Tunnel de points** — Une gorge de poussière lumineuse qui respire et se tord lentement.
- **Voile tournante** — Une étoffe prise dans un courant, qui claque et retombe.

### Anémone marine

*Une anémone posée au fond, dont les tentacules cherchent le courant.*

| | |
|---|---|
| Slug | `anemone-marine` |
| Runtime | canvas2d |
| Tags | anémone, tentacule, marin |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 7 mars 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 16.3 ms médian, 17.46 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/anemone-marine/AnemoneMarine.tsx` · `src/viz/anemone-marine/algo.ts` · `src/viz/anemone-marine/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Anneau respirant

*Un anneau de poussière qui se gonfle et se dégonfle, comme un souffle.*

| | |
|---|---|
| Slug | `anneau-respirant` |
| Runtime | canvas2d |
| Tags | anneau, souffle, particules |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 1er août 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 4.55 ms médian, 4.9 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/anneau-respirant/AnneauRespirant.tsx` · `src/viz/anneau-respirant/algo.ts` · `src/viz/anneau-respirant/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Attracteur de Lorenz

*Le papillon du chaos, retracé trente mille fois par seconde.*

| | |
|---|---|
| Slug | `attracteur-de-lorenz` |
| Runtime | canvas2d |
| Tags | chaos, attracteur, trajectoire |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 9 mai 2026 (tweet-sketches) |
| Coût mesuré | 30 i/s · JS 33.9 ms médian, 37.71 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/attracteur-de-lorenz/AttracteurDeLorenz.tsx` · `src/viz/attracteur-de-lorenz/algo.ts` · `src/viz/attracteur-de-lorenz/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Aurore boréale

*Des rideaux de lumière qui ondulent dans un ciel noir.*

| | |
|---|---|
| Slug | `aurore-boreale` |
| Runtime | webgl |
| Tags | aurore, shader, rideaux |
| Rendus | **Réglages** (défaut) |
| Origine | aurora (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.1 ms médian, 0.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/aurore-boreale/AuroreBoreale.tsx` · `src/viz/aurore-boreale/algo.ts` · `src/viz/aurore-boreale/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/plein-ecran-gl.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Balayage radar

*Un faisceau qui tourne et réveille des échos au passage.*

| | |
|---|---|
| Slug | `balayage-radar` |
| Runtime | canvas2d |
| Tags | radar, balayage, echos |
| Rendus | **Réglages** (défaut) |
| Origine | scan (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0 ms médian, 0.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/balayage-radar/BalayageRadar.tsx` · `src/viz/balayage-radar/algo.ts` · `src/viz/balayage-radar/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Colonne perlée

*Une colonne de perles qui roule très lentement sur elle-même.*

| | |
|---|---|
| Slug | `colonne-perlee` |
| Runtime | canvas2d |
| Tags | perle, colonne, lent |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 7 mai 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 4.4 ms médian, 4.85 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/colonne-perlee/ColonnePerlee.tsx` · `src/viz/colonne-perlee/algo.ts` · `src/viz/colonne-perlee/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Constellation

*Des points en dérive lente qui se relient quand ils se frôlent.*

| | |
|---|---|
| Slug | `constellation` |
| Runtime | canvas2d |
| Tags | reseau, liaisons, points |
| Rendus | **Réglages** (défaut) |
| Origine | constellation (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.7 ms médian, 0.9 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/constellation/Constellation.tsx` · `src/viz/constellation/algo.ts` · `src/viz/constellation/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Coquille cannelée

*Un coquillage strié qui s'ouvre lentement vers le spectateur.*

| | |
|---|---|
| Slug | `coquille-cannelee` |
| Runtime | canvas2d |
| Tags | coquille, cannelure, dense |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 8 août 2026 — #1 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 7.9 ms médian, 8.55 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/coquille-cannelee/CoquilleCannelee.tsx` · `src/viz/coquille-cannelee/algo.ts` · `src/viz/coquille-cannelee/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Coquille jumelle

*Un coquillage refermé sur lui-même, qui respire sans jamais s'ouvrir.*

| | |
|---|---|
| Slug | `coquille-jumelle` |
| Runtime | canvas2d |
| Tags | coquille, cannelure, dense |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 8 août 2026 — #2 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 7.3 ms médian, 7.85 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/coquille-jumelle/CoquilleJumelle.tsx` · `src/viz/coquille-jumelle/algo.ts` · `src/viz/coquille-jumelle/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Corolle de marée

*Une fleur d'eau qui monte et redescend avec la marée.*

| | |
|---|---|
| Slug | `corolle-de-maree` |
| Runtime | canvas2d |
| Tags | corolle, vague, marée |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 25 juillet 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 4.7 ms médian, 5.26 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/corolle-de-maree/CorolleDeMaree.tsx` · `src/viz/corolle-de-maree/algo.ts` · `src/viz/corolle-de-maree/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Couronne battante

*Une couronne qui bat comme une méduse, deux fois par tour.*

| | |
|---|---|
| Slug | `couronne-battante` |
| Runtime | canvas2d |
| Tags | couronne, méduse, battement |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 6 mars 2026 (tweet-sketches) |
| Coût mesuré | 30 i/s · JS 33.2 ms médian, 36.2 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/couronne-battante/CouronneBattante.tsx` · `src/viz/couronne-battante/algo.ts` · `src/viz/couronne-battante/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Éventail cranté

*Un éventail qui s'ouvre par crans, comme un mécanisme d'horlogerie.*

| | |
|---|---|
| Slug | `eventail-crante` |
| Runtime | canvas2d |
| Tags | éventail, cran, mécanique |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 24 juillet 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 8.5 ms médian, 9.5 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/eventail-crante/EventailCrante.tsx` · `src/viz/eventail-crante/algo.ts` · `src/viz/eventail-crante/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Flow field

*Des filaments qui suivent un courant invisible.*

| | |
|---|---|
| Slug | `flow-field` |
| Runtime | canvas2d |
| Tags | particules, bruit, courant |
| Rendus | **Réglages** (défaut) |
| Origine | flow (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.8 ms médian, 1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/flow-field/FlowField.tsx` · `src/viz/flow-field/algo.ts` · `src/viz/flow-field/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |
| Variantes écartées | Une seconde version vit dans l'Atelier génératif (« flow-field ») — l'arbitrage esthétique entre les deux appartient à l'utilisateur (SPEC.md §4). |

### Grain de film

*Une pellicule qui vit doucement sur un dégradé sombre.*

| | |
|---|---|
| Slug | `grain-de-film` |
| Runtime | canvas2d |
| Tags | grain, texture, pellicule |
| Rendus | **Réglages** (défaut) |
| Origine | grain (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.1 ms médian, 0.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/grain-de-film/GrainDeFilm.tsx` · `src/viz/grain-de-film/algo.ts` · `src/viz/grain-de-film/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Grille synthwave

*Un soleil strié sur une grille qui file vers l'horizon.*

| | |
|---|---|
| Slug | `grille-synthwave` |
| Runtime | canvas2d |
| Tags | retro, grille, horizon |
| Rendus | **Réglages** (défaut) |
| Origine | synthwave (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.1 ms médian, 0.16 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/grille-synthwave/GrilleSynthwave.tsx` · `src/viz/grille-synthwave/algo.ts` · `src/viz/grille-synthwave/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Médaillon tournant

*Un médaillon suspendu qui tourne, hésite, et repart.*

| | |
|---|---|
| Slug | `medaillon-tournant` |
| Runtime | canvas2d |
| Tags | médaillon, rotation, rond |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 10 mars 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 15.5 ms médian, 16.9 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/medaillon-tournant/MedaillonTournant.tsx` · `src/viz/medaillon-tournant/algo.ts` · `src/viz/medaillon-tournant/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Mesh gradient

*Une nappe de couleurs fondues qui respire à peine.*

| | |
|---|---|
| Slug | `mesh-gradient` |
| Runtime | dom-css |
| Tags | degrade, nappe, css |
| Rendus | **Réglages** (défaut) |
| Origine | mesh (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0 ms médian, 0.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/mesh-gradient/MeshGradient.tsx` · `src/viz/mesh-gradient/algo.ts` · `src/viz/mesh-gradient/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Noise Grid

*Une grille de cellules qui respirent au passage d'un plan de bruit.*

| | |
|---|---|
| Slug | `noise-grid` |
| Runtime | canvas2d |
| Tags | grille, bruit, respiration |
| Rendus | **Origine** (défaut) |
| Origine | noise-grid (atelier-generatif) |
| Coût mesuré | 59.9 i/s · JS 1.2 ms médian, 1.5 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/noise-grid/NoiseGrid.tsx` · `src/viz/noise-grid/algo.ts` · `src/viz/noise-grid/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/toile.ts` · `src/core/viz/reglages.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` · `src/core/viz/bruit-perlin.ts` |

### Orbes floutées

*De grandes lueurs molles qui dérivent l'une dans l'autre.*

| | |
|---|---|
| Slug | `orbes-floutees` |
| Runtime | dom-css |
| Tags | flou, lueurs, css |
| Rendus | **Réglages** (défaut) |
| Origine | orbs (banc-essai) |
| Coût mesuré | 30 i/s · JS 0.2 ms médian, 0.3 ms p95 · GPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/orbes-floutees/OrbesFloutees.tsx` · `src/viz/orbes-floutees/algo.ts` · `src/viz/orbes-floutees/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Orbit Particles

*Des corps tournent autour de quelques centres, et leurs anneaux se recouvrent.*

| | |
|---|---|
| Slug | `orbit-particles` |
| Runtime | canvas2d |
| Tags | orbite, anneaux, particules |
| Rendus | **Origine** (défaut) |
| Origine | orbit-particles (atelier-generatif) |
| Coût mesuré | 59.9 i/s · JS 0.1 ms médian, 0.2 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/orbit-particles/OrbitParticles.tsx` · `src/viz/orbit-particles/algo.ts` · `src/viz/orbit-particles/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/toile.ts` · `src/core/viz/reglages.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Plasma déformé

*Une matière liquide qui se plie et se replie sans fin.*

| | |
|---|---|
| Slug | `plasma-deforme` |
| Runtime | webgl |
| Tags | plasma, shader, liquide |
| Rendus | **Réglages** (défaut) |
| Origine | plasma (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.1 ms médian, 0.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/plasma-deforme/PlasmaDeforme.tsx` · `src/viz/plasma-deforme/algo.ts` · `src/viz/plasma-deforme/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/plein-ecran-gl.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Poussière d'étoiles

*Un ciel calme où chaque point scintille à son propre rythme.*

| | |
|---|---|
| Slug | `poussiere-d-etoiles` |
| Runtime | canvas2d |
| Tags | etoiles, scintillement, nuit |
| Rendus | **Réglages** (défaut) |
| Origine | sparse (banc-essai) |
| Coût mesuré | 59.9 i/s · JS 0.2 ms médian, 0.3 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/poussiere-d-etoiles/PoussiereDEtoiles.tsx` · `src/viz/poussiere-d-etoiles/algo.ts` · `src/viz/poussiere-d-etoiles/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/reglages.ts` · `src/core/viz/toile.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Rosace fondatrice

*La première rosace de la série — celle dont toutes les autres descendent.*

| | |
|---|---|
| Slug | `rosace-fondatrice` |
| Runtime | canvas2d |
| Tags | rosace, origine, symétrie |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 22 février 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 16.05 ms médian, 18.02 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/rosace-fondatrice/RosaceFondatrice.tsx` · `src/viz/rosace-fondatrice/algo.ts` · `src/viz/rosace-fondatrice/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Rosace jumelle

*Deux rosaces jumelles, l'une pulsant quand l'autre se repose.*

| | |
|---|---|
| Slug | `rosace-jumelle` |
| Runtime | canvas2d |
| Tags | rosace, jumelle, pulsation |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 5 mai 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 15.1 ms médian, 17.76 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/rosace-jumelle/RosaceJumelle.tsx` · `src/viz/rosace-jumelle/algo.ts` · `src/viz/rosace-jumelle/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Rosace triple

*Trois pétales de lumière tournent l'un dans l'autre, à contretemps.*

| | |
|---|---|
| Slug | `rosace-triple` |
| Runtime | canvas2d |
| Tags | rosace, symétrie, pétales |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 31 juillet 2026 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 7.8 ms médian, 8.56 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/rosace-triple/RosaceTriple.tsx` · `src/viz/rosace-triple/algo.ts` · `src/viz/rosace-triple/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Ruban ondulé

*Le même ruban, plus large, qui ondule au lieu de se plisser.*

| | |
|---|---|
| Slug | `ruban-ondule` |
| Runtime | canvas2d |
| Tags | ruban, onde, soie |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 8 mars 2026 — #2 (tweet-sketches) |
| Coût mesuré | 59.5 i/s · JS 18.5 ms médian, 19.81 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/ruban-ondule/RubanOndule.tsx` · `src/viz/ruban-ondule/algo.ts` · `src/viz/ruban-ondule/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Ruban plissé

*Un ruban de soie plissé qui glisse sans jamais se froisser.*

| | |
|---|---|
| Slug | `ruban-plisse` |
| Runtime | canvas2d |
| Tags | ruban, pli, soie |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 8 mars 2026 — #1 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 17.4 ms médian, 20.11 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/ruban-plisse/RubanPlisse.tsx` · `src/viz/ruban-plisse/algo.ts` · `src/viz/ruban-plisse/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/champ-de-points.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` |

### Spiral Bloom

*Une spirale qui s'ouvre une fois, puis respire sous le bruit.*

| | |
|---|---|
| Slug | `spiral-bloom` |
| Runtime | canvas2d |
| Tags | spirale, floraison, dégradé |
| Rendus | **Origine** (défaut) |
| Origine | spiral-bloom (atelier-generatif) |
| Coût mesuré | 59.9 i/s · JS 1.2 ms médian, 1.4 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
| Dépendances | aucune |
| À copier | `src/viz/spiral-bloom/SpiralBloom.tsx` · `src/viz/spiral-bloom/algo.ts` · `src/viz/spiral-bloom/manifest.json` · `src/core/viz/contrat.ts` · `src/core/viz/toile.ts` · `src/core/viz/reglages.ts` · `src/core/composants/creerCoquille.tsx` · `src/core/composants/SceneViz.tsx` · `src/core/composants/LimiteErreur.tsx` · `src/core/composants/Cout.tsx` · `src/core/hooks/useBoucleAnimation.ts` · `src/core/hooks/useSurface.ts` · `src/core/hooks/useVisible.ts` · `src/core/hooks/usePreferenceMouvement.ts` · `src/core/hooks/useInstrument.ts` · `src/core/instrument/mesures.ts` · `src/core/viz/bruit-perlin.ts` |

### Spirale tressée

*Des mèches qui s'enroulent et se dénouent sans jamais se rompre.*

| | |
|---|---|
| Slug | `spirale-tressee` |
| Runtime | canvas2d |
| Tags | spirale, tresse, particules |
| Rendus | Origine · **Aligné** (défaut) |
| Origine | 9 août 2026 — #1 (tweet-sketches) |
| Coût mesuré | 59.9 i/s · JS 6.5 ms médian, 7.51 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
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
| Coût mesuré | 59.9 i/s · JS 2.7 ms médian, 3.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
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
| Coût mesuré | 59.9 i/s · JS 4.7 ms médian, 5.1 ms p95 · CPU-bound · mesuré le 2026-08-12 sur win32 x64 · HeadlessChrome/151.0.7922.77 |
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
