# viz-light

Unified catalog of animated web backgrounds and generative visualizations —
born in the claude.ai "Viz Light" project, repatriated here as the single
source of truth.

**Two audiences:**

- **Humans** — browse a deployed showcase (Vercel) for beautiful, original,
  *measured* background effects: real FPS, JS frame time, GPU-bound detection.
- **Claude agents** — sent from any host project to pick a visualization and
  extract it: read `CATALOG.md`, copy the viz folder + the listed core files,
  drop the component in. Done.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict ·
Tailwind 4 · OKLCH colors. Static output, no backend.

**Status:** genesis (2026-08-11) — see the Ariadne thread in `docs/SPEC.md` §8.

## Where truth lives

| File | Role |
|---|---|
| `docs/SPEC.md` | **Canonical** — settles every contradiction |
| `docs/decisions/` | Immutable ADRs (the *why*) |
| `docs/evidence/` | Measurements, by subject, rewritten in place |
| `docs/handoff/` | Dated session narratives |
| `CLAUDE.md` | Project agent charter (`claude-viz-light`) |
| `CATALOG.md` | *(generated later)* — entry point for extracting agents |

## Gates

```bash
node scripts/check-docs.mjs   # documentation gate — must be green
```

Code gates (TS strict, type-aware lint, duplication, complexity, tests) are
wired at Ariadne step 3, before the first viz — see `docs/SPEC.md` §5.
