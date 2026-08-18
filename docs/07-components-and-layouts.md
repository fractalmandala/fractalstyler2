---
title: Components & Layouts
description: Shipped component blocks, page layout templates, grid heuristics, and structural laws.
---

# Components & Layouts

`fractalstyler2` ships ready-to-use semantic classes in `_08_blocks.sass` and structural page frames in `_10_layouts.sass`.

---

## 1. Shipped Component Blocks (`_08_blocks.sass`)

### Cards (`.card`)
Cards are top-anchored vertical stacks that automatically handle pinned partition footers:

```svelte
<article class="card pad-s radius-6 box ybetween gap-s" data-elevated>
	<div class="box gap-2xs">
		<header class="row ycenter xbetween">
			<span class="eyebrow text-xs" style="color: var(--theme-color)">Core</span>
			<span class="kbd text-xs">v2.2</span>
		</header>
		<h3 class="text-md font-semibold">Accordion</h3>
		<p class="muted text-sm clamp-2">Vertically stacked collapsible disclosure panels.</p>
	</div>

	<!-- Pinned Partition Footer -->
	<footer class="row wrap ycenter xbetween gap-xs pad-top-xs border-top">
		<div class="row wrap gap-3xs min0">
			<span class="kbd text-xs">#svelte</span>
			<span class="kbd text-xs">#runes</span>
		</div>
		<a href="/docs/components/accordion" class="button ghost text-xs row ycenter gap-3xs shrink-0">
			<span>Docs</span>
		</a>
	</footer>
</article>
```

### Interactive Controls
- **Buttons (`.button`)**: Variants include `.button.primary`, `.button.ghost`, `.button.sm`, `.button.lg`, `.button.is-icon`.
- **Native Select (`.select`)**: Built-in SVG chevron, optical line-height (`1.2`), and zero vertical glyph clipping.
- **Toggle Switch (`.switch-track`, `.switch-thumb`)**: Hardware-accelerated cubic spring physics.
- **Badges (`.badge`)**: Compact status pills (`data-status="released"`, `data-status="wip"`, `data-status="planned"`).
- **Keycaps (`.kbd`)**: Monospace keyboard shortcut indicators.

---

## 2. Page Layout Frames (`_10_layouts.sass`)

### Grids & Responsive Reflow

```
Full-Width Page (1200px+) ────────────►  .grid-4 (4 cols) or .grid-3 (3 cols)
Reading Column / Docs Shell (<=760px) ─►  .grid-2 (MAX 2 cols) or .card-grid (Auto-fit min 16rem)
Side-by-side / Comparisons (2 items) ──►  .grid-2 (2 desktop ──► 1 mobile)
```

- `.grid-1`: Single column stack.
- `.grid-2`: 2 columns desktop $\to$ 1 column mobile (`md: 768px`).
- `.grid-3`: 3 columns desktop $\to$ 2 tablet $\to$ 1 mobile.
- `.grid-4`: 4 columns desktop $\to$ 2 tablet $\to$ 1 mobile.
- `.card-grid`: Fluid auto-fit grid (`repeat(auto-fit, minmax(16rem, 1fr))`) that reflows automatically without media queries.

> [!IMPORTANT]
> **The Reading Column Max Columns Law**:
> Any grid placed within a constrained reading measure (`.docs-main`, `.center-column`, or container $\le 760\text{px}$) must **never exceed 2 columns** (`.grid-2` or `cols={2}`). 3 and 4-column grids are strictly reserved for full-width views (`.app-main`).

---

### Page Frames
- **`.docs`**: 3-column responsive documentation shell (Left sticky nav drawer $\to$ Center reading column $\to$ Right sticky Table of Contents rail).
- **`.holy-grail`**: Header $\to$ (Nav · Main · Aside) $\to$ Footer.
- **`.hero`**: Full-viewport cover (`80vh`) with a measured, centered title message.
- **`.app-shell`**: Sticky top application bar $\to$ Fluid scrollable body $\to$ Pinned footer.
