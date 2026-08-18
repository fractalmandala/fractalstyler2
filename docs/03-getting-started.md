---
title: Getting started
description: Install fractalstyler2, scaffold via CLI or install package, wire into SvelteKit, and build your first page.
---

## Option A: Scaffold via CLI (Recommended)

Scaffold the complete, editable SASS design system into your project's `src/lib/styles`:

```bash
# npm
npx fractalstyler2 init

# or pnpm
pnpm dlx fractalstyler2 init
```

Install `sass` as a dev dependency if you haven't already:
```bash
pnpm add -D sass
# or
npm install -D sass
```

---

## Option B: Direct Package Dependency

If you prefer to import from `node_modules` without scaffolding files:

```bash
pnpm add fractalstyler2
pnpm add -D sass
```

---

## Option C: Install as an Agent Plugin (Codex, Claude, Gemini, OpenCode)

`fractalstyler2` implements the [agent-plugins.org](https://agent-plugins.org/specification) standard. You can install it directly into your AI coding agent or design tool to enable design token queries, live SASS compilation, and automated component generation:

### OpenCode
Add to `~/.config/opencode/opencode.json`:
```json
{
  "mcp": {
    "fractalstyler2": {
      "type": "local",
      "command": ["npx", "-y", "fractalstyler2-mcp"],
      "enabled": true
    }
  }
}
```

### Gemini / Antigravity
Run the one-command installer:
```bash
npx fractalstyler2 mcp:install
```

### Claude Desktop / Claude Code
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```

### Codex
Add to your Codex configuration:
```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```

---


## Wire into SvelteKit

**1. Enable the SASS preprocessor.** In `vite.config.ts` (or `svelte.config.js`
if your setup uses one), add `vitePreprocess`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit({ preprocess: vitePreprocess() })]
});
```

**2. Emit the stylesheet once, globally.** In `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	// If scaffolded via CLI:
	import '$lib/styles/index.sass';

	// Or if using node_modules package:
	// import 'fractalstyler2/styles';

	let { children } = $props();
</script>

{@render children()}
```

That import compiles the full system (tokens, reset, utility classes, blocks,
layouts) and injects it as global CSS. You only do it once.

## Your first page

Markup stays thin and semantic:

```svelte
<div class="app-shell">
	<header class="app-header">
		<strong>My app</strong>
		<nav class="row gap-s" style="margin-inline-start:auto">
			<a class="button" data-variant="ghost" href="/docs">Docs</a>
			<a class="button" data-variant="primary" href="/start">Get started</a>
		</nav>
	</header>

	<main class="app-main box gap-2xl" style="padding:var(--space-2xl) var(--space-l)">
		<section class="hero">
			<div class="center">
				<h1 class="text-3xl">Fractals compose.</h1>
				<p class="body muted">One vocabulary, from atoms to pages.</p>
			</div>
		</section>

		<section class="grid-3">
			<article class="card"><h3 class="text-lg">One</h3></article>
			<article class="card" data-elevated><h3 class="text-lg">Two</h3></article>
			<article class="card"><h3 class="text-lg">Three</h3></article>
		</section>
	</main>

	<footer class="app-footer">
		<span class="body muted">© My app</span>
	</footer>
</div>
```

`.grid-3` is responsive (1 → 2 → 3 columns) with no extra markup.

## Compose your own component

When the shipped blocks don't cover something, author it from fractals in a new .sass file (or in scoped `<style lang="sass>` within the page/component if you prefer that).

```svelte
<div class="pricing-card">
	<h3 class="text-lg">Pro</h3>
	<p class="body muted">Everything, composed.</p>
</div>
```

```
	// If scaffolded:
	@use '$lib/styles/fractals' as *

	// If using package:
	// @use 'fractalstyler2/fractals' as *

	.pricing-card
		+surface(surface, l, 16, md)   // bg + border + radius + pad + shadow
		+stack(m, center)              // flex column + gap + centered
		text-align: center
```

## Color mode

Light is the default and is SSR-safe (no marker needed). Dark comes from the
OS (`prefers-color-scheme`) and from an explicit `data-mode="dark"` on `<html>`:

```svelte
<script>
	import { toggleMode } from 'fractalstyler2';
</script>

<button class="button" onclick={() => toggleMode()}>Toggle mode</button>
```

See [Tokens & theming](05-tokens-and-theming.md) for named themes.

Next: [Fractals reference](04-fractals-reference.md).
