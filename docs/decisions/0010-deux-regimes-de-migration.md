---
authority: annex
adr_status: accepted
last_verified: 2026-08-12
expires: never
---

# ADR 0010 — Deux régimes de migration : œuvres et techniques

**Date** : 2026-08-12 · **Statut** : accepted
**Demandé par l'utilisateur** : « pour les effets génériques, le code n'est pas
verbatim ! »

## Contexte

`SPEC.md §4` posait une seule règle pour les 31 viz : fidélité vérifiée par
captures comparées contre l'original. Elle vient d'un incident réel — une
version générique substituée à une implémentation validée, côté claude.ai.

Appliquée sans distinction, elle a produit un effet pervers mesurable. Les 10
effets du banc d'essai vivent dans un bundle minifié ; croyant devoir en faire
un portage fidèle, je les ai reportés au profit de sketches plus faciles à
transcrire. **Ce sont pourtant les plus simples du catalogue**, et les seuls de
catégorie `fond` — la section « Fonds » de la vitrine est donc restée vide,
alors que c'est précisément la séparation que l'utilisateur avait demandée
(cf. `evidence/erreurs-a-ne-pas-refaire.md` §12).

## Décision

**La règle de fidélité dépend de la nature de la source, pas de la difficulté du
portage.**

| Origine | Nature | Régime | Preuve attendue |
|---|---|---|---|
| `tweet-sketches` · `atelier-generatif` | **œuvre** — la formule est signée | portage fidèle | capture comparée à l'original, sur le rendu `origine` |
| `banc-essai` | **technique** — grain, flou, dégradé, constellation | réécriture libre | le rendu et les paramètres exposés |

## Pourquoi la distinction tient

Un sketch @yuruyurau est une formule d'auteur : une constante mal transcrite
n'est pas une variation, c'est une autre œuvre — et le rendu raffiné rendrait
l'erreur indiscernable d'un choix esthétique. D'où la capture comparée.

Un grain de film n'a pas d'auteur. Deux implémentations correctes diffèrent dans
leur code et se valent. Exiger d'elles une fidélité au code, c'est protéger
quelque chose qui n'existe pas, tout en payant le prix fort : du temps de
désassemblage, et des viz reportées.

**Ce que la décision ne relâche pas** : l'interdiction de substituer une version
générique à une implémentation **que l'utilisateur a validée** reste entière.
Elle porte sur les œuvres et sur toute viz recettée — pas sur des techniques
jamais arbitrées.

## Conséquences

- Les fonds n'ont pas de rendu `origine` obligatoire : un seul rendu suffit si
  la viz n'a rien à prouver contre un original.
- Le bundle minifié `sources/banc-essai-effets.html` cesse d'être un obstacle :
  `params`, `claim` et `reality` y sont lisibles, c'est la matière suffisante.
- Le gate de fidélité (captures comparées, étape 6) ne s'applique qu'aux viz de
  régime « œuvre ». Il ne doit pas être écrit de façon à réclamer une
  comparaison impossible pour les autres.
- Le verdict final sur les fonds appartient à l'utilisateur (étape 8), comme
  pour le reste.

## Alternative écartée

- **Garder une règle unique et désassembler le bundle** : coût réel, bénéfice
  nul — on aurait reproduit fidèlement un code que personne ne revendique, et
  la vitrine serait restée sans fonds plus longtemps encore.
