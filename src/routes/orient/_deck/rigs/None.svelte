<script lang="ts">
	import type { Specimen } from '../types.js'
	import Vitrine from '../Vitrine.svelte'

	let { specimen }: { specimen: Specimen } = $props()
</script>

<Vitrine {specimen} tall label="the specimen · unclassed">
	<div>
		<h3>Fractalstyler</h3>
		<p>Compose in markup.</p>
		<button>Continue</button>
	</div>
</Vitrine>

<p class="note">
	One element, carrying nothing. It will be the same element on the last screen — you are not going
	to be shown nine examples, you are going to build one thing six times over.
</p>

<style lang="sass">
	.note
		margin: 26px 0 0
		font-size: 12.5px
		line-height: 1.8
		color: #8891B4
		max-width: 52ch
</style>
