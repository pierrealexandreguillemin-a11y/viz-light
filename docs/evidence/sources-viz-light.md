---
authority: ledger
subject: sources
last_verified: 2026-08-11
expires: 2026-09-11
---

# Sources — les 3 artifacts publiés du projet claude.ai « Viz Light »

> ⚠️ **Périssable** : ces URLs ne vivent que tant que l'utilisateur laisse les
> artifacts publiés. Le rapatriement brut dans `sources/` est l'étape 1 du fil
> d'Ariane — avant tout le reste. Une fois les fichiers commités, ce document
> passe en trace de provenance (`expires: never`).

| Fichier | Contenu | URL publiée |
|---|---|---|
| `tweet-sketches-artifact.html` | 18 sketches p5.js @yuruyurau (#つぶやきProcessing, fév.→août 2026), sélecteur par date | https://claude.ai/public/artifacts/9eb103da-83a0-424c-bd0e-cac1365ae85d |
| `banc-essai-effets.html` | 10 effets réglables (canvas2d / dom-css / webgl) + instrument live + toggles pédago | https://claude.ai/public/artifacts/c8acd119-bc03-40c5-854b-1bb62e1d1f07 |
| `genart-studio-standalone.html` | « Atelier génératif » : 5 algos paramétrables (Tunnel de points, Flow Field, Orbit Particles, Spiral Bloom, Noise Grid) | https://claude.ai/public/artifacts/b39973e0-64e3-4f88-8f10-135b83cd121e |

**Inventaire** : 18 + 10 + 5 = 33 viz, **~31 uniques** après déduplication.

**Doublons connus** (la version validée par l'utilisateur gagne, l'autre = variante
dans le manifest) :
- *Tunnel de points* : version « Atelier génératif » = **référence validée**
  (formule `i / 353`, `hsbToRgba` custom, traînée par fondu, Perlin optionnel,
  rotation souris, hue-bucketing) — cf. mémoire du projet claude.ai. Présent
  aussi dans les tweet-sketches (source d'origine).
- *Flow field* : présent dans le banc d'essai ET l'Atelier — version à faire
  trancher par l'utilisateur au moment de la migration.

**Accès de secours** si une URL meurt avant rapatriement : conversations du
projet claude.ai « Viz Light » (lecture via session Chrome authentifiée) —
conversations « Effets visuels légers et impactants pour le web »,
« Dé-minification et conversion en TypeScript », « Applications et sites web ».
