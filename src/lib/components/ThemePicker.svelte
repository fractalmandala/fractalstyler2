<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { presets, initPresets, setTheme, themes } from '../presets.svelte.js';
	import ModeToggle from './ModeToggle.svelte';

	/**
	 * A popover palette picker over all built-in themes.
	 *
	 * Every theme card wears its own theme class, so the swatches inside it are
	 * that palette rendering itself — not a hardcoded preview. Composed entirely
	 * from registry classes; there is no stylesheet behind this component.
	 */
	interface Props {
		class?: string;
		/** Start the mode filter on one side. Users can still switch it. */
		filter?: 'all' | 'light' | 'dark';
		/** Show the light/dark toggle inside the panel. */
		showModeToggle?: boolean;
		/** Replace the default palette-glyph trigger. */
		trigger?: Snippet;
		[key: string]: unknown;
	}

	let {
		class: className = '',
		filter = 'all',
		showModeToggle = true,
		trigger,
		...rest
	}: Props = $props();

	let open = $state(false);
	// `filter` seeds the initial value only; the user drives it after that.
	// svelte-ignore state_referenced_locally
	let mode = $state<'all' | 'light' | 'dark'>(filter);
	let query = $state('');
	let root = $state<HTMLDivElement | null>(null);

	onMount(() => {
		initPresets();
		const onClick = (e: MouseEvent) => {
			if (open && root && !root.contains(e.target as Node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open) open = false;
		};
		window.addEventListener('click', onClick);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('click', onClick);
			window.removeEventListener('keydown', onKey);
		};
	});

	// theme-nordic-frost-light -> Nordic Frost Light
	const title = (id: string) =>
		id
			.replace(/^theme-/, '')
			.split('-')
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join(' ');

	const shown = $derived.by(() => {
		const byMode = mode === 'all' ? themes : themes.filter((t) => t.mode === mode);
		const q = query.trim().toLowerCase();
		return q ? byMode.filter((t) => t.id.toLowerCase().includes(q)) : byMode;
	});
</script>

<div class="relative {className}" bind:this={root} {...rest}>
	<button
		type="button"
		class="button ghost"
		aria-expanded={open}
		aria-haspopup="true"
		aria-label="Choose a palette"
		title="Palette"
		onclick={() => (open = !open)}
	>
		{#if trigger}
			{@render trigger()}
		{:else}
			<svg width="16" height="16" viewBox="0 0 19 19" aria-hidden="true">
				<circle cx="9.5" cy="9.5" r="7.75" fill="none" stroke="currentColor" stroke-width="1.5" />
				<circle cx="9.5" cy="5.75" r="1.5" fill="currentColor" />
				<circle cx="13.25" cy="9.5" r="1.5" fill="currentColor" />
				<circle cx="6" cy="8" r="1.5" fill="currentColor" />
				<circle cx="8" cy="13" r="1.5" fill="currentColor" />
			</svg>
		{/if}
	</button>

	<div class="popover box gap-8 pad-8 w-320" class:open>
		<div class="row ycenter xbetween gap-8">
			<div class="row gap-2" role="group" aria-label="Filter palettes by mode">
				{#each ['all', 'light', 'dark'] as m (m)}
					<button
						type="button"
						class="button ghost text-xs"
						class:active={mode === m}
						aria-pressed={mode === m}
						onclick={() => (mode = m as typeof mode)}
					>
						{m}
					</button>
				{/each}
			</div>
			{#if showModeToggle}
				<ModeToggle />
			{/if}
		</div>

		<input
			class="input text-xs"
			type="search"
			placeholder="Search palettes"
			aria-label="Search palettes"
			bind:value={query}
		/>

		<!-- One column on purpose: .grid-3 would collapse to 1 at this width
		     anyway (gridding golden rule), so a row card reads better. -->
		<div class="box gap-2 scroll-y h-256">
			{#each shown as theme (theme.id)}
				{@const active = presets.theme === theme.id}
				<button
					type="button"
					class="{theme.id} row ycenter gap-4 pad-4 bg border"
					aria-pressed={active}
					title={title(theme.id)}
					onclick={() => setTheme(theme.id)}
				>
					<span class="row gap-1 ycenter shrink-0">
						<span class="surface border-subtle w-12 h-12"></span>
						<span class="raised border-subtle w-12 h-12"></span>
						<span class="panel border-subtle w-12 h-12"></span>
						<span class="text-theme row ycenter">
							<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
								<circle cx="6" cy="6" r="5" fill="currentColor" />
							</svg>
						</span>
					</span>
					<span class="box xleft grow min0">
						<span class="text-xs text-primary truncate wfull">{title(theme.id)}</span>
					</span>
					{#if active}
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							aria-hidden="true"
							class="text-theme shrink-0"
						>
							<path
								d="M2.5 6.5 5 9l4.5-5.5"
								fill="none"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>

		<div class="row ycenter xbetween gap-8">
			<span class="text-xs text-muted">{shown.length} {shown.length === 1 ? 'palette' : 'palettes'}</span>
			<button type="button" class="button ghost text-xs" onclick={() => setTheme(null)}>
				Reset
			</button>
		</div>
	</div>
</div>
