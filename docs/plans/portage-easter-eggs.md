---
authority: annex
last_verified: 2026-08-13
expires: never
---

# Spec et plan de portage — lot `Easter_eggs`

> **Subordonné à [`SPEC.md`](../SPEC.md).** En cas de contradiction, SPEC.md
> gagne. L'inventaire vérifié de la source est
> [`evidence/sources-easter-eggs.md`](../evidence/sources-easter-eggs.md) ; les
> *pourquoi* sont dans `decisions/`.
>
> **Périmètre hors v1** (SPEC §4) : ce lot s'exécute **après la recette**
> (étape 8) et le déploiement (étape 9), au titre de l'étape 10 « ajouts au fil
> de l'eau ». Rien ici ne doit retarder la v1.
>
> **Règle d'import posée par l'utilisateur : PAR COPIE.** `C:\Dev\Easter_eggs`
> reste intact — rien n'y est déplacé, renommé ni supprimé.

## 1. Ce que ce plan couvre

Huit éléments retenus sur les treize inventoriés. Tous relèvent du **régime
technique** de l'[ADR 0010](../decisions/0010-deux-regimes-de-migration.md)
(réécriture libre) : aucun n'est une œuvre d'auteur, donc **aucune capture
comparée au pixel n'est exigée** — mais chacun doit être *regardé* (§4).

| # | Slug proposé | Catégorie | Runtime | Source dans `Easter_eggs` |
|---|---|---|---|---|
| 1 | `voronoi-neon` | `fond` | `webgl` | `Shader wallpapers/…html` (`fs2`) |
| 2 | `feuille-holographique` | `fond` | `webgl` | idem (`fs4`) |
| 3 | `champ-quantique` | `fond` | `webgl` | idem (`fs5`) |
| 4 | *(arbitrage)* `aurore-boreale` | `fond` | `webgl` | idem (`fs3`, « Aurora Veil ») |
| 5 | *(arbitrage)* `plasma-deforme` | `fond` | `webgl` | idem (`fs1`, « Plasma Tide ») |
| 6 | `explorateur-de-fractales` | `interactif` | `canvas2d` | `fractal-explorer.html` **+** `mandelbrot-easter-egg/react/src/domain/` |
| 7 | `halo-de-trace` | `animation` | `dom-css` | `Miami_circuit_easter-egg/miami-circuit-glow.html` |
| 8 | `globe-chargement` | `composant` | `canvas2d` | `Globe loader/Globe Loader.html` |
| 9 | `carte-iridescente` *(optionnel)* | `composant` | `dom-css` | `Iridescent card (1)/card-app.jsx` |

Les catégories `interactif` et `composant` sont ouvertes depuis l'
[ADR 0012](../decisions/0012-taxonomie-interactif-et-composant.md) : ce lot est
la première occasion de les employer.

## 2. Lot 0 — les déblocages, AVANT la première viz

Deux verrous du contrat de données refuseraient ce lot. Ils se lèvent d'abord,
chacun **calibré dans les deux sens** (rouge sur l'état fautif, vert sur l'état
corrigé), chacun avec son ADR — ce sont des décisions de périmètre, pas de
l'intendance.

### 2.1 `SOURCES` ne connaît pas `easter-eggs` — blocage dur

`src/core/manifest/types.ts:11` : `SOURCES = ["tweet-sketches", "banc-essai",
"atelier-generatif"]`. Un manifest portant `origine.source: "easter-eggs"` est
**refusé par le validateur** (`valider.ts:61`), donc `pnpm catalog` est rouge,
donc `pnpm verify` est rouge. Rien ne se porte tant que ce n'est pas fait.

- **À faire** : ajouter `"easter-eggs"` à `SOURCES` + un cas dans
  `tests/manifest-valider.test.ts` qui vérifie les deux sens (la nouvelle valeur
  passe, une valeur inventée échoue). **ADR 0013.**
- **Vérifié, et c'est une bonne nouvelle** : il n'existe **aucun**
  `Record<Source, …>` exhaustif dans le dépôt — la source s'affiche telle quelle
  (`core/catalogue/rendre.ts:46`, `core/composants/Specimen.tsx:68`). Le piège
  d'invisibilité qui a motivé l'ADR 0012 pour les catégories **ne se rejoue pas
  ici** ; le seul risque est le refus franc du validateur, qui est bruyant.

### 2.2 Aucun genre de paramètre ne sait exprimer un choix parmi N

`GENRES_PARAM = ["curseur", "interrupteur", "couleur"]`
(`types.ts:53`). L'explorateur de fractales doit offrir **7 familles** et une
palette : ce n'est ni un curseur ni un interrupteur.

- Tordre le contenu pour entrer dans le type (« curseur de 1 à 7 ») produirait
  un réglage qui **exige une légende** — interdit par l'exigence utilisateur n°3
  (SPEC §4, « Aucune légende »).
- **À faire** : ajouter un genre **`choix`** (liste de valeurs libellées) au
  schéma, au panneau de réglages et au validateur, calibré dans les deux sens.
  **ADR 0014.** C'est le même geste qu'ADR 0012 : élargir le type plutôt que
  laisser le type décider à la place du contenu.
- **Attention** : contrairement à `Source`, un genre nouveau **doit** être rendu
  par le panneau. Le rendu des paramètres doit passer par un
  `Record<GenreParam, …>` (ou un `switch` exhaustif) pour qu'un genre sans rendu
  soit une **erreur de compilation** et non un réglage invisible.

## 3. Les éléments, un par un

### 3.1 Les trois fonds shader sans concurrent (`voronoi-neon`, `feuille-holographique`, `champ-quantique`)

**Ce que dit la source, vérifié** : cinq fragment shaders en GLSL lisible, un
seul canvas. Les **seuls** uniformes sont `u_time`, `u_mouse`, `u_mouseSmooth`,
`u_res`, `u_clicks`.

- **Conséquence sur l'exigence « les réglages survivent »** : il n'y a **rien à
  conserver** — la source n'expose aucun contrôle. On en **crée**. À dire tel
  quel dans le handoff : c'est une création, pas une conservation.
  **Minimum 6 paramètres par viz**, dont au moins une couleur (genre `couleur`)
  et une **« Influence de la souris »** — précédent établi par les rendus
  `aligne` des sketches p5.
- **Catégorie `fond`, malgré la réactivité au clic.** Ces shaders répondent au
  curseur et aux clics (`u_clicks` : ondes de choc, pulsations). On ne les
  *manipule* pourtant pas pour explorer quelque chose : la souris est un accent,
  pas un usage. Si l'utilisateur en juge autrement à la recette, c'est **un
  champ du manifest à changer**, pas du code.
- **Piège — gate OKLCH.** `tests/couleurs-oklch.test.ts` refuse tout `#rrggbb`,
  `rgb(`, `hsl(` sous `src/` dans les fichiers `.css` / `.ts` / `.tsx`. Les
  couleurs par défaut vont donc dans le **`manifest.json`** (genre `couleur`,
  hors portée du gate), jamais dans l'`algo.ts`.
- **Piège — perte de contexte WebGL** : déjà gérée par le hook webgl du socle
  (SPEC §6). Ne pas la réimplémenter par viz.

### 3.2 Les deux fonds shader en concurrence (`Aurora Veil`, `Plasma Tide`)

**Arbitrage esthétique en attente — il appartient à l'utilisateur.** Le fait
technique à lui donner avant qu'il tranche : nos `aurore-boreale` et
`plasma-deforme` sont **déjà en WebGL, portent 8 curseurs chacun et sont mesurés
à 59,9 i/s** ; les versions Easter_eggs n'exposent aucun réglage.

**Mécanique du verdict** (SPEC §4, « la version validée par l'utilisateur
gagne ») :

- s'il retient la version Easter_eggs, elle **remplace** l'implémentation
  existante **sous le même slug** — pas de seconde entrée au catalogue — et la
  nôtre passe en `variantes` du manifest ;
- s'il garde la nôtre, la version Easter_eggs est notée en `variantes` et n'est
  pas portée.

Dans les deux cas le catalogue conserve **une** aurore et **un** plasma.

### 3.3 `explorateur-de-fractales` (`interactif`, `canvas2d`)

**Composition de deux sources — arbitrage technique déjà tranché**
(`evidence/sources-easter-eggs.md` §2.2) :

- de `fractal-explorer.html` : les `FractalCalculators`, **7 familles**
  (Mandelbrot, Julia, Burning Ship, Tricorn, Multibrot z³/z⁴/z⁵), vérifiées
  **fonctions pures — zéro référence au DOM** ;
- de `mandelbrot-easter-egg/react/src/domain/` : la structure en couches, le
  lissage (`n + 1 − log(log|z|)/log 2`) et les palettes.

**Paramètres** : famille (genre `choix`, cf. §2.2), itérations maximales
(curseur), palette (`choix`), et l'état d'interaction — centre, échelle, `c` de
Julia — qui **n'est pas un paramètre de manifest** mais de l'état de la viz.

**Piège — le rendu par tranches.** Le calcul est lourd et la source d'origine
rend par blocs (`renderChunk`). Notre `frame()` doit rendre **une tranche par
image** : rendre l'image entière dans un `frame()` effondrerait la cadence, et
l'instrument aurait raison de l'afficher.

**Piège — la section `interactif` de la planche.** Elle existe forcément :
`Planche.tsx` tient ses titres dans un `Record<Categorie, string>`, donc son
absence ne compilerait pas (ADR 0012). Rien à vérifier à la main.

### 3.4 `halo-de-trace` (`animation`, `dom-css`)

**La technique, vérifiée** : `stroke-dasharray` / `stroke-dashoffset` sur un
`<path>`, plus `blur()` et `drop-shadow()`. Elle ne dépend **en rien** du tracé
qu'elle parcourt.

- **Décision de contenu** : le circuit de Miami et les logos d'équipes
  appartiennent à un autre projet du portefeuille. On embarque un **tracé
  abstrait écrit ici**. On importe l'effet, pas le contenu.
- **Piège d'instrument — le plus important de ce lot.** Si l'avance du halo est
  faite en `@keyframes` CSS, `frame()` ne fait **rien** : l'instrument affiche
  alors des chiffres parfaitement crédibles en mesurant du vide (mémoire projet
  *« vérifier que l'objet mesuré existe »*). **L'avance du `stroke-dashoffset`
  est pilotée par `frame()`**, pas par CSS.

### 3.5 `globe-chargement` (`composant`, `canvas2d`)

La source mêle anneaux SVG en `@keyframes`, un canvas 2D et
`requestAnimationFrame`. **Même piège d'instrument qu'au §3.4**, en pire : la
moitié de l'animation échapperait à la mesure.

- **Décision** : réécriture **entière en `canvas2d`**, une seule surface, tout
  le mouvement dans `frame()`. Le régime technique l'autorise explicitement
  (ADR 0010) et c'est ce qui rend la mesure honnête.
- **Paramètres** : vitesse, nombre d'anneaux, épaisseur, couleur, taille.
- **DoD supplémentaire propre aux composants** : il doit rester lisible **à sa
  taille d'emploi** (~200 px), pas seulement en grand — la planche l'affiche
  dans une carte.

### 3.6 `carte-iridescente` (`composant`, `dom-css`) — optionnel, priorité la plus basse

**Réserve documentée, à ne pas perdre** : ce n'est pas un composant d'interface,
c'est une **carte à jouer** — `card-art.jsx` dessine « Ace of Auras » en SVG
360 × 540. Le besoin du portefeuille (« un loader qui ne ressemble pas à un
spinner générique ») est servi par le §3.5, pas par elle.

- Si elle est portée : n'emporter que **la technique** (le `conic-gradient`
  iridescent qui suit le pointeur), pas l'illustration.
- Même piège d'instrument : la teinte suit le pointeur **depuis `frame()`**.
- **À porter en dernier, ou pas du tout.** C'est l'utilisateur qui tranche, sur
  la carte réelle.

## 4. Definition of Done

### 4.1 Par viz — les dix points

Une viz n'est **pas** finie tant que les dix ne sont pas vrais. Aucun n'est
déclaratif : chacun est constaté.

1. `src/viz/<slug>/{algo.ts, <Nom>.tsx, manifest.json}` existent, `notes.md`
   si la viz a un piège à raconter.
2. **Frontière de portabilité** : `algo.ts` n'importe ni React, ni Next, ni
   `@/core/hooks/*` — vérifié par `pnpm lint`
   (`eslint.config.*:72`, `no-restricted-imports`), pas par relecture.
3. **Manifest valide** : `categorie`, `runtime`, `origine.source`, `tags`,
   `rendus[].params[]` avec leur genre, `extraction.fichiers` et
   `extraction.socle` **exacts** (la liste sert à un claude+n qui copie sans
   exécuter — une liste fausse casse le contrat d'extraction du SPEC §3).
4. **Réglages** : ceux de la source survivent tous. Quand la source n'en a
   aucun (les shaders, §3.1), **au moins 6 sont créés**, dont une couleur et une
   influence de la souris — et le handoff dit que ce sont des créations.
5. **`regler()` ne remonte pas l'animation** : changer une valeur en direct
   n'interrompt ni ne réinitialise la viz (exigence utilisateur n°1). Un
   changement qui redistribue tout — une graine — est la seule exception.
6. **Aucune légende** : si un réglage a besoin d'être expliqué, c'est le réglage
   qu'on remplace (exigence n°3).
7. **Gate OKLCH vert** : aucune couleur hex/hsl en dur dans `src/` — les
   couleurs de la viz sont des **données du manifest**.
8. **L'instrument mesure quelque chose de réel** : `frame()` fait le travail
   d'animation. Une viz dont le mouvement est en CSS pur est une viz dont la
   mesure est un mensonge crédible. Contrôle : mettre la viz en pause doit
   arrêter le mouvement.
9. **Perf tamponnée par `pnpm bench` exécuté**, machine calme, étalon accepté —
   jamais estimée, jamais « attendue ». Un chiffre aberrant accuse d'abord
   l'environnement : re-mesurer avant de conclure.
10. **La capture a été regardée**, pas seulement produite
    (`evidence/erreurs-a-ne-pas-refaire.md` §16 et §18). Le régime technique
    n'exige pas de comparaison au pixel, mais il exige un œil sur l'image.

### 4.2 Par lot

- `sources/easter-eggs/` contient les fichiers d'origine **copiés**, noms
  conservés ; `C:\Dev\Easter_eggs` intact (vérifié après coup).
- `CATALOG.md` et `src/viz/registre.genere.ts` régénérés — jamais édités à la
  main.
- `SPEC.md` à jour si le périmètre a bougé ; un **ADR par décision** ; les
  mesures dans `evidence/`.
- Handoff daté dans `docs/handoff/`.
- `pnpm verify` **exit 0** et `pnpm session` **VERT**.
- Commits atomiques et conventionnels. **Aucun `git push`** sans demande
  explicite.

## 5. Quality gates — ce qui s'exécute réellement

> Un seuil documenté que rien n'exécute **n'est pas un gate**. Chaque ligne
> ci-dessous est une commande réelle de `package.json`, vérifiée le 2026-08-13.

| Commande | Ce qu'elle refuse |
|---|---|
| `pnpm session` | arbre sale, docs incohérentes, `verify` non tamponné sur ce code, fil d'Ariane faux, handoff absent |
| `pnpm check-docs` | plusieurs sources de vérité, frontmatter absent, ADR muté, document périmé |
| `pnpm catalog` | **manifest invalide ou perf manquante** — c'est le gate central du lot |
| `pnpm format:check` | formatage |
| `pnpm lint` | complexité cyclomatique **et** cognitive, longueur de fonction **et** de fichier, règles type-aware, **frontière de portabilité** |
| `pnpm typecheck` | TS strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| `pnpm dup` | duplication inter-fichiers (jscpd) — c'est lui qui a mordu, à raison, sur les 13 sketches |
| `pnpm test:cov` | planchers **94 / 93 / 97 / 99** (statements / branches / functions / lines) + gate OKLCH + schéma de manifest |
| `pnpm build` | compilation Next |
| `pnpm bench` | rien — c'est l'**instrument**, pas un gate : il écrit les chiffres que `pnpm catalog` exige |
| `pnpm verify` | la chaîne complète, puis tamponne `stamp-verify` |
| Husky pre-commit / commit-msg | commit non formaté, message non conventionnel |

**Deux règles au-dessus du tableau**, héritées du socle :

1. **Un gate rouge = du code à corriger.** Jamais un seuil à baisser pour faire
   passer un build. Les seuils ne montent qu'avec la mesure.
2. **Tout gate nouveau se calibre dans les deux sens** — il doit échouer sur
   l'état fautif connu *et* passer sur l'état corrigé, vérifié en provoquant les
   deux. Cela vaut pour `SOURCES` (§2.1) et pour le genre `choix` (§2.2).

## 6. Ordre d'exécution

| Lot | Contenu | Pourquoi cet ordre |
|---|---|---|
| **0** | `SOURCES` + genre `choix`, ADR 0013 et 0014 | sans eux, aucun manifest du lot ne passe le validateur |
| **0 bis** | copier les sources retenues dans `sources/easter-eggs/` | « rapatrier avant de migrer », étape 1 du fil d'Ariane appliquée à ce lot |
| **1** | les 3 fonds shader sans concurrent | même famille que les 10 fonds déjà migrés — le chemin est connu, le risque est bas |
| **2** | les 2 arbitrages esthétiques (aurore, plasma) | montrer les deux versions, ne rien trancher |
| **3** | `explorateur-de-fractales` | le plus gros morceau ; dépend du genre `choix` du lot 0 |
| **4** | `halo-de-trace` puis `globe-chargement` | premiers usages réels de `dom-css` et de `composant` |
| **5** | `carte-iridescente` — ou son abandon | décision de l'utilisateur, sur la carte réelle |

Boucle par viz, inchangée depuis l'étape 6 :

```
src/viz/<slug>/{algo.ts, <Nom>.tsx, manifest.json}   # écrire
pnpm catalog     # valide le manifest, regénère CATALOG.md + le registre
pnpm build       # le bench a besoin de out/
pnpm bench       # mesure, écrit la perf dans les manifests
pnpm verify      # la chaîne complète
```

## 7. Ce que ce plan n'importe pas

Argumenté dans `evidence/sources-easter-eggs.md` §2 : la **boîte à rythmes**
(un instrument audio n'est pas une visualisation), les **bannières console**
(aucun rendu à mesurer), les **64 logos NFL** (assets d'un autre projet), et les
**deux archives-doublons** — `Iridescent card (1).zip` et
`Globe loader/Shader wallpapers.zip`, cette dernière contenant le HTML voisin au
même octet près.

## 8. Ce qui reste à l'utilisateur

Deux arbitrages esthétiques (§3.2), le sort de la carte à jouer (§3.6), et le
**verdict sur chaque viz portée** : le beau lui appartient, ici comme ailleurs.
