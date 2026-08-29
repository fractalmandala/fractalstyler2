<script lang="ts">
	import { LayoutPicker, presets } from '$lib/index.js';

	// Live readout: both factors + real measurements. Gaps and pads scale at
	// different rates (breathing); button height never moves (sizes stay).
	let readout = $state({ gapScale: '', padScale: '', gapPx: '', padPx: '', buttonH: '' });
	let accordionOpen = $state(true);
	$effect(() => {
		presets.layout; // track
		const cs = getComputedStyle(document.documentElement);
		const gapProbe = document.querySelector('.gap-probe');
		const padProbe = document.querySelector('.pad-probe');
		const button = document.querySelector('.h-probe');
		const f = (v: string) => (v.trim() === '' ? '1 (absent)' : v.trim());
		readout = {
			gapScale: f(cs.getPropertyValue('--gap-scale')),
			padScale: f(cs.getPropertyValue('--pad-scale')),
			gapPx: gapProbe ? getComputedStyle(gapProbe).rowGap : '',
			padPx: padProbe ? getComputedStyle(padProbe).padding : '',
			buttonH: button ? getComputedStyle(button).height : ''
		};
	});
</script>

<div class="page-shell box wfull gap-sm">
	<header class="box gap-3xs">
		<p class="eyebrow">preview</p>
		<h1 class="text-xl weight-600">Layout Presets</h1>
		<p>Tight | Comfortable | Sprawling — gaps × --gap-scale, pads × --pad-scale, sizes never move</p>
	</header>

	<!-- Sticky control: the picker never scrolls away from the specimens. -->
	<div class="card row ycenter gap-16 wrap sticky">
		<LayoutPicker />
		<p class="text-sm">
			gap × {readout.gapScale} · pad × {readout.padScale} · .gap-sm = {readout.gapPx} · .pad-sm = {readout.padPx} · button h = {readout.buttonH} (stays)
		</p>
	</div>

	<div class="grid-2 gap-sm">
		<!-- gap movers — separation between items -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">gaps · × --gap-scale</h3>
				<span class="badge mono text-xs">.gap-sm · .accordion · .tab-list</span>
			</div>
			<div class="row gap-probe ycenter wrap gap-sm">
				<button class="button primary h-probe">primary</button>
				<button class="button ghost">ghost</button>
				<span class="badge">badge</span>
			</div>
			<div class="accordion">
				<div class="accordion-item" class:open={accordionOpen}>
					<button class="accordion-trigger" aria-expanded={accordionOpen} onclick={() => (accordionOpen = !accordionOpen)}>accordion</button>
					<div class="accordion-content">
						<p class="text-sm">content — its open pad rides --pad-scale</p>
					</div>
				</div>
			</div>
			<div class="tab-list">
				<button class="tab-trigger active">tab</button>
				<button class="tab-trigger">tab</button>
			</div>
		</div>

		<!-- pad movers — the container's breathing -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">pads · × --pad-scale</h3>
				<span class="badge mono text-xs">.pad-sm · .card · .input · .select</span>
			</div>
			<div class="box pad-probe pad-sm">
				<span class="badge">.pad-sm — breathing probe</span>
			</div>
			<div class="field">
				<input class="input" placeholder="input" aria-label="input specimen" />
			</div>
			<div class="field">
				<select class="select" aria-label="select specimen">
					<option>select</option>
				</select>
			</div>
			<p class="text-xs text-muted">This card is itself a pad mover (.card padding).</p>
		</div>
	</div>

	<!-- stays — sizes and literals never move -->
	<div class="card row ycenter gap-16 wrap">
		<h3 class="text-sm weight-600">stays</h3>
		<span class="badge">.button h = {readout.buttonH}</span>
		<span class="badge">.gap-8 = 8px literal</span>
		<span class="badge mono text-xs">heights · widths · px literals</span>
	</div>
</div>
