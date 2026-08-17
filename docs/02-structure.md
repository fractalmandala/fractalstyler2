---
title: Structure
description: File and folder anatomy, the four tiers, import surface, and cascade order.
---

The source layout:

```
src/lib/
├─ cli.ts                    CLI engine (npx fractalstyler2 init)
├─ index.ts                  tiny runtime: version, setMode, toggleMode
└─ styles/                   all SASS partials in one unified folder
   ├─ _config.sass           scales-as-data + resolvers: space() radius() align() …
   ├─ _tokens.sass           the CSS custom properties (the only literal values)
   ├─ _base.sass             minimal reset; wires body to the palette
   ├─ _responsive.sass       +at(md) +until +cq — responsiveness as a fractal
   ├─ _atoms.sass            indivisible fractals: +box +row +gap +pad +surface skin…
   ├─ _molecules.sass        composed fractals: +stack +cluster +cover +surface +cols…
   ├─ _utilities.sass        projection of atoms → markup classes (optional layer)
   ├─ _fractals.sass         PURE API barrel — @forward config/responsive/atoms/molecules
   ├─ _blocks.sass           card, button, badge, input, panel… as fractal recipes
   ├─ _layouts.sass          grid-3, card-grid, hero, holy-grail, docs, app-shell
   └─ index.sass             the EMITTED stylesheet: tokens + base + utilities + blocks + layouts

templates/                   clean copies of all 11 SASS files copied by the init CLI
```

Two files serve as the SASS entry points:

- **`_fractals.sass`** — the *pure API*. `@forward`s config, responsive,
  atoms, molecules. Emits **no CSS**. Import it to compose your own styles.
- **`index.sass`** — the *emitted stylesheet*. `@use`s tokens, base,
  utilities, blocks, layouts in cascade order. Import it to ship ready-made CSS.

## The four tiers

| Tier | File(s) | Emits on its own? | Role |
| --- | --- | --- | --- |
| **Config** | `_config.sass` | no | scales as Sass data + resolver functions |
| **Atoms** | `_atoms.sass` | on call | one styling decision per mixin |
| **Molecules** | `_molecules.sass` | on call | recipes of atoms |
| **Components/Layouts** | `_blocks.sass`, `_layouts.sass` | as classes | recipes of molecules |

`_tokens.sass` and `_base.sass` sit beneath the tiers (they emit custom
properties and a reset). `_utilities.sass` sits beside them — it is the optional
projection of atoms into classes.

## Usage Surfaces

### 1. Scaffolded in your project (shadcn-style)
```bash
npx fractalstyler2 init
```
- In `src/routes/+layout.svelte`: `import '$lib/styles/index.sass'`
- In component SASS: `@use '$lib/styles/fractals' as *`

### 2. Package exports (direct dependency)

| Import | Resolves to | Use for |
| --- | --- | --- |
| `import 'fractalstyler2/styles'` | `dist/styles/index.sass` | emit the full stylesheet once, globally |
| `@use 'fractalstyler2/fractals' as *` | `dist/styles/_fractals.sass` | compose your own components from mixins |
| `@use 'fractalstyler2/tokens'` | `dist/styles/_tokens.sass` | just the custom properties |
| `import { … } from 'fractalstyler2'` | `dist/index.js` | `version`, `setMode`, `toggleMode` |

## Cascade order

`index.sass` loads in this exact order, and order is load-bearing:

```sass
@use './tokens'      // 1. custom properties define the vocabulary
@use './base'        // 2. reset consumes tokens (body font/bg/color)
@use './utilities'   // 3. atom classes (low specificity, single job)
@use './blocks'      // 4. components consume tokens + fractals
@use './layouts'     // 5. page templates
```

Tokens first so every later rule can reference them. Utilities before
components so a component can still be nudged by a utility class in markup where
that is genuinely wanted. Everything is flat, single-class specificity — the
cascade does the arbitration, not selector weight.

## What a partial may and may not do

- `_atoms.sass`, `_molecules.sass`, `_responsive.sass`, `_config.sass` **define** mixins/functions and emit nothing on their own.
- `_tokens.sass` and `_base.sass` emit custom properties and baseline reset.
- `_blocks.sass` and `_layouts.sass` author classes by composing fractals via `@use 'fractals' as *`. They contain almost no raw CSS.

Next: [Getting started](03-getting-started.md).
