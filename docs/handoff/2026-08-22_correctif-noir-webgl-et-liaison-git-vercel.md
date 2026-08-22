---
authority: annex
last_verified: 2026-08-22
expires: never
---

# Handoff — 2026-08-22 (6e session) · correctif du noir WebGL, liaison Git↔Vercel

**Point de départ** : `pnpm session` VERT, étape 6 close (31/31), étape 8
(recette) ouverte, étape 9 déployée en CLI. L'utilisateur, en recette sur l'URL
live, signale **deux viz cassées** — « aurore boréale » et « plasma déformé »
affichent un **écran noir** — et demande un **déploiement conforme** : remote git
+ liaison Vercel.
**Point d'arrivée** : bug corrigé, prouvé, verrouillé par un test ; dépôt GitHub
public créé et Vercel branché en CI/CD Git ; décisions consignées (ADR 0013). Le
correctif est **shippé en prod** par le push.

## 1. Le noir WebGL — cause racine, pas symptôme

**Symptôme** : exactement deux viz noires, les deux seules WebGL du catalogue.

**Cause racine** : `src/core/viz/plein-ecran-gl.ts` créait le contexte sans
`preserveDrawingBuffer: true`. Une seule viz vit à la fois (ADR 0011) ; les autres
sont **figées** sur leur unique `frame(0, 0)`. Buffer non préservé, le compositeur
vide le canvas WebGL après l'avoir présenté une fois → noir dès le premier
re-compositing. Les fonds canvas2d conservent leur buffer 2D : d'où *exactement
deux* viz touchées, jamais les 29 autres.

**Pourquoi ni le bench ni personne ne l'avait vu** : le bench mesure la cadence,
pas la luminance des pixels ; et il **isole** chaque viz (les autres masquées),
ce qui la fait redevenir l'unique élue *animée* — jamais figée, donc jamais noire
dans les conditions de mesure. Le régime « technique » (§4) dispense les fonds de
captures comparées : ces deux-là n'avaient aucune preuve visuelle. Erreur de la
même famille que n°1/n°14/n°16 — consignée en **`evidence/erreurs-a-ne-pas-refaire.md`
§19**.

**Correctif** : `canvas.getContext("webgl", { preserveDrawingBuffer: true })`.
Chaque image repeint tout l'écran en opaque : aucune accumulation.

**Preuve** (sonde qui lit la luminance de chaque canvas *figé*, vrai GPU
ANGLE/AMD) : luminance **aurore 0 → 57,8**, **plasma 0 → 76,9** ; les 27 fonds
canvas2d étaient déjà à 11–59. Verrouillé par `tests/plein-ecran-gl.test.ts`,
**calibré dans les deux sens** : rouge sans l'option, vert avec.

**Dette assumée** : le test ne couvre que CE réglage — un shader qui rendrait tout
noir passerait encore. Le garde-fou de classe (« luminance d'une viz *figée* > 0 »,
la sonde promue en script versionné dans la chaîne `verify`) est **proposé, pas
câblé** — décision à l'utilisateur.

**Résidu de même famille, non traité ici** (hors périmètre, à surveiller) :
`surRetour` (perte/retour de contexte WebGL) reconstruit le programme mais ne
redessine pas ; une viz *figée* resterait noire après un retour de contexte
jusqu'au prochain réglage. Intermittent (reset GPU / onglet mis en veille), pas le
symptôme signalé. À corriger si observé.

## 2. Déploiement conforme — remote GitHub + CI/CD Git Vercel

**Décision utilisateur (2026-08-22)** : GitHub **public** + **auto-deploy** Vercel.
Cela **supersède l'ADR 0006** (qui avait choisi CLI-only, remote hors-v1) →
**[ADR 0013](../decisions/0013-remote-github-et-deploiement-git-vercel.md)**. SPEC
§4 et §7 et l'étape 9 du fil d'Ariane mis à jour. J'ai signalé la divergence AVANT
d'agir et demandé visibilité + portée.

- **Dépôt** : `github.com/pierrealexandreguillemin-a11y/viz-light` (public), branche
  de prod `main` (l'ancienne `master` locale renommée `-M main`).
- **Liaison** : `vercel git connect` → projet `viz-light` connecté. Un push sur
  `main` déclenche désormais un déploiement de production.
- **Garde-fou intact** : `pnpm verify` est branché en **pre-push** ; le push du
  correctif l'a rejoué **VERT** (155 tests, couverture 95,55/94,69/97,56/100,
  build ok). Un push qui déploie est un push aux gates verts.
- Le lien CLI local (`.vercel/project.json`, non versionné) reste le chemin de
  secours ; il pointe le même projet.

**Numérotation ADR — à noter** : le handoff du 2026-08-21 « réservait » 0013/0014
pour de futurs ADR Easter_eggs (jamais créés). **0013 est désormais le déploiement
Git.** Les ADR Easter_eggs, quand le lot démarrera, prendront **0014/0015**.

## 3. État à la passation

- Fil d'Ariane : 0-7 ✅, **étape 8 ⬜ (recette, sur l'URL live)**, **étape 9 🟨**
  (déployée + CI/CD Git ; reste le CATALOG.md final après recette), étape 10 ⬜.
- `pnpm verify` : vert et tamponné sur ce code. `pnpm check-docs` : VERT (29 docs).
- Commits de cette session : `fix(viz)` (correctif + test) **poussé**, puis un
  commit `docs` (ADR 0013, SPEC, registre, handoff). **Push explicitement demandé**
  (la mise en place du remote en était l'objet).
- Couverture inchangée (95,55 / 94,69 / 97,56 / 100).

## 4. Ce que la prochaine session doit faire

**La recette (étape 8) continue, sur https://viz-light.vercel.app** — désormais
avec aurore et plasma réparés à re-regarder en priorité. Elle appartient à
l'utilisateur, viz par viz : reste / part / se règle autrement.

**Aucune décision technique laissée en suspens.** Choix restants, tous à
l'utilisateur, tous nommés :

1. Le verdict de recette sur chacune des 31 viz (étape 8), aurore/plasma d'abord.
2. **Câbler ou non le gate « luminance d'une viz figée > 0 »** (garde-fou de
   classe du §1) — proposé, ta décision.
3. Après recette : le **CATALOG.md final** pour clore l'étape 9.
4. Le lot Easter_eggs (étape 10) ne commence pas avant la recette ; ses ADR
   prendront 0014/0015.

## 5. Auto-évaluation — OK

Bug pris par la méthode : reproduit (sonde, luminance 0), cause racine isolée
(preserveDrawingBuffer, pas un symptôme), correctif minimal, prouvé avant/après,
verrouillé par un test calibré des deux côtés. Divergence SPEC signalée à
l'utilisateur avant d'agir plutôt qu'exécutée en douce. Une réserve tenue au
clair : je n'ai pas pu regarder l'URL de prod moi-même (extension navigateur non
connectée) — la preuve porte sur le build `out/` identique à ce qui déploie, et la
confirmation visuelle live revient à la recette de l'utilisateur. Dit, pas masqué.
