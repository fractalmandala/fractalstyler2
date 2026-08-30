<script lang="ts">
	import type { Presets, Specimen } from '../types.js'
	import Vitrine from '../Vitrine.svelte'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	/* The four axes, docs 10 §1. Empty string = the default, which the system
	   expresses by the attribute being ABSENT — so the readout below shows a
	   clean <html> when nothing is chosen. */
	const AXES = [
		{ key: 'shape', label: 'Shape', values: ['round', 'curved', 'pro', 'sharp'] },
		{ key: 'layout', label: 'Layout', values: ['tight', 'comfortable', 'sprawling'] },
		{ key: 'color', label: 'Colour', values: ['clean', 'general', 'vibrant'] },
		{ key: 'motion', label: 'Motion', values: ['reduced', 'active', 'heavy', 'springy'] }
	] as const

	/* Defaults ship in the token file itself, so selecting them means clearing. */
	const DEFAULTS: Record<string, string> = {
		shape: 'curved',
		layout: 'comfortable',
		color: 'general',
		motion: 'active'
	}

	function set(axis: string, v: string): void {
		const key = axis as keyof Presets
		;(specimen.presets[key] as string) = DEFAULTS[axis] === v ? '' : v
	}

	function reads(axis: string): string {
		const v = specimen.presets[axis as keyof Presets]
		return (v as string) || DEFAULTS[axis]
	}

	const attrLine = $derived(
		'<html' +
			AXES.map(({ key }) => {
				const v = specimen.presets[key as keyof Presets]
				return v ? ` data-${key}="${v}"` : ''
			}).join('') +
			'>'
	)
</script>

<Vitrine {specimen} tall>
	<div class="box gap-{specimen.gap} wfull">
		<div class="row ycenter xbetween gap-sm pad-{specimen.pad} surface border radius-md">
			<div class="box gap-3xs min0">
				<span class="text-md weight-600 text-primary">Fractalstyler</span>
				<span class="text-xs text-muted">Compose in markup.</span>
			</div>
			<button class="button primary shrink-0">Continue</button>
		</div>
		<div class="grid-3 gap-sm">
			<div class="card surface border pad-sm box gap-3xs">
				<span class="text-lg weight-700 text-primary">1,429</span>
				<span class="text-xs text-muted">Sessions</span>
			</div>
			<div class="card surface border pad-sm box gap-3xs">
				<span class="text-lg weight-700 text-success">14ms</span>
				<span class="text-xs text-muted">Latency</span>
			</div>
			<div class="card surface border pad-sm box gap-3xs">
				<span class="text-lg weight-700 text-theme">v2</span>
				<span class="text-xs text-muted">Build</span>
			</div>
		</div>
	</div>
</Vitrine>

<div class="controls">
	{#each AXES as axis}
		<div class="axis">
			<span class="label">{axis.label}</span>
			<div class="opts">
				{#each axis.values as v}
					<button class:on={reads(axis.key) === v} onclick={() => set(axis.key, v)}>{v}</button>
				{/each}
			</div>
		</div>
	{/each}

	<div class="mode">
		<span class="label">Mode</span>
		<div class="opts">
			{#each ['dark', 'light'] as m}
				<button
					class:on={specimen.presets.mode === m}
					onclick={() => (specimen.presets.mode = m as 'dark' | 'light')}
				>
					{m}
				</button>
			{/each}
		</div>
	</div>

	<code class="attr">{attrLine}</code>

	<p class="note">
		The markup in the ledger has not changed once on this screen. Four attributes remapped every
		token underneath it — and notice that the page <em>around</em> the glass did not move, because
		appearance is scoped to wherever you stamp it.
	</p>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 13px
		margin-top: 26px
		width: 100%

	.axis, .mode
		display: grid
		grid-template-columns: 84px 1fr
		align-items: center
		gap: 14px

	.label
		font-size: 9.5px
		letter-spacing: .26em
		text-transform: uppercase
		color: var(--faint)

	.opts
		display: flex
		gap: 1px
		flex-wrap: wrap
		button
			background: none
			border: 1px solid var(--line)
			padding: 5px 12px
			cursor: pointer
			color: var(--dim)
			font-family: var(--mono)
			font-size: 11px
			transition: .22s
			&:hover
				color: var(--silver)
				border-color: var(--violet)
			&.on
				color: var(--void)
				background: var(--gold)
				border-color: var(--gold)

	.attr
		display: block
		margin-top: 8px
		padding: 11px 14px
		border-left: 1px solid rgba(154, 140, 224, .3)
		font-family: var(--mono)
		font-size: 11.5px
		color: #9CA5CC
		word-break: break-all

	.note
		margin: 4px 0 0
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 52ch
		em
			font-style: italic
			color: var(--dim)
</style>
