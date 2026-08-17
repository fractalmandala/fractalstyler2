# fractalstyler2

A fractal-composition styling system for SvelteKit. **Every style unit is a SASS
mixin ("a fractal"), and components and layouts are recipes of smaller fractals.**

This is a standalone package with no relationship to any earlier styler. The
product is framework-agnostic SASS surfaced through a SvelteKit library; the JS
runtime is just a tiny mode helper.

## The idea

A fractal is a mixin: a tiny reusable styling decision that composes other
fractals. They form four self-similar tiers — each tier is "a recipe of the one
below":

| Tier | What | Examples |
| --- | --- | --- |
| **Config** | scales-as-data + resolvers | `space()`, `radius()`, `align()`, `$breakpoints` |
| **Atoms** | one decision each | `+box` `+row` `+gap` `+pad` `+border` `+radius` `+bg` `+ink` `+type` `+sticky` |
| **Molecules** | graphs of atoms | `+stack` `+cluster` `+cover` `+frame` `+surface` `+cols` `+auto-grid` |
| **Components / Layouts** | graphs of molecules | `.card` `.button` · `.grid-3` `.hero` `.holy-grail` `.docs` `.app-shell` |

The one idea that makes it click:

> **A utility class and a semantic component are the same fractal, consumed two ways.**
> `.gap-m { +gap(m) }` binds the fractal to markup; `.hero { +cover; +stack(m) }`
> composes it into a component. One vocabulary, you pick where each is used.

## Install

[NPM](https://www.npmjs.com/package/fractalstyler2)

```bash
npm install fractalstyler2
# or
pnpm add fractalstyler2
```

Your app also needs `sass` (the package ships `.sass` source):

```bash
npm install -D sass
# or
pnpm add -D sass
```

## Use

**1 — Emit the ready-made stylesheet** (tokens, base reset, utility classes,
blocks, layouts). Import once, globally (e.g. in your root `+layout.svelte`):

```svelte
<script>
	import 'fractalstyler2/styles';
</script>
```

Then write thin, semantic markup:

```svelte
<div class="grid-3">
	<article class="card"><h3 class="text-lg">Composable</h3></article>
	<article class="card" data-elevated><h3 class="text-lg">Elevated</h3></article>
	<article class="card"><h3 class="text-lg">Semantic</h3></article>
</div>
```

**2 — Compose your own components from the fractals.** Import the pure API
(emits nothing until called) inside any component's SASS:

```svelte
<style lang="sass">
	@use 'fractalstyler2/fractals' as *

	.pricing-card
		+surface(surface, l, 16, md)   // bg + border + radius + pad + shadow
		+stack(m, center)              // flex-column + gap + centered
		text-align: center
</style>
```

Values prefer the finite token scale and fall back to raw units in the same
call: `+gap(m)` → `var(--space-m)`, `+gap(16)` → `16px`. No JIT class explosion.

## What ships

```
fractalstyler2/
├─ styles         → the full emitted stylesheet (import 'fractalstyler2/styles')
├─ fractals       → the mixin/function API (@use 'fractalstyler2/fractals' as *)
├─ tokens         → just the custom properties (@use 'fractalstyler2/tokens')
└─ (default)      → { version, setMode, toggleMode }
```

Source layout: `src/lib/fractals/` (config, tokens, base, responsive, atoms,
molecules, utilities), `src/lib/components/` (blocks, layouts),
`src/lib/styles/` (the emit entry).

## Color mode

Light is the marker-free default (SSR-safe). Dark comes from
`prefers-color-scheme` and from an explicit `data-mode="dark"` on `<html>`:

```js
import { toggleMode, setMode } from 'fractalstyler2';
toggleMode();       // flip light/dark
setMode('dark');    // force
```

## Included layouts

`.grid-3` (responsive 1→2→3), `.card-grid` (intrinsic auto-fit), `.hero`,
`.holy-grail`, `.docs`, `.app-shell` — each a few fractal calls in
`src/lib/components/_layouts.sass`.

## Develop

```bash
# npm                    # pnpm
npm install              # pnpm install
npm run dev              # pnpm dev        — demo showcase at /
npm run prepack          # pnpm run prepack — build the package into dist/
```

## License

MIT
