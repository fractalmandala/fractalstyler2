<script lang="ts">
	import type { Specimen } from './types.js'
	import { presetAttrs } from './specimen.svelte.js'
	// The real compiled stylesheet, as text. Vite runs it through sass, so this
	// is byte-for-byte what a consumer of the package gets.
	import fractalstyler from '$lib/styles/index.sass?inline'

	/**
	 * A stage whose *viewport* is adjustable, not just its width.
	 *
	 * Fractalstyler's grids and shells step on media queries, which answer to
	 * the real viewport — narrowing a div proves nothing. An iframe carries its
	 * own viewport, so the breakpoints in _04_layouts.sass and _05_shells.sass
	 * fire for real at the widths the docs name.
	 */
	interface Props {
		specimen: Specimen
		html: string
		height?: number
	}

	let { specimen, html, height = 320 }: Props = $props()

	const attrs = $derived(
		Object.entries(presetAttrs(specimen.presets))
			.map(([k, v]) => `${k}="${v}"`)
			.join(' ')
	)

	let avail = $state(0)
	const scale = $derived(avail ? Math.min(1, avail / specimen.viewport) : 1)
	const shownW = $derived(Math.round(specimen.viewport * scale))
	const shownH = $derived(Math.round(height * scale))

	const doc = $derived(
		`<!doctype html><html ${attrs}><head><meta charset="utf-8">` +
			`<style>${fractalstyler}</style>` +
			`<style>html,body{background:var(--bg);overflow-x:hidden}` +
			`body{padding:18px}</style></head><body>${html}</body></html>`
	)
</script>

<div class="wrap" bind:clientWidth={avail}>
	<div class="frame" style:width="{shownW}px" style:height="{shownH}px">
		<iframe
			title="Responsive stage"
			srcdoc={doc}
			scrolling="no"
			style:width="{specimen.viewport}px"
			style:height="{height}px"
			style:transform="scale({scale})"
		></iframe>
	</div>
	<span class="readout">
		<b>{specimen.viewport}px</b>
		{#if scale < 1}<i>shown at {Math.round(scale * 100)}%</i>{/if}
	</span>
</div>

<style lang="sass">
	.wrap
		width: 100%
		display: flex
		flex-direction: column
		align-items: center
		gap: 11px

	.frame
		max-width: 100%
		overflow: hidden
		border: 1px solid rgba(178, 188, 224, .16)
		box-shadow: 0 0 0 1px rgba(4, 5, 12, .8), 0 24px 70px rgba(0, 0, 0, .55), 0 0 90px rgba(154, 140, 224, .07)
		transition: width .16s ease, height .16s ease
		background: #04050C

	iframe
		border: 0
		display: block
		transform-origin: top left

	.readout
		font-family: var(--mono)
		font-size: 11px
		color: var(--faint)
		display: flex
		gap: 10px
		align-items: baseline
		b
			color: var(--gold)
			font-weight: 400
		i
			font-style: normal
			opacity: .7
</style>
