<script lang="ts">
	import { MotionPicker, presets } from '$lib/index.js';

	// Live readout of the duration channels + the easing the motion preset remaps.
	let readout = $state({ fast: '', base: '', slow: '', ease: '' });
	let accordionOpen = $state(true);
	let popoverOpen = $state(false);
	let dialogOpen = $state(false);
	let switchOn = $state(false);
	$effect(() => {
		presets.motion; // track
		const cs = getComputedStyle(document.documentElement);
		readout = {
			fast: cs.getPropertyValue('--motion-fast').trim(),
			base: cs.getPropertyValue('--motion-base').trim(),
			slow: cs.getPropertyValue('--motion-slow').trim(),
			ease: cs.getPropertyValue('--ease-out').trim()
		};
	});
</script>

<div class="page-shell box wfull gap-sm">
	<header class="box gap-3xs">
		<p class="eyebrow">preview</p>
		<h1 class="text-xl weight-600">Motion Presets</h1>
		<p>Reduced | Heavy | Active | Springy — durations and easing</p>
	</header>

	<!-- Sticky control: the picker never scrolls away from the specimens. -->
	<div class="card row ycenter gap-16 wrap sticky">
		<MotionPicker />
		<p class="text-sm">
			fast {readout.fast} · base {readout.base} · slow {readout.slow} · ease-out {readout.ease} · data-motion = {presets.motion}
		</p>
	</div>

	<div class="grid-2 gap-sm">
		<!-- fast channel — hover/tap feedback -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">fast · --motion-fast</h3>
				<span class="badge mono text-xs">button · switch · links · tabs</span>
			</div>
			<div class="row ycenter wrap gap-sm">
				<button class="button primary">button — hover</button>
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
			<div class="box gap-3xs">
				<a class="navtree-link" href="/previews/motion">navtree-link — hover</a>
				<a class="toc-link" href="/previews/motion">toc-link — hover</a>
			</div>
			<div class="tab-list">
				<button class="tab-trigger active">tab — hover</button>
				<button class="tab-trigger">tab</button>
			</div>
		</div>

		<!-- base channel + easing — overlays and disclosure -->
		<div class="card box gap-sm">
			<div class="row xbetween ycenter wrap gap-8">
				<h3 class="text-sm weight-600">base + ease-out</h3>
				<span class="badge mono text-xs">accordion · popover · dialog</span>
			</div>
			<div class="accordion">
				<div class="accordion-item" class:open={accordionOpen}>
					<button class="accordion-trigger" aria-expanded={accordionOpen} onclick={() => (accordionOpen = !accordionOpen)}>accordion — toggle</button>
					<div class="accordion-content">
						<p class="text-sm">grid-rows transition rides base + ease-out</p>
					</div>
				</div>
			</div>
			<div class="box relative">
				<button class="button ghost" aria-expanded={popoverOpen} onclick={() => (popoverOpen = !popoverOpen)}>popover — toggle</button>
				<div class="popover" class:open={popoverOpen}>
					<p class="text-sm">fade + translate ride fast + ease-out</p>
				</div>
			</div>
			<button class="button primary" onclick={() => (dialogOpen = true)}>dialog — open</button>
		</div>
	</div>

	<!-- stays -->
	<div class="card row ycenter gap-16 wrap">
		<h3 class="text-sm weight-600">stays</h3>
		<span class="badge">prefers-reduced-motion still zeroes all durations</span>
		<span class="badge">spacing · radius · color</span>
	</div>
</div>

<div class="dialog" class:open={dialogOpen} role="dialog" aria-modal="true" aria-label="Dialog motion proof">
	<div class="row xbetween ycenter">
		<p class="text-md weight-600">Dialog — base + ease-out</p>
		<button class="button ghost is-icon" aria-label="Close dialog" onclick={() => (dialogOpen = false)}>✕</button>
	</div>
	<p class="text-sm text-muted">
		Opacity, visibility, and translate ride --motion-base and --ease-out: heavy lingers, springy overshoots, reduced snaps.
	</p>
</div>
