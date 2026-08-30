<script lang="ts">
	import type { Specimen } from '../types.js'
	import ViewportStage from '../ViewportStage.svelte'
	import Ruler from './Ruler.svelte'

	let { specimen = $bindable() }: { specimen: Specimen } = $props()

	/* The canonical app shell, docs 08 §1 — verbatim structure, nothing added. */
	const html = $derived(
		`<div class="app-shell${specimen.drawer ? ' open' : ''}">` +
			`<header class="app-header row ycenter xbetween">` +
			`<button class="button is-icon" aria-label="Toggle navigation">&#9776;</button>` +
			`<span class="text-sm weight-600">Application</span>` +
			`<button class="button ghost text-xs">Profile</button>` +
			`</header>` +
			`<main class="app-main">` +
			`<aside class="sidebar-left"><nav class="navtree">` +
			`<span class="navtree-title">Documentation</span>` +
			`<a class="navtree-link active" href="#a">Introduction</a>` +
			`<a class="navtree-link" href="#b">Tokens</a>` +
			`<a class="navtree-link" href="#c">Layouts</a>` +
			`</nav></aside>` +
			`<section class="main-section">` +
			`<details class="mobile-toc"><summary>On this page</summary></details>` +
			`<article class="content-shell box gap-sm pad-sm">` +
			`<h1 class="text-xl weight-600">The enclosure</h1>` +
			`<p class="text-sm text-secondary">Built from the same grammar as its contents.</p>` +
			`</article></section>` +
			`<aside class="sidebar-right"><nav class="toc">` +
			`<span class="toc-title">On this page</span>` +
			`<ul class="toc-list"><li><a class="toc-link active" href="#a">The enclosure</a></li></ul>` +
			`</nav></aside>` +
			`</main>` +
			`<footer class="app-footer row ycenter xbetween text-xs text-muted">` +
			`<span>fractalstyler2</span><span>v2</span></footer>` +
			`</div>`
	)

	const seams = $derived([
		{
			at: 1280,
			live: specimen.viewport >= 1280,
			on: '.sidebar-right — table of contents rail',
			off: 'retracted into .mobile-toc'
		},
		{
			at: 1024,
			live: specimen.viewport >= 1024,
			on: '.sidebar-left — navigation rail',
			off: 'off-canvas .drawer, opened by .open on .app-shell'
		}
	])
</script>

<ViewportStage {specimen} {html} height={440} />

<div class="controls">
	<Ruler bind:specimen marks={[640, 768, 1024, 1280]} />

	<div class="seams">
		{#each seams as s}
			<div class="seam" class:live={s.live}>
				<b>{s.at}px</b>
				<span>{s.live ? s.on : s.off}</span>
				<i>{s.live ? 'shown' : 'retracted'}</i>
			</div>
		{/each}
	</div>

	<button
		class="drawer-toggle"
		disabled={specimen.viewport >= 1024}
		onclick={() => (specimen.drawer = !specimen.drawer)}
	>
		{specimen.drawer ? 'close' : 'open'} the drawer
		{#if specimen.viewport >= 1024}<em>— narrow past 1024 first</em>{/if}
	</button>

	<p class="note">
		You decided none of that. The markup is the canonical skeleton from
		<em>docs/08</em> and nothing else — no breakpoint was authored here, no state was wired.
		Following the contract <em>is</em> the responsiveness.
	</p>
</div>

<style lang="sass">
	.controls
		display: flex
		flex-direction: column
		gap: 20px
		margin-top: 26px
		width: 100%

	.seams
		display: flex
		flex-direction: column
		gap: 8px
		border-top: 1px solid var(--line)
		padding-top: 16px

	.seam
		display: grid
		grid-template-columns: 62px 1fr 78px
		gap: 12px
		align-items: baseline
		font-size: 11.5px
		opacity: .45
		transition: opacity .3s
		b
			font-family: var(--mono)
			font-weight: 400
			color: var(--dim)
		span
			font-family: var(--mono)
			font-size: 11px
			color: var(--dim)
		i
			font-style: normal
			font-size: 9px
			letter-spacing: .2em
			text-transform: uppercase
			color: var(--faint)
			text-align: right
		&.live
			opacity: 1
			b, span
				color: var(--silver)
			i
				color: var(--gold)

	.drawer-toggle
		align-self: flex-start
		background: none
		border: 1px solid var(--line)
		padding: 8px 18px
		cursor: pointer
		color: var(--dim)
		font-size: 10.5px
		letter-spacing: .22em
		text-transform: uppercase
		transition: .25s
		&:hover:not(:disabled)
			color: var(--gold)
			border-color: var(--gold)
		&:disabled
			opacity: .35
			cursor: default
		em
			font-style: normal
			letter-spacing: .04em
			text-transform: none
			opacity: .7

	.note
		margin: 0
		font-size: 12.5px
		line-height: 1.75
		color: #8891B4
		max-width: 52ch
		em
			font-style: italic
			color: var(--dim)
</style>
