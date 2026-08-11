---
authority: ledger
subject: stacks-portfolio
last_verified: 2026-08-11
expires: 2027-02-11
---

# Stacks des projets hôtes (consommateurs potentiels du catalogue)

Mesuré le 2026-08-11 dans `C:\Dev\PROJECTS.md` + `C:\Dev\suminagashi\package.json`.

**Frontends déployés** : 6 apps React/Next sur Vercel (pendu, microgpt-lab,
microgpt-visualizer-fr, nos-joueurs-en-tournoi, tables-magiques,
inscription-echecs-aubagne) + **1 seule exception non-React : suminagashi**
(vanilla TS + Three.js + Vite) — qui est sous contrat de fidélité artistique et
**ne consommera jamais le catalogue**.

**En construction** : ma-nfl, ma-coupe-du-monde — Next.js 16 + React 19 + TS +
Tailwind (le moule de référence, cf. ADR 0003).

**Standard écrit du portefeuille** (`PROJECTS.md` §Classification) :
React 19 + TS + Tailwind, en Next.js 16 ou Vite 7. Deux projets déjà en OKLCH
(microgpt-visualizer-fr, fractalnaute).

**Render/Railway** : backends uniquement — aucun background à y placer.

**Conclusion opérationnelle** : les consommateurs réels sont React/Next à
~100 % → la forme « composant React natif » (ADR 0002) couvre le besoin ; le
portage non-React reste une recette documentée, pas un artefact maintenu.
