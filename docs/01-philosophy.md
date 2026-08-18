---
title: Philosophy
description: The fractal model — self-similarity, dual consumption, resolvers, and why it sits on CUBE CSS.
---

> A fractal is a mixin

The atomic idea of the system: **a fractal is a SASS mixin that encodes one
reusable styling decision and can compose other fractals.** In indented SASS a
fractal is defined with `=name` and called with `+name`:

```sass
=gap($v: s)
	gap: space($v)
```

`.box`, `.row`, `.grid`, `gap`, `pad`, `border`, `radius` — none of these are
classes first. They are fractals. A class is just one place a fractal can be
used.

## 2. Self-similarity — the same move at every scale

Fractals form four tiers, and each tier is *a recipe of the tier below*:

```
Config      space(), radius(), align()          ← scales-as-data + resolvers
  ↓
Atoms       +box  +gap  +pad  +border  +radius   ← one decision each
  ↓
Molecules   +stack  +cluster  +surface  +cols    ← graphs of atoms
  ↓
Components  .card  .button   ·  Layouts  .grid-3 .hero .docs
```

You read a whole-page `.docs` layout the same way you read a `.card`: as a short
list of fractal calls. That self-similarity is the "fractal" in the name — and
the reason the system stays small as it grows. New complexity is always "another
recipe of things that already exist."

## 3. Dual consumption — the key idea

A fractal is defined once. There are exactly two ways to use it:

**A — as a semantic composition** (inside your own selector):

```sass
.hero
	+cover(80vh, xl)
	> .center
		+stack(m, center)
```

Here, `+cover` calls the mixin `=cover` from molecules. A cover is simply a flexbox column with child centered, where you define the min-height and padding. Those are the 2 parameters (or arguments - those things in brackets). So, `+cover(80vh, xl)` gives you a flexbox column with min height of 80vh, and an extra large padding.
- in `_00_tokens.sass` you will find the definitions of space units. `xl` corresponds to `--space-xl` which is set at `clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)`.

***Fractalstyler similarly sets responsive and scaling scheme into the design. But should you wish to configure it your way, you can always alter the token definitions.***

> Tip: Look at the files 00_tokens and 01_config to understand the first level of fractals. 00_tokens sets variables for colors, typography, sizing, border-radius, shadows, z-index values. If you are using the [fractalthemer](https://github.com/fractalmandala/fractalthemer) package, make sure you do not change the color token variables, or the themes will no longer work.

**B — as a utility class** (bound to a name, used from markup):

```sass
@each $s in $space-steps
	.gap-#{$s}
		+gap($s)
```
```svelte
<div class="box gap-m pad-l">…</div>
```

> Utility classes are a *generated projection* of the fractal library. Same source of truth; the author picks where each fractal is
> consumed.

This dissolves the old "utility CSS vs. component CSS" argument. You have one
vocabulary of fractals and you decide, per fractal, whether it lives in markup
or in a component recipe.

## 4. Resolvers — one call, token-or-raw

Fractals never hardcode a value. Every value routes through a resolver that
prefers the finite token scale and falls back to a raw unit:

```
space(m)    → var(--space-m)     // the design vocabulary (default)
space(18)   → 18px               // escape hatch, same call
space(2rem) → 2rem               // passthrough
```

So there is one `+gap()` fractal — the number is an argument, not a new class.
No `gap16`, `gap18`, `gap22`, `pad24-sm` explosion. The token scale is the
default vocabulary; raw values are the exploratory escape hatch, and they live
in the *same* call site so promoting one to a token is a one-character edit.

> The resolvers in 01_config may look arcane, but they are simple utilities to set great flexibility in the system. `@function space($v)` simply means that when you use `space(8)` it resolves to a spacing of 8px. Further down the line it enables gap(8), pad(8), px(8) which is padding-inline and py(8) which is padding-block. 01_config builds the first elementary fractals!

What's more, the system isn't opinionated about the units you want to use. It resolves all these:
- token steps (m, xl, etc.) - space(m) resolves to var(--space-m) 
- numberical values - space(24) resolves to 24px
- CSS units - 2rem, 80vh etc.

## 5. State is an attribute

Variants and states ride on `data-*` / `aria-*`, never on modifier classes:

```sass
.button
	&[data-variant='primary']
		background: var(--theme)
```
```svelte
<button class="button" data-variant="primary">Save</button>
```

This keeps class strings short and bridges HTML, CSS, and Svelte runes without
class thrashing.

## 6. Why this sits on CUBE CSS

CUBE (Composition · Utility · Block · Exception) works *with* the cascade. The
fractal model keeps all four layers and simply moves two of them out of markup:

| CUBE layer | Where it lives here |
| --- | --- |
| **Composition** | `+stack +cluster +cols` fractals, composed in SASS (or projected to classes) |
| **Utility** | `+gap +pad +type` fractals; projected to classes only where wanted |
| **Block** | `.card { +surface(...) +stack(...) }` — a recipe, not a wall of CSS |
| **Exception** | unchanged — `&[data-variant='…']`, `&[aria-current]` |

## 7. The one honest tradeoff

Mixins **inline** their output. If 50 components each `+box`, that
`display:flex; flex-direction:column` is emitted 50 times, where a single `.box`
utility class ships once. Two things make this a non-issue:

1. gzip/brotli collapse repeated declarations extremely well.
2. `_utilities.sass` still exists — for truly ubiquitous atoms (`box`, `gap-*`,
   `pad-*`) you emit **one** class and reuse it. Reserve mixin-composition for
   components, where the duplication is bounded and the readability win is large.

You choose per fractal. That control is the whole point.

Next: [Structure](02-structure.md).
