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
| **1. Tokens & Config** | Fluid Utopia scales & resolvers | `space(m)` → `var(--space-m)`, `radius(12)` → `var(--radius-12)` |
| **2. Atoms** | Single layout/styling decisions | `+box`, `+row`, `+gap(s)`, `+pad(m)`, `+border`, `+radius(12)`, `+bg(surface)`, `+ink(primary)` |
| **3. Molecules** | Compositions of atoms | `+stack(s)`, `+cluster(xs)`, `+surface(surface, s, 12)`, `+cover(80vh)`, `+frame(16/9)`, `+with-sidebar` |
| **4. Components & Layouts** | Recipes of molecules | `.card`, `.panel`, `.button`, `.badge` · `.grid-3`, `.card-grid`, `.hero`, `.holy-grail`, `.docs`, `.app-shell` |

---

## Golden Rules for Agents

1. **Never hardcode values that tokens cover**: Use `+gap(m)`, `+radius(12)`, `+bg(surface)` instead of arbitrary pixel values.
2. **Compose fractals; don't write raw CSS**: Raw CSS is strictly for unique lines that no fractal covers.
3. **State on `data-*` / `aria-*` attributes**: Never use modifier classes like `.is-active` or `.btn--primary`. Use `&[data-elevated]`, `&[data-variant='primary']`.
4. **Markup stays semantic**: Prefer `<article class="card">` over 20 nested utility classes.
5. **Mobile-first**: Define base layout first, grow with `+at(md/lg/xl)` and `+cols()`.

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
			<span class="badge" data-variant="theme">Popular</span>
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
		+surface(surface, m, 16)
		+stack(m)
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
