---
title: Fractals reference
description: Every atom and molecule mixin, its arguments and defaults, plus the config resolvers.
---

# Fractals reference

Import the API in any SASS context:

```sass
@use 'fractalstyler2/fractals' as *
```

Argument conventions: a **step** is a scale keyword (`xs s m l xl…`) that resolves
to a token, or a bare number that becomes `px`, or any explicit unit that passes
through (see [resolvers](#resolvers)). An **align** value is a semantic keyword
(`start end center between around evenly stretch baseline`).

---

## Resolvers (functions)

| Function | Returns | Example |
| --- | --- | --- |
| `space($v)` | token or px | `space(m)` → `var(--space-m)`; `space(18)` → `18px` |
| `radius($v)` | token or px | `radius(12)` → `var(--radius-12)` |
| `text-size($v)` | token | `text-size(lg)` → `var(--text-lg)` |
| `shadow($v)` | token | `shadow(md)` → `var(--shadow-md)` |
| `surface($role)` | bg var | `surface(raised)` → `var(--bg-raised)` |
| `ink($role)` | text var | `ink(secondary)` → `var(--text-secondary)` |
| `align($v)` | flex value | `align(between)` → `space-between` |
| `bp($name)` | length | `bp(md)` → `768px` |

---

## Atoms

### Flow

| Mixin | Signature | Does |
| --- | --- | --- |
| `+box` | `($x: null, $y: null)` | flex column; `$x` → align-items, `$y` → justify-content |
| `+row` | `($x: null, $y: null)` | flex row; `$x` → justify-content, `$y` → align-items |
| `+wrap` | | `flex-wrap: wrap` |
| `+grid` | `($cols: 1)` | grid with N equal `minmax(0,1fr)` columns |
| `+auto-grid` | `($min: 15rem, $gap: s)` | auto-fit grid, tracks ≥ `$min` |
| `+center` | | `display:grid; place-items:center` |

```sass
.toolbar
	+row(between, center)   // spread on main axis, centered on cross axis
	+wrap
```

### Spacing

| Mixin | Signature | Does |
| --- | --- | --- |
| `+gap` | `($v: s)` | `gap` |
| `+pad` | `($v: s)` | `padding` |
| `+px` | `($v: s)` | `padding-inline` |
| `+py` | `($v: s)` | `padding-block` |
| `+mx-auto` | | `margin-inline: auto` |
| `+my-auto` | | `margin-block: auto` |

### Size

| Mixin | Signature | Does |
| --- | --- | --- |
| `+w` | `($v: 100%)` | `width` |
| `+h` | `($v: 100%)` | `height` |
| `+full` | | width + height 100% |
| `+square` | `($v)` | width = height = `$v` |
| `+grow` | `($n: 1)` | `flex-grow` |
| `+shrink` | `($n: 0)` | `flex-shrink` |
| `+min0` | | `min-width:0; min-height:0` (flex/grid overflow fix) |

### Surface & skin

| Mixin | Signature | Does |
| --- | --- | --- |
| `+bg` | `($role: surface)` | `background-color` from `bg`/`surface`/`raised` |
| `+ink` | `($role: primary)` | text `color` from `primary`/`secondary`/`muted`/`inverse` |
| `+border` | `($side: all, $color: var(--border))` | 1px border, all sides or one |
| `+radius` | `($v: 12)` | `border-radius` |
| `+shadow` | `($v: md)` | `box-shadow` from `sm`/`md`/`lg` |

### Position

| Mixin | Signature | Does |
| --- | --- | --- |
| `+relative` | | `position: relative` |
| `+absolute` | `($inset: null)` | `position: absolute` (+ optional `inset`) |
| `+sticky` | `($top: 0)` | `position: sticky; top` |
| `+fill` | | `position:absolute; inset:0` |

### Type

| Mixin | Signature | Does |
| --- | --- | --- |
| `+type` | `($v)` | `font-size` from the text scale |
| `+weight` | `($w: 500)` | `font-weight` |
| `+leading` | `($lh: 1.5)` | `line-height` |
| `+truncate` | | single-line ellipsis |
| `+clamp-lines` | `($n: 2)` | multi-line clamp to `$n` lines |

### Motion

| Mixin | Signature | Does |
| --- | --- | --- |
| `+transition` | `($props: all, $dur: 150ms, $ease: ease)` | `transition` shorthand |
| `+ring` | `($color: var(--ring))` | focus outline (2px + offset) |

---

## Molecules

| Mixin | Signature | Composes |
| --- | --- | --- |
| `+stack` | `($gap: xs, $x: null)` | `+box($x)` + `+gap` — vertical rhythm |
| `+cluster` | `($gap: xs, $x: start, $y: center)` | `+row` + `+wrap` + `+gap` — chip rows |
| `+center-column` | `($max: var(--measure,60ch), $pad: s)` | max-width measure + `+mx-auto` + `+px` |
| `+cover` | `($min: 100vh, $pad: s)` | `+box` filling min-height; `.center` child gets `+my-auto` |
| `+frame` | `($ratio: 16/9)` | aspect-ratio media box; child img/video `object-fit:cover` |
| `+reel` | `($gap: xs)` | `+row` horizontal scroll-snap rail |
| `+with-sidebar` | `($rail: 240px, $gap: s, $min: 60%)` | intrinsic rail + fluid `.flow` |
| `+surface` | `($bg: surface, $pad: s, $radius: 12, $elevation: none)` | `+bg` + `+border` + `+radius` + `+pad` (+ `+shadow` if elevated) |
| `+cols` | `($map, $gap: s)` | responsive column grid from a per-breakpoint map |

```sass
// A responsive 3-column grid, one call:
.grid-3
	+cols((base: 1, sm: 2, lg: 3), m)

// A card material in one call:
.tile
	+surface(surface, m, 16, md)
```

`+cols` map keys: `base` (no query) plus any breakpoint name (`sm md lg xl`).
Each value is a column count.

---

## Responsive fractals

| Mixin | Signature | Does |
| --- | --- | --- |
| `+at` | `($name)` | `@media (min-width)` by name (`sm md lg xl`) or raw length; wraps `@content` |
| `+until` | `($name)` | `@media (max-width)` variant |
| `+cq` | | `container-type: inline-size` |
| `+cq-at` | `($width)` | `@container (min-width)` |
| `+cq-until` | `($width)` | `@container (max-width)` |
| `+reduce-motion` | | `@media (prefers-reduced-motion: reduce)` |

```sass
.panel
	+pad(s)
	+at(md)
		+pad(l)      // any fractal can grow at a breakpoint
```

Next: [Tokens & theming](05-tokens-and-theming.md).
