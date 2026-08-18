---
title: Recipes & Patterns
description: Step-by-step practical component patterns with Svelte 5 runes and indented SASS.
---

# Recipes & Patterns

Practical, copy-pasteable components built with **Svelte 5 runes** and **fractalstyler2**.

---

## 1. Feature / Pricing Card

An anchored vertical card with category badge, feature checklist, and pinned button:

```svelte
<script lang="ts">
	interface Props {
		title: string;
		price: string;
		description: string;
		features: string[];
		popular?: boolean;
	}

	let { title, price, description, features, popular = false }: Props = $props();
</script>

<article class="card pad-m radius-6 box ybetween gap-m" data-elevated={popular ? true : undefined}>
	<div class="box gap-s">
		<header class="row ycenter xbetween">
			<span class="eyebrow text-xs" style="color: var(--theme-color)">{title}</span>
			{#if popular}
				<span class="badge" data-status="released">Popular</span>
			{/if}
		</header>

		<div class="box gap-3xs">
			<h3 class="text-2xl font-bold">{price}</h3>
			<p class="muted text-sm">{description}</p>
		</div>

		<ul class="box gap-2xs text-sm" style="list-style: none; padding: 0;">
			{#each features as feat}
				<li class="row ycenter gap-2xs">
					<span style="color: var(--theme-color)">✓</span>
					<span>{feat}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Pinned Footer Action -->
	<footer class="row wrap ycenter border-top">
		<button
			type="button"
			class="button text-sm wfull"
			class:primary={popular}
			class:ghost={!popular}
		>
			Get Started
		</button>
	</footer>
</article>
```

---

## 2. Accessible Native Dialog Modal

Leverages the top-layer native `<dialog>` with backdrop blur and token surfaces:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		title: string;
		children: Snippet;
	}

	let { open = $bindable(false), title, children }: Props = $props();
	let dialogEl = $state<HTMLDialogElement>();

	$effect(() => {
		if (open) dialogEl?.showModal();
		else dialogEl?.close();
	});
</script>

<dialog
	bind:this={dialogEl}
	class="dialog-modal"
	onclose={() => (open = false)}
>
	<div class="dialog-card">
		<header class="row ycenter xbetween">
			<h2 class="text-lg font-semibold">{title}</h2>
			<button type="button" class="is-icon" onclick={() => (open = false)} aria-label="Close">
				✕
			</button>
		</header>

		<div class="box gap-s">
			{@render children()}
		</div>

		<footer class="row ycenter xbetween pad-top-s border-top">
			<button type="button" class="button ghost sm" onclick={() => (open = false)}>Cancel</button>
			<button type="button" class="button primary sm" onclick={() => (open = false)}>Confirm</button>
		</footer>
	</div>
</dialog>
```

---

## 3. Filter & Search Toolbar

Combines search input, native select, and layout switchers with zero layout thrashing:

```svelte
<script lang="ts">
	let search = $state('');
	let category = $state('all');
	let view = $state<'grid' | 'list'>('grid');
</script>

<div class="panel pad-xs radius-6 row ycenter xbetween wrap gap-s">
	<!-- Search Box -->
	<div class="row ycenter gap-2xs grow min0" style="max-width: 320px;">
		<input
			type="text"
			bind:value={search}
			placeholder="Filter items..."
			class="input text-xs wfull"
		/>
	</div>

	<!-- Controls Cluster -->
	<div class="row ycenter gap-xs">
		<select bind:value={category} class="select text-xs">
			<option value="all">All Categories</option>
			<option value="core">Core UI</option>
			<option value="motion">Motion</option>
		</select>

		<div class="row ycenter gap-3xs panel pad-3xs radius-4">
			<button
				type="button"
				class="button ghost text-xs radius-4"
				data-active={view === 'grid' ? true : undefined}
				onclick={() => (view = 'grid')}
			>
				Grid
			</button>
			<button
				type="button"
				class="button ghost text-xs radius-4"
				data-active={view === 'list' ? true : undefined}
				onclick={() => (view = 'list')}
			>
				List
			</button>
		</div>
	</div>
</div>
```
