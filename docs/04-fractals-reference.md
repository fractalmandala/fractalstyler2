---
title: Fractals Reference
description: Complete manual of every atom, molecule, and macro recipe mixin, their signatures, resolvers, and examples.
---

# Fractals Reference

Import the pure API in any SASS file or Svelte component `<style lang="sass">`:

```sass
@use '$lib/styles/fractals' as *
// Or when using package dependency:
// @use 'fractalstyler2/fractals' as *
```

---

## 1. Resolvers (Functions)

Resolvers accept tokens (`m`, `s`, `md`, `surface`) or raw unit/numeric values (`18`, `2rem`), normalizing them to CSS custom properties or valid units:

| Function | Accepts | Returns | Example |
|---|---|---|---|
| `space($v)` | `3xs` `2xs` `xs` `s` `m` `l` `xl` `2xl` `3xl` `s-l` \| Number | Token or px | `space(m)` $\to$ `var(--space-m)`; `space(18)` $\to$ `18px` |
| `radius($v)` | `0` `2` `3` `4` `6` `8` `12` `16` `24` `full` \| Number | Token or px | `radius(6)` $\to$ `var(--radius-6)` |
| `surface($role)` | `bg` `surface` `raised` `panel` `footer` `popover` `dialog` `terminal` `input` `canvas` | Token var | `surface(panel)` $\to$ `var(--bg-panel)` |
| `ink($role)` | `primary` `secondary` `muted` `inverse` | Token var | `ink(secondary)` $\to$ `var(--text-secondary)` |
| `text-size($v)`| `xs` `sm` `md` `lg` `xl` `2xl` `3xl` `4xl` | Token var | `text-size(md)` $\to$ `var(--text-md)` |
| `shadow($v)` | `sm` `md` `lg` | Token var | `shadow(md)` $\to$ `var(--shadow-md)` |
| `align($v)` | `start` `end` `center` `between` `around` `evenly` `stretch` `baseline` | CSS flex keyword | `align(between)` $\to$ `space-between` |
| `bp($name)` | `sm` `md` `lg` `xl` | Breakpoint width | `bp(lg)` $\to$ `1024px` |

---

## 2. Atoms (Single-Decision Primitives)

### Flow & Alignment
- `+box($x: null, $y: null)` — Flex column. `$x` controls `align-items`, `$y` controls `justify-content`.
- `+row($x: null, $y: null)` — Flex row. `$x` controls `justify-content`, `$y` controls `align-items`.
- `+wrap` — `flex-wrap: wrap`.
- `+grid($cols: 1)` — CSS Grid with $N$ equal `minmax(0, 1fr)` tracks.
- `+auto-grid($min: 15rem, $gap: s)` — Responsive auto-fitting grid without media queries.
- `+center` — Dead center single child via `display: grid; place-items: center`.

### Spacing & Sizing
- `+gap($v: s)` — `gap: space($v)`.
- `+pad($v: s)` — `padding: space($v)`.
- `+px($v: s)` — `padding-inline: space($v)`.
- `+py($v: s)` — `padding-block: space($v)`.
- `+mx-auto` / `+my-auto` — Auto margins for centering.
- `+w($v: 100%)` / `+h($v: 100%)` / `+full` — Width and height constraints.
- `+min0` — `min-width: 0; min-height: 0` (prevents flex and grid child overflow).

### Surface & Skin
- `+bg($role: surface)` — Background color from the 21-token palette.
- `+ink($role: primary)` — Text color from the token palette.
- `+border($side: all, $color: var(--border))` — 1px solid border on all sides or a specific side (`top`, `bottom`, `left`, `right`).
- `+radius($v: 4)` — Concentric border radius (`0` to `24`, `full`).
- `+shadow($v: md)` — Elevation box shadow (`sm`, `md`, `lg`).

### Typography & Truncation
- `+type($v)` — Sets font-size to a fluid Utopia step.
- `+weight($w: 500)` — `font-weight: $w`.
- `+leading($lh: 1.5)` — `line-height: $lh`.
- `+truncate` — Single-line text ellipsis (`nowrap` + `overflow: hidden`).
- `+clamp-lines($n: 2)` — Multi-line text clamping.

---

## 3. Molecules (Compositions of Atoms)

- `+stack($gap: xs, $x: null)` — Vertical rhythm stack with aligned child flow.
- `+cluster($gap: xs, $x: start, $y: center)` — Wrapping flex row for tag chips and action pills.
- `+surface($bg: surface, $pad: null, $radius: 6, $elevation: none)` — The physical material primitive (background + border + radius + optional padding and shadow).
- `+cols($map, $gap: s)` — Responsive column map (`+cols((base: 1, sm: 2, lg: 4), s)`).
- `+center-column($max: var(--measure, 60ch), $pad: s)` — Constrained reading column with automatic horizontal centering.
- `+cover($min: 100vh, $pad: s)` — Full-viewport container with vertically centered hero focal point.
- `+frame($ratio: '16 / 9')` — Fixed aspect-ratio container with covered media.

---

## 4. Macro Recipes

Recipes are parameterized component archetypes in `_06_recipes.sass`:

### `=control($size: md, $radius: 4)`
Universal interactive control base (used for buttons, select triggers, inputs, and accordion bars). Handles hover states, active spring scale, focus rings, and disabled opacity.
- `$size`: `sm` (26px height), `md` (32px height), `lg` (38px height).

### `=select($size: md, $radius: 4)`
Native dropdown select recipe. Includes custom embedded SVG chevron, optical vertical text centering (`line-height: 1.2`), and 28px right padding to prevent text glyph clipping on macOS/WebKit.

### `=partition($side: top, $pad: s)`
Section divider with guaranteed breathing room. Combines border dividers with reciprocal padding (`padding-top: space($pad)`) and `margin-top: auto` for pinned footers.

### `=card($bg: surface, $pad: null, $radius: 6, $elevation: none)`
The standard top-anchored vertical card surface.

### `=collapsible`
Pure CSS grid transition (`0fr` $\to$ `1fr`) for zero-JS accordion animations.

### `=marquee($speed: 30s, $gap: 1rem)`
Hardware-accelerated infinite ticker with fade masks and pause-on-hover.

---

## 5. Responsive Media Query Mixins

- `+at($bp)` — `@media (min-width: bp($bp)) { @content }` (e.g. `+at(lg)`).
- `+below($bp)` — `@media (max-width: (bp($bp) - 1px)) { @content }`.
- `+between($min, $max)` — Viewport interval media query.
