---
authority: annex
last_verified: 2026-08-12
expires: never
---

# Handoff — 2026-08-12 (2e session) · les 10 fonds, et deux pannes trouvées

**Point de départ** : étape 6 à 5/31, section « Fonds » vide, utilisateur en
colère (« machine à gaz », « KISS ») — et un symptôme récurrent inexpliqué :
`npmjs.com/package/viz-light` s'ouvrait dans son navigateur.
**Point d'arrivée** : étape 6 à **15/31**, section « Fonds » pleine (10 fonds
réglables), `pnpm verify` **exit 0**, les deux pannes comprises et corrigées.

## 1. Ce qui a été fait

### Les 10 fonds du banc d'essai (régime « technique », ADR 0010)

`orbes-floutees`, `mesh-gradient` (dom-css) · `grain-de-film`,
`poussiere-d-etoiles`, `flow-field`, `constellation`, `grille-synthwave`,
`balayage-radar` (canvas2d) · `aurore-boreale`, `plasma-deforme` (webgl).
Réécrits depuis `claim`/`reality`/`params` de la source — le bundle minifié
n'a jamais été un obstacle. Tous mesurés, tous prouvés vivants dans la page
construite (sonde par scroll : pixels allumés ou éléments présents), les
interrupteurs pédagogiques du banc d'origine conservés (flou animé, mode n²,
halo par point, feTurbulence animé, repeint).

### Le schéma de réglages porte trois genres

`curseur` (défaut), `interrupteur` (0|1), `couleur` (chaîne CSS, hex dans les
manifests — donnée de viz, même frontière que le gate OKLCH). Validateur
branché par genre, calibré dans les deux sens ; panneau avec case à cocher et
`input color`. Sans ça, migrer les fonds aurait refait l'erreur n°7 (réglages
perdus).

### Socle ajouté (petit, réutilisé)

- `core/viz/toile.ts` : canvas 2D DPR-correct + aléatoire déterministe
  (mulberry32) — consommé aussi par `champ-de-points` (jscpd a mordu, à raison).
- `core/viz/reglages.ts` : lecture défensive des trois genres + `hexVersRgb`.
- `core/viz/plein-ecran-gl.ts` : quad plein écran, uniforms, PERTE DE CONTEXTE
  gérée (SPEC §6), socle GLSL bruit/fractal partagé.

## 2. Les deux pannes — à connaître absolument

### `npmjs.com/package/viz-light` s'ouvrait chez l'utilisateur (erreur n°13)

Le script `docs` de `package.json` collisionnait avec la commande intégrée
`docs` du gestionnaire de paquets (qui ouvre la page npm du paquet courant).
Renommé `check-docs`. Trois sessions de fenêtres intempestives pour une ligne.

### Le bench a tamponné les chiffres d'un environnement bridé (erreur n°14)

Le headless par défaut de Chrome plafonne à ~10 i/s sur cette machine (page
vide comprise) ; le bench a écrasé les manifests avec du 10 i/s « GPU-bound »
uniforme. Corrigé : `headless: "shell"` + **étalonnage page vide obligatoire**
(< 55 i/s = ROUGE, refus de mesurer). Remesuré : 59,9 i/s partout, temps JS
cohérents avec la veille. Au passage, le validateur accepte désormais un temps
JS médian de 0 ms — mesuré réellement sur `mesh-gradient` en mode composé.

## 3. Ce que la prochaine session doit savoir

1. **Dette de preuve** : les 5 œuvres p5 n'ont toujours AUCUNE capture comparée
   à l'original (interdit n°1). À produire avant la recette. Le rendu `origine`
   actuel est le moteur aligné avec saturation 0 — vérifier qu'il correspond
   bien à l'original, précisément par ces captures.
2. **Uniformité des défauts `aligne`** : les 5 animations partagent
   `teinteBase 200` — à l'écran elles se ressemblent beaucoup. C'est un
   verdict esthétique : le signaler à l'utilisateur, ne pas trancher seul.
3. **Reste 16 viz** : 14 sketches p5 (une formule chacun) puis les 5 algos de
   l'Atelier (arbitrage Flow Field = utilisateur ; la version banc-essai est
   déjà migrée en `fond` avec la variante notée au manifest).
4. La page fait vivre plusieurs viz à la fois : le socle met en pause hors
   viewport, mais 3-4 viz simultanées se partagent la machine — la cadence
   perçue en défilant n'est pas celle des manifests (mesurés une viz seule).

## 4. État à la passation

- Fil d'Ariane : 0-5b ✅, **étape 6 : 15/31**, 8-10 ⬜.
- `pnpm verify` → **exit 0** (117 tests). `pnpm check-docs` → VERT.
- Aucun push, aucun remote. Commits atomiques de cette session sur `master`.
