---
authority: annex
adr_status: accepted
last_verified: 2026-10-05
expires: never
---

# ADR 0019 — La source `tweet-direct` : un one-liner collé hors des artifacts

## Contexte

Le 2026-10-05, l'utilisateur colle un nouveau one-liner @yuruyurau
(#つぶやきProcessing) dans une session Claude Code : « un nouveau code à
dé-minifier et à ajouter aux viz ». C'est le premier ajout au fil de l'eau
(étape 10) qui ne passe par aucun artifact.

`origine.source` ne connaissait que des lieux de rapatriement :
`tweet-sketches` est **l'artifact claude.ai** dont viennent les 19 sketches v1
(`evidence/sources-viz-light.md`), pas « tout tweet de @yuruyurau ». Réutiliser
cette valeur aurait deux effets faux :

1. **Une provenance fausse** dans le manifest et dans `CATALOG.md`.
2. **Un compteur faux** : `scripts/check-session.mjs` compte la progression v1
   (`N/31`) sur les sources v1. La nouvelle viz passerait le compte à 32/31, et
   `pnpm session` serait rouge.

## Décision

**`SOURCES` gagne `tweet-direct`** : un sketch fourni directement par
l'utilisateur, recopié à l'octet dans `sources/tweets-golfes.md`
(§ « Ajouts au fil de l'eau »), qui reste le fichier de référence de fidélité.

Le régime de migration ne change pas : un one-liner d'auteur est une **œuvre**
([ADR 0010](0010-deux-regimes-de-migration.md)), donc portage fidèle, rendus
`origine` et `aligne` ([ADR 0008](0008-deux-rendus-par-viz-origine-et-aligne.md)),
captures comparées.

Même geste que l'[ADR 0014](0014-source-easter-eggs-dans-le-contrat.md) :
élargir le type plutôt que tordre la donnée.

## Ce qui rend la décision sûre

- Le validateur est calibré dans les deux sens (`tests/manifest-valider.test.ts`) :
  le test « accepte la source tweet-direct » a été vu **rouge** avant l'ajout à
  `SOURCES`, vert après ; une source inventée reste refusée.
- `check-session.mjs` n'a pas à changer : `tweet-direct` n'est pas une source
  v1, donc hors du compte `N/31`.
- Aucun `Record<Source, …>` exhaustif dans le dépôt : pas de piège
  d'invisibilité.

## Conséquences

- La date du post n'est pas connue (l'utilisateur ne l'a pas fournie, une
  recherche web ne l'a pas retrouvée) : `origine.date` est absent, ce que le
  schéma autorise. Elle n'est pas inventée.
- Les prochains one-liners collés suivent la même voie.
