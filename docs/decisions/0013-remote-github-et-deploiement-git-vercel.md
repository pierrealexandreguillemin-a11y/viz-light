---
authority: annex
adr_status: accepted
last_verified: 2026-08-22
expires: never
---

# 0013 — Remote GitHub public + déploiement Git-intégré Vercel

**Décision (utilisateur, 2026-08-22).** Le catalogue passe d'un déploiement
« repo local + Vercel CLI » à un déploiement **Git-intégré** :

1. **Dépôt GitHub public** — `github.com/pierrealexandreguillemin-a11y/viz-light`,
   branche de prod `main`.
2. **Vercel connecté au dépôt** (`vercel git connect`) : **chaque push sur `main`
   déclenche un déploiement de production**. Plus de `vercel deploy` manuel comme
   chemin nominal.

**Ce que cet ADR supersède.** L'[ADR 0006](./0006-deploiement-vercel-apres-validation-locale.md)
avait tranché l'inverse — pas de remote GitHub en v1, déploiement en une commande
CLI « comme suminagashi ». Cette décision est **remplacée** : le remote GitHub
n'est plus hors-v1, et le CI/CD Git devient le chemin de déploiement.

**Ce qui NE change pas.** Le principe de l'[ADR 0006](./0006-deploiement-vercel-apres-validation-locale.md)
que la v1 ne se publie qu'après validation locale complète **tient toujours** :
`pnpm verify` reste branché en **pre-push** (SPEC §5). Un push qui déploie est
donc un push dont les gates sont verts par construction — la porte de qualité
n'est pas contournée par l'automatisation, elle la précède.

**Pourquoi maintenant.** La recette (étape 8) se fait sur l'URL live ; un cycle
« corriger → push → prod » sans étape manuelle raccourcit la boucle de recette et
supprime la classe d'erreurs « déployé une version que je n'ai pas re-buildée ».
Le dépôt public assume que sources rapatriées (tweets golfés @yuruyurau attribués,
artifacts d'origine) et historique deviennent visibles — choix explicite de
l'utilisateur.

**Conséquences.** SPEC §4 (le remote GitHub sort de « hors v1 »), SPEC §7
(déploiement Git-intégré), et l'étape 9 du fil d'Ariane mise à jour. Le lien local
`.vercel/project.json` (qui servait au deploy CLI) reste valide et pointe le même
projet ; il n'est pas versionné (`.gitignore`).
