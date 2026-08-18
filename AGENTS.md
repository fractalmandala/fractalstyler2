---
title: AGENTS
description: Progressive-discovery entry point for agents — golden rules, intent→command routing, and pointers into the registry and docs.
---

# AGENTS — start here

This is the **entry point** for any AI agent working in `fractalstyler2`. It gives you the rules, the 21-token contract, and a routing table into the [command registry](docs/agents/registry.md).

---

## What this package is (10 seconds)

A styling system where **a fractal is a SASS mixin**. Components and layouts are composable recipes of smaller fractals. You build UI by *composing fractals*, not by writing ad-hoc CSS or unmaintainable utility strings.

It operates in two modes:
1. **Scaffold mode (shadcn-style)**: `npx fractalstyler2 init` copies the full, editable SASS design system into your project's `src/lib/styles`.
2. **Library mode**: Direct import via `import 'fractalstyler2/styles'` and `@use 'fractalstyler2/fractals' as *`.

---

## The Golden Rules (Always)

1. **Strict 21-Token Contract**: Never introduce foreign CSS variables (`--card`, `--primary`, `--border-strong`). All surfaces, ink, and borders resolve from the 21 tokens in `_00_tokens.sass`.
2. **Never hardcode values that tokens cover**: Use `+gap(m)`, `+radius(6)`, `+bg(surface)`. Raw numbers (`+gap(18)`) are explicit escape hatches only.
3. **Compose fractals; write raw CSS only for genuinely unique lines**.
4. **Reading Column Max Columns Law**: Max 2 columns (`.grid-2` or `cols={2}`) in `.docs-main` / reading measures ($\le 760\text{px}$).
5. **Partition Breathing Room**: Every divider line (`border-top` / `border-bottom`) MUST have reciprocal padding (`var(--space-xs)` / `var(--space-s)`).
6. **Card Containment**: Button rows, tag groups, and badge clusters inside cards must use `.row.wrap` or `.cluster`. Controls have `flex-shrink: 0`.
7. **Form Control Optical Baseline**: `<select>` uses `.select` (never raw `.input`).
8. **State rides on `data-*` / `aria-*`**, never modifier classes (`.btn--primary`, `.is-active`).
9. **Zero-CSS Mixin Isolation**: Component styles must `@use '$lib/styles/fractals' as *` (which emits 0 bytes CSS), never `index.sass`.

(Full details: [registry → Golden rules](docs/agents/registry.md#golden-rules) and [DESIGN.md](DESIGN.md).)

---

## Discovery Ladder

```
1. AGENTS.md (this file)         → rules + routing
2. docs/agents/registry.md       → the command that matches the request
3. the command's "Primary docs"  → read ONLY those docs/ files
4. do the work; verify; report
```

---

## Route the Request → A Command

| The user asks to… | Command | Then read |
|---|---|---|
| Scaffold styles into a project | [`fs2:init`](docs/agents/registry.md#fs2init) | [03. Getting Started](docs/03-getting-started.md), [README](README.md) |
| Build a page or route | [`fs2:page`](docs/agents/registry.md#fs2page) | [03](docs/03-getting-started.md), [07](docs/07-components-and-layouts.md), [08](docs/08-recipes.md) |
| Build a reusable component/block | [`fs2:component`](docs/agents/registry.md#fs2component) | [04](docs/04-fractals-reference.md), [07](docs/07-components-and-layouts.md) |
| Build a page layout/template | [`fs2:layout`](docs/agents/registry.md#fs2layout) | [04](docs/04-fractals-reference.md), [07](docs/07-components-and-layouts.md) |
| Add a new mixin/primitive | [`fs2:fractal`](docs/agents/registry.md#fs2fractal) | [02](docs/02-structure.md), [04](docs/04-fractals-reference.md), [DEVELOPERS](DEVELOPERS.md) |
| Add a theme / change tokens | [`fs2:theme`](docs/agents/registry.md#fs2theme) | [05](docs/05-tokens-and-theming.md) |
| Clean up / convert existing CSS | [`fs2:refactor`](docs/agents/registry.md#fs2refactor) | [01](docs/01-philosophy.md), [04](docs/04-fractals-reference.md), [06](docs/06-utilities.md) |
| Review/audit for idiom & UI invariants | [`fs2:review`](docs/agents/registry.md#fs2review) | [DESIGN.md](DESIGN.md), [01](docs/01-philosophy.md), [02](docs/02-structure.md) |

---

## Minimal Quickstart

### In Svelte Component (`<style lang="sass">`):
```sass
@use '$lib/styles/fractals' as *

.feature-card
	+surface(surface, m, 6)   // material: bg + border + radius(6px) + pad(m)
	+stack(s)                 // arrangement: flex column + gap(s)
	&[data-elevated]          // state via attribute
		+shadow(md)
```

### Global Stylesheet (`src/routes/+layout.svelte`):
```svelte
<script>
	import '$lib/styles/index.sass';
</script>

<section class="card-grid">
	<article class="card" data-elevated>
		<h3 class="text-md font-semibold">Title</h3>
		<p class="muted text-sm">Description text</p>
	</article>
</section>
```
