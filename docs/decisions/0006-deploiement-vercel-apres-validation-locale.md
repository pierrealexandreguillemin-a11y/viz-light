---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0006 — Déploiement Vercel free, après validation locale seulement

**Décision (utilisateur, 2026-08-11).** Pas de deploy preview pendant la
construction. La v1 se valide en local (gates verts + recette visuelle
utilisateur), puis se déploie en une commande — repo local + Vercel CLI, comme
suminagashi. Remote GitHub : hors v1.

**Conséquences.** Étape 9 du fil d'Ariane, après la recette (étape 8). Rien de
public tant que l'utilisateur n'a pas validé visuellement le catalogue.
