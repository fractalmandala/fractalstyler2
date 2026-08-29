<script lang="ts">
	import { ShapePicker, presets } from '$lib/index.js';

	// Live readout of the three radius channels the shape preset remaps.
	let channels = $state({ sm: '', md: '', lg: '' });
	let dialogOpen = $state(false);
	let popoverOpen = $state(false);
	let accordionOpen = $state(true);
	$effect(() => {
		presets.shape; // track
		const cs = getComputedStyle(document.documentElement);
		channels = {
			sm: cs.getPropertyValue('--radius-sm').trim(),
			md: cs.getPropertyValue('--radius-md').trim(),
			lg: cs.getPropertyValue('--radius-lg').trim()
		};
	});
</script>

<div class="page-shell box wfull gap-sm">
	<header class="box gap-3xs">
		<p class="eyebrow">preview</p>
		<h1 class="text-xl weight-600">Shape Presets</h1>
		<p>Round | Curved | Pro | Sharp</p>
	</header>

	<!-- Sticky control: the picker never scrolls away from the specimens. -->
	<div class="card row ycenter gap-16 wrap sticky">
		<ShapePicker />
		<p class="text-sm">
			--radius-sm {channels.sm} · md {channels.md} · lg {channels.lg} · data-shape = {presets.shape}
		</p>
	</div>

	<div class="grid-2 gap-sm">
		<!-- sm — the six small-corner movers -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">sm · --radius-sm</h3>
				<span class="badge mono text-xs">6 movers</span>
			</div>
			<div class="row gap-8 wrap ycenter">
				<button class="button primary">primary</button>
				<button class="button ghost">ghost</button>
				<button class="button is-icon" aria-label="icon button specimen">✳</button>
				<span class="badge">badge</span>
				<kbd class="kbd">⌘K</kbd>
			</div>
			<div class="field">
				<input class="input" placeholder="input" aria-label="input specimen" />
			</div>
			<div class="field">
				<select class="select" aria-label="select specimen">
					<option>select</option>
				</select>
			</div>
			<div class="box gap-3xs">
				<a class="navtree-link" href="/previews/shape">navtree-link</a>
				<a class="navtree-link active" href="/previews/shape">navtree-link active</a>
			</div>
		</div>

		<!-- md — the four mid-corner movers (the card itself is one) -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">md · --radius-md</h3>
				<span class="badge mono text-xs">4 movers</span>
			</div>
			<p class="text-xs text-muted">This card is itself a mover (.card).</p>
			<div class="box relative">
				<button class="button ghost" aria-expanded={popoverOpen} onclick={() => (popoverOpen = !popoverOpen)}>anchor</button>
				<div class="popover" class:open={popoverOpen}>
					<p class="text-sm">popover</p>
				</div>
			</div>
			<div class="accordion">
				<div class="accordion-item" class:open={accordionOpen}>
					<button class="accordion-trigger" aria-expanded={accordionOpen} onclick={() => (accordionOpen = !accordionOpen)}>accordion-item</button>
					<div class="accordion-content">
						<p class="text-sm">content</p>
					</div>
				</div>
			</div>
			<details class="mobile-toc" open>
				<summary>mobile-toc</summary>
			</details>
		</div>
	</div>

	<!-- lg — the one large-corner mover -->
	<div class="card row ycenter gap-16 wrap">
		<h3 class="text-sm weight-600">lg · --radius-lg</h3>
		<button class="button primary" onclick={() => (dialogOpen = true)}>Open dialog</button>
		<span class="badge mono text-xs">1 mover — its corner shows on open</span>
	</div>
</div>

<div class="dialog" class:open={dialogOpen} role="dialog" aria-modal="true" aria-label="Dialog lg proof">
	<div class="row xbetween ycenter">
		<p class="text-md weight-600">Dialog — --radius-lg</p>
		<button class="button ghost is-icon" aria-label="Close dialog" onclick={() => (dialogOpen = false)}>✕</button>
	</div>
	<p class="text-sm text-muted">
		lg channel: 32 / 24 / 16 / 0 across round / curved / pro / sharp.
	</p>
</div>
