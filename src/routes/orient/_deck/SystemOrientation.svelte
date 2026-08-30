<script lang="ts">
	import { systemDeck as defaultDeck, systemSlides as defaultSlides } from './system.data.js'
	import { markup, shellMarkup } from './specimen.svelte.js'
	import { rigs } from './rigs/index.js'
	import type { SystemDeck, SystemSlide } from './types.js'

	interface Props {
		slides?: SystemSlide[]
		deck?: SystemDeck
	}

	let { slides = defaultSlides, deck = defaultDeck }: Props = $props()

	let current = $state(0)
	/* One specimen for the whole deck. Rigs mutate it; it never resets. */
	let specimen = $state({ ...deck.specimen, presets: { ...deck.specimen.presets } })

	let canvasEl = $state<HTMLCanvasElement | null>(null)

	const slide = $derived(slides[current])
	const Rig = $derived(rigs[slide.rig.kind])
	const nextLabel = $derived(
		current === 0 ? 'Begin' : current === slides.length - 1 ? 'Again' : 'Continue'
	)

	/* The ledger is derived from the same state the vitrine renders, so the
	   code shown and the thing shown cannot disagree. */
	const lines = $derived(slide.id === 'enclosure' ? shellMarkup() : markup(specimen, current))
	const fresh = $derived(new Set<string>(slide.ledger?.fresh ?? []))

	const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }
	const esc = (s: string): string => s.replace(/[&<>]/g, (c) => ENTITIES[c])
	const fmt = (s: string): string =>
		esc(s)
			.replace(/\{([^}]+)\}/g, '<em>$1</em>')
			.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')

	/** Light the classes this screen just added; settle everything earlier. */
	function ledgerLine(line: string): string {
		return esc(line).replace(/class="([^"]*)"/, (_m, cls: string) => {
			const marked = cls
				.split(/\s+/)
				.filter(Boolean)
				.map((c) => {
					const hit = [...fresh].some((f) =>
						f.endsWith('*') ? c.startsWith(f.slice(0, -1)) : c === f
					)
					return `<span class="${hit ? 'new' : 'settled'}">${c}</span>`
				})
				.join(' ')
			return `class="${marked}"`
		})
	}

	const go = (i: number): void => {
		current = (i + slides.length) % slides.length
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.target instanceof HTMLInputElement) return
		if (event.key === 'ArrowRight' && current < slides.length - 1) current += 1
		if (event.key === 'ArrowLeft' && current > 0) current -= 1
	}

	/* Deterministic starfield — same seed as Act I, so the two decks share a sky. */
	function paintStars(): void {
		if (!canvasEl) return
		const ctx = canvasEl.getContext('2d')
		if (!ctx) return

		const dpr = window.devicePixelRatio || 1
		const w = window.innerWidth
		const h = window.innerHeight
		canvasEl.width = w * dpr
		canvasEl.height = h * dpr
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		ctx.clearRect(0, 0, w, h)

		let s = 20260829
		const rnd = (): number => (s = (s * 16807) % 2147483647) / 2147483647

		for (let i = 0; i < 200; i++) {
			const x = rnd() * w
			const y = rnd() * h
			const r = rnd() * 1.1 + 0.18
			const a = rnd() * 0.45 + 0.05
			ctx.beginPath()
			ctx.arc(x, y, r, 0, Math.PI * 2)
			ctx.fillStyle = rnd() > 0.88 ? `rgba(232,188,133,${a})` : `rgba(198,208,240,${a})`
			ctx.fill()
		}
	}

	$effect(paintStars)
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap"
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onresize={paintStars} />

<div class="orientation">
	<canvas class="stars" bind:this={canvasEl}></canvas>
	<div class="veil"></div>
	<div class="wordmark">{deck.wordmark}</div>

	<div class="app">
		<!-- ── copy ─────────────────────────────────────────── -->
		<section class="column">
			{#key current}
				<div class="slide">
					<p class="step">
						{#if slide.level}<i>{slide.level}</i>{/if}{slide.step}
					</p>

					{#if slide.heading}<h1>{@html fmt(slide.heading)}</h1>{/if}

					{#if slide.heuristic}
						<p class="heuristic">
							{#each slide.heuristic as line, i}
								<span style:animation-delay="{(0.15 + i * 0.6).toFixed(2)}s">{@html fmt(line)}</span>
							{/each}
						</p>
					{/if}

					{#if slide.body}
						<div class="body" class:after-heuristic={slide.heuristic}>
							{#each slide.body as para}
								<p>{@html fmt(para)}</p>
							{/each}
						</div>
					{/if}

					{#if slide.footnote}
						<div class="footnote">
							<b>{slide.footnote.label}</b>{@html fmt(slide.footnote.text)}
						</div>
					{/if}

					{#if slide.source}
						<p class="source">{slide.source}</p>
					{/if}
				</div>
			{/key}

			<div class="nav">
				<button class="go back" disabled={current === 0} onclick={() => go(current - 1)}>
					<span class="arrow"></span>Back
				</button>
				<button class="go" onclick={() => go(current + 1)}>
					{nextLabel}<span class="arrow"></span>
				</button>
				<span class="hint">← →</span>
			</div>
		</section>

		<!-- ── the instrument ───────────────────────────────── -->
		<section class="field">
			{#key slide.rig.kind}
				<div class="rig">
					<Rig bind:specimen />
				</div>
			{/key}
		</section>

		<!-- ── the ledger ───────────────────────────────────── -->
		<aside class="ledger">
			<div class="ledger-head">
				<span>Ledger</span>
				<i>{slide.ledger?.label ?? ''}</i>
			</div>
			<pre>{#each lines as line}<code>{@html ledgerLine(line)}</code>
{/each}</pre>
			<div class="tally">
				<span>custom CSS</span>
				<b>0 lines</b>
			</div>
		</aside>
	</div>

	<nav class="track" aria-label="Deck progress">
		<div class="thread"></div>
		{#each slides as s, i}
			<button
				class="node"
				class:passed={i < current}
				aria-current={i === current}
				onclick={() => go(i)}
			>
				<span class="bead"></span><span class="name">{s.node}</span>
			</button>
		{/each}
	</nav>
</div>

<style lang="sass">
	.orientation
		// The deck's own palette. Deliberately shares no name with a
		// fractalstyler token — the two vocabularies never touch.
		--void: #04050C
		--line: rgba(178, 188, 224, .13)
		--silver: #C4CCE6
		--dim: #6C7396
		--faint: #464C6B
		--violet: #9A8CE0
		--gold: #E8BC85
		--display: "Cormorant Garamond", Georgia, serif
		--ui: "Jost", system-ui, sans-serif
		--mono: ui-monospace, SFMono-Regular, Menlo, monospace
		position: relative
		min-height: 100dvh
		background: var(--void)
		color: var(--silver)
		font-family: var(--ui)
		font-weight: 300
		font-size: 15px
		line-height: 1.7
		-webkit-font-smoothing: antialiased

	.stars
		position: fixed
		inset: 0
		z-index: 0
		pointer-events: none

	.veil
		position: fixed
		inset: 0
		z-index: 1
		pointer-events: none
		background: radial-gradient(55% 45% at 55% 42%, rgba(154, 140, 224, .09), transparent 70%), radial-gradient(40% 40% at 12% 92%, rgba(232, 188, 133, .04), transparent 70%), radial-gradient(125% 95% at 50% 50%, transparent 42%, var(--void) 100%)

	.app
		position: relative
		z-index: 2
		min-height: 100dvh
		display: grid
		grid-template-columns: minmax(300px, 26%) minmax(0, 1fr) minmax(230px, 20%)
		gap: 0

	.wordmark
		position: fixed
		top: 30px
		left: 38px
		z-index: 5
		font-size: 10.5px
		letter-spacing: .42em
		text-transform: uppercase
		color: var(--faint)

	// ── copy column ─────────────────────────────────────────────
	.column
		display: flex
		flex-direction: column
		justify-content: center
		padding: 92px 40px 40px 78px
		min-height: 0

	.slide
		animation: fade .5s ease

	.step
		font-size: 10.5px
		letter-spacing: .34em
		text-transform: uppercase
		color: var(--gold)
		margin: 0 0 22px
		display: flex
		align-items: center
		gap: 12px
		opacity: .85
		i
			font-style: normal
			border: 1px solid rgba(232, 188, 133, .35)
			padding: 2px 7px
			font-size: 9px
			letter-spacing: .2em

	h1
		font-family: var(--display)
		font-weight: 300
		font-size: clamp(29px, 2.9vw, 44px)
		line-height: 1.1
		letter-spacing: -.01em
		margin: 0 0 22px
		color: #EDF0FA
		:global(em)
			font-style: italic
			color: var(--violet)

	.body
		max-width: 42ch
		color: #A8B0CE
		font-size: 14.5px
		line-height: 1.8
		&.after-heuristic
			margin-top: 30px
		p
			margin: 0 0 14px
			&:last-child
				margin-bottom: 0
		:global(strong)
			color: #E4E8F6
			font-weight: 400
		:global(em)
			font-style: italic
			color: var(--gold)
		:global(code)
			font-family: var(--mono)
			font-size: 12px
			color: var(--violet)

	.heuristic
		font-family: var(--display)
		font-size: clamp(19px, 1.8vw, 25px)
		line-height: 1.8
		color: #DDE2F2
		font-weight: 300
		max-width: 24ch
		margin: 0
		span
			display: block
			opacity: 0
			animation: rise .9s ease forwards
		:global(em)
			font-style: italic
			color: var(--gold)

	.footnote
		margin-top: 30px
		padding-top: 17px
		border-top: 1px solid var(--line)
		font-size: 12px
		color: var(--faint)
		max-width: 42ch
		line-height: 1.75
		b
			color: var(--dim)
			font-weight: 400
			letter-spacing: .14em
			text-transform: uppercase
			font-size: 10px
			display: block
			margin-bottom: 5px
		:global(code)
			font-family: var(--mono)
			color: var(--dim)

	.source
		margin: 16px 0 0
		font-family: var(--mono)
		font-size: 10px
		color: var(--faint)
		opacity: .6

	// ── instrument ──────────────────────────────────────────────
	.field
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center
		padding: 92px 34px 46px
		min-width: 0

	.rig
		width: 100%
		max-width: 720px
		display: flex
		flex-direction: column
		align-items: center
		animation: fade .5s ease

	// ── ledger ──────────────────────────────────────────────────
	.ledger
		border-left: 1px solid var(--line)
		padding: 92px 26px 40px
		display: flex
		flex-direction: column
		justify-content: center
		min-width: 0

	.ledger-head
		display: flex
		flex-direction: column
		gap: 5px
		margin-bottom: 18px
		span
			font-size: 9.5px
			letter-spacing: .3em
			text-transform: uppercase
			color: var(--faint)
		i
			font-style: normal
			font-size: 11px
			color: var(--dim)
			line-height: 1.5

	pre
		margin: 0
		font-family: var(--mono)
		font-size: 10.5px
		line-height: 2
		white-space: pre-wrap
		word-break: break-word
		color: #5E6688
		code
			font-family: inherit
		:global(.new)
			color: var(--gold)
		:global(.settled)
			color: var(--dim)

	.tally
		margin-top: 26px
		padding-top: 15px
		border-top: 1px solid var(--line)
		display: flex
		justify-content: space-between
		align-items: baseline
		span
			font-size: 9.5px
			letter-spacing: .24em
			text-transform: uppercase
			color: var(--faint)
		b
			font-family: var(--display)
			font-weight: 300
			font-size: 19px
			color: var(--dim)

	// ── navigation ──────────────────────────────────────────────
	.nav
		margin-top: 40px
		display: flex
		align-items: center
		gap: 24px

	.go
		background: none
		border: 0
		padding: 0
		cursor: pointer
		color: var(--silver)
		font-family: var(--ui)
		font-weight: 300
		font-size: 12px
		letter-spacing: .24em
		text-transform: uppercase
		display: flex
		align-items: center
		gap: 11px
		transition: color .3s, gap .3s
		&:hover
			color: var(--gold)
			gap: 17px
		&:disabled
			opacity: .22
			cursor: default
		.arrow
			width: 24px
			height: 1px
			background: currentColor
			position: relative
			&::after
				content: ""
				position: absolute
				right: 0
				top: -2.5px
				width: 5px
				height: 5px
				border-top: 1px solid currentColor
				border-right: 1px solid currentColor
				transform: rotate(45deg)
		&.back .arrow::after
			right: auto
			left: 0
			transform: rotate(-135deg)

	.hint
		font-size: 10.5px
		letter-spacing: .2em
		color: var(--faint)
		opacity: .55
		margin-left: auto

	// ── rail ────────────────────────────────────────────────────
	.track
		position: fixed
		left: 18px
		top: 50%
		transform: translateY(-50%)
		z-index: 5
		display: flex
		flex-direction: column

	.thread
		position: absolute
		left: 6.5px
		top: 16px
		bottom: 16px
		width: 1px
		background: var(--line)
		z-index: -1

	.node
		background: none
		border: 0
		padding: 8px 4px
		cursor: pointer
		display: flex
		align-items: center
		gap: 11px
		color: var(--faint)
		font-size: 9px
		letter-spacing: .22em
		font-family: var(--ui)
		.bead
			width: 5px
			height: 5px
			border-radius: 50%
			border: 1px solid currentColor
			transition: .4s
			flex-shrink: 0
		.name
			opacity: 0
			transition: opacity .3s
			white-space: nowrap
			text-transform: uppercase
		&:hover
			color: var(--silver)
			.name
				opacity: 1
		&.passed .bead
			background: var(--faint)
		&[aria-current="true"]
			color: var(--gold)
			.bead
				background: var(--gold)
				box-shadow: 0 0 10px rgba(232, 188, 133, .6)
			.name
				opacity: 1

	@keyframes rise
		from
			opacity: 0
			transform: translateY(9px)
		to
			opacity: 1
			transform: none

	@keyframes fade
		from
			opacity: 0
			transform: translateY(6px)
		to
			opacity: 1
			transform: none

	@media (prefers-reduced-motion: reduce)
		.slide,
		.rig,
		.heuristic span
			animation: none
			opacity: 1

	@media (max-width: 1180px)
		.app
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr)
		.ledger
			grid-column: 1 / -1
			border-left: 0
			border-top: 1px solid var(--line)
			padding: 30px 34px 46px

	@media (max-width: 900px)
		.app
			grid-template-columns: 1fr
			min-height: auto
		.field
			order: -1
			padding: 84px 22px 20px
		.column
			padding: 10px 22px 40px
		.ledger
			padding: 26px 22px 60px
		.track
			position: static
			transform: none
			flex-direction: row
			justify-content: center
			flex-wrap: wrap
			padding: 18px 0 30px
		.thread
			display: none
		.node .name
			display: none
		.wordmark
			position: static
			padding: 26px 22px 0
</style>
