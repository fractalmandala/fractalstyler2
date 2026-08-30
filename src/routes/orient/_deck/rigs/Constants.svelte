<script lang="ts">
	import type { Specimen } from '../types.js'
	import Ruler from './Ruler.svelte'
	import { TEXT_SCALE, SPACE_SCALE, resolve, boundState, colorTokens } from '../tokens.js'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	let family = $state<'text' | 'space' | 'color'>('text')
	const scale = $derived(family === 'text' ? TEXT_SCALE : SPACE_SCALE)
	const colors = colorTokens()

	const px = (n: number): string => `${Math.round(n * 100) / 100}px`
</script>

<div class="panel">
	<div class="tabs">
		{#each [['text', 'type'], ['space', 'space'], ['color', 'colour']] as [k, label]}
			<button class:on={family === k} onclick={() => (family = k as typeof family)}>{label}</button>
		{/each}
	</div>

	{#if family === 'color'}
		<div class="swatches">
			{#each colors as c}
				<span class="swatch" title={c.light}>
					<i style:background={c.light}></i>
					<b>--{c.name}</b>
				</span>
			{/each}
		</div>
		<p class="note">
			Thirty names, no hexes at the call site. You never write a colour — you name the
			<em>role</em> it plays, and the theme decides what that role looks like today.
		</p>
	{:else}
		<div class="scale">
			{#each scale as s}
				{@const v = resolve(s, specimen.viewport)}
				{@const st = boundState(s, specimen.viewport)}
				<div class="rung" class:pinned={st !== 'fluid'}>
					<b>.{s.name.replace('space-', 'gap-')}</b>
					<code>--{s.name}</code>
					<span class="val">{px(v)}</span>
					<span class="bar"><i style:width="{Math.min(100, (v / 120) * 100)}%"></i></span>
					<span class="st">{st === 'fluid' ? 'moving' : st === 'min' ? 'floor' : 'ceiling'}</span>
				</div>
			{/each}
		</div>
		<p class="note">
			Drag the ruler. Nothing jumps — every value walks its own line between a floor and a
			ceiling. There are no breakpoints in this scale, and the numbers above are computed from
			the clamps in <em>_00_tokens.sass</em>, not copied out of it.
		</p>
	{/if}
</div>

<div class="controls">
	<Ruler bind:specimen marks={[360, 640, 768, 1024, 1240]} />
</div>

<style lang="sass">
	.panel
		width: 100%
		border: 1px solid rgba(178, 188, 224, .13)
		background: rgba(10, 12, 24, .5)
		padding: 20px 22px 22px

	.tabs
		display: flex
		gap: 1px
		margin-bottom: 20px
		button
			background: none
			border: 0
			border-bottom: 1px solid var(--line)
			padding: 6px 16px
			cursor: pointer
			color: var(--faint)
			font-size: 10px
			letter-spacing: .26em
			text-transform: uppercase
			transition: .25s
			&:hover
				color: var(--silver)
			&.on
				color: var(--gold)
				border-bottom-color: var(--gold)

	.scale
		display: flex
		flex-direction: column
		gap: 2px

	.rung
		display: grid
		grid-template-columns: 76px 96px 60px 1fr 56px
		align-items: center
		gap: 12px
		padding: 5px 0
		font-size: 11px
		b
			font-family: var(--mono)
			font-weight: 400
			color: var(--silver)
		code
			font-family: var(--mono)
			color: var(--faint)
			font-size: 10.5px
		.val
			font-family: var(--display)
			font-size: 15px
			color: var(--gold)
			text-align: right
		.st
			font-size: 9px
			letter-spacing: .18em
			text-transform: uppercase
			color: var(--faint)
			text-align: right
		&.pinned
			.val
				color: var(--dim)
			.bar i
				background: var(--faint)

	.bar
		height: 1px
		background: var(--line)
		display: block
		i
			display: block
			height: 1px
			background: linear-gradient(90deg, rgba(232, 188, 133, .3), var(--gold))
			transition: width .12s linear

	.swatches
		display: grid
		grid-template-columns: repeat(auto-fill, minmax(148px, 1fr))
		gap: 3px 14px

	.swatch
		display: flex
		align-items: center
		gap: 9px
		padding: 3px 0
		i
			width: 11px
			height: 11px
			flex-shrink: 0
			border: 1px solid rgba(255, 255, 255, .12)
		b
			font-family: var(--mono)
			font-weight: 400
			font-size: 10.5px
			color: var(--dim)
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap

	.note
		margin: 20px 0 0
		padding-top: 15px
		border-top: 1px solid var(--line)
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 56ch
		em
			font-style: italic
			color: var(--dim)

	.controls
		margin-top: 26px
		width: 100%
</style>
