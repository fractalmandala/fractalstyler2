# fractalstyler2

A fractal-composition styling system for SvelteKit. **Every style unit is a SASS mixin ("a fractal"), and components and layouts are recipes of smaller fractals.**

Use it either as a **shadcn-style scaffolder** (copying editable SASS directly into your project's `src/lib/styles`) or as a **direct package dependency**.

---

## Quickstart (shadcn-style Scaffolding)

Scaffold the complete, customizable SASS design system directly into your project:

```bash
# Scaffold into src/lib/styles
npx fractalstyler2 init

# Or using pnpm
pnpm dlx fractalstyler2 init
```

### Next Steps in Your Project

**1. Import the stylesheet once globally in your root `src/routes/+layout.svelte`:**
```svelte
<script>
	import '$lib/styles/index.sass';
</script>
```

**2. Compose your components using the pure mixin barrel:**
```svelte
<div class="pricing-card">
	<span class="badge" data-status="released">Pro Plan</span>
	<h3>$29/mo</h3>
	<p>Full access to all fractal components and layouts.</p>
</div>

<style lang="sass">
	@use '$lib/styles/fractals' as *

	.pricing-card
		+surface(surface, m, 6, md)    // bg + border + radius(6px) + padding + shadow
		+stack(s, start)               // flex-column + gap(s) + top-anchored flow
</style>
```

---

## Alternative: Direct Package Dependency

If you prefer importing from `node_modules` instead of scaffolding local files:

```bash
pnpm add fractalstyler2
pnpm add -D sass
```

### Use from `node_modules`:

```svelte
<script>
	import 'fractalstyler2/styles';
</script>

<style lang="sass">
	@use 'fractalstyler2/fractals' as *

	.card
		+surface(surface, s, 6)
		+stack(s)
</style>
```

---

## The Physical Scale Hierarchy

The design system files in `src/lib/styles/` are numbered sequentially from indivisible math to page layouts:

```
index.sass             ──► Master Entrypoint (Forwards fractals + loads CSS cascade)
_fractals.sass         ──► Pure Mixin Barrel (Emits 0 bytes CSS)

── Phase 1: Pure Functions & Math (Zero CSS Emitted) ─────────────────────────
_00_tokens.sass        ──► Raw CSS custom properties on :root & theme modes
_01_config.sass        ──► Scales, maps, resolvers (space, radius, surface, ink)
_02_fonts.sass         ──► Local @font-face declarations
_03_responsive.sass    ──► Breakpoint helpers (+at, +below, +between)
_04_atoms.sass         ──► Single-decision primitives (+box, +row, +bg, +ink, +pad, +gap)
_05_molecules.sass     ──► Compositions of atoms (+stack, +cluster, +surface, +cols)
_06_recipes.sass       ──► Macro component archetypes (=control, =select, =card, =partition)

── Phase 2: CSS Cascade Emitters (Loaded once globally by index.sass) ─────────
_07_base.sass          ──► Global HTML element resets
_08_blocks.sass        ──► Semantic component classes (.surface, .panel, .select, .badge)
_09_utilities.sass     ──► 1:1 atomic markup projections (.pad-*, .pad-top-*, .gap-*, .hide-desktop)
_10_layouts.sass       ──► Page layout templates (.docs, .card-grid, .hero, .holy-grail)
_11_own.sass           ──► Bespoke local project overrides
```

---

## The Strict 21-Token Contract

All themes and surface colors resolve from the 21 variables defined in `_00_tokens.sass`:

- **Surfaces**: `--bg`, `--bg-surface`, `--bg-raised`, `--bg-panel`, `--bg-footer`, `--bg-popover`, `--bg-dialog`, `--bg-terminal`, `--bg-input`, `--bg-canvas`
- **Text & Ink**: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- **States & Feedback**: `--state-hover`, `--state-hover-subtle`, `--state-selected`
- **Borders & Accents**: `--border`, `--border-subtle`, `--theme-color`, `--theme-color-alt` *(aliased to `--theme`)*

---

## Color Mode

Light is the marker-free default (SSR-safe). Dark mode is activated via `prefers-color-scheme: dark` or explicitly via `data-mode="dark"` on `<html>`:

```js
import { toggleMode, setMode } from 'fractalstyler2';
toggleMode();       // flip light/dark
setMode('dark');    // force mode
```

---

## Documentation Index

| Guide | Description |
|---|---|
| [01. Philosophy](docs/01-philosophy.md) | The fractal model, self-similarity, and dual consumption |
| [02. Structure](docs/02-structure.md) | File anatomy, the 12-file numbered scale, and cascade order |
| [03. Getting Started](docs/03-getting-started.md) | Scaffolding, imports, and wiring into SvelteKit |
| [04. Fractals Reference](docs/04-fractals-reference.md) | Comprehensive reference for every atom and molecule mixin |
| [05. Tokens & Theming](docs/05-tokens-and-theming.md) | Fluid scales, the 21-variable contract, and dark mode |
| [06. Utilities Reference](docs/06-utilities.md) | Generated atomic classes, directional padding, and visibility |
| [07. Components & Layouts](docs/07-components-and-layouts.md) | Shipped blocks, cards, and page layout templates |
| [08. Recipes & Patterns](docs/08-recipes.md) | Worked examples: pricing card, responsive docs shell, dialog |
| [09. Migration from v1](docs/09-migration-from-v1.md) | Upgrading from older unnumbered stylesheets |
| [DESIGN.md](DESIGN.md) | Golden UI invariants, card containment laws, and defect prevention |

---

## License

MIT
