---
title: Agent Command Registry
description: Named, self-contained agent prompts that direct an agent to build pages, components, layouts, fractals, themes, and audits with fractalstyler2.
---

# Agent Command Registry

Each entry is a **command**: a reusable prompt that directs an AI coding agent to perform standard design system tasks with `fractalstyler2`. `AGENTS.md` routes user requests to a command body. Hosts may wire these as slash commands (e.g. `/fs2:page`) or execute them directly during pairing sessions.

**Every command inherits the [Golden Rules & Invariants](#golden-rules).**

---

## Command Index

| Command | Use when the user wants to… | Primary Docs |
|---|---|---|
| [`fs2:init`](#fs2init) | Scaffold SASS design system into a project | [03. Getting Started](../03-getting-started.md), [README](../../README.md) |
| [`fs2:page`](#fs2page) | Build a whole page, route, or marketing shell | [03](../03-getting-started.md), [07](../07-components-and-layouts.md), [08](../08-recipes.md) |
| [`fs2:component`](#fs2component) | Build a reusable component block with Svelte 5 runes | [04. Fractals Reference](../04-fractals-reference.md), [07](../07-components-and-layouts.md) |
| [`fs2:layout`](#fs2layout) | Build a responsive page-layout template | [04](../04-fractals-reference.md), [07](../07-components-and-layouts.md) |
| [`fs2:fractal`](#fs2fractal) | Add a new atom, molecule, or macro recipe mixin | [02. Structure](../02-structure.md), [04](../04-fractals-reference.md), [DEVELOPERS](../../DEVELOPERS.md) |
| [`fs2:theme`](#fs2theme) | Tune tokens or create a named theme | [05. Tokens & Theming](../05-tokens-and-theming.md) |
| [`fs2:refactor`](#fs2refactor) | Convert legacy CSS or utility-soup to fractal recipes | [01](../01-philosophy.md), [04](../04-fractals-reference.md), [06](../06-utilities.md) |
| [`fs2:review`](#fs2review) | Audit markup and SASS for fractal idiom and UI invariants | [DESIGN.md](../../DESIGN.md), [01](../01-philosophy.md), [02](../02-structure.md) |

---

## Golden Rules & UI Invariants

Applied to every command:

1. **Strict 21-Token Contract**: Never introduce foreign CSS variables (`--card`, `--primary`, `--border-strong`). All surfaces, ink, and borders must resolve from the 21 token contract in `_00_tokens.sass`.
2. **Never hardcode values that tokens cover**: Route through resolvers (`+gap(m)`, `+radius(6)`, `+bg(surface)`). Raw values (`+gap(18)`) are explicit escape hatches only.
3. **Compose fractals; avoid raw CSS**: In component `<style lang="sass">` blocks, compose existing atom/molecule mixins rather than writing ad-hoc CSS walls.
4. **Reading Column Max Columns Law**: Any grid placed inside a reading column (`.docs-main`, `.center-column`, or container $\le 760\text{px}$) must **never exceed 2 columns** (`.grid-2` or `cols={2}`). 3 and 4-column grids are strictly reserved for full-width views (`.app-main`).
5. **Partition Breathing Room**: Every divider line (`border-top` or `border-bottom`) that partitions content MUST have reciprocal padding (`var(--space-xs)` or `var(--space-s)`). Content text or action chips must never touch a divider line directly.
6. **Card Containment (Zero Overflow)**: Multiple-button rows, tag collections, or badge clusters within cards must use `.row.wrap` or `.cluster`. Control components (`.switch-track`, `.avatar`, `.is-icon`) must specify `flex-shrink: 0`.
7. **Form Control Optical Baseline**: `<select>` and `<input>` must use `=control`/`=select`/`.select` with optical line-height (`1.2`) and 28px chevron padding to prevent vertical glyph clipping. Never apply raw `.input` to `<select>`.
8. **State rides on `data-*` / `aria-*`**: Never create modifier classes (`.btn--primary`, `.is-active`). State is an attribute (`&[data-variant='primary']`, `&[aria-current='page']`).
9. **Zero-CSS Mixin Isolation**: Component styles must `@use '$lib/styles/fractals' as *` (which emits 0 bytes CSS), never `index.sass`.

---

## fs2:init

> **Goal:** Scaffold the complete editable SASS design system into the user's project.
>
> **Procedure:**
> 1. Run `npx fractalstyler2 init [dest]` (default destination: `src/lib/styles`).
> 2. Ensure `sass` is installed in `devDependencies`.
> 3. Verify `import '$lib/styles/index.sass'` in `src/routes/+layout.svelte`.
> 4. Verify `@use '$lib/styles/fractals' as *` in component `<style lang="sass">` blocks.

---

## fs2:page

> **Goal:** Build a complete page or route from existing fractals, blocks, and layouts.
>
> **Procedure:**
> 1. Select a layout shell: `.app-shell` (app chrome), `.holy-grail` (nav+main+aside), `.docs` (docs), or `.box` (landing/marketing).
> 2. Structure sections with layout fractals — `.grid-4`/`.grid-3` for full-width pages, `.grid-2`/`.card-grid` for docs and reading views, `.hero` for leads.
> 3. Populate with shipped blocks (`.card`, `.panel`, `.button`, `.badge`, `.select`).
> 4. Author bespoke component pieces inline via `fs2:component`.
> 5. Keep markup semantic and clean; use utility classes for layout flow and one-off spacing.

---

## fs2:component

> **Goal:** Author a reusable component block as a fractal recipe.
>
> **Procedure:**
> 1. Start from `+surface(...)` for materials (cards, panels) or `+stack/+cluster` for flow.
> 2. Add skin, spacing, and typography via atoms (`+bg`, `+ink`, `+pad`, `+type`).
> 3. Express variants and states with `&[data-*]` and `&[aria-*]`.
> 4. Anchor footers with `=partition(top, s)` or `margin-top: auto; padding-top: var(--space-xs); border-top: 1px solid var(--border)`.
> 5. Import pure mixins: `@use '$lib/styles/fractals' as *`.
>
> **Example Skeleton:**
> ```sass
> .feature-card
> 	+surface(surface, m, 6)
> 	+box(stretch, start)
> 	+gap(s)
> 	height: 100%
> 	&[data-elevated]
> 		+shadow(md)
> 	> footer
> 		+partition(top, s)
> 		+row(between, center)
> 		+wrap
> ```

---

## fs2:layout

> **Goal:** Build a page-layout template (structural, skin-free).
>
> **Procedure:**
> 1. Mobile-first single-column base using `+box` or `+grid`.
> 2. Reshape at breakpoints with `+at(md/lg/xl)` using `grid-template-columns` or `+cols`.
> 3. Keep layouts skin-free — no colors, background fills, or borders (that is the block's job).
>
> **Output:** A template in `src/lib/styles/_10_layouts.sass`.

---

## fs2:fractal

> **Goal:** Add a new atom, molecule, or macro recipe mixin.
>
> **Procedure:**
> 1. Atom $\to$ `src/lib/styles/_04_atoms.sass`; Molecule $\to$ `_05_molecules.sass`; Macro Recipe $\to$ `_06_recipes.sass`.
> 2. Route all values through resolvers (`space()`, `radius()`, `surface()`, `ink()`).
> 3. If introducing a new scale keyword, add it to both `_00_tokens.sass` and `_01_config.sass`.
> 4. Keep `templates/` in sync.
> 5. Document in `docs/04-fractals-reference.md`.

---

## fs2:theme

> **Goal:** Add a named theme or tune token scales.
>
> **Procedure:**
> 1. Named theme $\to$ add a `[data-theme='name']` block redefining only the token variables that differ.
> 2. Scale tuning $\to$ edit values in `_00_tokens.sass`. Adding a new keyword requires adding it to the list in `_01_config.sass`.
> 3. Preserve `:root` light palette as marker-free (the SSR/no-JS contract).

---

## fs2:refactor

> **Goal:** Convert legacy CSS or utility-soup markup into clean fractal recipes.
>
> **Procedure:**
> 1. Map raw CSS declarations to fractals (`display: flex; flex-direction: column` $\to$ `+box`, `border-radius: 6px` $\to$ `+radius(6)`).
> 2. Collapse repetitive markup class strings (`class="box gap-s pad-m bg-surface border radius-6..."`) into a single semantic component class.
> 3. Replace magic numbers with standard tokens (`space(s)`, `radius(4)`).
> 4. Verify visual fidelity before and after refactoring.

---

## fs2:review

> **Goal:** Audit code for fractal-idiom compliance and UI invariants.
>
> **Checklist:**
> - [ ] **21-Token Contract**: Zero references to foreign tokens (`--card`, `--primary`, `--border-strong`).
> - [ ] **Reading Column Law**: No 3 or 4-column grids inside `.docs-main` or reading views.
> - [ ] **Partition Breathing Room**: Every `border-top` divider has matching `padding-top: var(--space-xs)` / `var(--space-s)`.
> - [ ] **Card Containment**: Action rows and tag clusters inside cards use `.row.wrap` or `.cluster`. Controls have `flex-shrink: 0`.
> - [ ] **Form Control Optical Baseline**: `<select>` uses `.select` (never raw `.input`).
> - [ ] **Pure Mixin Isolation**: Components `@use '$lib/styles/fractals' as *` (never `index.sass`).
> - [ ] **Responsive Visibility**: Mobile drawer triggers use `.hide-desktop`.
> - [ ] **Scale Symmetry**: Any new scale keyword exists in both `_00_tokens.sass` and `_01_config.sass`.
> - [ ] **Clean Build**: `npx sass src/lib/styles/index.sass /tmp/check.css` passes with zero errors and zero warnings.
