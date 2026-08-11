---
authority: annex
adr_status: accepted
last_verified: 2026-08-11
expires: never
---

# 0003 — Moule technique : Next.js 16 + React 19 + TS strict + Tailwind 4 (ma-cdm / ma-nfl)

**Contexte.** Premier réflexe : Vite 7 (moule pendu/skoolman). L'utilisateur a
corrigé : le moule de référence est **ma-cdm / ma-nfl**.

**Décision (utilisateur, 2026-08-11).** Next.js 16 App Router + React 19 +
TypeScript strict + Tailwind 4, couleurs OKLCH. Sortie statique (aucune donnée
dynamique). Composants viz en client components. **Pas de PWA en v1** (YAGNI,
option ultérieure). Versions exactes épinglées au scaffold via Context7.

**Conséquences.** Une viz extraite vers ma-nfl/ma-cdm arrive dans son framework
exact. Hébergement Vercel free identique aux autres apps du portefeuille.
