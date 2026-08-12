---
authority: annex
adr_status: accepted
last_verified: 2026-08-12
expires: never
---

# ADR 0007 — TypeScript 6.0.3, plafonné par le lint type-aware

**Date** : 2026-08-12 · **Statut** : accepted

## Contexte

La règle d'épinglage du tier global est sans ambiguïté : au scaffold, on épingle
les **latest stables** mesurées, jamais les versions « connues » d'un modèle.
Mesuré au registre le 2026-08-12, `typescript@latest` = **7.0.2**.

Mais `SPEC.md §5` exige un socle qualité comprenant des **règles ESLint
type-aware** — celles qui voient ce qu'un linter syntaxique ne peut pas voir
(promesses non attendues, notamment). Ces règles viennent de `typescript-eslint`.

Lecture des `peerDependencies` publiées le 2026-08-12 :

```
typescript-eslint@8.67.0            typescript >=4.8.4 <6.1.0
typescript-eslint@8.67.1-alpha.2    typescript >=4.8.4 <6.1.0   (canary)
@typescript-eslint/parser@latest    typescript >=4.8.4 <6.1.0
```

Aucune version publiée, canary comprise, n'accepte TypeScript 7.

## Décision

**Épingler `typescript` à 6.0.3** — le dernier 6.x publié — et non 7.0.2.

Deux règles s'opposaient ; celle qui cède est celle qui coûte le moins.
« Latest stable » existe pour empêcher un modèle de proposer des versions
datées de son entraînement : ici, le retard est **mesuré et daté**, pas subi.
Le lint type-aware, lui, est un gate : le retirer pour gagner un numéro de
version majeure, c'est exactement le « toucher au seuil pour faire passer le
build » que le tier global interdit.

## Conséquences

- Le socle garde ses règles type-aware. Aucun gate n'est affaibli.
- On perd les apports de TypeScript 7 (compilateur natif, vitesse). Sur un
  projet de cette taille, la compilation n'est pas le goulot.
- **Sortie de reconquête** : dès qu'une version de `typescript-eslint` déclare
  `typescript <7.x` ou plus, passer à TypeScript 7 et re-mesurer. Le point de
  contrôle est la ré-vérification de `evidence/versions-epinglees.md`
  (`expires: 2026-11-12`) — la contrainte est donc revue au plus tard à cette
  date, sans dépendre de la mémoire de qui que ce soit.

## Alternatives écartées

- **TypeScript 7 + lint type-aware désactivé** : sacrifie un gate exigé par le
  SPEC pour un gain de confort. Refusé.
- **TypeScript 7 + `typescript-eslint` forcé hors de sa plage** (override pnpm) :
  fait tourner le parser hors du contrat déclaré par ses auteurs. Un gate qu'on
  fait tourner en terrain non supporté ne prouve plus rien.
- **Rester sur TypeScript 5.x** comme ma-cdm : plus vieux que nécessaire, sans
  contrepartie — 6.0.3 est dans la plage supportée.
