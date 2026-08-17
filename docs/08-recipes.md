---
title: Recipes
description: Complete worked builds — responsive grid, hero, docs page, dashboard, and a bespoke component.
---

# Recipes

Copy-paste starting points. Each shows the markup and, where relevant, the SASS
recipe behind it.

## Responsive 3-column grid

Markup only — `.grid-3` ships with the package:

```svelte
<section class="grid-3">
	{#each items as item}
		<article class="card"><h3 class="text-lg">{item.title}</h3></article>
	{/each}
</section>
```

Rolling your own column rhythm (e.g. 1 → 2 → 4):

```sass
.gallery
	+cols((base: 1, sm: 2, lg: 4), s)
```

## Hero section

```svelte
<section class="hero">
	<div class="center">
		<h1 class="text-4xl">Ship faster.</h1>
		<p class="body muted">One vocabulary from atoms to pages.</p>
		<div class="row gap-s">
			<a class="button" data-variant="primary" href="/start">Start</a>
			<a class="button" data-variant="ghost" href="/docs">Docs</a>
		</div>
	</div>
</section>
```

## Docs page

```svelte
<div class="docs">
	<nav class="docs-nav">
		<a class="body" href="/a">Section A</a>
		<a class="body" href="/b">Section B</a>
	</nav>
	<main class="docs-main">
		<h1 class="text-3xl">Page title</h1>
		<p class="body">Reading column, constrained to a comfortable measure.</p>
	</main>
	<aside class="docs-toc">
		<p class="eyebrow">On this page</p>
		<a class="body muted" href="#intro">Intro</a>
	</aside>
</div>
```

## Dashboard shell with stat cards

```svelte
<div class="app-shell">
	<header class="app-header">
		<strong>Dashboard</strong>
		<div class="row gap-s" style="margin-inline-start:auto">
			<span class="badge">live</span>
			<button class="button" data-variant="ghost">Settings</button>
		</div>
	</header>
	<main class="app-main box gap-l" style="padding:var(--space-l)">
		<div class="card-grid">
			<div class="panel stat"><p class="eyebrow">Revenue</p><p class="text-2xl">$48k</p></div>
			<div class="panel stat"><p class="eyebrow">Users</p><p class="text-2xl">12.3k</p></div>
			<div class="panel stat"><p class="eyebrow">Churn</p><p class="text-2xl">1.2%</p></div>
		</div>
	</main>
</div>
```

Optional bespoke `.stat` recipe (scoped or in `_blocks.sass`):

```sass
@use 'fractalstyler2/fractals' as *

.stat
	+stack(3xs)
	+ink(primary)
```

## Bespoke component — a tag row

Authored entirely from fractals, no shipped class:

```svelte
<div class="tag-row">
	{#each tags as t}<span class="tag">{t}</span>{/each}
</div>

<style lang="sass">
	@use 'fractalstyler2/fractals' as *

	.tag-row
		+cluster(2xs)
		.tag
			+row(center, center)
			+px(s)
			+py(3xs)
			+radius(full)
			+bg(raised)
			+ink(secondary)
			+type(sm)
			+border
			+transition(transform)
			&:hover
				transform: translateY(-2px)
</style>
```

## Media card with fixed aspect ratio

```svelte
<article class="card">
	<div class="media"><img src={src} alt="" /></div>
	<h3 class="text-lg">{title}</h3>
</article>

<style lang="sass">
	@use 'fractalstyler2/fractals' as *

	.media
		+frame(16 / 9)
		+radius(8)
</style>
```

For the model behind these, return to [Philosophy](01-philosophy.md); for every
mixin, [Fractals reference](04-fractals-reference.md).
