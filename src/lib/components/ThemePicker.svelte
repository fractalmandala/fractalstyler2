<script lang="ts">
	import { onMount } from 'svelte';
	import { presets, initPresets, setTheme, themes } from '../presets.svelte.js';

	/**
	 * `filter` — narrow the list to one mode. `label` — set to '' to drop the
	 * visible label; the select keeps an aria-label either way.
	 *
	 * A <select> rather than a button group: 76 palettes is past the point where
	 * a row of swatches stays usable, and the native control is keyboard- and
	 * screen-reader-correct for free.
	 */
	let {
		class: className = '',
		filter = 'all',
		label = 'Theme'
	}: { class?: string; filter?: 'all' | 'light' | 'dark'; label?: string } = $props();

	onMount(() => initPresets());

	const listed = $derived(filter === 'all' ? themes : themes.filter((t) => t.mode === filter));

	// theme-nordic-frost-light -> Nordic Frost Light
	function title(id: string): string {
		return id
			.replace(/^theme-/, '')
			.split('-')
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join(' ');
	}
</script>

<div class="field {className}">
	{#if label}
		<label class="field-label" for="fs2-theme">{label}</label>
	{/if}
	<select
		id="fs2-theme"
		class="select"
		aria-label={label || 'Theme'}
		value={presets.theme ?? ''}
		onchange={(e) => setTheme(e.currentTarget.value || null)}
	>
		<option value="">None — follow mode</option>
		{#each listed as theme (theme.id)}
			<option value={theme.id}>{title(theme.id)}</option>
		{/each}
	</select>
</div>
