<script lang="ts">
	import { toggleMode } from '$lib/index.js';
</script>

<!--
	Notice how thin this markup is. Layout classes like .grid-3, .hero and
	blocks like .card are single semantic classes — their recipe lives in SASS
	(src/lib/components), composed from fractals. State rides on data-* attrs.
-->
<div class="app-shell">
	<header class="app-header">
		<strong>fractalstyler2</strong>
		<nav class="row gap-s" style="margin-inline-start:auto">
			<a class="button" data-variant="ghost" href="https://svelte.dev">Docs</a>
			<button class="button" data-variant="primary" onclick={() => toggleMode()}>
				Toggle mode
			</button>
		</nav>
	</header>

	<main class="app-main box gap-2xl" style="padding:var(--space-2xl) var(--space-l)">
		<!-- HERO: +cover + centered +stack -->
		<section class="hero" style="min-height:44vh">
			<div class="center">
				<h1 class="text-3xl">Fractals compose.</h1>
				<p class="text-md muted">
					Atoms into molecules into components into pages — the same move at every scale.
				</p>
				<div class="row gap-s">
					<button class="button" data-variant="primary">Primary</button>
					<button class="button" data-variant="ghost">Ghost</button>
				</div>
			</div>
		</section>

		<!-- RESPONSIVE 3-COL GRID: one line, +cols((base:1, sm:2, lg:3)) -->
		<section class="box gap-s">
			<p class="eyebrow">.grid-3 — responsive 1 → 2 → 3</p>
			<div class="grid-3">
				{#each ['Composable', 'Token-driven', 'Semantic', 'CUBE-native', 'SSR-safe', 'Tiny output'] as title, i}
					<article class="card" data-elevated={i === 1 ? '' : undefined}>
						<span class="badge">fractal</span>
						<h3 class="text-lg">{title}</h3>
						<p class="body muted">Built from <span class="kbd">+surface</span> and <span class="kbd">+stack</span>.</p>
					</article>
				{/each}
			</div>
		</section>

		<!-- AUTO GRID: fits as many columns as hold the min track, no breakpoints -->
		<section class="box gap-s">
			<p class="eyebrow">.card-grid — intrinsic auto-fit</p>
			<div class="card-grid">
				{#each Array(4) as _, i}
					<div class="panel">
						<h4 class="text-md">Panel {i + 1}</h4>
						<p class="body muted">+surface(raised)</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- BESPOKE COMPONENT authored purely from fractals in scoped SASS below -->
		<section class="box gap-s">
			<p class="eyebrow">.tag-row — authored from fractals (scoped)</p>
			<div class="tag-row">
				{#each ['grid', 'flex', 'stack', 'cluster', 'cover', 'reel', 'frame'] as t}
					<span class="tag">{t}</span>
				{/each}
			</div>
		</section>
	</main>

	<footer class="app-footer">
		<span class="body muted">Built with fractalstyler2 · the fractal model</span>
	</footer>
</div>

<style lang="sass">
	@use '../lib/fractals' as *

	// A component the system doesn't ship — composed straight from fractals.
	// No new tokens, no BEM, no utility soup in the markup.
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
			cursor: default
			&:hover
				transform: translateY(-2px)
</style>
