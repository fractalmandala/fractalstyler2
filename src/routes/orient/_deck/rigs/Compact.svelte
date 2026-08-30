<script lang="ts">
	import type { Specimen } from '../types.js'
	import { markup } from '../specimen.svelte.js'

	let { specimen }: { specimen: Specimen } = $props()

	/* The pre-flight checklist, docs 13 — the last thing before _08_own.sass. */
	const CHECKS = [
		'Can it be composed with .box or .row?',
		'Can .gap-* and .pad-* provide all the breathing room?',
		'Can .surface, .raised or .panel provide the background?',
		'Can .border or .border-bottom provide the dividing line?',
		'Can .button, .badge, .input or .select handle the interactive state?'
	]

	const final = $derived(markup(specimen, 9).join('\n'))
	let copied = $state(false)

	async function copy(): Promise<void> {
		await navigator.clipboard.writeText(final)
		copied = true
		setTimeout(() => (copied = false), 1800)
	}
</script>

<div class="tally">
	<div class="figure">
		<b>0</b>
		<span>lines of custom CSS</span>
	</div>
	<div class="figure">
		<b>0</b>
		<span>class names invented</span>
	</div>
	<div class="figure">
		<b>1</b>
		<span>artifact, carried the whole way</span>
	</div>
</div>

<div class="checklist">
	<span class="label">Before you open _08_own.sass</span>
	<ol>
		{#each CHECKS as c}
			<li>{c}</li>
		{/each}
	</ol>
	<p class="verdict">
		Five yeses means it belongs in the markup. That file is for third-party widget overrides — a
		code editor, an SVG chart — and very little else.
	</p>
</div>

<p class="handoff">
	The other way in is to not read any of this: point your agent at the plugin and the class
	registry, and let it compose. The discipline above is what you would be asking it to hold.
</p>

<div class="exits">
	<button onclick={copy}>{copied ? 'copied' : 'take the markup'}</button>
	<a href="/orient">back to the rule</a>
</div>

<style lang="sass">
	.tally
		display: grid
		grid-template-columns: repeat(3, 1fr)
		gap: 22px
		border: 1px solid var(--line)
		padding: 26px 24px

	.figure
		display: flex
		flex-direction: column
		gap: 8px
		b
			font-family: var(--display)
			font-weight: 300
			font-size: 46px
			line-height: 1
			color: var(--gold)
		span
			font-size: 10.5px
			letter-spacing: .18em
			text-transform: uppercase
			color: var(--faint)
			line-height: 1.6

	.checklist
		margin-top: 30px
		.label
			font-size: 9.5px
			letter-spacing: .26em
			text-transform: uppercase
			color: var(--faint)
			display: block
			margin-bottom: 16px
		ol
			margin: 0
			padding: 0
			list-style: none
			counter-reset: c
		li
			counter-increment: c
			position: relative
			padding: 9px 0 9px 34px
			font-size: 13px
			color: #A8B0CE
			border-bottom: 1px solid var(--line)
			font-family: var(--mono)
			font-size: 11.5px
			&::before
				content: counter(c)
				position: absolute
				left: 0
				top: 9px
				color: var(--faint)
				font-size: 10px

	.verdict
		margin: 18px 0 0
		font-size: 12.5px
		line-height: 1.75
		color: var(--faint)
		max-width: 54ch

	.handoff
		margin: 26px 0 0
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 54ch

	.exits
		margin-top: 22px
		display: flex
		gap: 14px
		align-items: center
		button, a
			background: none
			border: 1px solid var(--line)
			padding: 10px 22px
			cursor: pointer
			color: var(--dim)
			text-decoration: none
			font-size: 10.5px
			letter-spacing: .22em
			text-transform: uppercase
			transition: .25s
			&:hover
				color: var(--gold)
				border-color: var(--gold)
</style>
