---
authority: archive
last_verified: 2026-08-11
---

> ⛔ **NE PAS UTILISER POUR DÉCIDER** — document de genèse (session de
> brainstorming du 2026-08-11, gardien cwd=C:\Dev), remplacé par
> **`docs/SPEC.md`** (canonique) et les ADR `docs/decisions/0001-0006`.
> Conservé comme récit d'origine uniquement.

# Viz Light — Design Document (genèse)

**Date:** 2026-08-11
**Status:** superseded by docs/SPEC.md
**Executor:** `claude-viz-light`

## 1. Purpose

Unify the visualizations built in the claude.ai project "Viz Light" into a single,
growing catalog app, with two audiences:

1. **Pierre-Alexandre** — browse for beauty/originality (wow effect, elegance), on a
   deployed showcase.
2. **Future Claude instances ("claude+n")** — sent from any host project to pick a
   background/visualization and extract it with near-zero friction.

The claude.ai "Viz Light" project remains a **sourcing antenna**. The repo is the
**single source of truth**.

## 2. Validated decisions

| # | Decision | Choice |
|---|----------|--------|
| D1 | Host | Claude Code repo `C:\Dev\viz-light` |
| D2 | Extraction channel | Repo source for claude+n; deployed site = human showcase |
| D3 | Scope v1 | Repatriate + unify the ~33 existing viz; then new creations & sources |
| D4 | Instrument | Raw measurement in shared core, collapsed by default; editorial blocks and toggles demoted to per-viz content |
| D5 | Perf data | Offline bench (Puppeteer) stamps numbers into manifests |
| D6 | Name/location | `C:\Dev\viz-light` |
| D7 | Deployment | Vercel free, after local validation |
| D8 | Form of a viz | Native React component (standalone-HTML and generic-wrapper approaches refused by user) |
| D9 | Stack mold | ma-cdm / ma-nfl: Next.js 16 + React 19 + TS strict + Tailwind 4, OKLCH, static, no PWA v1 |
| D10 | Portability | Pure-TS algo + thin React shell; non-React porting = generic mount recipe in CATALOG.md |
| D11 | "Simple extraction" | Copy viz folder + the 2-3 core files listed in its manifest |

## 3-9. Architecture, extraction contract, quality harness, v1 scope, error
handling, testing, out-of-scope

Contenu intégralement repris et maintenu dans `docs/SPEC.md` §2-§8 — voir le
canonique. Les URLs des artifacts sources vivent dans
`docs/evidence/sources-viz-light.md`.
