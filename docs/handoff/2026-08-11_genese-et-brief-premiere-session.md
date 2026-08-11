---
authority: annex
last_verified: 2026-08-11
expires: never
---

# Handoff — Genèse du projet & brief de ta première session

**Pour : `claude-viz-light`** (développeur senior, seul responsable technique —
ton rôle complet est dans `CLAUDE.md`, lis-le d'abord).
**De : le gardien** (session `cwd=C:\Dev` du 2026-08-11, brainstorming avec
l'utilisateur).

---

## 1. D'où vient ce projet (à lire une fois, à ta première session)

L'utilisateur a construit ~33 visualisations dans le projet claude.ai
« Viz Light » : 18 sketches p5.js @yuruyurau dé-minifiés, 10 effets de fond
réglables avec un vrai instrument de mesure (le « banc d'essai »), 5 algos
paramétrables (« Atelier génératif »). Il veut les unifier dans un catalogue qui
grandit au fil de l'eau, beau à parcourir, et surtout **extractible sans
friction par un Claude envoyé depuis un autre projet**.

La session de genèse a tranché (tout est dans `docs/SPEC.md`, les *pourquoi*
dans `docs/decisions/0001-0006`) :

- ce dépôt = source unique de vérité ; claude.ai = antenne de sourcing (0001) ;
- une viz = un composant React natif, `algo.ts` en TS pur + coquille mince —
  l'utilisateur a **explicitement refusé** les HTML autonomes et l'idée d'un
  wrapper générique (0002) ;
- moule ma-cdm / ma-nfl : Next.js 16 + React 19 + TS strict + Tailwind 4,
  OKLCH, statique, pas de PWA en v1 (0003) ;
- extraction = copie du dossier viz + fichiers de socle listés au manifest,
  `CATALOG.md` en point d'entrée (0004) ;
- instrument en socle replié, perf **tamponnée** par bench Puppeteer (0005) ;
- déploiement Vercel free **après** validation locale (0006).

**Deux fautes historiques à ne jamais reproduire** (elles ont eu lieu côté
claude.ai et l'utilisateur les a corrigées lui-même) : substituer une version
générique à une implémentation validée, et annoncer des perfs non mesurées.

## 2. État à la passation

- `docs/SPEC.md` canonique, fil d'Ariane §8 : étape 0 ✅, étapes 1-10 ⬜.
- Gate documentaire en place et **calibré dans les deux sens** (sorties ci-dessous).
- Aucun code applicatif. Pas de remote git. Rien de déployé.
- L'utilisateur relira le SPEC ; s'il demande des changements, ils arriveront
  par le gardien ou en direct — SPEC.md gagne toujours.

### Calibration du gate (2026-08-11)

VERT initial :

```
VERT — 10 document(s), 1 source de verite : docs/SPEC.md
```

ROUGE provoqué (2e document canonique temporaire) :

```
ROUGE — 1 probleme(s) sur 11 document(s) :
  x  2 documents canoniques : docs/SPEC.md, docs/tmp-second-canonical.md.
      → C'est précisément la situation que ce gate existe pour interdire.
```

VERT après restauration :

```
VERT — 10 document(s), 1 source de verite : docs/SPEC.md
```

Incident de calibration utile à connaître : un premier essai de fichier-piège
écrit via `Set-Content -Encoding utf8` (PowerShell 5.1) ajoute un **BOM** qui
casse la détection du frontmatter (`raw.startsWith('---')`) — le gate a rougi
sur « pas de frontmatter » au lieu de « 2 canoniques ». Écris tes .md avec un
outil sans BOM.

## 3. Ta première session — dans cet ordre

1. **Protocole d'ouverture** (`CLAUDE.md §4`) : gate, lire SPEC.md en entier,
   annoncer ton étape.
2. **Étape 1 — rapatriement brut, en premier** : télécharge les 3 artifacts
   (URLs dans `docs/evidence/sources-viz-light.md`) dans `sources/`, commit.
   Elles sont périssables — c'est la seule étape urgente. Les pages publiques
   sont des SPA : passe par la session Chrome authentifiée (bouton code `</>`
   des artifacts) ou demande à l'utilisateur de déposer les fichiers.
3. **Étape 2 — versions** : épingle les latest stables via Context7 (Next 16.x,
   React 19.x, TS, Tailwind 4.x, ESLint, Vitest, Puppeteer…), scaffold Next 16
   App Router. Consigne les versions dans `evidence/`.
4. **Étape 3 — socle qualité** avant toute viz (`SPEC.md §5`), chaque gate
   calibré dans les deux sens, preuves dans ton handoff de fermeture.
5. Poursuis le fil d'Ariane. Ne commence pas une étape si la précédente n'est
   pas verte. Termine par le protocole de fermeture (`CLAUDE.md §4`).

Le découpage fin des étapes 4-10 t'appartient — tu es le responsable technique.
Ce qui ne t'appartient pas : le verdict esthétique (recette utilisateur,
étape 8) et les décisions déjà actées (ADR — supersède avec lien si tu veux en
changer, n'édite jamais).
