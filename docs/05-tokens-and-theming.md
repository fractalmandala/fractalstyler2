---
title: Tokens & theming
description: The token scales, the color-mode contract, and how to add named themes.
---

Tokens are the only place literal values live. Every fractal consumes them
through a resolver. Edit a scale value in one place and it cascades everywhere.

## The scales

Defined in `src/lib/fractals/_tokens.sass` as CSS custom properties, and mirrored
in `_config.sass` as Sass data so resolvers know which keywords are "on scale".

| Scale | Keywords | Token pattern |
| --- | --- | --- |
| Space | `3xs 2xs xs s m l xl 2xl 3xl s-l` | `--space-*` (fluid `clamp`) |
| Type | `xs sm md lg xl 2xl 3xl 4xl` | `--text-*` (fluid) |
| Radius | `0 2 4 6 8 12 16 24 full` | `--radius-*` |
| Shadow | `sm md lg` | `--shadow-*` |
| Backgrounds | `bg surface raised` | `--bg`, `--bg-surface`, `--bg-raised` |
| Text | `primary secondary muted inverse` | `--text-*` |
| Borders | | `--border`, `--border-strong` |
| Brand | | `--theme`, `--theme-hover`, `--theme-active`, `--ring` |
| Layout | | `--header-height`, `--footer-height`, `--measure` |
| Z-index | | `--z-base/raised/sticky/modal/toast` |

To change a value, edit `_tokens.sass`. To add a *new keyword* to a scale (e.g. a
`--space-4xl`), add it to `_tokens.sass` **and** to the matching list in
`_config.sass` (`$space-steps`) so `space(4xl)` resolves to the token instead of
falling through to raw units.

## Color-mode contract

Three layers, in this order inside `_tokens.sass`:

1. **`:root`** defines the **light** palette with no marker. This is load-bearing:
   it is the only block that applies with no attribute on `<html>`, so tokens
   stay defined during SSR, with JS disabled, and for crawlers. Never delete it
   in favour of an explicit `[data-mode='light']` block.
2. **`@media (prefers-color-scheme: dark)`** guarded by
   `:root:not([data-mode='light'])` — dark for visitors who haven't explicitly
   chosen light.
3. **`[data-mode='dark']` / `[data-mode='light']`** — explicit choices that win.

Set the marker from JS with the shipped helpers:

```js
import { setMode, toggleMode } from 'fractalstyler2';

setMode('dark');       // force dark  → <html data-mode="dark">
toggleMode();          // flip, returns the new mode
```

Persisting and applying the choice before paint (to avoid a flash) is the app's
job — read your stored value in `app.html` or an early inline script and set
`data-mode` on `<html>` there.

## Adding a named theme

`data-mode` is the binary light/dark axis. For a distinct palette (a brand skin,
a high-contrast set), introduce your own attribute and redefine only the tokens
that differ. Add this to your app, or extend `_tokens.sass` in a fork:

```sass
[data-theme='sunset']
	--theme: #e4572e
	--theme-hover: #c8481f
	--bg-surface: #fff6f0
	// …only what changes; everything else inherits from :root
```

```svelte
<html data-theme="sunset">
```

Because fractals reference `var(--theme)` etc. rather than literals, every
component re-skins automatically — no component edits.

## Why fluid tokens

Space and type use `clamp()` tuned for a 360→1240px viewport, so rhythm scales
smoothly without breakpoint steps. Consumers rarely need media queries for
spacing; when a *layout* must change shape, that's what `+at()` and `+cols()`
are for.

Next: [Utilities](06-utilities.md).
