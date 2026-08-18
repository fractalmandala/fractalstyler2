---
title: DEVELOPERS
description: Complete guide to building and maintaining fractalstyler2 — mental model, change matrix, build vs repack, and the release checklist.
---

# DEVELOPERS

How to build, test, and maintain the `fractalstyler2` package. If you want to build UI *with* fractalstyler2, see [docs/](docs/README.md).

---

## Mental Model

- **Source of truth: `src/lib/styles/` and `templates/`.** All authoring happens here.
- **`dist/` is generated.** Produced by `svelte-package` and published to npm. Never edit manually.
- **Templates: `templates/`** contains the self-contained SASS partials that the CLI (`dist/cli.js`) copies when running `npx fractalstyler2 init`. Keep `templates/` in sync with `src/lib/styles/`.
- **The product is pure indented SASS.** `src/lib/index.ts` is a tiny runtime (`version`, `setMode`, `toggleMode`) — no CSS-in-JS. `src/lib/cli.ts` provides the `init` command.

```
src/lib/styles/  ── svelte-package ──▶  dist/styles/  ── exports map ──▶  consumers
       │                                     ▲
       └── copy to templates/ ──▶ npx fractalstyler2 init ──▶ scaffolds to $lib/styles/
```

---

## Canonical 12-File Numbered Scale

```
_00_tokens.sass        ──► Raw CSS custom properties on :root & theme modes
_01_config.sass        ──► Scales, maps, resolvers (space, radius, surface, ink)
_02_fonts.sass         ──► Local webfont declarations (@font-face)
_03_responsive.sass    ──► Breakpoint helpers (+at, +below, +between)
_04_atoms.sass         ──► Single-decision layout primitives (+box, +row, +bg, +ink)
_05_molecules.sass     ──► Compositions of atoms (+stack, +cluster, +surface, +cols)
_06_recipes.sass       ──► Macro component archetypes (=control, =select, =card, =partition)
_07_base.sass          ──► Global HTML element resets
_08_blocks.sass        ──► Semantic component classes (.surface, .panel, .select, .badge)
_09_utilities.sass     ──► 1:1 atomic markup projections (.pad-*, .pad-top-*, .gap-*)
_10_layouts.sass       ──► Page layout templates (.docs, .card-grid, .hero, .holy-grail)
_11_own.sass           ──► Bespoke local project overrides
_fractals.sass         ──► Pure Mixin Barrel (forwards 01 to 06, emits 0 bytes CSS)
index.sass             ──► Master Stylesheet (forwards fractals + loads CSS cascade)
```

---

## Scripts (`package.json`)

| npm | pnpm | Runs | Purpose |
|---|---|---|---|
| `npm run dev` | `pnpm dev` | `vite dev` | Local authoring + HMR verification |
| `npm run prepack` | `pnpm run prepack` | `svelte-kit sync && svelte-package && chmod +x dist/cli.js && publint` | **The library build** — regenerates `dist/` |
| `npm run build` | `pnpm build` | `vite build && prepack` | Full production build |
| `npm run check` | `pnpm check` | `svelte-kit sync && svelte-check` | Diagnostics / TypeScript checks |

---

## Change Matrix

| You want to… | Edit | Also update | Repack before publish? |
|---|---|---|---|
| Change a token value | `src/lib/styles/_00_tokens.sass` | `templates/_00_tokens.sass` | Yes |
| Add a **scale keyword** (e.g. `space-4xl`) | `_00_tokens.sass` **and** `_01_config.sass` (step list) | `templates/`, docs/05 | Yes |
| Add an atom/molecule mixin | `_04_atoms.sass` / `_05_molecules.sass` | `templates/`, `_09_utilities.sass`, docs/04 | Yes |
| Add a macro recipe | `_06_recipes.sass` | `templates/`, `_fractals.sass`, docs/04 | Yes |
| Add a utility class | `_09_utilities.sass` | `templates/`, docs/06 | Yes |
| Add a component block or layout | `_08_blocks.sass` / `_10_layouts.sass` | `templates/`, docs/07 | Yes |
| Change master cascade order | `src/lib/styles/index.sass` | `templates/index.sass` | Yes |
| Update CLI scaffolder | `src/lib/cli.ts` | README | Yes |

> [!IMPORTANT]
> **Golden Rule for Scales**:
> Any new scale keyword must exist in **BOTH** `_00_tokens.sass` (the CSS custom property) and `_01_config.sass` (the resolver's step list).

---

## Verification & Pre-Release Checklist

1. `npx sass src/lib/styles/index.sass /tmp/check.css` $\to$ SASS compiles with **0 warnings**.
2. `pnpm check` $\to$ **0 errors, 0 warnings**.
3. `pnpm run prepack` $\to$ `dist/` generated, `publint` reports **All good!**.
4. Test Scaffolder CLI: `node ./dist/cli.js init /tmp/test-scaffold && npx sass /tmp/test-scaffold/index.sass /tmp/test-scaffold/out.css`.
