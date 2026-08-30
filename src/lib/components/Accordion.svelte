<script lang="ts" module>
	export interface AccordionCtx {
		/** Called by an item when it opens, so the group can close the others. */
		claim: (id: symbol) => void;
		register: (id: symbol, close: () => void) => () => void;
	}
	export const ACCORDION = Symbol('fs2.accordion');
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	/**
	 * Accordion group, from canonical-markups.md §3.
	 *
	 * `single` is the "accordion parent that regulates what closes when what
	 * opens" the introduction describes: opening one item closes its siblings.
	 * Default is independent items, which is what most navigation trees want.
	 */
	interface Props {
		children: Snippet;
		/** Only one item open at a time. */
		single?: boolean;
		class?: string;
	}
	let { children, single = false, class: className = '' }: Props = $props();

	const items = new Map<symbol, () => void>();

	setContext<AccordionCtx>(ACCORDION, {
		register(id, close) {
			items.set(id, close);
			return () => items.delete(id);
		},
		claim(id) {
			if (!single) return;
			for (const [other, close] of items) if (other !== id) close();
		}
	});
</script>

<div class="accordion {className}">
	{@render children()}
</div>
