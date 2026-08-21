---
authority: ledger
subject: sources
last_verified: 2026-08-13
expires: never
---

# Source candidate — `C:\Dev\Easter_eggs`

> Inventaire **vérifié fichier par fichier** le 2026-08-13 (lecture seule ;
> aucun octet écrit hors de `viz-light`). Ce document sert à trancher ce qui
> entre au catalogue et ce qui n'y a pas sa place — et à préparer l'import.
>
> **Re-vérifié le 2026-08-13 (4e session), et il le fallait** : la première
> passe portait quatre erreurs — une archive-doublon oubliée, des shaders
> annoncés sans dire qu'ils n'ont aucun réglage, un « doublon probable » entre
> les deux explorateurs qui était en réalité un sur-ensemble strict, et une
> carte à jouer décrite comme un composant d'interface. Toutes corrigées
> ci-dessous, chacune contre le fichier.

**Règle d'import, posée par l'utilisateur : PAR COPIE, jamais par déplacement.**
`C:\Dev\Easter_eggs` doit rester intact et complet après l'opération. Rien n'y
est supprimé, renommé ni modifié.

## 1. Ce que contient le dossier

| Élément | Poids | Ce que c'est, vérifié |
|---|---|---|
| `Shader wallpapers/Shader Wallpapers.html` | 31 Ko | **5 fonds WebGL** en un seul fichier : `Plasma Tide`, `Neon Voronoi`, `Aurora Veil`, `Holographic Foil`, `Quantum Field`. Un canvas, `fbm` / `noise` / `voronoi` en GLSL lisible. **Aucun réglage exposé** : les seuls uniformes sont `u_time`, `u_mouse`, `u_mouseSmooth`, `u_res`, `u_clicks`, et le fichier ne contient pas un seul contrôle d'interface. |
| `mandelbrot-easter-egg/` | 35 Ko + React (+ 3,9 Mo de capture) | Explorateur de Mandelbrot, **une seule famille**. **Version React déjà en couches** : `domain/` (types, calcul, palettes) en TS pur — vérifié, il n'importe que ses propres types —, `application/` (hooks), plus un `standalone/mandelbrot.html` sans dépendance. Apporte le lissage (`n + 1 − log(log|z|)/log 2`) et les palettes. |
| `fractal-explorer.html` | 48 Ko | Explorateur de fractales, canvas2d interactif. **Sur-ensemble strict du précédent : 7 familles** — Mandelbrot, Julia, Burning Ship, Tricorn, Multibrot z³/z⁴/z⁵ — chacune avec sa formule documentée. `FractalCalculators` = fonctions pures (zéro référence au DOM, vérifié). Mêmes interactions que le Mandelbrot : molette, glisser, double-clic, tactile. |
| `Globe loader/Globe Loader.html` | 5,6 Ko | Loader 200 × 200 : anneaux SVG animés en CSS (`@keyframes`) + un canvas 2D piloté par `requestAnimationFrame`. |
| `Globe loader/Shader wallpapers.zip` | 9,6 Ko | **Doublon exact** de `Shader wallpapers/Shader Wallpapers.html` (31 155 octets à l'octet près), rangé au mauvais endroit. |
| `Iridescent card (1)/` | 5,6 Ko + 3 `.jsx` | **Carte à jouer**, pas un élément d'interface : `card-art.jsx` dessine « Ace of Auras » en SVG (360 × 540, enseigne inventée) ; `card-app.jsx` l'habille d'un `conic-gradient` réactif au survol ; `tweaks-panel.jsx` (25 Ko) est son panneau de réglages. |
| `Miami_circuit_easter-egg/` | 5 fichiers | Tracé SVG du circuit de Miami + deux HTML (bouton, halo) + `MiamiCircuit.tsx` + un script de synchro d'équipes. Le halo : `stroke-dasharray` / `stroke-dashoffset` sur un `<path>`, `blur()` et `drop-shadow()` — aucune dépendance au tracé lui-même. |
| `drum-machine-standalone.html` + `dm-bridge-template.css` + `docs/` | 68 Ko + 2 md | Boîte à rythmes (audio) et sa recherche de génération ML. |
| `console-log-banner.html`, `playground-console-banner.html` | 1,5 + 12 Ko | Bannières ASCII pour la console du navigateur. |
| `light_svg/`, `scoreboard_svg/` | 32 SVG × 2 | Logos des équipes NFL. |
| `Iridescent card (1).zip` | 210 Ko | Archive du dossier de même nom — doublon. |

## 2. Le tri

### Candidats — à importer

1. **Les 5 fonds shader** (`fond`, régime technique). Le meilleur lot du
   dossier : cinq fonds WebGL prêts, du même genre que ceux déjà migrés, avec
   du GLSL en clair. **Deux doublons à arbitrer par l'utilisateur** :
   `Aurora Veil` contre notre `aurore-boreale`, `Plasma Tide` contre notre
   `plasma-deforme` — verdict esthétique, donc décision utilisateur (même
   traitement que le Flow Field). **L'arbitrage n'est pas symétrique**, et il
   faut le dire avant de le poser : nos deux fonds sont déjà en WebGL, portent
   **8 curseurs chacun** et sont mesurés à 59,9 i/s ; les shaders d'origine
   n'exposent aucun réglage. Adopter la version Easter_eggs, c'est perdre les
   réglages ou les réinventer — du travail neuf, pas une migration. Les trois
   autres (`Neon Voronoi`, `Holographic Foil`, `Quantum Field`) n'ont pas de
   concurrent et entrent sans arbitrage.
2. **Un seul explorateur de fractales**, catégorie `interactif` (cf. §3), monté
   des deux sources — arbitrage **technique, donc tranché ici** : les
   `FractalCalculators` du `fractal-explorer` (7 familles, fonctions pures sans
   DOM) posés dans la structure en couches du `mandelbrot-easter-egg`, qui
   apporte le lissage et les palettes. Le « doublon probable » du premier
   inventaire était une erreur de cadrage : l'un est un sur-ensemble strict de
   l'autre en contenu, l'autre est meilleur en architecture — il n'y a rien à
   faire choisir à l'utilisateur, il y a une viz à composer. Régime technique,
   donc réécriture libre : aucune fidélité au pixel à prouver.
3. **Le halo du circuit de Miami** — la *technique* (tracé lumineux qui court
   le long d'un chemin SVG : `stroke-dasharray` / `stroke-dashoffset`, `blur()`,
   `drop-shadow()`) est réutilisable et jolie ; le *contenu* (le circuit de
   Miami, les logos d'équipes) appartient à un autre projet. Vérifié : l'effet
   ne dépend en rien du tracé qu'il parcourt. Importer l'effet, pas le tracé.
4. **Globe loader** : voir §3. Il tient la promesse — un loader qui ne
   ressemble pas à un spinner générique, réutilisable tel quel.
5. **Iridescent card** : voir §3. Fait sur la source — l'**objet** est une
   **carte à jouer** dessinée en SVG (« Ace of Auras »), pas un composant
   d'interface. Mais l'**effet** (le `conic-gradient` iridescent réactif au
   survol) est une technique portable qui tient sur ses propres mérites :
   **retenu de plein droit** (décision de l'utilisateur, 2026-08-21). On importe
   l'effet, on laisse l'illustration — même geste que pour le halo de Miami.

### Sans leur place ici — à laisser sur place

- **La boîte à rythmes** et ses deux documents : un instrument audio n'est pas
  une visualisation. Rien dans le contrat d'extraction ne s'y applique.
- **Les bannières console** : de l'art ASCII pour `console.log`. Aucun rendu,
  aucun réglage, aucune mesure possible — l'instrument n'aurait rien à mesurer.
- **`light_svg/` et `scoreboard_svg/`** : 64 logos NFL, assets d'un autre
  projet du portefeuille. Les copier ici les dédoublerait sans les rendre plus
  trouvables.
- **`Iridescent card (1).zip`** : doublon exact du dossier voisin.
- **`Globe loader/Shader wallpapers.zip`** : deuxième archive-doublon, absente
  du premier inventaire. Elle contient `Shader Wallpapers.html` au même octet
  près (31 155) — c'est le fichier voisin, rangé au mauvais endroit. On importe
  le HTML, pas l'archive.

## 3. Ce que ces candidats disent de notre taxonomie

`categorie` ne connaissait que **`fond`** et **`animation`**. Trois candidats
n'entraient proprement dans ni l'un ni l'autre, et c'est la taxonomie qu'il
fallait élargir, pas les candidats qu'il fallait jeter :

- **Mandelbrot, explorateur de fractales** — on ne les *regarde* pas, on les
  *manipule* : ils réagissent au zoom et au déplacement. Une catégorie
  **`interactif`** les décrirait honnêtement, et dirait au claude+n qu'il
  embarque une surface d'interaction, pas un décor.
- **Globe loader, carte iridescente** — des **éléments qu'on pose dans une
  interface** (un loader, une carte au survol). Une catégorie **`composant`**
  leur irait ; elle ouvrirait le catalogue à un besoin réel du portefeuille
  (« il me faut un loader qui ne ressemble pas à un spinner Bootstrap »).
  Ce besoin-là, c'est le **loader** qui le sert : la carte, re-vérifiée le
  2026-08-13, est une carte à jouer, pas un composant d'interface.

**TRANCHÉ le 2026-08-13** : `interactif` et `composant` sont entrés dans
`CATEGORIES` ([ADR 0012](../decisions/0012-taxonomie-interactif-et-composant.md)),
validateur calibré sur les quatre dans les deux sens, et la vitrine ne peut
plus oublier une catégorie — un titre manquant est une erreur de compilation,
vérifiée en la provoquant. Ces candidats ne sont donc plus bloqués par le
périmètre.

## 4. Plan d'import proposé (à exécuter après la recette, étape 10)

> **Ce résumé est dépassé par le plan détaillé** :
> [`plans/portage-easter-eggs.md`](../plans/portage-easter-eggs.md) — slugs,
> catégories, runtimes, pièges par élément, definition of done en dix points,
> tableau des gates et ordre d'exécution. Ce document-ci reste le **registre de
> la source** (ce qu'elle contient, ce qu'on en retient et pourquoi) ; il ne
> dit pas comment porter.

1. **Rapatrier avant de migrer** — copier les candidats retenus dans
   `sources/easter-eggs/`, en conservant les noms d'origine. Même principe que
   l'étape 1 du fil d'Ariane : la source vit dans le dépôt avant qu'on y
   touche. **Copie, jamais déplacement.**
2. **Deux arbitrages, tous deux à l'utilisateur** (aucun n'est technique) :
   `Aurora Veil` vs `aurore-boreale` · `Plasma Tide` vs `plasma-deforme`, en
   lui montrant d'abord ce que chaque camp coûte (les 8 curseurs, §2.1).
   ~~Mandelbrot vs explorateur de fractales~~ — **retiré le 2026-08-13** après
   re-vérification : ce n'était pas un choix de goût mais un cadrage fautif de
   ma part, les deux sources se composent (§2.2).
3. ~~Décision de taxonomie~~ — **faite le 2026-08-13** (ADR 0012). L'explorateur
   sera `interactif` ; le loader et la carte, `composant`.
4. **Migrer par lots**, boucle inchangée : écrire → `pnpm catalog` →
   `pnpm build` → `pnpm bench` → captures → `pnpm verify`. Les shaders relèvent
   du régime technique (réécriture libre) ; l'explorateur et le halo SVG aussi
   — aucun n'est une œuvre d'auteur au sens de l'ADR 0010.
