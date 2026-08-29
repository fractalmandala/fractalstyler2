---
title: Structure & Hierarchy
description: File and folder anatomy, the canonical 12-file physical scale, import surfaces, and cascade order.
---

# Structure & Hierarchy

All stylesheets in `fractalstyler2` live inside a single, unified directory (`src/lib/styles/`). Files are numbered sequentially from indivisible mathematical scales up to whole-page layouts.

```
src/lib/styles/
├── _00_tokens.sass        ──► Raw CSS custom properties on :root & [data-mode]
├── _01_config.sass        ──► Scales, maps, resolvers (space, radius, surface, ink)
├── _02_fonts.sass         ──► Local webfont declarations (@font-face)
├── _03_responsive.sass    ──► Viewport media query mixins (+at, +below, +between)
├── _04_atoms.sass         ──► Single-decision layout primitives (+box, +row, +bg, +ink)
├── _05_molecules.sass     ──► Compositions of atoms (+stack, +cluster, +surface, +cols)
├── _06_recipes.sass       ──► Macro component archetypes (=control, =select, =card, =partition)
├── _07_base.sass          ──► Global HTML element resets
├── _08_blocks.sass        ──► Semantic compositions (.card, .button, .select, .badge, .input)
├── _09_utilities.sass     ──► The class registry (spacing/radius/size families: presets, literals, negatives, -mob/-desk)
├── _10_layouts.sass       ──► Page layout templates (.docs, .card-grid, .hero, .holy-grail)
├── _11_own.sass           ──► Bespoke local project overrides
├── _fractals.sass         ──► Pure Mixin Barrel (forwards 01 to 06, emits 0 bytes CSS)
└── index.sass             ──► Master Stylesheet (forwards fractals + loads CSS cascade)
```

---

## The Two SASS Entrypoints

### 1. `_fractals.sass` — The Pure Mixin Barrel (Zero CSS)
- Forwards **only** the mathematical and mixin layers (`01_config` $\to$ `06_recipes`).
- Emits **0 bytes of CSS**.
- Safe to `@use '$lib/styles/fractals' as *` inside 100+ component `<style>` blocks without leaking `:root` token blocks or duplicate class declarations.

```sass
@forward '01_config'
@forward '03_responsive'
@forward '04_atoms'
@forward '05_molecules'
@forward '06_recipes'
```

### 2. `index.sass` — The Emitted Global Stylesheet
- Loaded **once globally** in your root `+layout.svelte`.
- Forwards `fractals` at Line 1 so downstream consumers can import one master file.
- Uses `@use '...' as *` to load the cascade in strict specificity order:

```sass
// 1. Public SASS API
@forward 'fractals'

// 2. Global Stylesheet Cascade
@use '02_fonts' as *
@use '00_tokens' as *
@use '07_base' as *
@use '08_blocks' as *
@use '09_utilities' as *
@use '10_layouts' as *
@use '11_own' as *
```

---

## The Scale Hierarchy Breakdown

| File | Emits CSS? | Purpose |
|---|---|---|
| `_00_tokens.sass` | Yes (`:root`) | The single source of truth for runtime CSS custom properties. |
| `_01_config.sass` | No (0 bytes) | Sass map data and resolver functions (`space()`, `radius()`, `surface()`, `ink()`). |
| `_02_fonts.sass` | Yes (`@font-face`) | Local webfonts and typography fallbacks. |
| `_03_responsive.sass` | No (0 bytes) | Breakpoint media query mixins (`+at()`, `+below()`, `+between()`). |
| `_04_atoms.sass` | No (0 bytes) | Single-decision mixins (`+box`, `+row`, `+bg`, `+ink`, `+pad`, `+gap`). |
| `_05_molecules.sass` | No (0 bytes) | Multi-atom compositions (`+stack`, `+cluster`, `+surface`, `+cols`). |
| `_06_recipes.sass` | No (0 bytes) | Parameterized macro archetypes (`=control`, `=select`, `=card`, `=partition`). |
| `_07_base.sass` | Yes (HTML tags) | Global HTML resets (box-sizing, body ink, link states). |
| `_08_blocks.sass` | Yes (`.classes`) | Baseline compositions (`.card`, `.button`, `.select`, `.badge`, `.accordion`). |
| `_09_utilities.sass` | Yes (`.classes`) | The class registry (spacing/radius/size families: presets, literals, negatives, `-mob`/`-desk` locks). |
| `_10_layouts.sass` | Yes (`.classes`) | Page-scale frames (`.docs`, `.card-grid`, `.hero`, `.holy-grail`). |
| `_11_own.sass` | Yes (`.classes`) | Local bespoke overrides for your application. |

---

## The Class Grammar (registry v1)

Since v0.5.0, **classes are the public API** — mixins are internal generators, still callable during migration. The full registry lives in [`registry-v1.md`](../registry-v1.md); the grammar in one table:

| Form | Meaning | Example |
| --- | --- | --- |
| `.family-{preset}` | Token-routed fluid value | `.gap-sm`, `.pad-x-md`, `.text-lg` |
| `.family-{N}` | Literal px within `$utility-range` (1–256) | `.gap-16`, `.radius-4`, `.w-64` |
| `.family--{N}` | Negative (margin families only) | `.marg--16` |
| `.family-{value}-{mob\|desk}` | Viewport lock (below / at-or-above 768px) | `.gap-sm-desk`, `.hide-mobile` |

Every class is self-sufficient — co-occurrence adds, never requires. Visual toggles are classes (`.open`, `.active`, `.elevated`); semantic state stays on native attributes.

**Preset languages** ride `<html>` data-attributes as pure token remaps (fractalthemer applies them): `data-layout` tight/sprawling, `data-shape` round/curved/pro/sharp (remaps the `--radius-sm/md/lg` channels compositions read), `data-color` clean/vibrant (light mode only), `data-motion` springy/heavy/reduced.

## Import Syntax Guidelines

### In Svelte Component `<style>` Blocks:
Always import the pure mixin barrel so no duplicate CSS is emitted:

```svelte
<style lang="sass">
	@use '$lib/styles/fractals' as *

	.my-card
		+surface(surface, sm, 6)
		+stack(sm)
</style>
```

### In Root `+layout.svelte`:
Import the master stylesheet once:

```svelte
<script>
	import '$lib/styles/index.sass';
</script>
```
