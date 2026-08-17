---
title: Philosophy
description: The fractal model — self-similarity, dual consumption, resolvers, and why it sits on CUBE CSS.
---

# Philosophy

## 1. A fractal is a mixin

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

**B — as a utility class** (bound to a name, used from markup):

```sass
@each $s in $space-steps
	.gap-#{$s}
		+gap($s)
```
```svelte
<div class="box gap-m pad-l">…</div>
```

> Utility classes are a *generated projection* of the fractal library, not a
> parallel system. Same source of truth; the author picks where each fractal is
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

## 5. State is an attribute, not a class

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
