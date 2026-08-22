---
authority: annex
last_verified: 2026-08-22
expires: never
---

# Handoff — 2026-08-22 (7e session) · lot Easter_eggs : Lot 0, rapatriement, garde-fou WebGL

**Point de départ** : `pnpm session` VERT, étape 6 close (31/31), étape 8
(recette) ouverte sur l'URL live, étape 9 déployée + CI/CD Git. L'utilisateur, à
la reprise, tranche quatre points : (1) recette OK, (2) le garde-fou luminance —
« aucune idée, je comprends pas la question » → délégué, (3) CATALOG.md final OK,
(4) **« go »** sur le lot Easter_eggs.
**Point d'arrivée** : la **fondation du lot est posée et vérifiée** — les deux
verrous du contrat de données levés, les sources rapatriées, le garde-fou WebGL
câblé à la racine. Trois commits, trois ADR, chaque gate calibré dans les deux
sens, `pnpm verify` vert et tamponné à chaque étape. **Aucun push** (non demandé).

## 1. Ce qui a été livré

| Commit | Contenu | ADR |
|---|---|---|
| `f4bf728` | **Lot 0** — `SOURCES` admet `easter-eggs` ; nouveau genre de paramètre `choix` (un choix parmi N valeurs libellées, sans légende). Validateur **et** panneau répartissent par `Record<GenreParam,…>` exhaustif : un genre sans validation/contrôle est une erreur de compilation. | 0014, 0015 |
| `07b64db` | **Lot 0bis** — sources retenues copiées dans `sources/easter-eggs/`, noms conservés. `C:\Dev\Easter_eggs` intact (hash identique, arbre inchangé, vérifié après coup). | — |
| `813366f` | **Garde-fou WebGL** — une viz ne peut plus créer son contexte WebGL à la main (`getContext("webgl"…)` interdit dans `src/viz/**/algo.ts`) ; elle passe par `creerPleinEcranGl`, seul détenteur de `preserveDrawingBuffer:true`. | 0016 |

**Preuves** : `pnpm verify` vert et tamponné après chaque commit ;
`evidence/socle-qualite.md §3.6` (calibration du gate WebGL, sortie réelle dans
les deux sens). Numéros d'ADR du plan corrigés (0013/0014 → 0014/0015 : 0013 est
parti au déploiement Git le 22).

## 2. La décision #2 (garde-fou), tranchée — et sa forme

L'utilisateur a délégué. La question du handoff précédent proposait un garde-fou
« luminance d'une viz **figée** > 0 » dans `verify`. **En traçant le mécanisme
(`useScenePrincipale`), la preuve a changé mon analyse** : l'état « figé »
dépend de l'élection de scène, pas d'un réglage posé de l'extérieur ; une sonde
headless qui force cet état serait **fragile**, et un gate qui rougit à tort
finit désactivé. La cause racine du bug du 22, elle, est **un seul site d'appel**
(`getContext` sans l'option), attrapable à la syntaxe, déterministe. D'où le gate
statique (ADR 0016), plutôt que la sonde. **Angle mort déclaré** : il n'attrape
pas un noir de *logique GLSL* (uniform oublié, formule fausse) — cela reste
couvert par l'œil sur la capture *figée* à la migration (plan §4.1 point 10). La
sonde de luminance reste *possible* comme travail futur, pas *nécessaire* pour la
régression qui a eu lieu.

## 3. Ce que la prochaine session doit faire — Lot 1, chemin tracé

**Lot 1 = les 3 fonds shaders sans concurrent** : `voronoi-neon` (source `fs2`),
`feuille-holographique` (`fs4`), `champ-quantique` (`fs5`), dans
`sources/easter-eggs/Shader Wallpapers.html`.

**Découverte à traiter EN PREMIER — une extension de socle, pas une question
ouverte.** Ces shaders veulent la souris (`u_mouse`, `u_mouseSmooth`) et des
clics (`u_clicks[8]`). Or **le contrat (`core/viz/contrat.ts`) n'achemine aucune
souris** — `frame(temps, delta)` seulement. Le précédent existe et tranche la
forme : `core/viz/champ-de-points.ts` (socle des sketches p5) **pose son propre
écouteur `pointermove` sur l'hôte** (lignes ~138-144) et applique
`influenceSouris * sourisX`. Donc :

1. **Étendre `creerPleinEcranGl`** (`core/viz/plein-ecran-gl.ts`) du même
   plombage pointeur → uniforms `u_mouse`/`u_mouseSmooth` (normalisés 0..1,
   comme les shaders l'attendent), gouverné par un réglage « Influence de la
   souris » (exigence plan §3.1). En TDD, calibré ; c'est du socle partagé.
2. **Les `u_clicks` peuvent tomber** : ce sont des fonds (régime technique,
   réécriture libre) ; le clic est « un accent, pas un usage » (plan §3.1).
   Garder le suivi souris (l'interactivité principale) + `u_time`.
3. **Adapter les fragments** : la source nomme `u_res` ; le socle pose
   `u_resolution`. Réécrire le fragment pour le socle (ou aliaser).
4. **≥ 6 paramètres créés par viz**, dont **une couleur** (genre `couleur`, dans
   le manifest — jamais dans l'`algo.ts`, gate OKLCH) et l'influence souris. Ce
   sont des **créations**, pas des conservations (la source n'expose aucun
   réglage) — à dire tel quel.
5. Boucle par viz : écrire → `pnpm catalog` → `pnpm build` → `pnpm bench` →
   **regarder la capture, figée** → `pnpm verify`.

Ordre du plan ensuite : Lot 2 (aurore/plasma — **attend le verdict visuel de
l'utilisateur**), Lot 3 (`explorateur-de-fractales`, dépend du genre `choix`
désormais livré + du reader `choix` à ajouter à `reglages.ts`), Lots 4-5.

## 4. Choix restants — tous à l'utilisateur, tous nommés

1. **Recette (étape 8)**, sur https://viz-light.vercel.app, viz par viz — aurore
   et plasma réparées à re-regarder en priorité.
2. **Lot 2** du plan : verdict visuel `aurore-boreale` vs `Aurora Veil`,
   `plasma-deforme` vs `Plasma Tide` — avec curseurs obligatoires (plan §3.2).
   Rien n'est porté côté Easter_eggs pour ces deux-là tant que ce verdict n'est
   pas posé.
3. Après recette : le **CATALOG.md final** pour clore l'étape 9.
4. Catégories à confirmer à la recette (champs de manifest, pas du code) :
   `carte-iridescente` (`composant` ou `fond`), les 3 shaders (`fond` malgré la
   réactivité souris).

## 5. Auto-évaluation — OK

Travail pris par la méthode : chaque déblocage en TDD (RED prouvé avant GREEN),
chaque gate calibré dans les deux sens (y compris le WebGL, rouge provoqué puis
retiré), `verify` vert et tamponné avant chaque commit. Décision #2 déléguée
tranchée **en changeant de forme sur preuve** (mécanisme tracé), pas au ressenti,
et l'écart avec la proposition du handoff est dit, pas masqué. Séquencement « go
devant la recette » consigné dans SPEC §8 et le plan plutôt qu'exécuté en douce.
Réserve tenue au clair : je n'ai **pas** encore porté de shader ni regardé un
rendu Easter_eggs — la fondation est livrée, le Lot 1 est cadré, pas commencé.
Dit, pas gonflé en « lot avancé ».
