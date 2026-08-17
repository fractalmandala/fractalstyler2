---
title: DEVELOPERS
description: Complete guide to building and maintaining fractalstyler2 — mental model, change matrix, build vs repack, and the release checklist.
---

# DEVELOPERS

How to build, edit, and maintain the package itself. If you want to build UI
*with* fractalstyler2, you're in the wrong file — see [docs/](docs/README.md).

## Mental model

- **Source of truth: `src/lib/**`.** All authoring happens here.
- **`dist/` is generated. Never edit it, never commit it by hand.** It is
  produced by `svelte-package` and is what consumers actually import (the
  `exports` map points at `dist/…`).
- **The demo app (`src/routes/**`) is not shipped.** It exists to develop and
  visually verify the library. `files` in `package.json` publishes only `dist`.
- **The product is SASS.** `src/lib/index.ts` is a tiny runtime (`version`,
  `setMode`, `toggleMode`) — no CSS-in-JS.

```
src/lib/  ── svelte-package ──▶  dist/  ── exports map ──▶  consumers
   ▲                                                          ▲
  edit here                            import 'fractalstyler2/styles' etc.
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

> Note on this scaffold: the Svelte CLI **inlines** Svelte config inside
> `vite.config.ts` (there is no `svelte.config.js`), and the preprocessor is
> added there as `sveltekit({ preprocess: vitePreprocess() })`. Build approval
> for `@parcel/watcher` lives in `pnpm-workspace.yaml` (`allowBuilds`).

## Scripts (`package.json`)

| Script | Runs | When you use it |
| --- | --- | --- |
| `pnpm dev` | `vite dev` | daily authoring + visual verification (HMR) |
| `pnpm run prepack` | `svelte-kit sync && svelte-package && publint` | **the library build** — refresh `dist/` |
| `pnpm build` | `vite build && prepack` | build the demo **site** and then the library |
| `pnpm preview` | `vite preview` | preview the built demo site |
| `pnpm check` | `svelte-kit sync && svelte-check` | types/diagnostics |

## Build vs repack — the distinction that matters

- **"Rebuild" (recompile CSS)** happens automatically. `pnpm dev` compiles the
  SASS on every save via HMR; you never manually rebuild to *see* a change in
  the demo. A fast headless check: `npx sass src/lib/styles/index.sass:/tmp/check.css`.
- **"Repack" (regenerate `dist/`)** = `pnpm run prepack`. This is what makes your
  `src/lib` edits visible to **consumers** (published npm, `pnpm link`, or a
  `file:` dependency). Editing `src/lib` does **not** update `dist` on its own.

**Rule of thumb:**
- Iterating in the demo → just `pnpm dev`, no repack.
- Anyone outside this repo needs the change → **repack**.
- Publishing → repack (and `prepack` also runs automatically on `npm/pnpm publish`).

`vite build` is only for deploying the **demo site**; it is not part of shipping
the library.

## Change matrix — what to touch, and whether to repack

| You want to… | Edit | Also update | Repack before publish? |
| --- | --- | --- | --- |
| Change a token value | `src/lib/fractals/_tokens.sass` | — | yes |
| Add a **new scale keyword** (e.g. `space-4xl`) | `_tokens.sass` **and** `_config.sass` (its `$*-steps` list) | docs/05 | yes |
| Add an atom/molecule mixin | `_atoms.sass` / `_molecules.sass` | project in `_utilities.sass` if markup-usable; docs/04 | yes |
| Add a utility class | `_utilities.sass` | docs/06 | yes |
| Add a block/layout | `components/_blocks.sass` / `_layouts.sass` | docs/07 | yes |
| Change the emitted CSS or cascade order | `src/lib/styles/index.sass` | — | yes |
| Change the reset | `_base.sass` | — | yes |
| Add/rename a public import path | `package.json` `exports` **and** ensure the file lands in `dist` | docs/02, README | yes |
| Change runtime JS/TS | `src/lib/index.ts` | regenerates `dist/index.d.ts` on repack | yes |
| Add a theme | `_tokens.sass` (`[data-theme]` block) | docs/05 | yes |
| Edit the demo | `src/routes/**` | — | no (not shipped) |
| Edit docs/agents | `docs/**`, `AGENTS.md` | — | no |

Golden constraint: **any new scale keyword must exist in BOTH `_tokens.sass`
(the CSS var) and `_config.sass` (the resolver's step list).** Miss one and
`space(newkey)` silently falls through to raw units.

## Adding a public export (worked example)

To expose `fractalstyler2/base`:

1. The file already exists at `src/lib/fractals/_base.sass` → it will be copied to
   `dist/fractals/_base.sass` on repack.
2. Add to `package.json` `exports`:
   ```json
   "./base": "./dist/fractals/_base.sass"
   ```
3. `pnpm run prepack` → confirm `dist/fractals/_base.sass` exists and publint is
   clean.
4. Document the new import in docs/02 and the README table.

## Verification workflow

Before committing or publishing:

1. `npx sass src/lib/styles/index.sass:/tmp/check.css` → SASS compiles, **zero
   warnings**.
2. `pnpm dev` → the demo renders; check light/dark and a narrow + wide viewport.
3. `pnpm check` → no type errors.
4. `pnpm run prepack` → svelte-package succeeds and **publint says "All good!"**.
5. Inspect `dist/` → the files your `exports` reference are present.

## Release checklist

1. Land and verify changes (workflow above).
2. Bump `version` in `package.json` (semver: patch = fixes, minor = additive
   fractals/tokens, major = renamed/removed public API or changed cascade).
3. Update the README/docs if the public surface changed.
4. `pnpm run prepack` (also runs automatically on publish, but run it to inspect).
5. `pnpm publish` (or `npm publish`). The `prepack` lifecycle regenerates `dist`.
6. Tag the release in git.

## Conventions

- **Indented SASS, tabs.** No SCSS braces, no CSS `{}`.
- **One entry file per surface.** `fractals/index.sass` = pure API (emits
  nothing); `styles/index.sass` = the emitted stylesheet. Partials start with `_`.
- **No hardcoded values in fractals.** Always route through a resolver.
- **Atoms are one decision; molecules compose atoms; components compose
  molecules.** If a mixin sets three unrelated properties, it's a molecule.
- **Cascade order in `styles/index.sass` is load-bearing:** tokens → base →
  utilities → blocks → layouts. Don't reorder casually.
- **`:root` light palette must stay marker-free** (the SSR/no-JS contract). Add
  dark/theme as additional blocks, never by moving light behind an attribute.

## Gotchas

- Editing `src/lib` but a linked consumer sees nothing new → you forgot to
  **repack**.
- `space(foo)` renders `foo px`-ish garbage or passes through unexpectedly → the
  keyword isn't in `_config.sass`'s step list.
- `<style lang="sass">` throws "did you forget a sass preprocessor?" → the
  preprocessor wiring in `vite.config.ts` is missing or `sass` isn't installed.
- `pnpm install`/`dev` fails with `ERR_PNPM_IGNORED_BUILDS` → approve the build
  in `pnpm-workspace.yaml` (`allowBuilds`).
