---
title: Getting Started
description: Installation and setup.
---

The recommended way is to scaffold the complete, editable SASS design system into your project's `src/lib/styles`:

```bash
# npm
npx fractalstyler2 init

# or pnpm
pnpm --package=fractalstyler2 dlx fractalstyler2 init
```

Install `sass` as a dev dependency if you haven't already:
```bash
pnpm add -D sass
# or
npm install -D sass
```


## Option B: Direct Package Dependency

If you prefer to import from `node_modules` without scaffolding files:

```bash
pnpm add fractalstyler2
pnpm add -D sass
```

---

## Option C: Install as an Agent Plugin (Codex, Claude, Gemini, OpenCode)

`fractalstyler2` implements the [agent-plugins.org](https://agent-plugins.org/specification) standard. You can install it directly into your AI coding agent or design tool to enable design token queries, live SASS compilation, and automated component generation:

### OpenCode
Add to `~/.config/opencode/opencode.json`:
```json
{
  "mcp": {
    "fractalstyler2": {
      "type": "local",
      "command": ["npx", "-y", "fractalstyler2-mcp"],
      "enabled": true
    }
  }
}
```

### Gemini / Antigravity
Run the one-command installer:
```bash
npx fractalstyler2 mcp:install
```

### Claude Desktop / Claude Code
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```

### Codex
Add to your Codex configuration:
```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```

---


## Wire into SvelteKit

**1. Enable the SASS preprocessor.** In `vite.config.ts` (or `svelte.config.js`
if your setup uses one), add `vitePreprocess`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit({ preprocess: vitePreprocess() })]
});
```

**2. Emit the stylesheet once, globally.** In `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	// If scaffolded via CLI:
	import '$lib/styles/index.sass';

	// Or if using node_modules package:
	// import 'fractalstyler2/styles';

	let { children } = $props();
</script>

{@render children()}
```

That import compiles the full system (tokens, reset, utility classes, blocks,
layouts) and injects it as global CSS. You only do it once.

## Your First Markup

If you are able to use 3 classes well - .box, .row, and .grid, you're pretty much equipped to begin making layouts and pages. 
In the file `_03_containers.sass`, see .box and .row. If you're familiar with Every Layout, these are the same as stack and cluster. Flexboxes column and row, respectively. 

Modular and fractal. In your markup, use `class="box gap-xl"` for xl sized gap between the box's children items. Add `radius-lg` if you're tastes are more rounded elements.  Align items left? Add in `xleft`. 
`box gap-sm` and `row ycenter gap-sm` are likely to be your most used classes. You can use them on cards, sidebars, shells - anything. 

A decision that is left to you is whether some things are "bloat" or "scoped efficieny".
Should you use a class `sidebar-left` which you define as a flex in column direction, or should you just throw in `box gap-lg` in the markup?



## Display Mode

## Color mode

Light is the default and is SSR-safe (no marker needed). Dark comes from the
OS (`prefers-color-scheme`) and from an explicit `data-mode="dark"` on `<html>`:

```svelte
<script>
	import { toggleMode } from 'fractalstyler2';
</script>

<button class="button" onclick={() => toggleMode()}>Toggle mode</button>
```

See [Tokens & theming](05-tokens-and-theming.md) for named themes.

Next: [Fractals reference](04-fractals-reference.md).



The atomic idea of the system: **a fractal is a SASS mixin that encodes one
reusable styling decision and can compose other fractals.** In indented SASS a
fractal is defined with `=name` and called with `+name`:

```sass
=gap($v: sm)
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

> Tip: Look at the files 00\_tokens and 01\_config to understand the first level of fractals. 00\_tokens sets variables for colors, typography, sizing, border-radius, shadows, z-index values. If you are using the [fractalthemer](https://github.com/fractalmandala/fractalthemer) package, make sure you do not change the color token variables, or the themes will no longer work.

**B — as a utility class** (bound to a name, used from markup):

```sass
@each $s in $space-steps
	.gap-#{$s}
		+gap($s)
```

```svelte
<div class="box gap-md pad-lg">…</div>
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
space(md)    → var(--space-md)     // the design vocabulary (default)
space(18)   → 18px               // escape hatch, same call
space(2rem) → 2rem               // passthrough
```

So there is one `+gap()` fractal — the number is an argument, not a new class.
No `gap16`, `gap18`, `gap22`, `pad24-sm` explosion. The token scale is the
default vocabulary; raw values are the exploratory escape hatch, and they live
in the *same* call site so promoting one to a token is a one-character edit.

> The resolvers in 01\_config may look arcane, but they are simple utilities to set great flexibility in the system. `@function space($v)` simply means that when you use `space(8)` it resolves to a spacing of 8px. Further down the line it enables gap(8), pad(8), px(8) which is padding-inline and py(8) which is padding-block. 01\_config builds the first elementary fractals!

What's more, the system isn't opinionated about the units you want to use. It resolves all these:

- token steps (m, xl, etc.) - space(md) resolves to var(--space-md) 
- numberical values - space(24) resolves to 24px
- CSS units - 2rem, 80vh etc.

## 5. Visual toggles are classes; semantics stay native

Registry v1: what JS toggles for looks is a class; what carries meaning is a
native attribute:

```sass
.button
	&.primary
		background: var(--theme-color)
	&.active
		+bg(bg)
```

```svelte
<button class="button primary">Save</button>
```

Class strings stay short, and `[disabled]`, `[aria-expanded]`, and
`:focus-visible` keep their native meaning for assistive tech and CSS alike.

## 6. Why this sits on CUBE CSS

CUBE (Composition · Utility · Block · Exception) works *with* the cascade. The
fractal model keeps all four layers and simply moves two of them out of markup:


| CUBE layer      | Where it lives here                                                                  |
| --------------- | ------------------------------------------------------------------------------------ |
| **Composition** | `+stack +cluster +cols` fractals, composed in SASS (or projected to classes)         |
| **Utility**     | `+gap +pad +type` fractals; projected to classes only where wanted                   |
| **Block**       | `.card { +surface(...) +stack(...) }` — a recipe, not a wall of CSS                  |
| **Exception**   | visual toggles as classes (`.open`, `.active`); `&[aria-current]` stays an attribute |


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