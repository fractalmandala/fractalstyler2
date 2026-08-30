<script lang="ts">
	import { deck as defaultDeck, slides as defaultSlides } from './orientation.data.js'
	import { renderFigure, CENTRE, VIEWBOX } from './figures.js'
	import type { Deck, Slide } from './types.js'

	interface Props {
		slides?: Slide[]
		deck?: Deck
	}

	let { slides = defaultSlides, deck = defaultDeck }: Props = $props()

	let current = $state(0)
	let seed = $state({ ...deck.seed })

	let figureEl = $state<SVGSVGElement | null>(null)
	let canvasEl = $state<HTMLCanvasElement | null>(null)

	const slide = $derived(slides[current])
	const figureMarkup = $derived(renderFigure(slide.graphic, seed))
	const nextLabel = $derived(
		current === 0 ? 'Begin' : current === slides.length - 1 ? 'Again' : 'Continue'
	)

	/* — inline markup: {emphasis} and *strong* — */
	const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }
	const esc = (s: string): string => s.replace(/[&<>]/g, (c) => ENTITIES[c])
	const fmt = (s: string): string =>
		esc(s)
			.replace(/\{([^}]+)\}/g, '<em>$1</em>')
			.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
	const codefmt = (s: string): string =>
		esc(s).replace(/\[\[([^\]]+)\]\]/g, '<span class="todo">⟨$1⟩</span>')

	const go = (i: number): void => {
		current = (i + slides.length) % slides.length
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.target instanceof HTMLInputElement) return
		if (event.key === 'ArrowRight' && current < slides.length - 1) current += 1
		if (event.key === 'ArrowLeft' && current > 0) current -= 1
	}

	/* — rotation: one persistent clock, so dial drags never snap the figure — */
	let spinning: SVGGraphicsElement[] = []

	$effect(() => {
		figureMarkup
		spinning = figureEl ? Array.from(figureEl.querySelectorAll<SVGGraphicsElement>('[data-spin]')) : []
	})

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		let t = 0
		let frame = 0

		const orbit = (): void => {
			t += 0.02
			for (const group of spinning) {
				const rate = Number(group.dataset.spin)
				group.setAttribute('transform', `rotate(${t * rate} ${CENTRE} ${CENTRE})`)
			}
			frame = requestAnimationFrame(orbit)
		}

		frame = requestAnimationFrame(orbit)
		return () => cancelAnimationFrame(frame)
	})

	/* — starfield: deterministic, so it never reshuffles on resize — */
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

		for (let i = 0; i < 220; i++) {
			const x = rnd() * w
			const y = rnd() * h
			const r = rnd() * 1.15 + 0.18
			const a = rnd() * 0.5 + 0.06
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
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&family=Noto+Serif+Devanagari:wght@300;400&display=swap"
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onresize={paintStars} />

<div class="orientation">
	<canvas class="stars" bind:this={canvasEl}></canvas>
	<div class="veil"></div>
	<div class="wordmark">{deck.wordmark}</div>

	<div class="app">
		<section class="column">
			{#key current}
				<div class="slide">
					<p class="step">{slide.step}</p>

					{#if slide.sanskrit}<p class="sanskrit">{slide.sanskrit}</p>{/if}
					{#if slide.translit}<p class="translit">{slide.translit}</p>{/if}
					{#if slide.heading}<h1>{@html fmt(slide.heading)}</h1>{/if}

					{#if slide.heuristic}
						<p class="heuristic">
							{#each slide.heuristic as line, i}
								<span style:animation-delay="{(0.15 + i * 0.7).toFixed(2)}s">{@html fmt(line)}</span>
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

					{#if slide.dials}
						<div class="dials">
							<div class="dial">
								<div class="dial-head">
									<span>{deck.dialLabels.sides}</span><span>{seed.sides}</span>
								</div>
								<input type="range" min="3" max="12" bind:value={seed.sides} />
							</div>
							<div class="dial">
								<div class="dial-head">
									<span>{deck.dialLabels.ratio}</span><span>{seed.ratio.toFixed(2)}</span>
								</div>
								<input type="range" min="1.15" max="1.75" step="0.01" bind:value={seed.ratio} />
							</div>
							<p class="dial-note">{deck.dialNote}</p>
						</div>
					{/if}

					{#if slide.footnote}
						<div class="footnote">
							<b>{slide.footnote.label}</b>{@html fmt(slide.footnote.text)}
						</div>
					{/if}

					{#if slide.example}
						<div class="example">
							<b>{slide.example.label}</b>
							<code>{@html codefmt(slide.example.code)}</code>
						</div>
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

		<section class="field">
			<svg class="figure" viewBox={VIEWBOX} bind:this={figureEl} aria-hidden="true">
				{@html figureMarkup}
			</svg>
			<div class="caption">{slide.caption}</div>
		</section>
	</div>

	<nav class="track" aria-label="Orientation progress">
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
		--void: #04050C
		--line: rgba(178, 188, 224, .13)
		--silver: #C4CCE6
		--dim: #6C7396
		--faint: #464C6B
		--violet: #9A8CE0
		--gold: #E8BC85
		--display: "Cormorant Garamond", Georgia, serif
		--ui: "Jost", "Noto Serif Devanagari", system-ui, sans-serif
		--deva: "Noto Serif Devanagari", serif
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
		background: radial-gradient(60% 50% at 68% 48%, rgba(154, 140, 224, .10), transparent 70%), radial-gradient(40% 40% at 20% 90%, rgba(232, 188, 133, .05), transparent 70%), radial-gradient(120% 90% at 50% 50%, transparent 45%, var(--void) 100%)

	.app
		position: relative
		z-index: 2
		height: 100dvh
		display: grid
		grid-template-columns: minmax(340px, 37%) 1fr

	.wordmark
		position: fixed
		top: 30px
		left: 38px
		z-index: 5
		font-size: 10.5px
		letter-spacing: .42em
		text-transform: uppercase
		color: var(--faint)

	// ── text column ─────────────────────────────────────────────
	.column
		display: flex
		flex-direction: column
		justify-content: center
		padding: 96px 54px 40px
		min-height: 0
		overflow-y: auto

	.slide
		animation: fade .55s ease

	.step
		font-size: 10.5px
		letter-spacing: .4em
		text-transform: uppercase
		color: var(--gold)
		margin: 0 0 26px
		display: flex
		align-items: center
		gap: 14px
		opacity: .85
		&::after
			content: ""
			height: 1px
			width: 52px
			background: linear-gradient(90deg, rgba(232, 188, 133, .5), transparent)

	h1
		font-family: var(--display)
		font-weight: 300
		font-size: clamp(34px, 4.1vw, 58px)
		line-height: 1.08
		letter-spacing: -.01em
		margin: 0 0 24px
		color: #EDF0FA
		:global(em)
			font-style: italic
			color: var(--violet)

	.sanskrit
		font-family: var(--deva)
		font-size: 26px
		line-height: 1.6
		color: var(--gold)
		margin: 0 0 10px
		font-weight: 300

	.translit
		font-family: var(--display)
		font-style: italic
		font-size: 19px
		color: #C9D0E8
		margin: 0 0 20px

	.body
		max-width: 40ch
		color: #A8B0CE
		font-size: 16px
		&.after-heuristic
			margin-top: 32px
		p
			margin: 0 0 15px
			&:last-child
				margin-bottom: 0
		:global(strong)
			color: #E4E8F6
			font-weight: 400
		:global(em)
			font-style: italic
			color: var(--gold)

	.heuristic
		font-family: var(--display)
		font-size: clamp(19px, 2vw, 25px)
		line-height: 1.85
		color: #DDE2F2
		font-weight: 300
		max-width: 26ch
		margin: 0
		span
			display: block
			opacity: 0
			animation: rise 1s ease forwards
		:global(em)
			font-style: italic
			color: var(--gold)

	.footnote
		margin-top: 34px
		padding-top: 18px
		border-top: 1px solid var(--line)
		font-size: 12.5px
		letter-spacing: .03em
		color: var(--faint)
		max-width: 40ch
		b
			color: var(--dim)
			font-weight: 400
			letter-spacing: .14em
			text-transform: uppercase
			font-size: 10.5px
			display: block
			margin-bottom: 5px
		:global(strong)
			color: var(--dim)
			font-weight: 400

	.example
		margin-top: 16px
		max-width: 40ch
		border-left: 1px solid rgba(154, 140, 224, .3)
		padding: 2px 0 2px 15px
		b
			color: var(--faint)
			font-weight: 400
			letter-spacing: .14em
			text-transform: uppercase
			font-size: 10px
			display: block
			margin-bottom: 7px
		code
			display: block
			font-family: var(--mono)
			font-size: 11.5px
			line-height: 1.85
			color: #9CA5CC
			white-space: pre-wrap
			:global(.todo)
				color: #7A5F8E

	// ── dials ───────────────────────────────────────────────────
	.dials
		margin-top: 38px
		display: flex
		flex-direction: column
		gap: 22px
		max-width: 330px

	.dial
		display: flex
		flex-direction: column
		gap: 10px

	.dial-head
		display: flex
		justify-content: space-between
		align-items: baseline
		span:first-child
			font-size: 10.5px
			letter-spacing: .28em
			text-transform: uppercase
			color: var(--faint)
		span:last-child
			font-family: var(--display)
			font-size: 17px
			color: var(--gold)

	.dial-note
		font-size: 11.5px
		color: var(--faint)
		letter-spacing: .02em
		margin: 0

	input[type="range"]
		appearance: none
		-webkit-appearance: none
		width: 100%
		height: 20px
		background: none
		cursor: pointer
		margin: 0
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

	// ── navigation ──────────────────────────────────────────────
	.nav
		margin-top: 44px
		display: flex
		align-items: center
		gap: 26px

	.go
		background: none
		border: 0
		padding: 0
		cursor: pointer
		color: var(--silver)
		font-family: var(--ui)
		font-weight: 300
		font-size: 12.5px
		letter-spacing: .26em
		text-transform: uppercase
		display: flex
		align-items: center
		gap: 12px
		transition: color .3s, gap .3s
		&:hover
			color: var(--gold)
			gap: 18px
		&:disabled
			opacity: .22
			cursor: default
		.arrow
			width: 26px
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

	// ── constellation rail ──────────────────────────────────────
	.track
		position: fixed
		right: 40px
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
		padding: 9px 4px
		cursor: pointer
		display: flex
		align-items: center
		gap: 12px
		color: var(--faint)
		font-size: 9.5px
		letter-spacing: .24em
		font-family: var(--ui)
		.bead
			width: 5px
			height: 5px
			border-radius: 50%
			border: 1px solid currentColor
			transition: .4s
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

	// ── figure ──────────────────────────────────────────────────
	.field
		position: relative
		display: grid
		place-items: center
		min-height: 0
		padding: 40px

	.figure
		width: min(76vh, 100%)
		height: auto
		display: block
		overflow: visible
		:global(*)
			vector-effect: non-scaling-stroke

	.caption
		position: absolute
		bottom: 34px
		left: 50%
		transform: translateX(-50%)
		font-size: 10.5px
		letter-spacing: .34em
		text-transform: uppercase
		color: var(--faint)
		text-align: center
		white-space: nowrap

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
			transform: translateY(7px)
		to
			opacity: 1
			transform: none

	@media (prefers-reduced-motion: reduce)
		.slide,
		.heuristic span
			animation: none
			opacity: 1

	@media (max-width: 940px)
		.app
			grid-template-columns: 1fr
			height: auto
		.field
			order: -1
			padding: 80px 24px 10px
		.figure
			width: min(64vh, 86vw)
		.column
			padding: 30px 26px 70px
			justify-content: flex-start
		.track
			position: static
			transform: none
			flex-direction: row
			justify-content: center
			padding: 20px 0
			gap: 6px
		.thread
			display: none
		.node .name
			display: none
		.wordmark
			position: static
			padding: 26px 26px 0
		.caption
			position: static
			transform: none
			margin-top: 20px
</style>
