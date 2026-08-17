---
title: Utilities
description: The markup classes projected from atom fractals, and when to reach for them.
---

# Utilities

Utility classes are the *projection* of atom fractals into markup, generated in
`src/lib/fractals/_utilities.sass`. They ship in `fractalstyler2/styles`. Use
them for quick composition in markup; reach for [component recipes](07-components-and-layouts.md)
when a class string recurs.

## Flow

| Class | Fractal |
| --- | --- |
| `.box` | `+box` (flex column) |
| `.row` `.row.wrap` | `+row` (+ `+wrap`) |
| `.grid-cols-1` … `.grid-cols-6` | `+grid(n)` |
| `.center` | `+center` |

Alignment modifiers (composed in the class string):

- On `.box`: `.xcenter .xleft .xright` (cross axis) · `.ycenter .ytop .ybot` (main axis)
- On `.row`: `.ycenter .ytop .ybot` (cross axis) · `.xbetween .xevenly .xleft .xright` (main axis)

```svelte
<div class="row ycenter xbetween">…</div>
<div class="box xcenter">…</div>
```

## Spacing

Generated for every space step (`3xs 2xs xs s m l xl 2xl 3xl s-l`):

| Pattern | Fractal |
| --- | --- |
| `.gap-m` | `+gap(m)` |
| `.pad-l` | `+pad(l)` |
| `.px-s` | `+px(s)` |
| `.py-xl` | `+py(xl)` |

## Surface, radius, shadow, border

| Class | Fractal |
| --- | --- |
| `.bg-bg` `.bg-surface` `.bg-raised` | `+bg(role)` |
| `.radius-0…24` `.radius-full` | `+radius(v)` |
| `.shadow-sm/md/lg` | `+shadow(v)` |
| `.border` | `+border` (all sides) |
| `.border-top/right/bottom/left` | `+border(side)` |

## Type

| Class | Fractal / effect |
| --- | --- |
| `.text-xs … .text-4xl` | `+type(v)` |
| `.truncate` | single-line ellipsis |
| `.body` | md size + 1.6 leading + primary ink (semantic paragraph) |
| `.muted` | secondary ink |
| `.eyebrow` | small uppercase label, muted |

## Sizing shortcuts

| Class | Fractal |
| --- | --- |
| `.wfull` `.hfull` `.full` | `+w/+h/+full` |
| `.grow` | `+grow` |
| `.min0` | `+min0` |

## Extending the projection

To add a utility, bind a fractal to a class in `_utilities.sass` — ideally by
looping a scale so the whole family generates at once:

```sass
@each $s in $space-steps
	.mt-#{$s}
		margin-top: space($s)
```

Only project atoms you actually use in markup; anything you don't project still
exists as a fractal for composition. See [DEVELOPERS.md](../DEVELOPERS.md) for
when a change like this needs a repack.

Next: [Components & layouts](07-components-and-layouts.md).
