---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# ADR 0015 — Un genre de paramètre `choix` (un choix parmi N valeurs libellées)

## Contexte

Le contrat de données ne connaissait que trois genres de paramètre :
`GENRES_PARAM = ["curseur", "interrupteur", "couleur"]`
(`src/core/manifest/types.ts`). Le lot Easter_eggs
(`plans/portage-easter-eggs.md`) amène un réglage qu'aucun des trois n'exprime :
l'`explorateur-de-fractales` doit offrir **sept familles** (Mandelbrot, Julia,
Burning Ship, Tricorn, Multibrot z³/z⁴/z⁵) et une **palette**. Ce n'est ni une
grandeur continue (curseur) ni un booléen (interrupteur).

Tordre le contenu pour entrer dans un curseur (« de 1 à 7 ») produirait un
réglage dont le « 3 » ne veut rien dire sans **légende** — exactement ce que
l'exigence utilisateur n°3 interdit (SPEC §4, « Aucune légende »).

## Décision

**`GENRES_PARAM` devient
`curseur | interrupteur | couleur | choix`.**

Un `choix` porte une liste d'`options` `{ valeur, libelle }` et une valeur par
défaut qui doit être la `valeur` de l'une d'elles. Le panneau le rend comme un
menu déroulant libellé — le libellé EST l'explication, il n'y a pas de légende à
ajouter.

C'est le même geste que l'[ADR 0012](0012-taxonomie-interactif-et-composant.md)
(catégories) et l'[ADR 0014](0014-source-easter-eggs-dans-le-contrat.md)
(sources) : élargir le type plutôt que laisser le type décider à la place du
contenu.

## Ce qui rend la décision sûre

1. **Le validateur est calibré dans les deux sens**
   (`tests/manifest-valider.test.ts`, describe « genre choix ») : un `choix`
   dont la valeur par défaut est une option passe ; une valeur absente des
   options, une liste d'options vide ou absente, une option sans `valeur`/
   `libelle`, deux options de même `valeur` — chacun échoue sur son chemin
   précis.
2. **Le panneau ne peut pas oublier de rendre un genre.** `Reglages.tsx` répartit
   désormais les contrôles par un `Record<GenreParam, …>` (`CONTROLES`) : ajouter
   un genre à `GENRES_PARAM` sans lui donner de contrôle est une **erreur de
   compilation** attrapée par `pnpm typecheck` — pas un réglage silencieusement
   invisible. Contrairement à `Source` (ADR 0014, rendu inerte, aucun `Record`
   exhaustif), un genre **doit** être rendu, donc la garantie est ici nécessaire.

## Conséquences

- L'`explorateur-de-fractales` (Lot 3 du plan) peut exposer « Famille » et
  « Palette » sans légende.
- Aucun paramètre existant ne change : un `Param` sans `genre` reste un curseur,
  le cas majoritaire. Les manifests des 31 viz migrées sont intacts.
- La lecture côté algo d'un `choix` (une chaîne = la clé d'option) sera ajoutée à
  `core/viz/reglages.ts` quand le premier algo consommateur arrivera (Lot 3) —
  pas avant, pour ne pas livrer de code sans test qui l'exerce.
