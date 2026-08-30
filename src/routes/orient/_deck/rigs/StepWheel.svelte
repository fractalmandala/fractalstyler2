<script lang="ts">
	import type { Specimen, SpaceStep } from '../types.js'
	import Vitrine from '../Vitrine.svelte'
	import { SPACE_STEPS } from '../specimen.svelte.js'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	const DENSITY = [
		{ v: 'tight', gap: 0.85, pad: 0.7 },
		{ v: '', gap: 1, pad: 1 },
		{ v: 'sprawling', gap: 1.2, pad: 1.5 }
	] as const

	const active = $derived(DENSITY.find((d) => d.v === specimen.presets.layout) ?? DENSITY[1])
</script>

<Vitrine {specimen} tall>
	<div class="row gap-{specimen.gap} pad-{specimen.pad} surface border wfull">
		<div class="box gap-3xs grow min0 raised pad-sm">
			<span class="text-sm weight-600">gap-{specimen.gap}</span>
			<span class="text-xs text-muted">separates siblings</span>
		</div>
		<div class="box gap-3xs grow min0 raised pad-sm">
			<span class="text-sm weight-600">pad-{specimen.pad}</span>
			<span class="text-xs text-muted">holds the edge back</span>
		</div>
	</div>
</Vitrine>

<div class="controls">
	{#each [['gap', 'Gap · between'], ['pad', 'Pad · within']] as [key, label]}
		<div class="wheel">
			<div class="head">
				<span>{label}</span>
				<b>.{key}-{specimen[key as 'gap' | 'pad']}</b>
			</div>
			<div class="steps">
				{#each SPACE_STEPS as s}
					<button
						class:on={specimen[key as 'gap' | 'pad'] === s}
						onclick={() => (specimen[key as 'gap' | 'pad'] = s as SpaceStep)}
					>
						{s}
					</button>
				{/each}
			</div>
		</div>
	{/each}

	<div class="density">
		<span class="head-label">Density preset · data-layout</span>
		<div class="steps">
			{#each DENSITY as d}
				<button
					class:on={specimen.presets.layout === d.v}
					onclick={() => (specimen.presets.layout = d.v)}
				>
					{d.v || 'comfortable'}
				</button>
			{/each}
		</div>
		<p class="note">
			The class names did not change. One attribute multiplied every gap by
			<em>{active.gap}</em> and every padding by <em>{active.pad}</em> — and they move at
			different rates, because scaling both equally is a perceptual no-op.
		</p>
	</div>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 24px
		margin-top: 26px
		width: 100%

	.wheel, .density
		display: flex
		flex-direction: column
		gap: 9px

	.head
		display: flex
		justify-content: space-between
		align-items: baseline
		span
			font-size: 10px
			letter-spacing: .28em
			text-transform: uppercase
			color: var(--faint)
		b
			font-family: var(--mono)
			font-weight: 400
			font-size: 12.5px
			color: var(--gold)

	.head-label
		font-size: 10px
		letter-spacing: .28em
		text-transform: uppercase
		color: var(--faint)

	.steps
		display: flex
		gap: 1px
		flex-wrap: wrap
		button
			background: none
			border: 1px solid var(--line)
			padding: 5px 11px
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

	.note
		margin: 6px 0 0
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 52ch
		em
			font-style: normal
			color: var(--gold)
</style>
