<script lang="ts">
	import type { Specimen } from '../types.js'
	import ViewportStage from '../ViewportStage.svelte'
	import Ruler from './Ruler.svelte'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	/* The stepping table, verbatim from _04_layouts.sass / docs 07 §1. */
	const STEPS: Record<number, [number, number][]> = {
		// [min-width, columns] — read downward, first match from the widest
		3: [
			[1024, 3],
			[0, 1]
		],
		4: [
			[1024, 4],
			[640, 2],
			[0, 1]
		],
		6: [
			[1024, 6],
			[768, 3],
			[640, 2],
			[0, 1]
		]
	}

	const cols = $derived(
		(STEPS[specimen.count].find(([w]) => specimen.viewport >= w) ?? [0, 1])[1]
	)

	/* What auto-fit lands on at this width, given --card-min: 16rem = 256px. */
	const CARD_MIN = 256
	const autoCols = $derived(
		Math.max(1, Math.min(specimen.count, Math.floor((specimen.viewport - 36) / CARD_MIN)))
	)
	const stranded = $derived(specimen.count % autoCols)

	const cards = (n: number, tag: string): string =>
		Array.from(
			{ length: n },
			(_, i) =>
				`<div class="card surface border pad-sm text-xs text-secondary">${tag}${i + 1}</div>`
		).join('')

	/* Two labelled grids stacked. Rows change with the width, so the stage
	   height has to follow or the stranded row is cropped out of frame. */
	const CARD_H = 62
	const stageHeight = $derived(
		78 +
			Math.ceil(specimen.count / cols) * (CARD_H + 18) +
			Math.ceil(specimen.count / autoCols) * (CARD_H + 18)
	)

	const html = $derived(
		`<div class="box gap-md">` +
			`<span class="eyebrow text-muted">.grid-${specimen.count} · harmonic</span>` +
			`<div class="grid-${specimen.count} gap-sm">${cards(specimen.count, '')}</div>` +
			`<span class="eyebrow text-muted">.card-grid · intrinsic</span>` +
			`<div class="card-grid gap-sm">${cards(specimen.count, '')}</div>` +
			`</div>`
	)
</script>

<ViewportStage {specimen} {html} height={stageHeight} />

<div class="controls">
	<Ruler bind:specimen marks={[640, 768, 1024, 1280]} />

	<div class="counts">
		<span class="label">Item count</span>
		{#each [3, 4, 6] as n}
			<button class:on={specimen.count === n} onclick={() => (specimen.count = n as 3 | 4 | 6)}>
				{n}
			</button>
		{/each}
	</div>

	<div class="readouts">
		<div class="row-out">
			<b>.grid-{specimen.count}</b>
			<span>{cols} {cols === 1 ? 'column' : 'columns'}</span>
			<i>{specimen.count} ÷ {cols} = {specimen.count / cols} — clean</i>
		</div>
		<div class="row-out" class:warn={stranded > 0}>
			<b>.card-grid</b>
			<span>{autoCols} {autoCols === 1 ? 'column' : 'columns'}</span>
			<i>
				{#if stranded > 0}
					{stranded} left over on the last row
				{:else}
					no remainder at this width
				{/if}
			</i>
		</div>
	</div>

	<p class="note">
		Neither is wrong. <b>.grid-{specimen.count}</b> is for a count you know at authoring time and
		steps only through divisors. <b>.card-grid</b> is for a count you do not — a query result, a
		feed — and fits as many as the width allows.
	</p>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 22px
		margin-top: 26px
		width: 100%

	.counts
		display: flex
		align-items: center
		gap: 8px
		.label
			font-size: 10px
			letter-spacing: .28em
			text-transform: uppercase
			color: var(--faint)
			margin-right: 8px
		button
			background: none
			border: 1px solid var(--line)
			width: 34px
			height: 30px
			cursor: pointer
			color: var(--dim)
			font-family: var(--mono)
			font-size: 12px
			transition: .25s
			&:hover
				color: var(--silver)
			&.on
				color: var(--void)
				background: var(--gold)
				border-color: var(--gold)

	.readouts
		display: flex
		flex-direction: column
		gap: 10px
		border-top: 1px solid var(--line)
		padding-top: 16px

	.row-out
		display: grid
		grid-template-columns: 120px 92px 1fr
		align-items: baseline
		gap: 10px
		font-size: 11.5px
		b
			font-family: var(--mono)
			font-weight: 400
			color: var(--silver)
		span
			color: var(--gold)
		i
			font-style: normal
			color: var(--faint)
		&.warn i
			color: #C98C8C

	.note
		margin: 0
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 52ch
		b
			font-family: var(--mono)
			font-weight: 400
			color: var(--dim)
</style>
