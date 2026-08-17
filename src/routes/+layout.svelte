<script lang="ts">
	// Emit the full fractalstyler2 stylesheet once, globally.
	// This in-repo demo imports the SOURCE via $lib. A consumer of the published
	// package uses `import 'fractalstyler2/styles'` instead (that resolves to
	// dist/, which only exists after `pnpm run prepack`).
	import '$lib/styles/index.sass';
	let { children } = $props();
</script>

{@render children()}
