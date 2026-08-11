---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0001 — Le catalogue vit dans un dépôt Claude Code, pas sur claude.ai

**Contexte.** Les viz sont nées dans le projet claude.ai « Viz Light »
(artifacts mono-fichier). L'utilisateur veut un catalogue qui grandit au fil de
l'eau, extractible par un claude+n, déployable Vercel free.

**Décision.** Le dépôt `C:\Dev\viz-light` est la **source unique de vérité**.
Le projet claude.ai devient une **antenne de sourcing** : tout ce qui y naît est
rapatrié ici. Claude Design écarté (pas de repo multi-fichiers, pas de harnais).

**Conséquences.** Git + gates + TS strict possibles ; la continuité ne dépend
plus de la mémoire d'une conversation. Le rapatriement est une étape explicite
du fil d'Ariane.
