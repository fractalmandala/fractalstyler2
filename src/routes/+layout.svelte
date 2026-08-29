<script lang="ts">
	// Emit the full fractalstyler2 stylesheet once, globally.
	// This in-repo demo imports the SOURCE via $lib. A consumer of the published
	// package uses `import 'fractalstyler2/styles'` instead (that resolves to
	// dist/, which only exists after `pnpm run prepack`).
	import '$lib/styles/index.sass';
	import { onMount } from 'svelte';
	import { getPresetScript, initPresets } from '$lib/presets.svelte.js';
	let { children } = $props();

	onMount(() => initPresets());
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script>${getPresetScript()}<\/script>`}
</svelte:head>

<div class="app-shell">
	<header class="app-header row xbetween">
		<a href="/">fractalstyler previews</a>
		<nav class="row gap-16 ycenter">
			<a class="link" href="/previews/containers">containers</a>
			<a class="link" href="/previews/layouts">layouts</a>
			<a class="link" href="/previews/shells">shells</a>
			<a class="link" href="/previews/shape">shape</a>
			<a class="link" href="/previews/layout">layout</a>
			<a class="link" href="/previews/color">color</a>
			<a class="link" href="/previews/motion">motion</a>
		</nav>
	</header>
	<main class="app-main">
		<aside class="sidebar-left">
			<nav class="navtree">
				<div class="navtree-title">presets</div>
				<a class="navtree-link" href="/previews/shape">shape — radius</a>
				<a class="navtree-link" href="/previews/layout">layout — density</a>
				<a class="navtree-link" href="/previews/color">color — tint</a>
				<a class="navtree-link" href="/previews/motion">motion — energy</a>
				<div class="navtree-title">vocabulary</div>
				<a class="navtree-link" href="/previews/containers">containers</a>
				<a class="navtree-link" href="/previews/markups">markups</a>
			</nav>
		</aside>
		<section class="main-section">
			{@render children()}
		</section>
		<aside class="sidebar-right">
			<nav class="toc">
				<div class="toc-title">on this site</div>
				<ul class="toc-list">
					<li><a class="toc-link" href="/previews/shape">shape presets</a></li>
					<li><a class="toc-link" href="/previews/layout">layout presets</a></li>
					<li><a class="toc-link" href="/previews/color">color presets</a></li>
					<li><a class="toc-link" href="/previews/motion">motion presets</a></li>
					<li><a class="toc-link" href="/previews/containers">containers</a></li>
					<li><a class="toc-link" href="/previews/markups">markups</a></li>
				</ul>
				<div class="toc-footer">fractalstyler2</div>
			</nav>
		</aside>
	</main>
	<footer class="app-footer">footer</footer>
</div>
