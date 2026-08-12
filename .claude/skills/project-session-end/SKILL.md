---
name: project-session-end
description: Use when the user says "fin de session", "session-end", "clôture", "pause", "STOP", "prépare la reprise", when a milestone of the fil d'Ariane ships (étape verte, lot de migrations benché, décision ADR), or before the final message of any session that committed code. Also self-trigger before writing the last user-facing recap of a working session.
---

# viz-light — Clôture de session

Mécanise le **protocole de fermeture existant** (`CLAUDE.md §4`) — il ne le
remplace pas. Projection minimal-fork du template
`C:\Dev\skills-templates\project-session-end` (profil mature-with-discipline) :
le mémo de reprise EST le handoff daté du projet, pas un format parallèle.

> Stack-aware : Next.js 16 statique, gates = `pnpm verify` (docs → catalog →
> format → lint → typecheck → dup → test:cov → build) + `pnpm bench` mesuré,
> jamais estimé. Source de vérité : `docs/SPEC.md`.

## Protocole (7 étapes, dans l'ordre)

### 1 — État réel (collecter, ne pas supposer)

```bash
cd C:/Dev/viz-light
git log --oneline -10 && git status --short
node scripts/check-docs.mjs
pnpm verify 2>&1 | tail -4        # si du code a changé depuis le dernier verify
```

### 2 — Documents vivants

- `docs/SPEC.md` : fil d'Ariane §8 et état de l'étape en cours à jour ; si le
  périmètre a bougé, le plan d'exécution reste **sans décision à prendre**.
- Toute décision de session → ADR (`docs/decisions/`), jamais éditer un ADR.
- Toute mesure ou erreur nouvelle → `docs/evidence/` (les erreurs vont dans
  `erreurs-a-ne-pas-refaire.md` avec défaut / cause / garde-fou).

### 3 — Handoff daté (= LE mémo de reprise, format existant du projet)

`docs/handoff/<AAAA-MM-JJ>_<recit-kebab>.md`, frontmatter `authority: annex`.
Contenu exigé — sans section vide, `N/A — <raison>` sinon :

1. Point de départ → point d'arrivée (une ligne chacun).
2. Ce qui a été fait (par livrable, avec preuves : sorties de commandes).
3. Ce que la prochaine session doit savoir (pièges, leçons, corrections).
4. **La reprise est sans décision** : pointer la table/plan exact à exécuter ;
   s'il reste un choix, il appartient à l'utilisateur et il est nommé.
5. État à la passation : fil d'Ariane, `verify` exit code, commits, push state.

### 4 — Mémoire projet

`C:/Users/pierr/.claude/projects/C--Dev-viz-light/memory/` :
`etat-viz-light.md` réécrit (état, priorité de reprise, questions utilisateur),
nouvelles leçons en fichiers `type: feedback` distincts, index `MEMORY.md`
mis à jour (une ligne par mémoire, pas de contenu).

### 5 — Gates finaux

```bash
node scripts/check-docs.mjs        # VERT obligatoire
git status --short                 # arbre PROPRE obligatoire (commits conventionnels)
```

### 6 — Auto-évaluation de fin (1 ligne, honnête)

`OK` / `ALERTE` / `STOP` sur trois signes : corrections utilisateur répétées
sur le même sujet · vérifications sautées « pour aller vite » · affirmations
non mesurées dans les derniers messages. Si ALERTE ou STOP, le dire à
l'utilisateur — c'est une donnée, pas un aveu.

### 7 — Récapitulatif utilisateur (format fixe)

```
Session close.
- Livré : <une ligne par livrable, avec preuve>
- État : verify <exit>, check-docs <VERT/ROUGE>, <N> commits, arbre <propre/sale>
- Reprise : <fichier/section du plan sans décision> ; question(s) qui t'appartiennent : <liste ou aucune>
- Auto-évaluation : <OK/ALERTE/STOP — signe principal>
```

## Anti-patterns (refuser)

- Clôturer avec `verify` rouge ou un arbre sale « à finir la prochaine fois ».
- Handoff qui résume sans preuves, ou qui laisse un choix implicite à la
  prochaine session au lieu de le figer ou de le nommer comme décision
  utilisateur.
- Créer un fichier mémo parallèle au handoff (doublon interdit — minimal-fork).
- « C'est fait » sans coller la sortie de la commande.

## Références

- `C:/Dev/viz-light/CLAUDE.md` §4 (protocole, source de vérité de ce skill).
- `docs/SPEC.md` §8 (fil d'Ariane) ; dernier `docs/handoff/` (format vivant).
- Template canonique : `C:\Dev\skills-templates\project-session-end\SKILL.md`
  (projection minimal-fork 2026-08-12 : mémo/questions/sanity = coexist avec
  l'existant ; fichiers feedback doctrine = ignore, rien créé).
