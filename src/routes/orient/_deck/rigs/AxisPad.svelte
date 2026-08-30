<script lang="ts">
	import type { Specimen } from '../types.js'
	import Vitrine from '../Vitrine.svelte'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	/* Only the alignments the registry actually defines for each container.
	   Read from _03_containers.sass — .box has no x-distribution, .row has no
	   y-distribution. The pad greys out what does not exist rather than
	   pretending it does. */
	const X = ['xleft', 'xcenter', 'xright', 'xbetween'] as const
	const Y = ['ytop', 'ycenter', 'ybot', 'ybetween'] as const

	const BOX_X = new Set(['xleft', 'xcenter', 'xright'])
	const ROW_Y = new Set(['ytop', 'ycenter', 'ybot'])

	const availX = $derived(
		specimen.axis === 'box' ? (c: string) => BOX_X.has(c) : (_c: string) => true
	)
	const availY = $derived(
		specimen.axis === 'row' ? (c: string) => ROW_Y.has(c) : (_c: string) => true
	)

	/* What the same intent costs elsewhere. The point of the screen: these two
	   swap places when the container flips; the fractalstyler names do not. */
	const NATIVE: Record<string, string> = {
		xleft: 'flex-start',
		xcenter: 'center',
		xright: 'flex-end',
		xbetween: 'space-between',
		ytop: 'flex-start',
		ycenter: 'center',
		ybot: 'flex-end',
		ybetween: 'space-between'
	}

	const xProp = $derived(specimen.axis === 'row' ? 'justify-content' : 'align-items')
	const yProp = $derived(specimen.axis === 'row' ? 'align-items' : 'justify-content')

	function flip(): void {
		specimen.axis = specimen.axis === 'row' ? 'box' : 'row'
		if (!availX(specimen.alignX)) specimen.alignX = 'xcenter'
		if (!availY(specimen.alignY)) specimen.alignY = 'ycenter'
	}
</script>

<Vitrine {specimen} tall>
	<div
		class="{specimen.axis} gap-{specimen.gap} pad-{specimen.pad} {specimen.alignY} {specimen.alignX} surface border h-200 wfull"
	>
		<span class="badge">one</span>
		<span class="badge">two</span>
		<span class="badge">three</span>
	</div>
</Vitrine>

<div class="controls">
	<div class="flipper">
		<button class:on={specimen.axis === 'box'} onclick={() => specimen.axis !== 'box' && flip()}>
			.box
		</button>
		<button class:on={specimen.axis === 'row'} onclick={() => specimen.axis !== 'row' && flip()}>
			.row
		</button>
	</div>

	<div class="pads">
		<div class="pad">
			<span class="pad-label">horizontal · always x</span>
			{#each X as c}
				<button
					class="cell"
					class:on={specimen.alignX === c}
					disabled={!availX(c)}
					onclick={() => (specimen.alignX = c)}
				>
					.{c}
				</button>
			{/each}
		</div>
		<div class="pad">
			<span class="pad-label">vertical · always y</span>
			{#each Y as c}
				<button
					class="cell"
					class:on={specimen.alignY === c}
					disabled={!availY(c)}
					onclick={() => (specimen.alignY = c)}
				>
					.{c}
				</button>
			{/each}
		</div>
	</div>

	<div class="ghost">
		<span class="ghost-label">what you would otherwise be tracking</span>
		<code>{xProp}: {NATIVE[specimen.alignX]}</code>
		<code>{yProp}: {NATIVE[specimen.alignY]}</code>
		<p>Flip the container. Those two property names trade places. Yours did not move.</p>
	</div>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 22px
		margin-top: 26px
		width: 100%

	.flipper
		display: flex
		gap: 1px
		align-self: flex-start
		border: 1px solid var(--line)
		button
			background: none
			border: 0
			padding: 8px 22px
			cursor: pointer
			color: var(--dim)
			font-family: var(--mono)
			font-size: 12px
			letter-spacing: .06em
			transition: color .3s, background .3s
			&:hover
				color: var(--silver)
			&.on
				color: var(--void)
				background: var(--gold)

	.pads
		display: grid
		grid-template-columns: 1fr 1fr
		gap: 18px

	.pad
		display: flex
		flex-direction: column
		gap: 5px

	.pad-label
		font-size: 9.5px
		letter-spacing: .26em
		text-transform: uppercase
		color: var(--faint)
		margin-bottom: 5px

	.cell
		background: none
		border: 1px solid transparent
		border-left: 1px solid var(--line)
		padding: 6px 11px
		text-align: left
		cursor: pointer
		color: var(--dim)
		font-family: var(--mono)
		font-size: 11.5px
		transition: .25s
		&:hover:not(:disabled)
			color: var(--silver)
			border-left-color: var(--violet)
		&.on
			color: var(--gold)
			border-left-color: var(--gold)
		&:disabled
			opacity: .2
			cursor: default
			text-decoration: line-through

	.ghost
		border-top: 1px solid var(--line)
		padding-top: 16px
		display: flex
		flex-direction: column
		gap: 4px
		code
			font-family: var(--mono)
			font-size: 11.5px
			color: #7A5F8E
		p
			margin: 8px 0 0
			font-size: 12px
			color: var(--faint)
			max-width: 44ch

	.ghost-label
		font-size: 9.5px
		letter-spacing: .26em
		text-transform: uppercase
		color: var(--faint)
		margin-bottom: 6px
</style>
