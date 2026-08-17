---
title: Structure
description: File and folder anatomy, the four tiers, import surface, and cascade order.
---

The source layout:

```
src/lib/
├─ fractals/                 the vocabulary (mixins + functions + tokens)
│  ├─ _config.sass           scales-as-data + resolvers: space() radius() align() …
│  ├─ _tokens.sass           the CSS custom properties (the only literal values)
│  ├─ _base.sass             minimal reset; wires body to the palette
│  ├─ _responsive.sass       +at(md) +until +cq — responsiveness as a fractal
│  ├─ _atoms.sass            indivisible fractals: +box +row +gap +pad +surface skin…
│  ├─ _molecules.sass        composed fractals: +stack +cluster +cover +surface +cols…
│  ├─ _utilities.sass        projection of atoms → markup classes (optional layer)
│  └─ index.sass             PURE API barrel — @forward config/responsive/atoms/molecules
├─ components/
│  ├─ _blocks.sass           card, button, badge, input, panel… as fractal recipes
│  └─ _layouts.sass          grid-3, card-grid, hero, holy-grail, docs, app-shell
├─ styles/
│  └─ index.sass             the EMITTED stylesheet: tokens + base + utilities + components
└─ index.ts                  tiny runtime: version, setMode, toggleMode
```

Two files are "entry points" and everything else is a partial (leading `_`):

- **`fractals/index.sass`** — the *pure API*. `@forward`s config, responsive,
  atoms, molecules. Emits **no CSS**. Import it to compose your own styles.
- **`styles/index.sass`** — the *emitted stylesheet*. `@use`s tokens, base,
  utilities, blocks, layouts in cascade order. Import it to ship ready-made CSS.

## The four tiers

| Tier | File(s) | Emits on its own? | Role |
| --- | --- | --- | --- |
| **Config** | `_config.sass` | no | scales as Sass data + resolver functions |
| **Atoms** | `_atoms.sass` | on call | one styling decision per mixin |
| **Molecules** | `_molecules.sass` | on call | recipes of atoms |
| **Components/Layouts** | `components/*` | as classes | recipes of molecules |

`_tokens.sass` and `_base.sass` sit beneath the tiers (they emit custom
properties and a reset). `_utilities.sass` sits beside them — it is the optional
projection of atoms into classes.

## Import surface (package exports)

| Import | Resolves to | Use for |
| --- | --- | --- |
| `import 'fractalstyler2/styles'` | `dist/styles/index.sass` | emit the full stylesheet once, globally |
| `@use 'fractalstyler2/fractals' as *` | `dist/fractals/index.sass` | compose your own components from mixins |
| `@use 'fractalstyler2/tokens'` | `dist/fractals/_tokens.sass` | just the custom properties |
| `import { … } from 'fractalstyler2'` | `dist/index.js` | `version`, `setMode`, `toggleMode` |

## Cascade order

`styles/index.sass` loads in this exact order, and order is load-bearing:

```sass
@use '../fractals/tokens'      // 1. custom properties define the vocabulary
@use '../fractals/base'        // 2. reset consumes tokens (body font/bg/color)
@use '../fractals/utilities'   // 3. atom classes (low specificity, single job)
@use '../components/blocks'    // 4. components consume tokens + fractals
@use '../components/layouts'   // 5. page templates
```

Tokens first so every later rule can reference them. Utilities before
components so a component can still be nudged by a utility class in markup where
that is genuinely wanted. Everything is flat, single-class specificity — the
cascade does the arbitration, not selector weight.

## What a partial may and may not do

- A partial in `fractals/` **defines** mixins/functions and may emit tokens/reset
  (`_tokens`, `_base`) or projected classes (`_utilities`). Atom/molecule
  partials emit nothing until their mixins are called.
- A partial in `components/` **only** authors classes, always by composing
  fractals via `@use '../fractals' as *`. It should contain almost no raw CSS —
  if you're writing `display: flex` by hand in a component, there is probably a
  fractal for it.

Next: [Getting started](03-getting-started.md).
