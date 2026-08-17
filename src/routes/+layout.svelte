<script lang="ts">
	// Emit the full fractalstyler2 stylesheet once, globally.
	import '$lib/styles/index.sass';
	let { children } = $props();
</script>

{@render children()}
