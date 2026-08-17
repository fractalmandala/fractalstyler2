# Fractals Catalog Reference

## Atom Fractals (Single Decisions)

* **Layout Flow**: `+box(x, y)` (flex col), `+row(x, y)` (flex row), `+wrap`, `+grid(cols)`, `+auto-grid(min, gap)`, `+center` (grid center).
* **Spacing**: `+gap(v)`, `+pad(v)`, `+px(v)`, `+py(v)`, `+mx-auto`, `+my-auto`.
* **Sizing**: `+w(v)`, `+h(v)`, `+full`, `+square(v)`, `+grow(n)`, `+shrink(n)`, `+min0`.
* **Surfaces**: `+bg(role)`, `+ink(role)`, `+border(side, color)`, `+radius(v)`, `+shadow(v)`.
* **Position**: `+relative`, `+absolute(inset)`, `+sticky(top)`, `+fill`.
* **Type**: `+type(v)`, `+weight(w)`, `+leading(lh)`, `+truncate`, `+clamp-lines(n)`.
* **Motion**: `+transition(props, dur, ease)`, `+ring(color)`.

## Molecule Fractals (Compositions of Atoms)

* **`+stack($gap: xs, $x: null)`**: Vertical flex column rhythm with uniform gap.
* **`+cluster($gap: xs, $x: start, $y: center)`**: Wrapping flex row for tag clouds, chips, and button rows.
* **`+center-column($max: 60ch, $pad: s)`**: Bounded reading column with max-width measure and auto margins.
* **`+cover($min: 100vh, $pad: s)`**: Full-height container with a vertically centered focal child (`> .center`).
* **`+frame($ratio: 16 / 9)`**: Fixed aspect-ratio container for media.
* **`+reel($gap: xs)`**: Horizontal scroll-snap rail.
* **`+with-sidebar($rail: 240px, $gap: s, $min: 60%)`**: Intrinsic sidebar + fluid main layout.
* **`+surface($bg: surface, $pad: s, $radius: 12, $elevation: none)`**: The all-in-one material mixin.
* **`+cols($map, $gap: s)`**: Responsive grid mapped across breakpoints, e.g. `+cols((base: 1, sm: 2, lg: 3), m)`.

## Responsive Utilities
* `+at(sm | md | lg | xl)`: Mobile-first min-width media query.
* `+until(sm | md | lg | xl)`: Max-width media query.
* `+cq`, `+cq-at(width)`, `+cq-until(width)`: Container queries.
