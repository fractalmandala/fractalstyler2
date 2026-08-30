---
name: fractal-styler
description: Design, compose, and build UI components and page layouts using the fractalstyler2 SASS mixin system and fluid design tokens in SvelteKit. Use when authoring components, applying design tokens, styling layouts, or compiling fractal recipes.
---

# Fractal Styler (fractalstyler2)

`fractalstyler2` is a fractal-composition styling system for SvelteKit and modern web applications. Every styling decision is a reusable SASS mixin ("a fractal"), and components and layouts are clean recipes composed of smaller fractals.

---

## The Four Tiers of Composition

| Tier | Role | Examples |
| :--- | :--- | :--- |
| **1. Tokens & Config** | Fluid Utopia scales & resolvers | `space(md)` → `var(--space-md)`, `radius(12)` → `var(--radius-12)` |
| **2. Atoms** | Single layout/styling decisions | `+box`, `+row`, `+gap(sm)`, `+pad(md)`, `+border`, `+radius(12)`, `+bg(surface)`, `+ink(primary)` |
| **3. Molecules** | Compositions of atoms | `+stack(sm)`, `+cluster(xs)`, `+surface(surface, sm, 12)`, `+cover(80vh)`, `+frame(16/9)`, `+with-sidebar` |
| **4. Components & Layouts** | Recipes of molecules | `.card`, `.panel`, `.button`, `.badge` · `.grid-3`, `.card-grid`, `.hero`, `.holy-grail`, `.docs`, `.app-shell` |

---

## Golden Rules for Agents

1. **Check the Zero-SASS Cookbook First**: Before declaring new custom classes in `_08_own.sass` or writing custom CSS, check `docs/13-cookbook.md`. Segmented controls (`.row.ycenter.shrink-0.pad-2.raised.border`), tab strips (`.tab-list.reel`), search bars, metrics, and modals can all be composed in HTML with 0 lines of custom CSS.
2. **Never hardcode values that tokens cover**: Use `.gap-sm` / `+gap(sm)`, `.surface` / `.raised` instead of arbitrary pixel values or foreign hex colors.
3. **Compose fractals; don't write raw CSS**: Raw CSS is strictly for unique lines that no fractal covers.
4. **Visual toggles ride classes; semantics stay native**: `.open` / `.active` / `.elevated` for JS-toggled looks; `[disabled]`, `[aria-expanded]`, `:focus-visible` keep their native meaning.
5. **Markup stays semantic**: Prefer clean tags (`<article class="card">`) over utility class soup.
6. **Mobile-first**: Define base layout first, grow with `+at(md/lg/xl)` and `+cols()`.

---

## How to Author a Svelte 5 Component

```svelte
<script lang="ts">
	let {
		title = 'Pricing Tier',
		price = '$29',
		highlighted = false,
		children
	} = $props();
</script>

<article class="pricing-card" data-highlighted={highlighted || undefined}>
	<div class="row ycenter xbetween">
		<h3 class="text-xl">{title}</h3>
		{#if highlighted}
			<span class="badge">Popular</span>
		{/if}
	</div>
	<div class="row ycenter gap-2xs">
		<span class="text-4xl font-bold">{price}</span>
		<span class="muted">/month</span>
	</div>
	{#if children}
		{@render children()}
	{/if}
</article>

<style lang="sass">
	@use '$lib/styles/fractals' as *

	.pricing-card
		+surface(surface, md, 16)
		+stack(md)
		transition: transform 150ms ease, box-shadow 150ms ease

		&[data-highlighted]
			+border(all, var(--theme))
			+shadow(lg)
</style>
```

---

## MCP Tools Integration

If the host environment connects to the `fractalstyler2` MCP server, use the available tools:
* `get_design_tokens`: Query available space, typography, and radius steps.
* `compile_fractals`: Compile SASS mixin recipes to verify CSS output.
* `snap_to_tokens`: Snap canvas pixel values to tokens.
* `validate_recipe`: Lint SASS/Svelte against the golden rules.
