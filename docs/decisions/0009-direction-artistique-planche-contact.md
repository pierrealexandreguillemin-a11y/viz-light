---
authority: annex
adr_status: accepted
last_verified: 2026-08-12
expires: never
---

# ADR 0009 — Direction artistique : la planche contact

**Date** : 2026-08-12 · **Statut** : accepted
**Demandé par l'utilisateur** : « ajoute une étape frontend […] pour t'assurer
que le projet est agréable à regarder et que l'UI et l'UX sont bonnes. »

## Contexte

La palette posée au scaffold (étape 2) était **un défaut, pas un choix** : fond
quasi-noir + un accent cyan vif. C'est l'un des trois looks vers lesquels la
génération assistée converge par défaut, indépendamment du sujet. Il fallait le
remplacer par une direction tirée du sujet lui-même.

Le sujet : des sketches de #つぶやきProcessing et des fonds animés. Leur monde,
c'est du **code tapé, court, daté**, qui produit de la lumière accumulée sur de
l'encre — les originaux dessinent sur `background(9)` avec de l'alpha. Et le
banc d'essai rapatrié porte déjà une idée forte, en toutes lettres dans ses
données : un champ `claim` (« extrêmement faible ») contredit par un champ
`reality` (« faux tel quel, mais pour une raison intéressante »).

## Décision

**La vitrine est une planche contact où chaque spécimen porte son coût mesuré.**

Trois règles en découlent, chacune vérifiable :

### 1. Chrome chaud, mesure froide, l'art possède toute autre couleur

Les viz sont froides (teintes HSB cyan/magenta). L'interface est donc **os et
ambre** — chaude — pour qu'elle ne puisse jamais rivaliser avec une viz. Un seul
ton froid subsiste, `--color-mesure`, **réservé aux chiffres de l'instrument**.

### 2. Le monospace est la voix de la machine ; la sans-serif, celle de l'humain

Titres, étiquettes, provenance, nombres : monospace resserré. **Seule la phrase
`ambiance`** — le seul champ subjectif du manifest, celui qui dit ce qu'on
ressent et non ce que ça calcule — passe en sans-serif italique. La distinction
typographique encode donc une distinction réelle du contrat de données.

Aucune fonte n'est téléchargée : la sortie est statique et sans requête externe.
Utiliser la fonte du code comme fonte d'affichage n'est pas un repli, c'est
cohérent avec un catalogue de code — à condition de la traiter comme un choix
(grande taille, interlettrage négatif), ce qui est fait.

### 3. La grille encode l'état de la mesure

Le filet d'une cellule passe **à l'ambre** quand la viz a une perf relevée, et
reste os pâle sinon. On voit d'un coup d'œil, sans lire, ce qui est prouvé.

### L'élément signature : le filet de coût

Une barre de 3 px sous chaque viz montre **la part du budget d'une image
(16,7 ms) consommée par le JavaScript**. Une viz GPU-bound affiche une barre
presque vide tout en tournant lentement. C'est la leçon « ce qu'on lit vs ce que
la mesure montre » rendue visible **sans une phrase** — et c'est aussi ce que le
bench relève (`data-fps`, `data-js-p95`…), donc le chiffre du manifest est
exactement celui que l'écran affiche.

## Ce qui a été corrigé après capture

La première version a été jugée sur image, pas sur intention :

- **De la prose en monospace** dans l'en-tête — quatre lignes de mono forment un
  mur, et cela enfreignait la règle 2 dès la première page. L'explication est
  descendue en `Legende`, contre l'objet qu'elle décrit.
- **Une dalle grise** occupant la moitié de l'écran : peindre le fond de la
  grille pour obtenir les filets laisse les colonnes vides visibles. Les filets
  sont passés en `outline` sur chaque cellule.
- **Des cellules étirées** en hauteur : `align-items: start`.

## Conséquences

- Une **étape 5b** est ajoutée au fil d'Ariane : direction artistique et revue
  UI/UX. Elle est repassée à l'étape 8, quand la planche est pleine — une
  direction se juge sur du contenu réel, pas sur un état vide.
- Le socle qualité gagne un gate de fait : `tests/couleurs-oklch.test.ts`
  garantit que la palette reste en OKLCH, donc que la règle 1 ne se dilue pas.
- Le verdict esthétique final reste celui de l'utilisateur (étape 8).

## Alternative écartée

- **Une grille de cartes arrondies avec un accent vif** : c'est le défaut décrit
  plus haut. Il ne dit rien du sujet et aurait rendu la vitrine
  interchangeable avec n'importe quel autre catalogue.
