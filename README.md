# fractalstyler2

A fractal-composition styling system for SvelteKit. **Every style unit is a SASS
mixin ("a fractal"), and components and layouts are recipes of smaller fractals.**

Use it either as a **shadcn-style scaffolder** (copying editable SASS into your project's `src/lib/styles`) or as a **direct package dependency**.

---

## Quickstart (shadcn-style Scaffolding)

Scaffold the complete, customizable SASS design system directly into your project's `src/lib/styles`:

```bash
# Scaffold into src/lib/styles
npx fractalstyler2 init

# Or using pnpm
pnpm dlx fractalstyler2 init
```

### Next Steps in Your Project

**1. Import the stylesheet in your root `+layout.svelte`:**
```svelte
<script>
	import '$lib/styles/index.sass';
</script>
```

**2. Compose your components using the fractals:**
```svelte
<style lang="sass">
	@use '$lib/styles/fractals' as *

	.pricing-card
		+surface(surface, l, 16, md)   // bg + border + radius + pad + shadow
		+stack(m, center)              // flex-column + gap + centered
		text-align: center
</style>
```

---

## Alternative: Direct Package Dependency

If you prefer importing from `node_modules` instead of scaffolding local files:

```bash
npm install fractalstyler2
# or
pnpm add fractalstyler2
```

Your app also needs `sass`:
```bash
npm install -D sass
# or
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
		+surface(surface, s, 12)
		+stack(s)
</style>
```

---

## The Model

A fractal is a mixin: a tiny reusable styling decision that composes other
fractals. They form four self-similar tiers — each tier is "a recipe of the one
below":

| Tier | What | Examples |
| --- | --- | --- |
| **Config** | scales-as-data + resolvers | `space()`, `radius()`, `align()`, `$breakpoints` |
| **Atoms** | one decision each | `+box` `+row` `+gap` `+pad` `+border` `+radius` `+bg` `+ink` `+type` `+sticky` |
| **Molecules** | graphs of atoms | `+stack` `+cluster` `+cover` `+frame` `+surface` `+cols` `+auto-grid` |
| **Components / Layouts** | graphs of molecules | `.card` `.button` · `.grid-3` `.hero` `.holy-grail` `.docs` `.app-shell` |

The one idea that makes it click:

> **A utility class and a semantic component are the same fractal, consumed two ways.**
> `.gap-m { +gap(m) }` binds the fractal to markup; `.hero { +cover; +stack(m) }`
> composes it into a component. One vocabulary, you pick where each is used.

---

## Color Mode

Light is the marker-free default (SSR-safe). Dark comes from `prefers-color-scheme` and from an explicit `data-mode="dark"` on `<html>`:

```js
import { toggleMode, setMode } from 'fractalstyler2';
toggleMode();       // flip light/dark
setMode('dark');    // force mode
```

---

## CLI Options

```bash
fractalstyler2 init [dest] [options]

Arguments:
  dest          Target directory for SASS partials (default: src/lib/styles)

Options:
  -f, --force   Overwrite files if they already exist
  -h, --help    Show help message
```

---

## License

MIT
