---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# ADR 0014 — La source `easter-eggs` entre dans le contrat de données

## Contexte

Le lot `C:\Dev\Easter_eggs` (SPEC §4, hors v1 ; inventaire vérifié dans
`evidence/sources-easter-eggs.md`, spec de portage dans
`plans/portage-easter-eggs.md`) démarre. Ses neuf éléments sont importés **par
copie** et catalogués comme toute autre viz — donc avec un `manifest.json`.

Le contrat de données ne connaissait que les trois artifacts « Viz Light » :
`SOURCES = ["tweet-sketches", "banc-essai", "atelier-generatif"]`
(`src/core/manifest/types.ts`). Un manifest portant
`origine.source: "easter-eggs"` était **refusé par le validateur**
(`valider.ts`, `validerOrigine`) → `pnpm catalog` rouge → `pnpm verify` rouge.
Rien du lot ne pouvait se porter tant que ce verrou tenait.

## Décision

**`SOURCES` devient
`tweet-sketches | banc-essai | atelier-generatif | easter-eggs`.**

Décision de l'utilisateur, 2026-08-22 : « 4 : go » sur le lancement du lot
Easter_eggs.

C'est le même geste que l'[ADR 0012](0012-taxonomie-interactif-et-composant.md)
pour les catégories : élargir le type plutôt que tordre le contenu ou laisser le
type refuser une donnée légitime.

## Ce qui rend la décision sûre

1. **Le validateur est calibré dans les deux sens**
   (`tests/manifest-valider.test.ts`) : `"easter-eggs"` passe désormais, une
   source inventée (`"inventee"`, `"codepen"`) échoue toujours sur
   `origine.source`. Une valeur annoncée par le type mais refusée par le
   validateur donnerait un gate qui ment.
2. **Pas de piège d'invisibilité, contrairement aux catégories de l'ADR 0012.**
   Vérifié : aucun `Record<Source, …>` exhaustif dans le dépôt — la source
   s'affiche telle quelle (`core/catalogue/rendre.ts`, `composants/Specimen.tsx`).
   Le seul mode de panne possible était le refus franc du validateur, qui est
   bruyant, jamais une viz silencieusement invisible.

## Conséquences

- Les manifests du lot Easter_eggs peuvent porter leur origine réelle sans
  mensonge — une viz venue de `C:\Dev\Easter_eggs` n'a pas à se déguiser en
  banc d'essai pour passer le gate.
- Aucune viz existante ne change de source : les 31 migrées restent
  `tweet-sketches`, `banc-essai` ou `atelier-generatif`.
- Ce premier déblocage ne suffit pas au lot : l'explorateur de fractales exige
  aussi un genre de paramètre `choix`
  ([ADR 0015](0015-genre-de-parametre-choix.md)).
