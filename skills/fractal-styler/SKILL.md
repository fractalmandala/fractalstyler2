---
name: fractal-styler
description: Compose UI components and page layouts with the fractalstyler2 class registry — fluid tokens, container primitives, harmonic grids, and canonical application shells. Use when authoring components, applying design tokens, styling layouts, or reviewing markup for a fractalstyler2 project.
---

# Fractal Styler (fractalstyler2)

`fractalstyler2` is a composition styling system. **The class registry is the
entire public API.** You compose in markup; you do not author CSS.

It ships as plain CSS and as editable SASS, from one source. Which one a
project took changes nothing you do: the classes, tokens, 41 themes and four
preset axes are identical either way. Check for `fractalstyler.css` or a
`src/lib/styles/` directory to know which you are in — and never assume a SASS
toolchain exists.

The system defines no authoring mixins and no SASS functions. If you find
yourself reaching for `+stack`, `+surface`, `+gap()`, `space()` or `radius()`,
you are inventing an API: none of them exist. The only two mixins in the source
are internal theme generators you never call.

Full class list: `references/fractals.md`. Tokens: `references/tokens.md`.
Both are generated from the stylesheet, so they cannot be stale.

---

## The Prohibition

This is the rule the system is most often broken by, so it comes first.

**Do not create new classes.** Not in `_08_own.sass`, not in a component
`<style>` block, not anywhere. Compose from the registry in the `class`
attribute instead.

`_08_own.sass` exists for third-party widget overrides — a code editor, an
embedded chart, a map library that ships its own DOM. It is not for your
layout, your card, your sidebar, or your spacing. A module that adds hundreds
of lines there has not used the system; it has bypassed it.

Before you write a single custom declaration, run this checklist from
`docs/13-cookbook.md`:

1. Can it be composed with `.box` or `.row`?
2. Can `.gap-*` and `.pad-*` provide all the breathing room?
3. Can `.surface`, `.raised` or `.panel` provide the background?
4. Can `.border` or `.border-bottom` provide the dividing line?
5. Can `.button`, `.badge`, `.input` or `.select` handle the interactive state?

Five yeses means it belongs in the markup. That is nearly always the answer —
the cookbook composes segmented controls, tab strips, search bars, metric
tiles, activity feeds, dialogs and dropdowns with zero custom CSS.

Do **not** replace a composed class string with a "cleaner" semantic class.
`class="row ycenter xbetween gap-sm pad-md surface border"` is the finished
state, not an intermediate one to tidy away.

---

## The Six Layers

Each layer is built from the one below it. Naming follows all the way down.

| Layer | What it is | Reach for |
|:---|:---|:---|
| **L0** Tokens | Fluid scales and 31 colour roles | `--space-md`, `--text-lg`, `--bg-surface` |
| **L1** Dimensions | Space, size, radius | `.gap-sm`, `.pad-x-md`, `.marg--xs`, `.w-240`, `.min0` |
| **L2** Containers | Flow and alignment | `.box`, `.row`, `.grid`, `.xcenter`, `.ycenter`, `.grow` |
| **L3** Layouts | Grids, measures, frames | `.grid-3`, `.card-grid`, `.prose`, `.frame-16-9`, `.reel` |
| **L4** Shells | Page and app scaffolding | `.app-shell`, `.sidebar-left`, `.drawer`, `.dialog` |
| **L5** Visuals | Surfaces, ink, controls | `.surface`, `.text-muted`, `.border`, `.button.primary` |

---

## Rules That Actually Bite

**1. Every token is also a class.** `--space-md` implies `.gap-md`, `.pad-md`,
`.marg-md`. Never invent a second vocabulary.

**2. `x` is always horizontal, `y` is always vertical — in every container.**
This is the system's central convenience. `.xcenter` centres horizontally on
`.box`, on `.row`, and on `.grid`, even though the underlying property differs
each time. Never reason about `justify-content` vs `align-items`.

Not every combination exists, because not every one is meaningful:
`.box` has no `x`-distribution (`xbetween`, `xevenly`, `xaround`), and
`.row` has no `y`-distribution. Check `references/fractals.md` rather than
guessing.

**3. Grids step through divisors only.** `.grid-6` goes 6 → 3 → 2 → 1 and
never 5 or 4, so no row is ever left holding one card. Use `.grid-N` when you
know the count at authoring time; use `.card-grid` when you do not (a query
result, a feed) and let it auto-fit.

**4. A shell class without its canonical markup is half a definition.** L4
classes assume a specific structure. Copy it from
`docs/08-shells-and-markups.md` or `styles/canonical-markups.md` verbatim —
the responsive behaviour (right rail retracts at 1280, left rail becomes a
drawer at 1024) is a consequence of that structure, and you get it for free
only by following it.

**5. Prefer preset steps to literals.** `.gap-sm` over `.gap-16`. Literals are
the sanctioned escape hatch for exact requirements — a 16px icon box, a 1px
rule — not the default. They come from a discrete ladder, not any integer:
`0, 1, 2, 4, 6, 8, 12`, then every multiple of 8 — up to 64px for `gap`, `pad`,
`marg` and `radius`, up to 512px for `w`, `h` and `square`.

**6. Responsive without media queries.** Append `-mob` (below 768px) or
`-desk` (768px and above) to any dimension class: `pad-xs-mob pad-lg-desk`.

**7. Visual toggles ride classes; semantics stay native.** `.open`, `.active`
for JS-driven looks; `[disabled]`, `[aria-expanded]`, `:focus-visible` keep
their own meaning.

---

## Authoring a Component

```svelte
<script lang="ts">
	let { title = 'Pricing', price = '$29', highlighted = false, children } = $props();
</script>

<article class="card box gap-md pad-md surface border radius-md" class:active={highlighted}>
	<div class="row ycenter xbetween gap-sm">
		<h3 class="text-lg weight-600 marg-0">{title}</h3>
		{#if highlighted}<span class="badge">Popular</span>{/if}
	</div>

	<div class="row ybot gap-2xs">
		<span class="text-3xl weight-700 text-primary">{price}</span>
		<span class="text-xs text-muted">/month</span>
	</div>

	{#if children}{@render children()}{/if}

	<button class="button primary wfull">Choose plan</button>
</article>
```

No `<style>` block. That is the expected outcome, not an unusual one.

---

## Presets

Four axes, applied as attributes on `<html>` — or on any element, to scope a
themed region:

```html
<html data-shape="sharp" data-layout="tight" data-color="vibrant" data-motion="springy">
```

An absent attribute means that axis's default. Values are in
`references/tokens.md`. Presets remap tokens only; they never require a markup
change.

---

## MCP Tools

If the host connects the `fractalstyler2` MCP server:

- `list_fractals` — the class registry, filterable by layer (`L0`..`L5`)
- `get_design_tokens` — space, type, radius and colour scales
- `css_to_fractals` — translate raw CSS declarations into registry classes
- `snap_to_tokens` — snap arbitrary pixel values to the nearest token step
- `validate_recipe` — lint markup against these rules
- `compile_fractals` — compile the stylesheet and verify output

Query `list_fractals` before naming any class you are not certain of.
