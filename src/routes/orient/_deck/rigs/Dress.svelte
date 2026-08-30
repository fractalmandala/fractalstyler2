<script lang="ts">
	import type { Specimen } from '../types.js'
	import Vitrine from '../Vitrine.svelte'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	const SURFACES = ['surface', 'raised', 'panel'] as const
	const RADII = [
		{ v: 'radius-sm', label: '.radius-sm' },
		{ v: 'radius-md', label: '.radius-md' },
		{ v: 'radius-lg', label: '.radius-lg' },
		{ v: '', label: 'none' }
	] as const

	let button = $state<'primary' | 'ghost' | 'active'>('primary')
</script>

<Vitrine {specimen} tall>
	<div
		class="row ycenter xbetween gap-{specimen.gap} pad-{specimen.pad} {specimen.surface} {specimen
			.bordered
			? 'border'
			: ''} {specimen.radius} wfull"
	>
		<div class="row ycenter gap-sm min0">
			<div class="square-40 grid center raised radius-full text-xs text-muted shrink-0">ṛ</div>
			<div class="box gap-3xs min0">
				<span class="text-md weight-600 text-primary truncate">Fractalstyler</span>
				<span class="text-xs text-muted truncate">Compose in markup.</span>
			</div>
		</div>
		<button class="button {button} shrink-0">Continue</button>
	</div>
</Vitrine>

<div class="controls">
	<div class="group">
		<span class="label">Surface role</span>
		<div class="opts">
			{#each SURFACES as s}
				<button class:on={specimen.surface === s} onclick={() => (specimen.surface = s)}>.{s}</button>
			{/each}
		</div>
	</div>

	<div class="group">
		<span class="label">Corner channel</span>
		<div class="opts">
			{#each RADII as r}
				<button class:on={specimen.radius === r.v} onclick={() => (specimen.radius = r.v)}>
					{r.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="group">
		<span class="label">Hairline</span>
		<div class="opts">
			<button class:on={specimen.bordered} onclick={() => (specimen.bordered = true)}>.border</button>
			<button class:on={!specimen.bordered} onclick={() => (specimen.bordered = false)}>none</button>
		</div>
	</div>

	<div class="group">
		<span class="label">Button</span>
		<div class="opts">
			{#each ['primary', 'ghost', 'active'] as b}
				<button class:on={button === b} onclick={() => (button = b as typeof button)}>.{b}</button>
			{/each}
		</div>
	</div>

	<p class="note">
		Nothing structural moved on this screen. Every control here changed a
		<em>surface</em> — the outermost layer, and the only one you should ever have to change your
		mind about.
	</p>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 16px
		margin-top: 26px
		width: 100%

	.group
		display: grid
		grid-template-columns: 118px 1fr
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

	.note
		margin: 8px 0 0
		padding-top: 15px
		border-top: 1px solid var(--line)
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 52ch
		em
			font-style: italic
			color: var(--dim)
</style>
