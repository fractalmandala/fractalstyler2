---
title: Getting Started
description: Installation and setup.
---

The recommended way is to scaffold the complete, editable SASS design system into your project's `src/lib/styles`:

```bash
# npm
npx fractalstyler2 init

# or pnpm
pnpm --package=fractalstyler2 dlx fractalstyler2 init
```

Install `sass` as a dev dependency if you haven't already:

```bash
pnpm add -D sass
# or
npm install -D sass
```

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

## Your First Markup

If you are able to use 3 classes well - .box, .row, and .grid, you're pretty much equipped to begin making layouts and pages. 
In the file `_03_containers.sass`, see .box and .row. If you're familiar with Every Layout, these are the same as stack and cluster. Flexboxes column and row, respectively. 

Modular and fractal. In your markup, use `class="box gap-xl"` for xl sized gap between the box's children items. Add `radius-lg` if you're tastes are more rounded elements.  Align items left? Add in `xleft`. 
`box gap-sm` and `row ycenter gap-sm` are likely to be your most used classes. You can use them on cards, sidebars, shells - anything. 

A decision that is left to you is whether some things are "bloat" or "scoped efficieny".
Should you use a class `sidebar-left` which you define as a flex in column direction, or should you just throw in `box gap-lg` in the markup?


## Display Mode and Themes

Fractalstyler's kindred package `fractalthemer` unlocks a whole new layer to the system - themes and backgrounds. To get started:

```
pnpm add fractalthemer
# or
npm install fractalthemer
```

Then, import into your root layout:

```
<script lang="ts">
	# fractalstyler2 existing import:
	import '$lib/styles/index.sass';

	# add:
	import 'fractalthemer/styles.css';
	import { ThemeScript, AuraBackground, ThemePicker } from 'fractalthemer';
</script> 
```

Assuming your layout's outer container is app-shell, add ThemePicker, ThemeScript and AuraBackground:
```
<ThemeScript />
<AuraBackground />
<div class="appshell">
  <header>
    <!-- Drawer launcher & mode switcher -->
    <ThemePicker />
  </header>
  <main>
    {@render children()}
  </main>
</div>
```

ThemeScript injects a tiny synchronous script into `<head>` that reads localStorage (theme, background style, custom theme tokens, and the custom accent) and applies everything before first paint, ensuring zero-flicker. 

Get going with modes and themes by reading the Fractalthemer documentation.

[Next - Structure](./03-structure.md)