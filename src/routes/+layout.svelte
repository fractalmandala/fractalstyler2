<script lang="ts">
	// Emit the full fractalstyler2 stylesheet once, globally.
	// This in-repo demo imports the SOURCE via $lib. A consumer of the published
	// package uses `import 'fractalstyler2/styles'` instead (that resolves to
	// dist/, which only exists after `pnpm run prepack`).
	import '$lib/styles/index.sass';
	import { onMount } from 'svelte';
	import { getPresetScript, initPresets } from '$lib/presets.svelte.js';
	let { children } = $props();

	onMount(() => initPresets());
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script>${getPresetScript()}<\/script>`}
</svelte:head>

{@render children()}
