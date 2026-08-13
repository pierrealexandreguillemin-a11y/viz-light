---
authority: annex
adr_status: accepted
last_verified: 2026-08-13
expires: never
---

# ADR 0012 — La taxonomie s'ouvre à `interactif` et `composant`

## Contexte

Le catalogue ne connaissait que deux usages : `fond` et `animation`. L'inventaire
du lot `C:\Dev\Easter_eggs` (`evidence/sources-easter-eggs.md`, 2026-08-13) a
sorti trois candidats qui n'entrent proprement dans ni l'un ni l'autre :

- un explorateur de Mandelbrot et un explorateur de fractales, qu'on ne regarde
  pas mais qu'on **manipule** — ils répondent au zoom et au déplacement ;
- un loader animé et une carte iridescente, qui sont des **éléments
  d'interface** : ils ont une place dans une page, pas un cadre à eux.

Deux issues : les refuser au motif qu'ils ne sont pas des fonds, ou élargir la
taxonomie. Refuser aurait été laisser la case décider à la place du goût.

## Décision

**`CATEGORIES` devient `fond | animation | interactif | composant`.**

Décision de l'utilisateur, 2026-08-13 : « on peut éventuellement enrichir la
taxonomie et le scope actuels pour des éléments intéressants », puis
« ma recommandation : ajouter interactif et composant ».

`interactif` n'est pas une nuance cosmétique : il prévient un claude+n qu'il
embarque **une surface d'interaction**, pas un décor — donc des écouteurs, un
état, et une politique de clavier à reprendre. C'est une information de contrat
d'extraction, pas une étiquette de rangement.

## Ce qui rend la décision sûre

1. **Le validateur est calibré sur les quatre**, dans les deux sens
   (`tests/manifest-valider.test.ts`) : chacune passe, `"joli"` et l'absence
   échouent. Une catégorie annoncée par le type mais refusée par le validateur
   donnerait un gate qui ment.
2. **La vitrine ne peut plus oublier une catégorie.** `Planche.tsx` tient ses
   titres dans un `Record<Categorie, string>` : ajouter une catégorie sans lui
   donner de section est désormais une **erreur de compilation**, attrapée par
   `pnpm typecheck`. Avec l'ancien tableau, la viz aurait été valide, mesurée,
   cataloguée… et invisible — une panne muette, la pire espèce.

## Conséquences

- Le périmètre du projet s'élargit d'un cran : le catalogue répond aussi à
  « il me faut un loader qui ne ressemble pas à un spinner » et « il me faut
  une pièce qu'on manipule ».
- Risque assumé, nommé par l'utilisateur : diluer ce qu'il parcourt. La parade
  est la séparation en sections, déjà en place — quatre listes courtes plutôt
  qu'une longue.
- Aucune viz existante ne change de catégorie : les 31 migrées restent `fond`
  ou `animation`.
