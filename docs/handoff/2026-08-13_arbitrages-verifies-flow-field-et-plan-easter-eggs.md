---
authority: annex
last_verified: 2026-08-13
expires: never
---

# Handoff — 2026-08-13 (4e session) · vérification des arbitrages, Flow Field tranché, plan de portage

**Point de départ** : `pnpm session` VERT, étape 6 à 31/31 migrées, une seule
décision en suspens (l'arbitrage *Flow Field*) et trois arbitrages annoncés sur
le lot Easter_eggs. Demande de l'utilisateur : « vérifie et confirme tes
arbitrages ».
**Point d'arrivée** : **l'étape 6 est close**. Flow Field tranché par
l'utilisateur, un réglage ajouté et prouvé par l'image, quatre erreurs corrigées
dans mon propre inventaire, une mesure fausse corrigée, et la spec de portage du
lot Easter_eggs écrite avec sa definition of done et ses gates. `pnpm verify`
exit 0.

## 1. La vérification des arbitrages — quatre erreurs, dont une utile

Re-vérification **contre les fichiers**, pas contre l'inventaire. Ce qui tenait
tient (`domain/` du Mandelbrot pur, halo Miami séparable du tracé, Globe loader
conforme, 5 shaders confirmés, éléments laissés sur place). Ce qui ne tenait
pas, corrigé dans `evidence/sources-easter-eggs.md` :

1. **Une archive-doublon oubliée** — `Globe loader/Shader wallpapers.zip`
   contient le HTML voisin au même octet près (31 155).
2. **Les 5 shaders n'ont aucun réglage** (uniformes `u_time`, `u_mouse`,
   `u_mouseSmooth`, `u_res`, `u_clicks`). Or nos `aurore-boreale` et
   `plasma-deforme` portent **8 curseurs chacun**. L'arbitrage esthétique que je
   présentais comme symétrique ne l'est pas : adopter la version Easter_eggs
   coûterait les réglages. L'utilisateur avait besoin de ce fait avant de
   trancher, et je ne le lui avais pas donné.
3. **L'erreur la plus utile** : `fractal-explorer.html` n'est pas un « doublon
   probable » du Mandelbrot, c'est un **sur-ensemble strict** — 7 familles
   contre 1, calculateurs purs (zéro DOM). L'autre apporte l'architecture en
   couches et le lissage. Ils se **composent**. Un arbitrage esthétique de moins
   à faire porter à l'utilisateur : c'était un cadrage fautif, pas un choix de
   goût.
4. **La carte iridescente est une carte à JOUER** (`card-art.jsx` : « Ace of
   Auras », SVG 360 × 540), pas un composant d'interface. Le besoin portefeuille
   que j'invoquais est servi par le Globe loader. Candidat plus faible
   qu'annoncé.

## 2. Flow Field — tranché par l'utilisateur

Les deux versions montrées **là où elles vivent**, sans rien réinventer : la
nôtre sur la planche (`pnpm dev`, port 4320), celle de l'Atelier ouverte depuis
`sources/genart-studio-standalone.html`. Verdict : **la nôtre (banc d'essai)
gagne**. Consigné en `variantes` du manifest et dans `SPEC.md §4`.

### Un onzième réglage : « Longueur de traînée »

Demandé par l'utilisateur comme complément d'« Effacement ». **« Effacement »
existait déjà** (`fade`, 0,005 → 0,3) — le levier manquant était la **durée de
vie d'un filament**, en dur dans le code (`60 + hasard × 240` images). Elle
devient un curseur 30 → 600, défaut **180**, valeur qui reproduit *exactement*
l'ancien comportement : le rendu de référence ne bouge pas.

`regler()` rabote les vies en cours quand on raccourcit — sans cela, passer de
600 à 30 mettrait dix secondes à se voir.

**Une hypothèse posée, puis démentie par l'image.** J'avais annoncé que le fondu
bornerait l'effet et qu'il ne se verrait qu'à `Effacement` minimal. Faux :
captures à `Effacement` par défaut, `evidence/captures/flow-field--trainee-30.png`
(texture fine et uniforme) contre `--trainee-600.png` (longues plumes qui
suivent le courant). L'écart est franc. **Regarder l'image reste ce qui tranche.**

Le banc de captures a d'abord produit **544 × 13 pixels de texte** en croyant
photographier la viz : `data-viz` est porté par la ligne de coût, pas par la
surface. C'est le piège n°16 qui se rejoue, à l'identique. Corrigé en remontant
à l'`article` puis en redescendant au `canvas`.

## 3. Une mesure fausse corrigée — `orbes-floutees`

`pnpm bench` re-exécuté, machine calme, étalon 61 i/s. `orbes-floutees` portait
59,9 i/s (mesure du 12) ; **deux passes consécutives du 13 la donnent à 30 i/s,
`gpuBound: true`, 0,1 ms de JavaScript** — le processeur ne fait rien, c'est le
flou qui coûte. Aucune ligne de cette viz n'a changé entre les deux dates : la
mesure du 12 était optimiste.

`ruban-ondule`, lui, **était du bruit** : 30,1 i/s puis 59,9. Son JS tient 18 ms,
juste au-dessus du budget de 16,7 ms — ces viz-là basculent d'une passe à
l'autre. D'où la règle, désormais écrite : **on ne conclut jamais sur une passe
unique**.

Nouveau document : `evidence/cadence-mesuree.md` — les trois viz sous 60 i/s,
leurs **deux causes distinctes** (CPU pour les deux sketches à 30 000 points,
GPU pour les orbes), et le piège de lecture des viz assises sur le budget
d'image.

## 4. La spec de portage du lot Easter_eggs

`docs/plans/portage-easter-eggs.md` — **nouveau dossier `docs/plans/`**
(autorité `annex`, rangé par thème, pas par date). Neuf éléments retenus, chacun
avec slug, catégorie, runtime, régime et pièges ; **definition of done en dix
points** ; **tableau des gates qui s'exécutent réellement** ; ordre d'exécution
en six lots.

**Deux verrous du contrat de données, trouvés en vérifiant** — ils bloqueraient
le lot dès la première viz :

- **`SOURCES` n'accepte que `tweet-sketches | banc-essai | atelier-generatif`** :
  tout manifest `easter-eggs` serait refusé par le validateur, donc `pnpm
  catalog` rouge. **ADR 0013 à écrire.** Vérifié en revanche qu'aucun
  `Record<Source, …>` exhaustif n'existe : le piège d'invisibilité qui a motivé
  l'ADR 0012 **ne se rejoue pas** ici — le refus est franc et bruyant.
- **Aucun genre de paramètre ne sait exprimer un choix parmi N**, alors que
  l'explorateur de fractales doit en offrir sept. Tordre le contenu (« curseur
  de 1 à 7 ») imposerait une légende, interdite par l'exigence n°3. **Genre
  `choix` à ajouter, ADR 0014**, rendu par un `Record<GenreParam, …>` exhaustif
  pour qu'un genre sans rendu **ne compile pas**.

## 5. État à la passation

- Fil d'Ariane : 0-5b ✅, **étape 6 ✅ close**, 7 ✅, **8 ⬜ (recette
  utilisateur — c'est la suite)**, 9-10 ⬜.
- `pnpm verify` → **exit 0**, tampon posé. `pnpm session` → VERT.
- 4 commits atomiques sur `master`. Aucun push, aucun remote.
- Couverture : 95,55 / 94,69 / 97,56 / 100 — au-dessus des planchers.

## 6. Ce que la prochaine session doit faire

**Étape 8 — la recette visuelle par Pierre-Alexandre.** C'est la seule étape
ouverte, et elle lui appartient entièrement : passer les 31 viz en revue sur la
planche et dire ce qui reste, ce qui part, ce qui se règle autrement.

**Aucune décision technique n'est laissée en suspens.** Les choix restants sont
tous à l'utilisateur, et tous nommés :

1. Le verdict de recette sur chacune des 31 viz (étape 8).
2. `Aurora Veil` contre `aurore-boreale` et `Plasma Tide` contre
   `plasma-deforme` — à ne poser **qu'avec** le fait technique du §1.2 (les 8
   curseurs perdus), et seulement au moment du lot Easter_eggs.
3. Le sort de la carte à jouer (§1.4) — à trancher sur la carte réelle.

Le lot Easter_eggs ne commence **pas** avant l'étape 8 ; quand il commencera, il
commencera par les ADR 0013 et 0014, pas par une viz.
