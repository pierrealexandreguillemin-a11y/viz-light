---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0004 — Extraction claude+n = copie du dossier viz + fichiers de socle listés

**Contexte.** But produit : « envoyer un claude+n chercher une visualisation
avec extraction/copie simple ». Canal repo choisi (le site est la vitrine
humaine).

**Décision (définition confirmée par l'utilisateur, 2026-08-11).**
« Extraction simple » = copier `src/viz/<slug>/` + les 2-3 fichiers de socle
**listés dans le manifest de la viz**. `CATALOG.md`, généré depuis les
manifests, est le point d'entrée : nom, aperçu, ambiance, coût mesuré, liste de
fichiers. Hôte non-React : `algo.ts` + recette de montage générique (documentée
une fois, pas d'adaptateur par viz).

**Conséquences.** Le manifest porte un champ « extraction » obligatoire ; le
générateur de CATALOG.md est un gate (manifest invalide = rouge).
