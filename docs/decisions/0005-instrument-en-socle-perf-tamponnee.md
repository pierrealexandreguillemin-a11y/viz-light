---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0005 — Instrument de mesure en socle, chiffres tamponnés dans les manifests

**Contexte.** Le banc d'essai claude.ai embarque un instrument réel (cadence
mesurée, temps JS médian/p95, détection GPU-bound), des blocs éditoriaux
« ce qu'on lit vs ce que la mesure montre » et des toggles « mauvaise pratique ».

**Décision (utilisateur, 2026-08-11).** Trois sorts distincts :
1. **La mesure brute passe en socle** (`useInstrument`), affichable sur chaque
   viz, **repliée par défaut** dans la vitrine.
2. **L'éditorial et les toggles pédagogiques** deviennent du contenu optionnel
   par viz (`notes.md`) — ils n'ont de sens que pour les 10 effets du banc.
3. **Les chiffres sont tamponnés** dans le manifest par `scripts/bench.mjs`
   (Puppeteer) : un claude+n choisit sur données sans rien exécuter.

**Conséquences.** Toute nouvelle viz est mesurée d'office ; jamais de perf
« estimée » dans un manifest.
