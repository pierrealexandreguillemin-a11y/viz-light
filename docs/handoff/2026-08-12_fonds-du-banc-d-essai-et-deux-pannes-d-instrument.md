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

1. **Dette de preuve SOLDÉE en fin de session** : captures comparées dans
   `evidence/captures/` (une paire par œuvre), et formules vérifiées contre les
   one-liners golfés lus dans la conversation source « Dé-minification et
   conversion en TypeScript » (via Chrome). Leçon : l'artifact rapatrié est une
   TRADUCTION — la référence de fidélité, ce sont les golfés de la conversation.
2. **Coloration alignée corrigée** : la teinte dérive désormais de l'angle et
   de la magnitude DE CHAQUE FORMULE (obligatoires au contrat du moteur), plus
   jamais de la position à l'écran ; `origine` est monochrome sans traînée,
   alpha exact par sketch ; la souris agit sur les 5. Les animations sont
   redevenues visuellement distinctes.
3. **Reste 16 viz** : 14 sketches p5 (une formule chacun) puis les 5 algos de
   l'Atelier (arbitrage Flow Field = utilisateur ; la version banc-essai est
   déjà migrée en `fond` avec la variante notée au manifest).
4. **Une seule viz vit à la fois**
   ([ADR 0011](../decisions/0011-une-seule-scene-vivante.md), décision
   utilisateur) : la plus visible anime, les autres sont figées sur une image —
   la cadence perçue rejoint celle des manifests. Piège documenté : `canvas
   .width = …` efface un canvas, une scène figée se repeint après réglage ou
   redimensionnement.
5. **La clôture de session est mécanisée** : skill `project-session-end`
   (`.claude/skills/`), projection minimal-fork du template
   `C:\Dev\skills-templates` — le handoff daté reste LE mémo, aucun fichier
   doctrine dupliqué. L'invoquer à chaque fin de session (CLAUDE.md §4).

## 3.5 LA REPRISE EST SANS DÉCISION — tout est déjà tranché

1. Ouvrir `docs/SPEC.md` § « Plan d'exécution des 13 sketches restants » :
   slugs, noms, constantes exactes (points/vitesse/alpha), pièges identifiés
   (XOR du 24 juillet, état du Lorenz, cercles pleins du 7 mai, `w` caché du
   6 mars) et règles fixes (souris, teinte, deux rendus). Il n'y a RIEN à
   choisir — exécuter la table ligne par ligne.
2. La référence de fidélité est **`sources/tweets-golfes.md`** (rapatrié
   intégralement depuis la conversation claude.ai) — jamais l'artifact.
3. Le champ `taille` (cercles du 7 mai) est LA seule modification de moteur
   prévue : `PointCalcule.taille?: number`, `fillRect(x, y, taille ?? 1, …)`.
4. Après les 13 : les 5 algos de l'Atelier. Seule décision restante, et elle
   appartient à l'utilisateur : l'arbitrage Flow Field (lui montrer les deux).

## 4. État à la passation

- Fil d'Ariane : 0-5b ✅, **étape 6 : 15/31**, 8-10 ⬜.
- `pnpm verify` → **exit 0** (117 tests). `pnpm check-docs` → VERT.
- Aucun push, aucun remote. Commits atomiques de cette session sur `master`.
