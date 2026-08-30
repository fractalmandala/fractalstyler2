<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The centred landing section, from canonical-markups.md §5. */
	interface Props {
		children: Snippet;
		class?: string;
	}
	let { children, class: className = '' }: Props = $props();
</script>

<section class="hero {className}">
	{@render children()}
</section>
