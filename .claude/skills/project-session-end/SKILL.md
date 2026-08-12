---
name: project-session-end
description: Use when the user says "fin de session", "session-end", "clôture", "pause", "STOP", "prépare la reprise", when a milestone of the fil d'Ariane ships (étape verte, lot de migrations benché, décision ADR), or before the final message of any session that committed code. Also self-trigger before writing the last user-facing recap of a working session.
---

# viz-light — Clôture de session

Orchestre le protocole de fermeture de `CLAUDE.md §4` — le contenu vit là-bas
et dans les documents du projet, jamais ici (minimal-fork).

## Checklist, dans l'ordre

1. **État réel** : `git log --oneline -5 && git status --short`, puis
   `pnpm verify 2>&1 | tail -3` si du code a changé depuis le dernier passage.
2. **Documents** : `SPEC.md` à jour (le plan de reprise reste sans décision) ·
   décision de session → ADR · mesure ou erreur → `evidence/`. **Tout nouveau
   fichier docs part d'une copie d'un fichier existant du même dossier**
   (frontmatter compris) — jamais de mémoire.
3. **Handoff daté** dans `docs/handoff/` — même structure que le précédent.
   Exigence unique : aucune décision implicite laissée à la prochaine session ;
   un choix restant est nommé et attribué à l'utilisateur.
4. **Mémoire projet** : `etat-viz-light.md` réécrit, leçon nouvelle = un
   fichier feedback, une ligne dans `MEMORY.md`.
5. **Fin** : `node scripts/check-docs.mjs` VERT **et** arbre git propre —
   sinon corriger maintenant, jamais reporter. Puis récapitulatif :

```
Session close.
- Livré : <une ligne par livrable, avec preuve>
- État : verify <exit>, check-docs <VERT/ROUGE>, <N> commits, arbre <propre/sale>
- Reprise : <plan exact> ; questions utilisateur : <liste ou aucune>
- Auto-évaluation : <OK/ALERTE/STOP — signe principal>
```

L'auto-évaluation est honnête : corrections utilisateur répétées, vérification
sautée, affirmation non mesurée → ALERTE ou STOP, et on le dit.

## Refuser

Clôturer rouge ou sale « pour finir plus tard » · mémo parallèle au handoff ·
« c'est fait » sans sortie de commande.
