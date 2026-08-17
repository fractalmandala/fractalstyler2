---
title: DEVELOPERS
description: Complete guide to building and maintaining fractalstyler2 — mental model, change matrix, build vs repack, and the release checklist.
---

# DEVELOPERS

How to build, edit, and maintain the package itself. If you want to build UI
*with* fractalstyler2, you're in the wrong file — see [docs/](docs/README.md).

## Mental model

- **Source of truth: `src/lib/**` and `templates/**`.** All authoring happens here.
- **`dist/` is generated. Never edit it, never commit it by hand.** It is
  produced by `svelte-package` and is what consumers actually import (the
  `exports` and `bin` maps point at `dist/…`).
- **Templates: `templates/`** contains the self-contained SASS partials that the CLI
  (`dist/cli.js`) copies when running `npx fractalstyler2 init`. Keep `templates/` in sync
  with `src/lib/styles/`.
- **The demo app (`src/routes/**`) is not shipped.** It exists to develop and
  visually verify the library.
- **The product is SASS.** `src/lib/index.ts` is a tiny runtime (`version`,
  `setMode`, `toggleMode`) — no CSS-in-JS. `src/lib/cli.ts` provides the `init` command.

```
src/lib/styles/  ── svelte-package ──▶  dist/styles/  ── exports map ──▶  consumers
       │                                     ▲
       └── copy to templates/ ──▶ npx fractalstyler2 init ──▶ scaffolds to $lib/styles/
```

## Toolchain

| Tool | Role |
| --- | --- |
| `@sveltejs/package` | copies `src/lib` → `dist` (the library build) |
| `vitePreprocess` | compiles `<style lang="sass">` in the demo (wired in `vite.config.ts`) |
| `sass` | the SASS compiler (dev dep; consumers need it too) |
| `publint` | lints the publishable package shape |
| `svelte-check` | type/diagnostics for `.svelte`/`.ts` |
| adapter-auto | builds the demo site only (not the library) |

## Scripts (`package.json`)

| npm | pnpm | Runs | When you use it |
| --- | --- | --- | --- |
| `npm run dev` | `pnpm dev` | `vite dev` | daily authoring + visual verification (HMR) |
| `npm run prepack` | `pnpm run prepack` | `svelte-kit sync && svelte-package && chmod +x dist/cli.js && publint` | **the library build** — refresh `dist/` |
| `npm run build` | `pnpm build` | `vite build && prepack` | build the demo **site** and then the library |
| `npm run preview` | `pnpm preview` | `vite preview` | preview the built demo site |
| `npm run check` | `pnpm check` | `svelte-kit sync && svelte-check` | types/diagnostics |

## Build vs repack — the distinction that matters

- **"Rebuild" (recompile CSS)** happens automatically. `npm run dev` (pnpm:
  `pnpm dev`) compiles the SASS on every save via HMR; you never manually
  rebuild to *see* a change in the demo. A fast headless check:
  `npx sass src/lib/styles/index.sass /tmp/check.css`.
- **"Repack" (regenerate `dist/`)** = `npm run prepack` (pnpm: `pnpm run
  prepack`). This is what makes your `src/lib` edits visible to **consumers**
  (published npm, `npm link` / `pnpm link`, or a `file:` dependency). Editing
  `src/lib` does **not** update `dist` on its own.

**Rule of thumb:**
- Iterating in the demo → just `npm run dev` / `pnpm dev`, no repack.
- Anyone outside this repo needs the change → **repack**.
- Publishing → repack (and `prepack` also runs automatically on `npm publish` / `pnpm publish`).

## Change matrix — what to touch, and whether to repack

| You want to… | Edit | Also update | Repack before publish? |
| --- | --- | --- | --- |
| Change a token value | `src/lib/styles/_tokens.sass` | `templates/_tokens.sass` | yes |
| Add a **new scale keyword** (e.g. `space-4xl`) | `_tokens.sass` **and** `_config.sass` (its `$*-steps` list) | `templates/`, docs/05 | yes |
| Add an atom/molecule mixin | `_atoms.sass` / `_molecules.sass` | `templates/`, `_utilities.sass`, docs/04 | yes |
| Add a utility class | `_utilities.sass` | `templates/`, docs/06 | yes |
| Add a block/layout | `_blocks.sass` / `_layouts.sass` | `templates/`, docs/07 | yes |
| Change the emitted CSS or cascade order | `src/lib/styles/index.sass` | `templates/index.sass` | yes |
| Change the reset | `_base.sass` | `templates/_base.sass` | yes |
| Update CLI scaffolder | `src/lib/cli.ts` | README | yes |
| Add/rename a public import path | `package.json` `exports` **and** ensure the file lands in `dist` | docs/02, README | yes |
| Change runtime JS/TS | `src/lib/index.ts` | regenerates `dist/index.d.ts` on repack | yes |
| Add a theme | `_tokens.sass` (`[data-theme]` block) | `templates/_tokens.sass`, docs/05 | yes |
| Edit the demo | `src/routes/**` | — | no (not shipped) |
| Edit docs/agents | `docs/**`, `AGENTS.md` | — | no |

Golden constraint: **any new scale keyword must exist in BOTH `_tokens.sass`
(the CSS var) and `_config.sass` (the resolver's step list).** Miss one and
`space(newkey)` silently falls through to raw units.

## Verification workflow

Before committing or publishing:

1. `npx sass src/lib/styles/index.sass /tmp/check.css` → SASS compiles, **zero
   warnings**.
2. `npm run dev` (pnpm: `pnpm dev`) → the demo renders; check light/dark and a narrow + wide viewport.
3. `npm run check` (pnpm: `pnpm check`) → no type errors.
4. `npm run prepack` (pnpm: `pnpm run prepack`) → svelte-package succeeds and **publint says "All good!"**.
5. Test CLI init: `node ./dist/cli.js init /tmp/test-init && npx sass /tmp/test-init/index.sass /tmp/test-init/output.css`.
6. Inspect `dist/` → the files your `exports` and `bin` reference are present.

## Release checklist

1. Land and verify changes (workflow above).
2. Bump `version` in `package.json` (semver: patch = fixes, minor = additive
   fractals/tokens, major = renamed/removed public API or changed cascade).
3. Update the README/docs if the public surface changed.
4. `npm run prepack` / `pnpm run prepack` (also runs automatically on publish, but run it to inspect).
5. `npm publish` (or `pnpm publish`). The `prepack` lifecycle regenerates `dist`.
6. Tag the release in git.

## Conventions

- **Indented SASS, tabs.** No SCSS braces, no CSS `{}`.
- **Single directory for partials.** All SASS partials live in `styles/` (`_fractals.sass` forwards API, `index.sass` emits full CSS). Partials start with `_`.
- **No hardcoded values in fractals.** Always route through a resolver.
- **Atoms are one decision; molecules compose atoms; components compose
  molecules.** If a mixin sets three unrelated properties, it's a molecule.
- **Cascade order in `styles/index.sass` is load-bearing:** tokens → base →
  utilities → blocks → layouts. Don't reorder casually.
- **`:root` light palette must stay marker-free** (the SSR/no-JS contract). Add
  dark/theme as additional blocks, never by moving light behind an attribute.
