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

**Règle d'import, posée par l'utilisateur : PAR COPIE, jamais par déplacement.**
`C:\Dev\Easter_eggs` doit rester intact et complet après l'opération. Rien n'y
est supprimé, renommé ni modifié.

## 1. Ce que contient le dossier

| Élément | Poids | Ce que c'est, vérifié |
|---|---|---|
| `Shader wallpapers/Shader Wallpapers.html` | 31 Ko | **5 fonds WebGL** en un seul fichier : `Plasma Tide`, `Neon Voronoi`, `Aurora Veil`, `Holographic Foil`, `Quantum Field`. Un canvas, `fbm` / `noise` / `voronoi` en GLSL lisible. |
| `mandelbrot-easter-egg/` | 35 Ko + React | Explorateur de Mandelbrot. **Version React déjà en couches** : `domain/` (types, calcul, palettes) en TS pur, `application/` (hooks), plus un `standalone/mandelbrot.html` sans dépendance. |
| `fractal-explorer.html` | 48 Ko | Explorateur de fractales, canvas2d interactif. Recouvre probablement le précédent. |
| `Globe loader/Globe Loader.html` | 5,6 Ko | Loader 200 × 200 : anneaux SVG animés en CSS + un canvas 2D. |
| `Iridescent card (1)/` | 5,6 Ko + 3 `.jsx` | Carte d'interface iridescente (`conic-gradient` CSS, pas de canvas), avec un panneau de réglages et des captures. |
| `Miami_circuit_easter-egg/` | 4 fichiers | Tracé SVG du circuit de Miami + deux HTML (bouton, halo) + `MiamiCircuit.tsx` + un script de synchro d'équipes. |
| `drum-machine-standalone.html` + `dm-bridge-template.css` + `docs/` | 68 Ko + 2 md | Boîte à rythmes (audio) et sa recherche de génération ML. |
| `console-log-banner.html`, `playground-console-banner.html` | 1,5 + 12 Ko | Bannières ASCII pour la console du navigateur. |
| `light_svg/`, `scoreboard_svg/` | 32 SVG × 2 | Logos des équipes NFL. |
| `Iridescent card (1).zip` | 210 Ko | Archive du dossier de même nom — doublon. |

## 2. Le tri

### Candidats — à importer

1. **Les 5 fonds shader** (`fond`, régime technique). Le meilleur lot du
   dossier : cinq fonds WebGL prêts, du même genre que ceux déjà migrés, avec
   du GLSL en clair. **Deux doublons probables à arbitrer par l'utilisateur** :
   `Aurora Veil` contre notre `aurore-boreale`, `Plasma Tide` contre notre
   `plasma-deforme` — verdict esthétique, donc décision utilisateur (même
   traitement que le Flow Field).
2. **Mandelbrot** (catégorie à créer, cf. §3). Son `domain/` est déjà du
   TypeScript pur sans React : c'est **exactement** la frontière qu'impose
   `SPEC.md §3`. Le portage sera court.
3. **L'explorateur de fractales**, à comparer au Mandelbrot avant de porter les
   deux : deux explorateurs de fractales dans un catalogue de 31 viz, c'est
   probablement un doublon. À montrer côte à côte.
4. **Le halo du circuit de Miami** — la *technique* (tracé lumineux qui court
   le long d'un chemin SVG) est réutilisable et jolie ; le *contenu* (le circuit
   de Miami, les logos d'équipes) appartient à un autre projet. Importer
   l'effet, pas le tracé.
5. **Globe loader** et **Iridescent card** : voir §3 — ils ne sont pas des
   fonds, mais ils ne sont pas sans intérêt pour autant.

### Sans leur place ici — à laisser sur place

- **La boîte à rythmes** et ses deux documents : un instrument audio n'est pas
  une visualisation. Rien dans le contrat d'extraction ne s'y applique.
- **Les bannières console** : de l'art ASCII pour `console.log`. Aucun rendu,
  aucun réglage, aucune mesure possible — l'instrument n'aurait rien à mesurer.
- **`light_svg/` et `scoreboard_svg/`** : 64 logos NFL, assets d'un autre
  projet du portefeuille. Les copier ici les dédoublerait sans les rendre plus
  trouvables.
- **`Iridescent card (1).zip`** : doublon exact du dossier voisin.

## 3. Ce que ces candidats disent de notre taxonomie

`categorie` ne connaît aujourd'hui que **`fond`** et **`animation`**
(`core/manifest/types.ts`). Trois candidats n'entrent proprement dans ni l'un
ni l'autre, et c'est la taxonomie qu'il faut élargir, pas les candidats qu'il
faut jeter :

- **Mandelbrot, explorateur de fractales** — on ne les *regarde* pas, on les
  *manipule* : ils réagissent au zoom et au déplacement. Une catégorie
  **`interactif`** les décrirait honnêtement, et dirait au claude+n qu'il
  embarque une surface d'interaction, pas un décor.
- **Globe loader, carte iridescente** — des **éléments d'interface** (un
  loader, une carte au survol). Une catégorie **`composant`** leur irait ; elle
  ouvrirait le catalogue à un besoin réel du portefeuille (« il me faut un
  loader qui ne ressemble pas à un spinner Bootstrap »).

**Recommandation** : ajouter `interactif` et `composant` à `CATEGORIES`, et
élargir d'une ligne l'objet du projet (`SPEC.md §1`). Le coût est faible — le
champ est déjà validé et déjà utilisé pour séparer les sections de la vitrine.
Le risque est de diluer le catalogue : à trancher par l'utilisateur, puisque
cela touche à ce qu'il veut parcourir.

## 4. Plan d'import proposé (à exécuter après la recette, étape 10)

1. **Rapatrier avant de migrer** — copier les candidats retenus dans
   `sources/easter-eggs/`, en conservant les noms d'origine. Même principe que
   l'étape 1 du fil d'Ariane : la source vit dans le dépôt avant qu'on y
   touche. **Copie, jamais déplacement.**
2. **Trois arbitrages, tous à l'utilisateur** (aucun n'est technique) :
   `Aurora Veil` vs `aurore-boreale` · `Plasma Tide` vs `plasma-deforme` ·
   Mandelbrot vs explorateur de fractales.
3. **Décision de taxonomie** (§3) : `interactif` et `composant`, oui ou non. Si
   oui : ADR + extension de `CATEGORIES` + calibration du validateur dans les
   deux sens, avant la première viz de ces catégories.
4. **Migrer par lots**, boucle inchangée : écrire → `pnpm catalog` →
   `pnpm build` → `pnpm bench` → captures → `pnpm verify`. Les shaders relèvent
   du régime technique (réécriture libre) ; le Mandelbrot et le halo SVG aussi
   — aucun n'est une œuvre d'auteur au sens de l'ADR 0010.
