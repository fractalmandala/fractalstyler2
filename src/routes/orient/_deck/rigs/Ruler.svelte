<script lang="ts">
	import type { Specimen } from '../types.js'

	/**
	 * The viewport ruler. Appears three times across the deck — on L0 driving
	 * token clamps, on L3 driving grid stepping, on L4 driving shell retraction.
	 * The same instrument at three scales.
	 *
	 * 360 → 1240 is not arbitrary: it is the interpolation band the Utopia
	 * scales in _00_tokens.sass were generated against.
	 */
	let { specimen = $bindable(), marks = [] }: { specimen: Specimen; marks?: number[] } = $props()

	const MIN = 320
	const MAX = 1440

	const pct = (w: number): number => ((w - MIN) / (MAX - MIN)) * 100
</script>

<div class="ruler">
	<div class="head">
		<span>Viewport</span>
		<label>
			<input
				type="number"
				min={MIN}
				max={MAX}
				step="10"
				bind:value={specimen.viewport}
				aria-label="Viewport width in pixels"
			/><span class="unit">px</span>
		</label>
	</div>

	<div class="track">
		{#each marks as m}
			<span class="mark" class:live={specimen.viewport >= m} style:left="{pct(m)}%">
				<i>{m}</i>
			</span>
		{/each}
		<input
			type="range"
			min={MIN}
			max={MAX}
			step="1"
			bind:value={specimen.viewport}
			aria-label="Viewport width"
		/>
	</div>

	<div class="ends"><span>{MIN}</span><span>{MAX}</span></div>
</div>

<style lang="sass">
	.ruler
		display: flex
		flex-direction: column
		gap: 9px
		width: 100%

	.head
		display: flex
		justify-content: space-between
		align-items: baseline
		span
			font-size: 10px
			letter-spacing: .28em
			text-transform: uppercase
			color: var(--faint)

	label
		display: flex
		align-items: baseline
		gap: 3px

	input[type="number"]
		width: 62px
		background: none
		border: 0
		border-bottom: 1px solid var(--line)
		color: var(--gold)
		font-family: var(--display)
		font-size: 17px
		text-align: right
		padding: 0 0 2px
		&:focus-visible
			outline: 0
			border-bottom-color: var(--gold)

	.unit
		font-size: 10px
		color: var(--faint)
		letter-spacing: .1em

	.track
		position: relative
		padding-top: 16px

	.mark
		position: absolute
		top: 0
		width: 1px
		height: 22px
		background: var(--line)
		transition: background .3s
		i
			position: absolute
			top: -4px
			left: 4px
			font-style: normal
			font-family: var(--mono)
			font-size: 9px
			color: var(--faint)
			transition: color .3s
		&.live
			background: rgba(232, 188, 133, .45)
			i
				color: var(--gold)

	.ends
		display: flex
		justify-content: space-between
		font-family: var(--mono)
		font-size: 9.5px
		color: var(--faint)
		opacity: .6

	input[type="range"]
		appearance: none
		-webkit-appearance: none
		width: 100%
		height: 20px
		background: none
		cursor: pointer
		margin: 0
		position: relative
		&::-webkit-slider-runnable-track
			height: 1px
			background: var(--line)
		&::-moz-range-track
			height: 1px
			background: var(--line)
		&::-webkit-slider-thumb
			-webkit-appearance: none
			width: 9px
			height: 9px
			border-radius: 50%
			background: var(--gold)
			margin-top: -4px
			box-shadow: 0 0 0 5px rgba(232, 188, 133, .13)
		&::-moz-range-thumb
			width: 9px
			height: 9px
			border: 0
			border-radius: 50%
			background: var(--gold)
			box-shadow: 0 0 0 5px rgba(232, 188, 133, .13)
		&:focus-visible
			outline: 1px solid var(--violet)
			outline-offset: 8px
</style>
