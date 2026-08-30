<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { Specimen } from './types.js'
	import { presetAttrs } from './specimen.svelte.js'

	/**
	 * The vitrine — a lit rectangle of real, compiled Fractalstyler against the
	 * void. Everything inside it is the actual system; everything outside is
	 * this deck's own chrome and touches no Fractalstyler token.
	 *
	 * The four preset axes are stamped HERE rather than on <html>, which the
	 * token file permits: every preset selector in _00_tokens.sass is a bare
	 * attribute selector, so it resolves on any element.
	 */
	interface Props {
		specimen: Specimen
		children: Snippet
		/** Give the stage room — for shells and grids rather than single cards. */
		tall?: boolean
		/** Constrain the stage to the simulated viewport width. */
		width?: number
		label?: string
	}

	let { specimen, children, tall = false, width, label }: Props = $props()
	const attrs = $derived(presetAttrs(specimen.presets))
</script>

<div class="vitrine" class:tall>
	<div class="glass" {...attrs} style:--stage-w={width ? `${width}px` : '100%'}>
		<div class="stage">
			{@render children()}
		</div>
	</div>
	{#if label}<span class="vitrine-label">{label}</span>{/if}
</div>

<style lang="sass">
	.vitrine
		position: relative
		width: 100%
		display: flex
		flex-direction: column
		align-items: center

	.glass
		width: 100%
		max-width: 100%
		border: 1px solid rgba(178, 188, 224, .16)
		box-shadow: 0 0 0 1px rgba(4, 5, 12, .8), 0 24px 70px rgba(0, 0, 0, .55), 0 0 90px rgba(154, 140, 224, .07)
		overflow: hidden
		// The only place in the deck where a Fractalstyler token is read.
		background: var(--bg)
		display: flex
		justify-content: center

	.stage
		width: var(--stage-w, 100%)
		max-width: 100%
		padding: 26px
		transition: width .18s ease
		display: flex
		flex-direction: column
		justify-content: center

	.tall .stage
		min-height: 268px

	.vitrine-label
		margin-top: 12px
		font-size: 9.5px
		letter-spacing: .3em
		text-transform: uppercase
		color: var(--faint)
</style>
