<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { ACCORDION, type AccordionCtx } from './Accordion.svelte';

	/**
	 * One disclosure, from canonical-markups.md §3.
	 *
	 * Emits all three parts of the contract: `.accordion-item` carries `.open`,
	 * `.accordion-content` is the grid that animates, and `.accordion-panel` is
	 * the element that actually clips. The panel is the easiest to omit by hand
	 * and the failure is silent — the content simply never collapses.
	 *
	 * State stays on native attributes: the trigger carries `aria-expanded`.
	 */
	interface Props {
		/** The always-visible trigger row. */
		trigger: Snippet;
		children: Snippet;
		open?: boolean;
		class?: string;
	}
	let { trigger, children, open = $bindable(false), class: className = '' }: Props = $props();

	const id = Symbol();
	const group = getContext<AccordionCtx | undefined>(ACCORDION);

	onMount(() => group?.register(id, () => (open = false)));

	function toggle(): void {
		open = !open;
		if (open) group?.claim(id);
	}
</script>

<div class="accordion-item {className}" class:open>
	<button type="button" class="accordion-trigger" aria-expanded={open} onclick={toggle}>
		{@render trigger()}
	</button>
	<div class="accordion-content">
		<div class="accordion-panel box gap-2xs pad-x-xs">
			{@render children()}
		</div>
	</div>
</div>
