---
authority: annex
last_verified: 2026-08-13
expires: never
---

# Handoff — 2026-08-13 (3e session) · les 13 derniers sketches p5

**Point de départ** : étape 6 à 15/31, gate `pnpm session` VERT, plan des 13
sketches figé dans `SPEC.md` — aucune décision à prendre.
**Point d'arrivée** : étape 6 à **28/31**, les **18 sketches @yuruyurau
migrés, mesurés et prouvés** par captures comparées. `pnpm verify` exit 0.

## 1. Ce qui a été fait

Les 13 sketches restants, exécutés ligne par ligne depuis la table de
`SPEC.md` : `coquille-jumelle`, `rosace-triple`, `corolle-de-maree`,
`eventail-crante`, `attracteur-de-lorenz`, `colonne-perlee`, `rosace-jumelle`,
`medaillon-tournant`, `ruban-plisse`, `ruban-ondule`, `anemone-marine`,
`couronne-battante`, `rosace-fondatrice`.

Les quatre pièges annoncés étaient réels et sont tous traités :

- **`y^9` du 24 juillet** : XOR entier, pas une puissance → `Math.trunc(y) ^ 9`.
- **État du Lorenz (9 mai)** : le seul sketch à état de la série. Il intègre
  trente mille pas d'Euler par image et se ré-amorce à `(9,9,9)` quand `i`
  remonte — le moteur parcourt `i` en descendant, donc un `i` qui remonte
  signale sans ambiguïté une nouvelle image. Intégrer PUIS tracer (l'ordre du
  golfé : corps de boucle vs clause de mise à jour).
- **Cercles pleins du 7 mai** : champ `PointCalcule.taille` ajouté au moteur,
  `fillRect(x, y, taille, taille)`. Les perles plus grosses au bord sont
  visibles sur la capture.
- **`w` caché du 6 mars** : `i/w/3` où `w = 400` est posé par
  `createCanvas(w = 400, w)` plus loin dans le golfé.

### Deux ajouts au moteur, chacun exigé par une œuvre

`PointCalcule.taille` (ci-dessus) et `placerEnPolaire(q, c, magnitude, ecart)`
— la forme `point(q·sin(c) + 200, (q + ecart)·cos(c) + 200)` que plusieurs
sketches partagent mot pour mot. Arithmétique identique, terme pour terme.

### Chaque formule porte le nom de son œuvre

`function positionner` partout créait un squelette identique d'un fichier à
l'autre (import + signature + bloc d'export) : **jscpd a mordu, à raison**.
Chaque formule s'appelle désormais `coquilleJumelle`, `rosaceTriple`… Le seuil
de duplication n'a pas bougé — c'est le code qui a changé.

## 2. La preuve de fidélité — et ce qu'elle a coûté

13 paires dans `evidence/captures/` (`<slug>--original-p5.png` face à
`<slug>--origine-catalogue.png`), l'original exécuté **verbatim** depuis
`sources/tweets-golfes.md` dans un vrai p5 1.9. Les 13 concordent : géométrie,
densité, silhouette.

**Le banc de captures a produit trois fois de suite des images qui ne
prouvaient rien, sans jamais échouer** — détail dans
`evidence/erreurs-a-ne-pas-refaire.md` §16 (clic avant hydratation · clic sur
le mauvais article · chronomètre parti de la navigation et non du montage).
Retenir : le PNG produit n'est pas la preuve, l'image l'est — il faut la
regarder.

**Cinq golfés du fichier de référence ne s'exécutent pas** (§17) : ils
finissent par `}#つぶやきProcessing` sans les `//`. Artefact de transcription ;
le fichier de référence n'a **pas** été édité, c'est le banc qui neutralise la
fin de ligne.

## 3. Les chiffres, tels que mesurés

28 viz mesurées, `pnpm bench` étalonné à 61 i/s sur page vide. Toutes à 59,9 i/s
sauf **`attracteur-de-lorenz` et `couronne-battante` : 30 i/s**, ~33 ms de
JavaScript par image. Ce n'est pas un défaut de portage — trente mille points
par image, c'est ce que demande le golfé, et le curseur « Points » laisse
l'utilisateur arbitrer. Les manifests portent le chiffre réel.

Une première passe de bench avait donné 30 i/s à cinq viz de plus : c'était la
machine chargée par un autre travail, pas les viz. La seconde passe, machine
calme, les remet à 59,9. L'étalonnage a fait son office (il avait d'abord
REFUSÉ de mesurer à 54 i/s).

## 4. Divers

`pnpm dev` écoute désormais sur le **port 4320** (le 3000 était disputé avec
d'autres projets du portefeuille). Isolation vérifiée par ailleurs : rien ne
fuit hors du dossier — `node_modules` local, hooks git dans `.husky/_`, aucune
install globale, store pnpm partagé en lecture seule. La gêne ressentie était
du CPU (Chrome headless du bench), pas une fuite.

## 5. Ce que la prochaine session doit faire

1. **Étape 6, 3 viz restantes** : les algos de l'Atelier génératif, régime
   « œuvre ». Même boucle : écrire → `pnpm catalog` → `pnpm build` →
   `pnpm bench` → captures comparées → `pnpm verify`.
2. **La seule décision du chantier appartient à l'utilisateur** : l'arbitrage
   *Flow Field* (version banc d'essai déjà migrée en `fond`, contre celle de
   l'Atelier). Lui montrer les deux, ne rien trancher.
3. Puis étape 8 : recette visuelle complète par Pierre-Alexandre.

## 6. État à la passation

- Fil d'Ariane : 0-5b ✅, **étape 6 : 28/31**, 8-10 ⬜.
- `pnpm verify` → **exit 0**. `pnpm session` → VERT.
- Aucun push, aucun remote. Commits atomiques sur `master`.
