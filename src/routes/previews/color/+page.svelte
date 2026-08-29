<script lang="ts">
	import { ColorPicker, presets } from '$lib/index.js';

	// Live readout of the three surface-ladder tokens the color preset remaps.
	let readout = $state({ surface: '', raised: '', panel: '', mode: '' });
	let tocOpen = $state(true);
	let accordionOpen = $state(true);
	let switchOn = $state(false);
	$effect(() => {
		presets.color; // track
		const cs = getComputedStyle(document.documentElement);
		readout = {
			surface: cs.getPropertyValue('--bg-surface').trim(),
			raised: cs.getPropertyValue('--bg-raised').trim(),
			panel: cs.getPropertyValue('--bg-panel').trim(),
			mode: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		};
	});
</script>

<div class="page-shell box wfull gap-sm">
	<header class="box gap-3xs">
		<p class="eyebrow">preview</p>
		<h1 class="text-xl weight-600">Color Presets</h1>
		<p>Clean | General | Vibrant — the surface ladder tint</p>
	</header>

	<!-- Sticky control: the picker never scrolls away from the specimens. -->
	<div class="card row ycenter gap-16 wrap sticky">
		<ColorPicker />
		<p class="text-sm">
			surface {readout.surface} · raised {readout.raised} · panel {readout.panel} · mode {readout.mode} · data-color = {presets.color}
		</p>
	</div>

	<div class="grid-2 gap-sm">
		<!-- the ladder itself — the three remapped tokens, directly -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">surface ladder · the 3 tokens</h3>
				<span class="badge mono text-xs">.surface · .raised · .panel</span>
			</div>
			<div class="box gap-3xs">
				<div class="surface row xbetween ycenter pad-xs"><span class="text-sm">.surface</span><span class="badge mono text-xs">--bg-surface</span></div>
				<div class="raised row xbetween ycenter pad-xs"><span class="text-sm">.raised</span><span class="badge mono text-xs">--bg-raised</span></div>
				<div class="panel row xbetween ycenter pad-xs"><span class="text-sm">.panel</span><span class="badge mono text-xs">--bg-panel</span></div>
			</div>
			<p class="text-xs text-muted">Clean flattens the ladder toward the page bg; vibrant deepens the separation.</p>
		</div>

		<!-- compositions reading the ladder -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">compositions</h3>
				<span class="badge mono text-xs">card · badge · kbd · switch</span>
			</div>
			<div class="row ycenter wrap gap-sm">
				<span class="badge">badge — raised</span>
				<kbd class="kbd">⌘K — raised</kbd>
				<button class="button ghost">ghost — hover raised</button>
				<button
					class="switch-track"
					role="switch"
					aria-checked={switchOn}
					aria-label="switch specimen"
					onclick={() => (switchOn = !switchOn)}
				>
					<span class="switch-thumb"></span>
				</button>
			</div>
			<div class="accordion">
				<div class="accordion-item" class:open={accordionOpen}>
					<button class="accordion-trigger" aria-expanded={accordionOpen} onclick={() => (accordionOpen = !accordionOpen)}>accordion — surface</button>
					<div class="accordion-content">
						<p class="text-sm">trigger hover reads raised</p>
					</div>
				</div>
			</div>
			<details class="mobile-toc" open={tocOpen} ontoggle={(e) => (tocOpen = (e.currentTarget as HTMLDetailsElement).open)}>
				<summary>mobile-toc — surface, open raised</summary>
			</details>
			<p class="text-xs text-muted">This card (.card) and the page header behind you ride --bg-surface.</p>
		</div>
	</div>

	<!-- stays — everything color presets never touch -->
	<div class="card row ycenter gap-16 wrap">
		<h3 class="text-sm weight-600">stays</h3>
		<span class="badge">ink · theme-color</span>
		<span class="badge">borders · shadows</span>
		<span class="badge">radius · spacing · motion</span>
	</div>
</div>
