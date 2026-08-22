---
authority: annex
adr_status: superseded
last_verified: 2026-08-22
expires: never
---

# 0006 — Déploiement Vercel free, après validation locale seulement

> ⛔ **SUPERSÉDÉ le 2026-08-22 par l'[ADR 0013](./0013-remote-github-et-deploiement-git-vercel.md).**
> Le volet « pas de remote GitHub, deploy CLI en une commande » ne s'applique
> plus : le déploiement est désormais Git-intégré (push `main` = prod). En
> revanche, l'exigence « ne publier qu'après validation locale complète »
> **survit** — `pnpm verify` est branché en pre-push. Lire l'ADR 0013 pour le
> pourquoi ; ce document reste pour l'histoire, pas pour décider.

**Décision (utilisateur, 2026-08-11).** Pas de deploy preview pendant la
construction. La v1 se valide en local (gates verts + recette visuelle
utilisateur), puis se déploie en une commande — repo local + Vercel CLI, comme
suminagashi. Remote GitHub : hors v1.

**Conséquences.** Étape 9 du fil d'Ariane, après la recette (étape 8). Rien de
public tant que l'utilisateur n'a pas validé visuellement le catalogue.
