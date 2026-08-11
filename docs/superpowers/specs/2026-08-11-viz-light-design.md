# Viz Light — Design Document

**Date:** 2026-08-11
**Status:** Validated by user (brainstorming session, cwd=C:\Dev, gardien role)
**Executor:** `claude-viz-light` (to be launched from `C:\Dev\viz-light\` after plan approval)

## 1. Purpose

Unify the visualizations built in the claude.ai project "Viz Light" into a single,
growing catalog app, with two audiences:

1. **Pierre-Alexandre** — browse for beauty/originality (wow effect, elegance), on a
   deployed showcase.
2. **Future Claude instances ("claude+n")** — sent from any host project to pick a
   background/visualization and extract it with near-zero friction.

The claude.ai "Viz Light" project remains a **sourcing antenna** (spotting/converting
sketches on the go). The repo is the **single source of truth**: everything sourced there
gets repatriated here.

## 2. Validated decisions

| # | Decision | Choice |
|---|----------|--------|
| D1 | Host | Claude Code repo `C:\Dev\viz-light` (not claude.ai, not Claude Design) |
| D2 | Extraction channel | Repo source for claude+n; deployed site = human showcase |
| D3 | Scope v1 | Repatriate + unify the ~33 existing viz; addition pipeline proven. New creations & new sources come after v1 |
| D4 | Instrument | Raw measurement (real FPS, JS time median/p95, GPU-bound detection) in shared core, collapsed by default in the showcase. Editorial claim-vs-measure blocks and "bad practice" toggles demoted to optional per-viz content |
| D5 | Perf data | Offline bench (Puppeteer) stamps measured numbers into each viz manifest → claude+n picks on data without running anything |
| D6 | Project name/location | `C:\Dev\viz-light` (continuity with the claude.ai project) |
| D7 | Deployment | Vercel free tier, **after** local validation (no early deploy) |
| D8 | Form of a viz | **Native React component** (user refused standalone-HTML-first and generic-wrapper approaches). Matches host stack |
| D9 | Stack mold | **Same as ma-cdm / ma-nfl: Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind 4**, OKLCH colors everywhere. Static output. No PWA in v1 (YAGNI; optional later) |
| D10 | Portability rule | Inside each viz, the algorithm is **pure TypeScript** (no React); the component is a **thin shell** mounting it via core hooks. Non-React porting = pure algo + ~20-30 line mount recipe, documented once in CATALOG.md. No per-viz adapters maintained (YAGNI) |
| D11 | "Simple extraction" definition (user-confirmed) | Copy the viz folder + the 2-3 core files listed in its manifest. Non-React host: pure algo file + generic mount recipe |

## 3. Architecture

```
viz-light/
├── CLAUDE.md                  # project charter (from project-bootstrap template)
├── CATALOG.md                 # GENERATED — claude+n entry point
├── docs/                      # ADRs (immutable) / evidence (living) / handoffs (dated)
├── scripts/
│   ├── new-viz.mjs            # scaffold: folder + manifest + component skeleton
│   ├── build-catalog.mjs      # manifests → CATALOG.md (gate: schema-valid, perf present)
│   └── bench.mjs              # Puppeteer: measures each viz, stamps perf into manifest
├── src/
│   ├── core/
│   │   ├── hooks/             # useAnimationLoop, useCanvas (DPR cap, visibility pause,
│   │   │                      #   prefers-reduced-motion), useInstrument
│   │   ├── instrument/        # real-FPS meter, JS-time median/p95, GPU-bound detection
│   │   ├── params/            # param schema → generic controls UI
│   │   └── ui/                # gallery, scene, panel — Tailwind 4, OKLCH tokens
│   ├── viz/
│   │   └── <slug>/
│   │       ├── <Name>.tsx     # thin React shell (client component)
│   │       ├── algo.ts        # pure TS drawing logic — no React import
│   │       ├── manifest.json  # identity, origin, tags, params, deps, measured perf,
│   │       │                  #   extraction file list
│   │       └── notes.md       # optional: editorial, pedagogy toggles, known pitfalls
│   └── app/                   # Next.js App Router pages (static)
└── public/labs/               # escape hatch: self-contained HTML for incompatible
                               #   stacks, rendered via an <IframeViz> component,
                               #   cataloged with the same manifest
```

- **Registry**: viz auto-discovered from manifests; per-viz lazy loading (p5.js chunk
  loads only for p5 sketches).
- **Runtimes**: canvas2d, webgl (raw), p5 (instance mode driven by our loop), dom-css,
  iframe (escape hatch). All are npm deps + thin adapters inside core hooks — this is
  the answer to "different stacks": browser libs are the nominal case; truly
  incompatible toolchains go to `public/labs/`.

## 4. Extraction contract (claude+n)

1. Read `CATALOG.md`: per viz — name, preview, mood tags, measured cost, exact file
   list to copy.
2. Copy `src/viz/<slug>/` + the listed core files (typically 2-3 hooks).
3. In the host (React/Next, the portfolio standard): place `<VizName />`. Done.
4. Non-React host (rare; only deployed exception is suminagashi, which is under a
   fidelity contract and will never consume the catalog): take `algo.ts` + follow the
   generic mount recipe in CATALOG.md.

## 5. Quality harness (wired before the first viz — task 1 of the plan)

- TypeScript strict incl. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- ESLint type-aware (unawaited promises etc.), cyclomatic **and** cognitive complexity,
  function/file length limits.
- jscpd (cross-file duplication).
- Prettier; Husky pre-commit + conventional-commit message gate.
- Vitest: core hooks, params schema, registry, manifest schema validation.
- `build-catalog` gate fails on invalid manifest or missing stamped perf.
- Every gate calibrated both ways (fails on known-bad, passes on known-good) — no
  default thresholds trusted.
- Versions pinned to latest stable at bootstrap (verified via Context7 at scaffold
  time — step 1, not housekeeping).

## 6. v1 scope & migration

Sources (published artifacts, retrievable via authenticated Chrome session):

- `tweet-sketches-artifact.html` — 18 @yuruyurau p5.js sketches
  https://claude.ai/public/artifacts/9eb103da-83a0-424c-bd0e-cac1365ae85d
- `banc-essai-effets.html` — 10 tunable effects + live instrument
  https://claude.ai/public/artifacts/c8acd119-bc03-40c5-854b-1bb62e1d1f07
- `genart-studio-standalone.html` — 5 parametric algos ("Atelier génératif")
  https://claude.ai/public/artifacts/b39973e0-64e3-4f88-8f10-135b83cd121e

⚠ These URLs live only while the artifacts stay published — repatriate early in the plan.

Steps: repatriate sources → deduplicate (~33 → ~31; Tunnel de points and Flow Field
exist twice — keep the user-validated version, record the other as a variant in the
manifest) → port each onto the component + pure-algo structure → **visual fidelity
check per viz via compared captures against the original** (continuity is
non-negotiable, per Viz Light project memory) → bench + stamp perf → generate
CATALOG.md → deploy to Vercel.

## 7. Error handling

- Per-viz error boundary: a crashing viz shows an error card; the app never goes down.
- WebGL context-loss handled in the webgl hook.
- `prefers-reduced-motion`: static first frame by default, explicit override control.

## 8. Testing

- Unit (Vitest): core hooks, param schema, manifest validation, registry.
- Fidelity (Puppeteer): per-viz capture compared to reference capture at migration time.
- Bench (Puppeteer, separate script — not a test gate): stamps perf numbers.

## 9. Out of scope (v1) / later

- New viz creations on demand; repatriation of further sources (other claude.ai
  conversations, #つぶやきProcessing tweets, CodePen, Shadertoy).
- Generated standalone HTML per viz (only if a real need appears).
- PWA; GitHub remote (local repo + Vercel CLI deploy first, like suminagashi).
