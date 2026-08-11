---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0002 — Chaque viz est un composant React natif (algo pur + coquille mince)

**Contexte.** Trois formes envisagées : HTML autonomes maintenus à la main
(+ harnais de synchro), HTML autonomes générés par build, composants React.
Les projets hôtes du portefeuille sont ~100 % React/Next
(`evidence/stacks-portfolio.md`).

**Décision (utilisateur, 2026-08-11).** Les deux approches HTML sont
**refusées**, ainsi que l'idée d'un wrapper générique. Chaque viz est un
**composant React natif** : `algo.ts` en TS pur (aucun import React) + `<Name>.tsx`
coquille mince consommant les hooks du socle.

**Conséquences.** Extraction = copie de dossier, idiome identique à l'hôte.
Portage non-React possible à bon marché (algo pur + recette de montage générique
documentée une fois dans CATALOG.md). Pas de fichier HTML par viz en v1 —
réintroductible en génération si un besoin réel apparaît.
