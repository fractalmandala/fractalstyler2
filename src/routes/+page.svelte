<script lang="ts">
	import { toggleMode } from '$lib/index.js';
</script>

<!--
	Notice how thin this markup is. Layout classes like .grid-3, .hero and
	blocks like .card are single semantic classes — their recipe lives in SASS
	(src/lib/components), composed from fractals. Visual toggles ride classes
	(.open/.active); semantics stay on aria/native attributes.
-->

<div class="page-shell">
		<section class="hero">
				<h1>must be some hero</h1>
		</section>
</div>




